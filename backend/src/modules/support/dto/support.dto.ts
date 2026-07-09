import {
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSupportRequestDto {
  @IsNumber()
  user: number;

  @IsString()
  text: string;
}

export class SendMessageDto {
  @IsNumber()
  author: number;

  @IsNumber()
  supportRequest: number;

  @IsString()
  text: string;
}

export class MarkMessagesAsReadDto {
  @IsNumber()
  user: number;

  @IsNumber()
  supportRequest: number;

  @IsDate()
  @Type(() => Date)
  createdBefore: Date;
}

export class GetChatListParams {
  @IsOptional()
  @IsNumber()
  user?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateSupportRequestClientDto {
  @IsString()
  text: string;
}

export class SendMessageClientDto {
  @IsString()
  text: string;
}

export class MarkMessagesAsReadClientDto {
  @IsDateString()
  createdBefore: string;
}
