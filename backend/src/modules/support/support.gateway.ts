import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import { WsAuthGuard } from '../../common/guards/ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class SupportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets: Map<number, string[]> = new Map();

  constructor(
    private supportService: SupportService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.getUserFromSocket(client);

      if (user) {
        if (!this.userSockets.has(user.id)) {
          this.userSockets.set(user.id, []);
        }
        this.userSockets.get(user.id).push(client.id);

        client.join(`user-${user.id}`);
        client.data.user = user;
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;

    if (user) {
      const sockets = this.userSockets.get(user.id) || [];
      const index = sockets.indexOf(client.id);
      if (index > -1) {
        sockets.splice(index, 1);
      }

      if (sockets.length === 0) {
        this.userSockets.delete(user.id);
      }

      client.leave(`user-${user.id}`);
    }
  }

  @SubscribeMessage('message:subscribeToChat')
  @UseGuards(WsAuthGuard)
  async handleSubscribeToChat(client: Socket, chatId: string) {
    const user = client.data.user;

    const request = await this.supportService.findSupportRequestById(
      Number(chatId),
    );

    if (user.role === UserRole.CLIENT && request.userId !== user.id) {
      throw new WsException("You don't have access to this chat");
    }

    client.join(`chat-${chatId}`);

    const messages = await this.supportService.getMessages(Number(chatId));
    client.emit('message:history', messages);
  }

  @SubscribeMessage('message:send')
  @UseGuards(WsAuthGuard)
  async handleSendMessage(
    client: Socket,
    data: { chatId: string; text: string },
  ) {
    const user = client.data.user;

    const request = await this.supportService.findSupportRequestById(
      Number(data.chatId),
    );

    if (user.role === UserRole.CLIENT && request.userId !== user.id) {
      throw new WsException("You don't have access to this chat");
    }

    if (!request.isActive) {
      throw new WsException('This support request is closed');
    }

    const message = await this.supportService.sendMessage(
      Number(data.chatId),
      user.id,
      data.text,
    );

    this.server.to(`chat-${data.chatId}`).emit('message:new', {
      id: message.id,
      text: message.text,
      sentAt: message.sentAt,
      readAt: message.readAt,
      author: {
        id: user.id,
        name: user.name,
      },
    });

    const unreadCount = await this.supportService.getUnreadCount(
      Number(data.chatId),
      user.id,
    );

    const otherRole =
      user.role === UserRole.CLIENT ? UserRole.MANAGER : UserRole.CLIENT;
    this.server.to('managers').emit('support:newMessage', {
      chatId: data.chatId,
      hasNewMessages: unreadCount > 0,
    });
  }

  @SubscribeMessage('message:markRead')
  @UseGuards(WsAuthGuard)
  async handleMarkMessagesRead(
    client: Socket,
    data: { chatId: string; createdBefore: string },
  ) {
    const user = client.data.user;

    await this.supportService.markMessagesAsRead(
      Number(data.chatId),
      user.id,
      new Date(data.createdBefore),
    );

    this.server.to(`chat-${data.chatId}`).emit('message:read', {
      chatId: data.chatId,
      readAt: new Date(),
    });
  }

  private async getUserFromSocket(client: Socket): Promise<any> {
    try {
      const cookie = client.handshake.headers.cookie;
      if (!cookie) return null;

      return null;
    } catch (error) {
      return null;
    }
  }
}
