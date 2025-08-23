import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserSport } from './user-sport.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserSport)
    private userSportsRepository: Repository<UserSport>,
  ) {}

  async findProfileByUserId(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['sports'], // Dołączamy relację ze sportami
    });

    if (!user) {
      throw new NotFoundException('Użytkownik nie został znaleziony.');
    }
    // Usuwamy hasło przed zwróceniem danych
    delete user.password;
    return user;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.findProfileByUserId(userId);

    // Aktualizuj podstawowe dane profilu
    if (updateProfileDto.name) user.name = updateProfileDto.name;
    if (updateProfileDto.homeCity) user.homeCity = updateProfileDto.homeCity;

    // Aktualizuj sporty (jeśli zostały przesłane)
    if (updateProfileDto.sports) {
      // 1. Usuń stare sporty
      await this.userSportsRepository.delete({ userId });
      // 2. Dodaj nowe sporty
      const sportsToSave = updateProfileDto.sports.map((sportDto) =>
        this.userSportsRepository.create({
          userId,
          ...sportDto,
        }),
      );
      await this.userSportsRepository.save(sportsToSave);
    }

    await this.usersRepository.save(user);
    // Zwróć zaktualizowany profil z nowymi sportami
    return this.findProfileByUserId(userId);
  }
}
