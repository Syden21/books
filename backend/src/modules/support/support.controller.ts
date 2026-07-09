import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportRequestDto } from './dto/create-support-request.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkMessagesReadDto } from './dto/mark-messages-read.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { Request } from 'express';

@Controller('api')
@UseGuards(AuthenticatedGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('client/support-requests')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async createSupportRequest(
    @Req() req: Request,
    @Body() createSupportRequestDto: CreateSupportRequestDto,
  ) {
    const user = req.user as any;
    const request = await this.supportService.createSupportRequest(
      user.id,
      createSupportRequestDto,
    );

    return {
      id: request.id,
      createdAt: request.createdAt,
      isActive: request.isActive,
      hasNewMessages: false,
    };
  }

  @Get('client/support-requests')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  async getClientSupportRequests(
    @Req() req: Request,
    @Query('isActive') isActive?: string,
  ) {
    const user = req.user as any;
    const requests = await this.supportService.getClientSupportRequests(
      user.id,
      isActive !== undefined ? isActive === 'true' : undefined,
    );

    return Promise.all(
      requests.map(async (request) => ({
        id: request.id,
        createdAt: request.createdAt,
        isActive: request.isActive,
        hasNewMessages: await this.supportService.hasNewMessages(
          request.id,
          user.id,
        ),
      })),
    );
  }

  @Get('manager/support-requests')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  async getManagerSupportRequests(@Query('isActive') isActive?: string) {
    const requests = await this.supportService.getManagerSupportRequests(
      isActive !== undefined ? isActive === 'true' : undefined,
    );

    return Promise.all(
      requests.map(async (request) => ({
        id: request.id,
        createdAt: request.createdAt,
        isActive: request.isActive,
        hasNewMessages: await this.supportService.hasNewMessages(
          request.id,
          request.userId,
        ),
        client: {
          id: request.user.id,
          name: request.user.name,
          email: request.user.email,
          contactPhone: request.user.contactPhone,
        },
      })),
    );
  }

  @Get('common/support-requests/:id/messages')
  async getMessages(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = req.user as any;
    const request = await this.supportService.findSupportRequestById(id);

    if (user.role === UserRole.CLIENT && request.userId !== user.id) {
      throw new Error("You don't have access to this support request");
    }

    const messages = await this.supportService.getMessages(id);

    return messages.map((message) => ({
      id: message.id,
      sentAt: message.sentAt,
      text: message.text,
      readAt: message.readAt,
      author: {
        id: message.author.id,
        name: message.author.name,
      },
    }));
  }

  @Post('common/support-requests/:id/messages')
  async sendMessage(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    const user = req.user as any;
    const request = await this.supportService.findSupportRequestById(id);

    if (user.role === UserRole.CLIENT && request.userId !== user.id) {
      throw new Error("You don't have access to this support request");
    }

    const message = await this.supportService.sendMessage(
      id,
      user.id,
      sendMessageDto.text,
    );

    return {
      id: message.id,
      sentAt: message.sentAt,
      text: message.text,
      readAt: message.readAt,
      author: {
        id: user.id,
        name: user.name,
      },
    };
  }

  @Post('common/support-requests/:id/messages/read')
  async markMessagesRead(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() markMessagesReadDto: MarkMessagesReadDto,
  ) {
    const user = req.user as any;
    const request = await this.supportService.findSupportRequestById(id);

    if (user.role === UserRole.CLIENT && request.userId !== user.id) {
      throw new Error("You don't have access to this support request");
    }

    await this.supportService.markMessagesAsRead(
      id,
      user.id,
      new Date(markMessagesReadDto.createdBefore),
    );

    return { success: true };
  }

  @Post('manager/support-requests/:id/close')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MANAGER)
  async closeSupportRequest(@Param('id', ParseIntPipe) id: number) {
    await this.supportService.closeSupportRequest(id);
    return { success: true };
  }
}
