import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.validatePassword(email, password);
      const { passwordHash, ...result } = user;
      return result;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: User) {
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash: registerDto.password,
      name: registerDto.name,
      contactPhone: registerDto.contactPhone,
      role: UserRole.CLIENT,
    });

    return user;
  }

  async logout(): Promise<void> {
    return;
  }
}
