import { IsEnum, IsNotEmpty } from 'class-validator';
import { FriendshipStatus } from '../friendship.entity';

export class UpdateFriendshipDto {
  @IsEnum(FriendshipStatus)
  @IsNotEmpty()
  status: FriendshipStatus;
}
