import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  libraryId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  totalCopies?: number = 1;

  @IsOptional()
  @IsString()
  coverImage?: string;
}
