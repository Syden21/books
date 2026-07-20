import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getDatabaseConfig } from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LibrariesModule } from './modules/libraries/libraries.module';
import { BooksModule } from './modules/books/books.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { SupportModule } from './modules/support/support.module';
import { SessionSerializer } from './modules/auth/session.serializer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    LibrariesModule,
    BooksModule,
    RentalsModule,
    SupportModule,
  ],
  providers: [SessionSerializer],
})
export class AppModule {}
