import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SupportService } from './support.service';
import { SupportGateway } from './support.gateway';
import { SupportRequest } from './entities/support-request.entity';
import { Message } from './entities/message.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportRequest, Message]),
    EventEmitterModule.forRoot(),
    UsersModule,
  ],
  providers: [SupportService, SupportGateway],
  exports: [SupportService],
})
export class SupportModule {}
