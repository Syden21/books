import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './entities/book.entity';
import { SearchBookDto } from './dto/search-book.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(data: CreateBookDto): Promise<Book> {
    if (data.totalCopies < 1) {
      throw new BadRequestException('totalCopies must be at least 1');
    }

    const book = this.booksRepository.create({
      ...data,
      availableCopies: data.totalCopies,
      isAvailable: data.totalCopies > 0,
    });

    return this.booksRepository.save(book);
  }

  async findById(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['library'],
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async search(params: SearchBookDto): Promise<Book[]> {
    const { library, author, title, availableOnly } = params;

    const where: any = {};

    if (library) {
      where.libraryId = library;
    }
    if (author) {
      where.author = Like(`%${author}%`);
    }
    if (title) {
      where.title = Like(`%${title}%`);
    }
    if (availableOnly) {
      where.isAvailable = true;
    }

    const query = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.library', 'library')
      .where(where);

    if (availableOnly) {
      query.andWhere('book.availableCopies > 0');
    }

    return query.getMany();
  }

  async updateAvailability(bookId: number, change: number): Promise<void> {
    const book = await this.findById(bookId);
    const newAvailable = book.availableCopies + change;

    if (newAvailable < 0) {
      throw new BadRequestException('Not enough copies available');
    }

    book.availableCopies = newAvailable;
    book.isAvailable = newAvailable > 0;
    await this.booksRepository.save(book);
  }
}
