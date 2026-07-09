import { IsNumber, IsDateString, Min } from 'class-validator';

export class CreateRentalDto {
  @IsNumber()
  @Min(1)
  bookId: number;

  @IsNumber()
  @Min(1)
  libraryId: number;

  @IsDateString()
  dateStart: string;

  @IsDateString()
  dateEnd: string;
}
