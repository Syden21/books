import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BookRental } from '../../rentals/entities/book-rental.entity';
import { SupportRequest } from '../../support/entities/support-request.entity';
import { Message } from '../../support/entities/message.entity';

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookRental, (rental) => rental.user)
  rentals: BookRental[];

  @OneToMany(() => SupportRequest, (request) => request.user)
  supportRequests: SupportRequest[];

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];
}
