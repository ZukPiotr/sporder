// Lokalizacja: src/profiles/profiles.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserSport } from './user-sport.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserSport)
    private userSportsRepository: Repository<UserSport>,
  ) {}

  async findProfileByUserId(
    userId: number,
  ): Promise<Omit<User, 'password' | 'hashPassword'>> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['sports'],
    });

    if (!user) {
      throw new NotFoundException('Użytkownik nie został znaleziony.');
    }
    
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'password' | 'hashPassword'>> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const userRepo = transactionalEntityManager.getRepository(User);
      const sportsRepo = transactionalEntityManager.getRepository(UserSport);
      
      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Użytkownik nie został znaleziony.');
      }

      if (updateProfileDto.name) user.name = updateProfileDto.name;
      if (updateProfileDto.homeCity) user.homeCity = updateProfileDto.homeCity;

      if (updateProfileDto.sports) {
        await sportsRepo.delete({ userId: user.id });

        if (updateProfileDto.sports.length > 0) {
          const sportsToSave = updateProfileDto.sports.map((sportDto) =>
            sportsRepo.create({
              userId: user.id,
              sportName: sportDto.sportName,
              skillLevel: sportDto.skillLevel,
              isFavorite: sportDto.isFavorite ?? false,
            }),
          );
          await sportsRepo.save(sportsToSave);
        }
      }

      await userRepo.save(user);
      return this.findProfileByUserId(userId);
    });
  }
}