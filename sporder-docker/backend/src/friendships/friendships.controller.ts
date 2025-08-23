import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post('requests')
  sendRequest(@Request() req, @Body() body: SendFriendRequestDto) {
    const senderId = req.user.sub;
    return this.friendshipsService.sendRequest(senderId, body.recipientId);
  }

  @Patch('requests/:requesterId')
  respondToRequest(
    @Request() req,
    @Param('requesterId', ParseIntPipe) requesterId: number,
    @Body() body: UpdateFriendshipDto,
  ) {
    const userId = req.user.sub;
    return this.friendshipsService.updateFriendshipStatus(
      userId,
      requesterId,
      body.status,
    );
  }

  @Get()
  getMyFriends(@Request() req) {
    const userId = req.user.sub;
    return this.friendshipsService.findUserFriends(userId);
  }

  @Delete(':friendId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFriend(
    @Request() req,
    @Param('friendId', ParseIntPipe) friendId: number,
  ) {
    const userId = req.user.sub;
    return this.friendshipsService.removeFriend(userId, friendId);
  }
}
