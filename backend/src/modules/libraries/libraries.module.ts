import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrariesController } from './libraries.controller';
import { LibrariesService } from './libraries.service';
import { Library } from './entities/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  controllers: [LibrariesController],
  providers: [LibrariesService],
  exports: [LibrariesService],
})
export class LibrariesModule {}
