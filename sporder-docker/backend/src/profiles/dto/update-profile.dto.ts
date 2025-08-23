import { IsString, IsOptional, IsArray } from 'class-validator';
import { AddUserSportDto } from './add-user-sport.dto';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  homeCity?: string;

  @IsArray()
  @IsOptional()
  sports?: AddUserSportDto[];
}
