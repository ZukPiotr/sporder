import { IsInt, IsNotEmpty } from 'class-validator';

export class SendFriendRequestDto {
  @IsInt()
  @IsNotEmpty()
  recipientId: number;
}
