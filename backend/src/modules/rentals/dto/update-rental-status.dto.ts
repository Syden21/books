import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRentalStatusDto {
  @IsEnum(['reserved', 'active', 'completed', 'cancelled'])
  @IsNotEmpty()
  status: 'reserved' | 'active' | 'completed' | 'cancelled';
}
