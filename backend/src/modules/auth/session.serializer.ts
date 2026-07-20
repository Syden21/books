// backend/src/modules/auth/session.serializer.ts
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error | null, user: any) => void): any {
    if (!user) return done(new Error('User is null'), null);
    done(null, { _id: user._id, email: user.email });
  }

  deserializeUser(
    payload: any,
    done: (err: Error | null, user: any) => void,
  ): any {
    console.log('🟢 Deserialize user:', payload);
    done(null, payload);
  }
}
