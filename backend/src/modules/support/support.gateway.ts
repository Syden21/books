import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportService } from './support.service';

@WebSocketGateway({
  namespace: 'support',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class SupportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets: Map<number, string[]> = new Map();

  constructor(private supportService: SupportService) {
    this.supportService.subscribe((supportRequest, message) => {
      this.emitNewMessage(supportRequest._id, message);
    });
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect();
      return;
    }

    const userId = client.handshake.query.userId as string;
    if (userId) {
      const userIdNum = parseInt(userId);
      if (!this.userSockets.has(userIdNum)) {
        this.userSockets.set(userIdNum, []);
      }
      this.userSockets.get(userIdNum).push(client.id);
      client.join(`user_${userIdNum}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      const index = sockets.indexOf(client.id);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
  }

  @SubscribeMessage('subscribeToChat')
  async handleSubscribeToChat(client: Socket, payload: { chatId: number }) {
    if (!payload.chatId) {
      return;
    }
    client.join(`chat_${payload.chatId}`);

    const messages = await this.supportService.getMessages(payload.chatId);
    client.emit('chatHistory', messages);
  }

  @SubscribeMessage('unsubscribeFromChat')
  handleUnsubscribeFromChat(client: Socket, payload: { chatId: number }) {
    if (payload.chatId) {
      client.leave(`chat_${payload.chatId}`);
    }
  }

  private emitNewMessage(supportRequestId: number, message: any) {
    this.server.to(`chat_${supportRequestId}`).emit('newMessage', message);
  }
}
