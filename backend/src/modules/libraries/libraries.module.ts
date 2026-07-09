import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrariesService } from './libraries.service';
import { LibrariesController } from './libraries.controller';
import { Library } from './entities/library.entity';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Book])],
  providers: [LibrariesService],
  controllers: [LibrariesController],
  exports: [LibrariesService],
})
export class LibrariesModule {}
