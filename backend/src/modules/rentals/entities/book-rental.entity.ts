import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Library } from '../../libraries/entities/library.entity';
import { Book } from '../../libraries/entities/book.entity';

export type RentalStatus = 'reserved' | 'active' | 'completed' | 'cancelled';

@Entity('book_rentals')
export class BookRental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.rentals)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  libraryId: number;

  @ManyToOne(() => Library)
  @JoinColumn({ name: 'libraryId' })
  library: Library;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, (book) => book.rentals)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'timestamp' })
  dateStart: Date;

  @Column({ type: 'timestamp' })
  dateEnd: Date;

  @Column({
    type: 'enum',
    enum: ['reserved', 'active', 'completed', 'cancelled'],
    default: 'reserved',
  })
  status: RentalStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
