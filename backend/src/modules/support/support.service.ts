import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SupportRequest } from './entities/support-request.entity';
import { Message } from './entities/message.entity';
import { User, UserRole } from '../users/entities/user.entity';
import {
  ISupportRequestService,
  ISupportRequestClientService,
  ISupportRequestEmployeeService,
} from './interfaces/support.interface';
import {
  CreateSupportRequestDto,
  SendMessageDto,
  MarkMessagesAsReadDto,
  GetChatListParams,
} from './dto/support.dto';

@Injectable()
export class SupportService
  implements
    ISupportRequestService,
    ISupportRequestClientService,
    ISupportRequestEmployeeService
{
  constructor(
    @InjectRepository(SupportRequest)
    private supportRequestRepository: Repository<SupportRequest>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const { user, isActive } = params;
    const where: any = {};

    if (user) {
      where.user = user;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.supportRequestRepository.find({
      where,
      relations: ['messages', 'userEntity'],
      order: { createdAt: 'DESC' },
    });
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const supportRequest = await this.supportRequestRepository.findOne({
      where: { _id: data.supportRequest },
    });

    if (!supportRequest) {
      throw new NotFoundException('Support request not found');
    }

    if (!supportRequest.isActive) {
      throw new ForbiddenException('This support request is closed');
    }

    const author = await this.userRepository.findOne({
      where: { _id: data.author },
    });

    if (!author) {
      throw new NotFoundException('User not found');
    }

    const message = this.messageRepository.create({
      author: data.author,
      supportRequestId: data.supportRequest,
      text: data.text,
    });

    const savedMessage = await this.messageRepository.save(message);

    this.eventEmitter.emit('message.sent', {
      supportRequest,
      message: savedMessage,
    });

    return savedMessage;
  }

  async getMessages(supportRequestId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { supportRequestId },
      relations: ['authorEntity'],
      order: { sentAt: 'ASC' },
    });
  }

  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void {
    this.eventEmitter.on('message.sent', handler);
    return () => {
      this.eventEmitter.off('message.sent', handler);
    };
  }

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const supportRequest = this.supportRequestRepository.create({
      user: data.user,
      isActive: true,
    });

    const savedRequest =
      await this.supportRequestRepository.save(supportRequest);

    await this.sendMessage({
      author: data.user,
      supportRequest: savedRequest._id,
      text: data.text,
    });

    return savedRequest;
  }

  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
    const { user, supportRequest, createdBefore } = params;

    const userEntity = await this.userRepository.findOne({
      where: { _id: user },
    });
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const query = this.messageRepository
      .createQueryBuilder('message')
      .update(Message)
      .set({ readAt: new Date() })
      .where('message.supportRequestId = :supportRequest', { supportRequest })
      .andWhere('message.readAt IS NULL')
      .andWhere('message.sentAt <= :createdBefore', { createdBefore });

    if (userEntity.role === UserRole.CLIENT) {
      const employees = await this.userRepository.find({
        where: [{ role: UserRole.ADMIN }, { role: UserRole.MANAGER }],
      });
      const employeeIds = employees.map((e) => e._id);
      if (employeeIds.length > 0) {
        query.andWhere('message.author IN (:...employeeIds)', { employeeIds });
      } else {
        return;
      }
    } else {
      query.andWhere('message.author = :user', { user });
    }

    await query.execute();
  }

  async getUnreadCount(
    supportRequestId: number,
    userId: number,
  ): Promise<number> {
    const userEntity = await this.userRepository.findOne({
      where: { _id: userId },
    });
    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const query = this.messageRepository
      .createQueryBuilder('message')
      .where('message.supportRequestId = :supportRequestId', {
        supportRequestId,
      })
      .andWhere('message.readAt IS NULL');

    if (userEntity.role === UserRole.CLIENT) {
      const employees = await this.userRepository.find({
        where: [{ role: UserRole.ADMIN }, { role: UserRole.MANAGER }],
      });
      const employeeIds = employees.map((e) => e._id);
      if (employeeIds.length > 0) {
        query.andWhere('message.author IN (:...employeeIds)', { employeeIds });
      } else {
        return 0;
      }
    } else {
      query.andWhere('message.author = :userId', { userId });
    }

    return query.getCount();
  }

  async getUnreadCountEmployee(supportRequestId: number): Promise<number> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .where('message.supportRequestId = :supportRequestId', {
        supportRequestId,
      })
      .andWhere('message.readAt IS NULL');

    const supportRequest = await this.supportRequestRepository.findOne({
      where: { _id: supportRequestId },
    });
    if (!supportRequest) {
      throw new NotFoundException('Support request not found');
    }
    query.andWhere('message.author = :userId', { userId: supportRequest.user });

    return query.getCount();
  }

  async closeRequest(supportRequestId: number): Promise<void> {
    const supportRequest = await this.supportRequestRepository.findOne({
      where: { _id: supportRequestId },
    });
    if (!supportRequest) {
      throw new NotFoundException('Support request not found');
    }
    supportRequest.isActive = false;
    await this.supportRequestRepository.save(supportRequest);
  }
}
