import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Imię nie może być puste.' })
  name: string;

  @IsEmail({}, { message: 'Proszę podać poprawny adres email.' })
  @IsNotEmpty({ message: 'Email nie może być pusty.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Hasło nie może być puste.' })
  @MinLength(6, { message: 'Hasło musi mieć co najmniej 6 znaków.' })
  password: string;
}