import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, user: any) => void): any {
    done(null, { _id: user._id });
  }

  async deserializeUser(
    payload: { _id: number },
    done: (err: Error | null, user: any) => void,
  ): Promise<any> {
    try {
      const user = await this.usersService.findById(payload._id);
      if (!user) {
        return done(new Error('User not found'), null);
      }
      done(null, user);
    } catch (error: any) {
      done(error, null);
    }
  }
}
