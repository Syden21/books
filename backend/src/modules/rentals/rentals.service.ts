import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { BookRental } from './entities/book-rental.entity';
import { LibrariesService } from '../libraries/libraries.service';
import { UsersService } from '../users/users.service';
import { CreateRentalDto } from './dto/create-rental.dto';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(BookRental)
    private rentalRepository: Repository<BookRental>,
    private librariesService: LibrariesService,
    private usersService: UsersService,
  ) {}

  async createRental(
    userId: number,
    data: CreateRentalDto,
  ): Promise<BookRental> {
    await this.usersService.findById(userId);

    const book = await this.librariesService.findBookById(data.bookId);

    if (!book.isAvailable || book.availableCopies <= 0) {
      throw new BadRequestException('Book is not available for rental');
    }

    const startDate = new Date(data.dateStart);
    const endDate = new Date(data.dateEnd);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }

    const rental = this.rentalRepository.create({
      userId,
      libraryId: data.libraryId,
      bookId: data.bookId,
      dateStart: startDate,
      dateEnd: endDate,
      status: 'reserved',
    });

    await this.librariesService.updateAvailableCopies(data.bookId, -1);

    return this.rentalRepository.save(rental);
  }

  async getRentalById(
    id: number,
    userId: number,
    userRole: string,
  ): Promise<BookRental> {
    const rental = await this.rentalRepository.findOne({
      where: { id },
      relations: ['user', 'book', 'library'],
    });

    if (!rental) {
      throw new NotFoundException(`Rental with ID ${id} not found`);
    }

    if (userRole === 'client' && rental.userId !== userId) {
      throw new ForbiddenException('You can only view your own rentals');
    }

    return rental;
  }

  async getUserRentals(userId: number): Promise<BookRental[]> {
    await this.usersService.findById(userId);

    return this.rentalRepository.find({
      where: { userId },
      relations: ['book', 'library'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllRentals(): Promise<BookRental[]> {
    return this.rentalRepository.find({
      relations: ['user', 'book', 'library'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateRentalStatus(
    id: number,
    status: 'reserved' | 'active' | 'completed' | 'cancelled',
    userId: number,
    userRole: string,
  ): Promise<BookRental> {
    const rental = await this.getRentalById(id, userId, userRole);

    if (status === 'cancelled' && userRole === 'client') {
      if (rental.status !== 'reserved') {
        throw new BadRequestException('Only reserved rentals can be cancelled');
      }
      await this.librariesService.updateAvailableCopies(rental.bookId, 1);
    }

    if (userRole === 'client' && status !== 'cancelled') {
      throw new ForbiddenException('You can only cancel your rentals');
    }

    rental.status = status;
    return this.rentalRepository.save(rental);
  }

  async getActiveRentals(): Promise<BookRental[]> {
    return this.rentalRepository.find({
      where: {
        status: 'active',
        dateEnd: MoreThan(new Date()),
      },
      relations: ['user', 'book', 'library'],
    });
  }

  async checkOverdueRentals(): Promise<BookRental[]> {
    return this.rentalRepository.find({
      where: {
        status: 'active',
        dateEnd: MoreThan(new Date()),
      },
      relations: ['user', 'book'],
    });
  }
}
