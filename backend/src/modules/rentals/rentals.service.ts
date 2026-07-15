import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental, RentalStatus } from './entities/rental.entity';
import { BooksService } from '../books/books.service';

interface CreateRentalData {
  userId: number;
  libraryId: number;
  bookId: number;
  dateStart: string;
  dateEnd: string;
}

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
    private booksService: BooksService,
  ) {}

  async create(data: CreateRentalData): Promise<Rental> {
    const { userId, libraryId, bookId, dateStart, dateEnd } = data;

    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    const now = new Date();

    if (startDate < now) {
      throw new BadRequestException('Start date must be in the future');
    }
    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }
    if (endDate > new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)) {
      throw new BadRequestException('Rental period cannot exceed 1 year');
    }

    const book = await this.booksService.findById(bookId);
    if (!book.isAvailable || book.availableCopies <= 0) {
      throw new BadRequestException('Book is not available for rental');
    }

    const existingRental = await this.rentalsRepository.findOne({
      where: {
        userId,
        bookId,
        status: RentalStatus.ACTIVE,
      },
    });

    if (existingRental) {
      throw new BadRequestException(
        'You already have an active rental of this book',
      );
    }

    const rental = this.rentalsRepository.create({
      userId,
      libraryId,
      bookId,
      dateStart: startDate,
      dateEnd: endDate,
      status: RentalStatus.RESERVED,
    });

    await this.booksService.updateAvailability(bookId, -1);

    return this.rentalsRepository.save(rental);
  }

  async updateStatus(id: number, status: RentalStatus): Promise<Rental> {
    const rental = await this.rentalsRepository.findOne({ where: { id } });
    if (!rental) {
      throw new NotFoundException(`Rental with id ${id} not found`);
    }

    if (
      (status === RentalStatus.CANCELLED ||
        status === RentalStatus.COMPLETED) &&
      rental.status !== RentalStatus.COMPLETED &&
      rental.status !== RentalStatus.CANCELLED
    ) {
      await this.booksService.updateAvailability(rental.bookId, 1);
    }

    rental.status = status;
    return this.rentalsRepository.save(rental);
  }

  async findByUser(userId: number): Promise<Rental[]> {
    return this.rentalsRepository.find({
      where: { userId },
      relations: { book: true, library: true },
      order: { createdAt: 'DESC' },
    });
  }
}
