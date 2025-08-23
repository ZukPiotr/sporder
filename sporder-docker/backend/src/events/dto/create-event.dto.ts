import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  sport: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsDateString()
  @IsNotEmpty()
  when: string;

  @IsInt()
  @Min(2)
  spots: number;
}
