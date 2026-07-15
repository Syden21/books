import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Library } from '../modules/libraries/entities/library.entity';
import { Book } from '../modules/books/entities/book.entity';
import { Rental } from '../modules/rentals/entities/rental.entity';
import { SupportRequest } from '../modules/support/entities/support-request.entity';
import { Message } from '../modules/support/entities/message.entity';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isProduction = nodeEnv === 'production';

  const password = configService.get<string>('POSTGRES_PASSWORD');
  const finalPassword = password || '123456';

  return {
    type: 'postgres' as const,
    host: configService.get<string>('POSTGRES_HOST', 'localhost'),
    port: configService.get<number>('POSTGRES_PORT', 5432),
    username: configService.get<string>('POSTGRES_USER', 'library_user'),
    password: finalPassword,
    database: configService.get<string>('POSTGRES_DB', 'BookReservation'),
    entities: [User, Library, Book, Rental, SupportRequest, Message],
    synchronize: true,
    logging: true,
    retryAttempts: 5,
    retryDelay: 3000,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
};
