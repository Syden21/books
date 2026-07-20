import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('🔍 AuthService.validateUser called with:', email);
    try {
      const user = await this.usersService.validatePassword(email, password);
      const { passwordHash, ...result } = user;
      return result;
    } catch (error: any) {
      console.error('❌ AuthService.validateUser error:', error.message);
      throw error;
    }
  }

  async login(user: User) {
    return {
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

  async logout(req: any): Promise<void> {
    return new Promise((resolve, reject) => {
      req.logout((err: any) => {
        if (err) {
          reject(err);
        } else {
          req.session.destroy((err: any) => {
            if (err) {
              reject(err);
            } else {
              if (req.res) {
                req.res.clearCookie('library.sid');
              }
              resolve();
            }
          });
        }
      });
    });
  }

  async getSessionUser(req: any): Promise<User | null> {
    return req.user || null;
  }
}
