import { IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateRentalDto {
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsNumber()
  @IsNotEmpty()
  libraryId: number;

  @IsDateString()
  dateStart: string;

  @IsDateString()
  dateEnd: string;
}
