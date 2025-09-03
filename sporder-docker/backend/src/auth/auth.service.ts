import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOne(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    // Tworzymy użytkownika w bazie danych. Hook @BeforeInsert w encji zahashuje hasło.
    const user = await this.usersService.create(createUserDto);
    
    // !! KLUCZOWA ZMIANA !!
    // Po udanym stworzeniu użytkownika, od razu wywołujemy funkcję login,
    // aby wygenerować dla niego token i zwrócić pełny pakiet danych.
    // Używamy hasła z DTO (przed hashowaniem), ponieważ funkcja login
    // sama zajmuje się porównaniem hashy za pomocą bcrypt.compare.
    return this.login(user.email, createUserDto.password);
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Usuwamy hash hasła z obiektu, który zwrócimy do frontendu
    const { password, ...userData } = user;
    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }
}