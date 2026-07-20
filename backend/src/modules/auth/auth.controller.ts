import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

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
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Logout failed',
      });
    }
  }

  @UseGuards(SessionAuthGuard)
  @Get('auth/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
