import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { User } from '../users/user.entity';
import { UserSport } from './user-sport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSport])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
