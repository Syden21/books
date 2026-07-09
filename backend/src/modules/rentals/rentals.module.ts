import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { BookRental } from './entities/book-rental.entity';
import { LibrariesModule } from '../libraries/libraries.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookRental]),
    LibrariesModule,
    UsersModule,
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
})
export class RentalsModule {}
