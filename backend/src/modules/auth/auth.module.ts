import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from '../users/users.module';
import { SessionAuthGuard } from './guards/session-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
      defaultStrategy: 'local',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, SessionAuthGuard],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
