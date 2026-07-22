import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  HttpStatus,
  UseInterceptors,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return new Promise((resolve, reject) => {
      req.login(req.user, (err) => {
        if (err) return reject(err);
        resolve(this.authService.login(req.user));
      });
    });
  }

  @Post('client/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }

  @UseGuards(SessionAuthGuard)
  @Post('auth/logout')
  async logout(@Request() req, @Res() res: Response) {
    try {
      await this.authService.logout(req);
      return res.status(HttpStatus.OK).json({});
    } catch {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Logout failed',
      });
    }
  }

  @UseGuards(SessionAuthGuard)
  @Put('auth/profile')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpeg|png|webp|gif)/)) {
          return callback(new Error('Only images are allowed'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async updateProfile(
    @Request() req,
    @Body() body: { name?: string; contactPhone?: string; password?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user._id;
    const updateData: any = {};

    if (body.name) updateData.name = body.name;
    if (body.contactPhone !== undefined)
      updateData.contactPhone = body.contactPhone;
    if (body.password) {
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(body.password, saltRounds);
    }
    if (file) {
      updateData.avatarUrl = `/uploads/avatars/${file.filename}`;
    }

    await this.usersService.update(userId, updateData);
    return this.usersService.findById(userId);
  }
}
