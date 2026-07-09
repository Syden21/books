import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Library } from './entities/library.entity';
import { Book } from './entities/book.entity';
import { CreateLibraryDto } from './dto/create-library.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async createLibrary(data: CreateLibraryDto): Promise<Library> {
    const library = this.libraryRepository.create(data);
    return this.libraryRepository.save(library);
  }

  async findAllLibraries(): Promise<Library[]> {
    return this.libraryRepository.find({
      relations: ['books'],
    });
  }

  async findLibraryById(id: number): Promise<Library> {
    const library = await this.libraryRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!library) {
      throw new NotFoundException(`Library with ID ${id} not found`);
    }

    return library;
  }

  async createBook(data: CreateBookDto, coverImage?: string): Promise<Book> {
    const library = await this.findLibraryById(data.libraryId);

    const book = this.bookRepository.create({
      ...data,
      library,
      coverImage: coverImage || null,
      availableCopies: data.totalCopies || 1,
      isAvailable: (data.totalCopies || 1) > 0,
    });

    return this.bookRepository.save(book);
  }

  async searchBooks(params: SearchBooksDto): Promise<Book[]> {
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

    return this.bookRepository.find({
      where,
      relations: ['library'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBookById(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['library'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async updateBookAvailability(
    bookId: number,
    isAvailable: boolean,
  ): Promise<Book> {
    const book = await this.findBookById(bookId);
    book.isAvailable = isAvailable;
    return this.bookRepository.save(book);
  }

  async updateAvailableCopies(bookId: number, change: number): Promise<Book> {
    const book = await this.findBookById(bookId);
    book.availableCopies += change;

    if (book.availableCopies < 0) {
      throw new Error('Not enough copies available');
    }

    book.isAvailable = book.availableCopies > 0;
    return this.bookRepository.save(book);
  }
}
