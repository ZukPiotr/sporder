import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Proszę podać poprawny adres email.' })
  @IsNotEmpty({ message: 'Email nie może być pusty.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Hasło nie może być puste.' })
  password: string;
}