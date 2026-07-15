import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  CreateSupportRequestClientDto,
  SendMessageClientDto,
  MarkMessagesAsReadClientDto,
} from './dto/support.dto';

@Controller('api')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Post('client/support-requests')
  async createSupportRequest(
    @Request() req,
    @Body() data: CreateSupportRequestClientDto,
  ) {
    const supportRequest = await this.supportService.createSupportRequest({
      user: req.user._id,
      text: data.text,
    });

    const unreadCount = await this.supportService.getUnreadCount(
      supportRequest._id,
    );

    return {
      id: supportRequest._id.toString(),
      createdAt: supportRequest.createdAt.toISOString(),
      isActive: supportRequest.isActive,
      hasNewMessages: unreadCount > 0,
    };
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  @Get('client/support-requests')
  async getClientSupportRequests(
    @Request() req,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveBool =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    const requests = await this.supportService.findSupportRequests({
      user: req.user._id,
      isActive: isActiveBool,
    });

    const result: any[] = [];
    for (const request of requests) {
      const unreadCount = await this.supportService.getUnreadCount(request._id);
      result.push({
        id: request._id.toString(),
        createdAt: request.createdAt.toISOString(),
        isActive: request.isActive,
        hasNewMessages: unreadCount > 0,
      });
    }

    return result;
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @Get('manager/support-requests')
  async getManagerSupportRequests(@Query('isActive') isActive?: string) {
    const isActiveBool =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    const requests = await this.supportService.findSupportRequests({
      user: undefined,
      isActive: isActiveBool,
    });

    const result: any[] = [];
    for (const request of requests) {
      const unreadCount = await this.supportService.getUnreadCount(request._id);
      result.push({
        id: request._id.toString(),
        createdAt: request.createdAt.toISOString(),
        isActive: request.isActive,
        hasNewMessages: unreadCount > 0,
        client: {
          id: request.userEntity?._id?.toString() || '',
          name: request.userEntity?.name || 'Unknown',
          email: request.userEntity?.email || '',
          contactPhone: request.userEntity?.contactPhone || '',
        },
      });
    }

    return result;
  }

  @UseGuards(SessionAuthGuard)
  @Get('common/support-requests/:id/messages')
  async getMessages(@Param('id') id: string, @Request() req) {
    const messages = await this.supportService.getMessages(parseInt(id));

    return messages.map((msg) => ({
      id: msg._id.toString(),
      createdAt: msg.sentAt.toISOString(),
      text: msg.text,
      readAt: msg.readAt?.toISOString() || null,
      author: {
        id: msg.authorEntity?._id?.toString() || msg.author.toString(),
        name: msg.authorEntity?.name || 'Unknown',
      },
    }));
  }

  @UseGuards(SessionAuthGuard)
  @Post('common/support-requests/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @Request() req,
    @Body() data: SendMessageClientDto,
  ) {
    const message = await this.supportService.sendMessage({
      author: req.user._id,
      supportRequest: parseInt(id),
      text: data.text,
    });

    const author = await this.supportService['userRepository'].findOne({
      where: { _id: message.author },
    });

    return {
      id: message._id.toString(),
      createdAt: message.sentAt.toISOString(),
      text: message.text,
      readAt: message.readAt?.toISOString() || null,
      author: {
        id: author?._id?.toString() || message.author.toString(),
        name: author?.name || 'Unknown',
      },
    };
  }

  @UseGuards(SessionAuthGuard)
  @Post('common/support-requests/:id/messages/read')
  async markMessagesAsRead(
    @Param('id') id: string,
    @Request() req,
    @Body() data: MarkMessagesAsReadClientDto,
  ) {
    await this.supportService.markMessagesAsRead({
      user: req.user._id,
      supportRequest: parseInt(id),
      createdBefore: new Date(data.createdBefore),
    });
    return { success: true };
  }
}
