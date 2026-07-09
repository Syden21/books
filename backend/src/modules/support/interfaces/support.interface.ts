import { SupportRequest } from '../entities/support-request.entity';
import { Message } from '../entities/message.entity';
import {
  CreateSupportRequestDto,
  SendMessageDto,
  MarkMessagesAsReadDto,
  GetChatListParams,
} from '../dto/support.dto';

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequestId: number): Promise<Message[]>;
  subscribe(
    handler: (supportRequest: SupportRequest, message: Message) => void,
  ): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequestId: number, userId: number): Promise<number>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequestId: number): Promise<number>;
  closeRequest(supportRequestId: number): Promise<void>;
}
