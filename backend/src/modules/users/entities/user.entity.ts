import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rental } from '../../rentals/entities/rental.entity';
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
  _id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'passwordHash', length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'contactPhone', length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[];

  @OneToMany(() => SupportRequest, (support) => support.user)
  supportRequests: SupportRequest[];

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];
}
