import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(JwtAuthGuard) // Wszystkie endpointy w tym kontrolerze wymagają zalogowania
@Controller('profile')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  getMyProfile(@Request() req) {
    const userId = req.user.sub;
    return this.profilesService.findProfileByUserId(userId);
  }

  @Patch('me')
  updateMyProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = req.user.sub;
    return this.profilesService.updateProfile(userId, updateProfileDto);
  }
}
