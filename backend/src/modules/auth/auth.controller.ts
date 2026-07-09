import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request) {
    return this.authService.login(req.user as any);
  }

  @Post('logout')
  @UseGuards(AuthGuard('session'))
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {});
    res.clearCookie('connect.sid');
    return res.json({ success: true });
  }

  @Post('client/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      passwordHash: registerDto.password,
      role: UserRole.CLIENT,
    });

    // Убираем passwordHash из ответа
    const { passwordHash, ...result } = user;
    return result;
  }

  @Get('me')
  @UseGuards(AuthGuard('session'))
  async getCurrentUser(@Req() req: Request) {
    const user = req.user as any;
    const { passwordHash, ...result } = user;
    return result;
  }
}
