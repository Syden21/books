import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SupportRequest } from './support-request.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ name: 'authorId' })
  author: number;

  @Column({ name: 'supportRequestId' })
  supportRequestId: number;

  @CreateDateColumn({ name: 'sentAt' })
  sentAt: Date;

  @Column({ type: 'text' })
  text: string;

  @Column({ name: 'readAt', type: 'timestamp', nullable: true })
  readAt: Date;

  @ManyToOne(() => User, (user) => user.messages)
  authorEntity: User;

  @ManyToOne(() => SupportRequest, (support) => support.messages)
  supportRequest: SupportRequest;
}
