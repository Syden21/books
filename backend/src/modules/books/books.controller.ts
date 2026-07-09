import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { SearchBookDto } from './dto/search-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('api')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('common/books')
  async searchBooks(@Query() searchParams: SearchBookDto) {
    return this.booksService.search(searchParams);
  }

  @Get('common/books/:id')
  async getBookById(@Param('id') id: string) {
    return this.booksService.findById(parseInt(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('admin/books')
  @UseInterceptors(FileInterceptor('coverImage'))
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createBookDto.coverImage = file.filename || file.path;
    }
    return this.booksService.create(createBookDto);
  }
}
