import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Library } from '../../libraries/entities/library.entity';
import { Rental } from '../../rentals/entities/rental.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'libraryId' })
  libraryId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  @Column({ nullable: true })
  year: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'coverImage', length: 500, nullable: true })
  coverImage: string;

  @Column({ name: 'isAvailable', default: true })
  isAvailable: boolean;

  @Column({ name: 'totalCopies', default: 1 })
  totalCopies: number;

  @Column({ name: 'availableCopies', default: 1 })
  availableCopies: number;

  @ManyToOne(() => Library, (library) => library.books)
  library: Library;

  @OneToMany(() => Rental, (rental) => rental.book)
  rentals: Rental[];
}
