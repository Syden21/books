import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Library } from './library.entity';
import { BookRental } from '../../rentals/entities/book-rental.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  libraryId: number;

  @ManyToOne(() => Library, (library) => library.books)
  @JoinColumn({ name: 'libraryId' })
  library: Library;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: 1 })
  totalCopies: number;

  @Column({ default: 1 })
  availableCopies: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookRental, (rental) => rental.book)
  rentals: BookRental[];
}
