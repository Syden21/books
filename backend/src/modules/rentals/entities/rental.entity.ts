import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';
import { Library } from '../../libraries/entities/library.entity';

export enum RentalStatus {
  RESERVED = 'reserved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'libraryId' })
  libraryId: number;

  @Column({ name: 'bookId' })
  bookId: number;

  @Column({ name: 'dateStart', type: 'timestamp' })
  dateStart: Date;

  @Column({ name: 'dateEnd', type: 'timestamp' })
  dateEnd: Date;

  @Column({ type: 'enum', enum: RentalStatus, default: RentalStatus.RESERVED })
  status: RentalStatus;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.rentals)
  user: User;

  @ManyToOne(() => Book, (book) => book.rentals)
  book: Book;

  @ManyToOne(() => Library)
  library: Library;
}
