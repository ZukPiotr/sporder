import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class AddUserSportDto {
  @IsString()
  @IsNotEmpty()
  sportName: string;

  @IsString()
  @IsNotEmpty()
  skillLevel: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}