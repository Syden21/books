import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: any) => void) {
    done(null, user.id);
  }

  async deserializeUser(id: number, done: (err: Error, user: any) => void) {
    try {
      const user = await this.usersService.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
}
