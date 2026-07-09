import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsString()
  description?: string;
}
