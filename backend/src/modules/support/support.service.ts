import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SupportRequest } from './entities/support-request.entity';
import { Message } from './entities/message.entity';
import { UsersService } from '../users/users.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { UserRole } from '../users/entities/user.entity';

export interface GetChatListParams {
  userId: number | null;
  isActive?: boolean;
}

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportRequest)
    private supportRequestRepository: Repository<SupportRequest>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createSupportRequest(
    userId: number,
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    await this.usersService.findById(userId);

    const supportRequest = this.supportRequestRepository.create({
      userId,
      isActive: true,
    });

    const savedRequest =
      await this.supportRequestRepository.save(supportRequest);

    const message = this.messageRepository.create({
      supportRequestId: savedRequest.id,
      authorId: userId,
      text: data.text,
    });

    await this.messageRepository.save(message);

    return savedRequest;
  }

  async getClientSupportRequests(
    userId: number,
    isActive?: boolean,
  ): Promise<SupportRequest[]> {
    await this.usersService.findById(userId);

    const where: any = { userId };
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.supportRequestRepository.find({
      where,
      relations: ['messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async getManagerSupportRequests(
    isActive?: boolean,
  ): Promise<SupportRequest[]> {
    const where: any = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.supportRequestRepository.find({
      where,
      relations: ['user', 'messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async closeSupportRequest(requestId: number): Promise<void> {
    const request = await this.findSupportRequestById(requestId);
    request.isActive = false;
    await this.supportRequestRepository.save(request);
  }

  async findSupportRequestById(id: number): Promise<SupportRequest> {
    const request = await this.supportRequestRepository.findOne({
      where: { id },
      relations: ['user', 'messages', 'messages.author'],
    });

    if (!request) {
      throw new NotFoundException(`Support request with ID ${id} not found`);
    }

    return request;
  }

  async getMessages(supportRequestId: number): Promise<Message[]> {
    const request = await this.findSupportRequestById(supportRequestId);
    return request.messages;
  }

  async sendMessage(
    supportRequestId: number,
    authorId: number,
    text: string,
  ): Promise<Message> {
    const request = await this.findSupportRequestById(supportRequestId);

    if (!request.isActive) {
      throw new BadRequestException('This support request is closed');
    }

    const message = this.messageRepository.create({
      supportRequestId,
      authorId,
      text,
    });

    const savedMessage = await this.messageRepository.save(message);

    this.eventEmitter.emit('message.created', {
      supportRequest: request,
      message: savedMessage,
    });

    return savedMessage;
  }

  async markMessagesAsRead(
    supportRequestId: number,
    userId: number,
    createdBefore: Date,
  ): Promise<void> {
    const request = await this.findSupportRequestById(supportRequestId);
    const user = await this.usersService.findById(userId);

    let whereCondition: any = {
      supportRequestId,
      readAt: null,
      sentAt: LessThan(createdBefore),
    };

    if (user.role === UserRole.CLIENT) {
      whereCondition = {
        ...whereCondition,
        authorId: request.userId !== userId,
      };
    } else {
      whereCondition = {
        ...whereCondition,
        authorId: request.userId,
      };
    }

    await this.messageRepository.update(whereCondition, {
      readAt: new Date(),
    });
  }

  async getUnreadCount(
    supportRequestId: number,
    userId: number,
  ): Promise<number> {
    const request = await this.findSupportRequestById(supportRequestId);
    const user = await this.usersService.findById(userId);

    let whereCondition: any = {
      supportRequestId,
      readAt: null,
    };

    if (user.role === UserRole.CLIENT) {
      whereCondition = {
        ...whereCondition,
        authorId: request.userId !== userId,
      };
    } else {
      whereCondition = {
        ...whereCondition,
        authorId: request.userId,
      };
    }

    return this.messageRepository.count({ where: whereCondition });
  }

  async hasNewMessages(
    supportRequestId: number,
    userId: number,
  ): Promise<boolean> {
    const count = await this.getUnreadCount(supportRequestId, userId);
    return count > 0;
  }

  async subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ) {
    this.eventEmitter.on('message.created', handler);

    return () => {
      this.eventEmitter.off('message.created', handler);
    };
  }
}
