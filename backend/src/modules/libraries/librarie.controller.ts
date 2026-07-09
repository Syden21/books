import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  // === Common Endpoints ===

  @Get('common/books')
  async searchBooks(@Query() searchParams: SearchBooksDto) {
    return this.librariesService.searchBooks(searchParams);
  }

  @Get('common/books/:id')
  async getBook(@Param('id', ParseIntPipe) id: number) {
    return this.librariesService.findBookById(id);
  }

  @Get('common/libraries')
  async getLibraries() {
    return this.librariesService.findAllLibraries();
  }

  @Get('common/libraries/:id')
  async getLibrary(@Param('id', ParseIntPipe) id: number) {
    return this.librariesService.findLibraryById(id);
  }

  // === Admin Endpoints ===

  @Post('admin/libraries')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createLibrary(@Body() createLibraryDto: CreateLibraryDto) {
    return this.librariesService.createLibrary(createLibraryDto);
  }

  @Post('admin/books')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `book-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() coverImage: Express.Multer.File,
  ) {
    return this.librariesService.createBook(
      createBookDto,
      coverImage?.filename,
    );
  }
}
