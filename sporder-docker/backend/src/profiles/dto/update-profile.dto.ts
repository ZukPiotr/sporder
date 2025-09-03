import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddUserSportDto } from './add-user-sport.dto';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  homeCity?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddUserSportDto)
  @IsOptional()
  sports?: AddUserSportDto[];
}