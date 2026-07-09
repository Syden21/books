import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from './message.entity';

@Entity('support_requests')
export class SupportRequest {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ name: 'userId' })
  user: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'isActive', default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.supportRequests)
  userEntity: User;

  @OneToMany(() => Message, (message) => message.supportRequest)
  messages: Message[];
}
