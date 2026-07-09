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
import { SupportRequest } from './support-request.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supportRequestId: number;

  @ManyToOne(() => SupportRequest, (request) => request.messages)
  @JoinColumn({ name: 'supportRequestId' })
  supportRequest: SupportRequest;

  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @CreateDateColumn()
  sentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
