import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Friendship, FriendshipStatus } from './friendship.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipsRepository: Repository<Friendship>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private getFriendshipKey(userId1: number, userId2: number) {
    return {
      userOneId: Math.min(userId1, userId2),
      userTwoId: Math.max(userId1, userId2),
    };
  }

  async sendRequest(senderId: number, recipientId: number): Promise<Friendship> {
    if (senderId === recipientId) {
      throw new BadRequestException('Nie możesz wysłać zaproszenia do samego siebie.');
    }

    const recipient = await this.usersRepository.findOneBy({ id: recipientId });
    if (!recipient) {
      throw new NotFoundException('Użytkownik docelowy nie został znaleziony.');
    }

    const key = this.getFriendshipKey(senderId, recipientId);
    const existingFriendship = await this.friendshipsRepository.findOneBy(key);

    if (existingFriendship) {
      throw new ConflictException('Relacja z tym użytkownikiem już istnieje.');
    }

    const newFriendship = this.friendshipsRepository.create({
      ...key,
      status: FriendshipStatus.PENDING,
      actionUserId: senderId,
    });

    return this.friendshipsRepository.save(newFriendship);
  }

  async updateFriendshipStatus(
    userId: number,
    requesterId: number,
    status: FriendshipStatus,
  ): Promise<Friendship> {
    const key = this.getFriendshipKey(userId, requesterId);
    const friendship = await this.friendshipsRepository.findOneBy(key);

    if (!friendship) {
      throw new NotFoundException('Zaproszenie nie zostało znalezione.');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new BadRequestException('Ta relacja nie oczekuje na akceptację.');
    }

    if (friendship.actionUserId === userId) {
      throw new ForbiddenException('Nie możesz zaakceptować własnego zaproszenia.');
    }

    if (status === FriendshipStatus.ACCEPTED) {
      friendship.status = FriendshipStatus.ACCEPTED;
      friendship.actionUserId = userId;
      return this.friendshipsRepository.save(friendship);
    } else {
      // Odrzucenie zaproszenia lub zablokowanie to usunięcie relacji PENDING
      // Bardziej złożona logika blokowania wymagałaby rozbudowy
      await this.friendshipsRepository.remove(friendship);
      return null; // Zwracamy null, aby zasygnalizować usunięcie
    }
  }
  
  async removeFriend(userId: number, friendId: number): Promise<void> {
    const key = this.getFriendshipKey(userId, friendId);
    const friendship = await this.friendshipsRepository.findOneBy({
        ...key,
        status: FriendshipStatus.ACCEPTED,
    });

    if (!friendship) {
        throw new NotFoundException('Nie jesteście znajomymi.');
    }
    
    await this.friendshipsRepository.remove(friendship);
  }

  async findUserFriends(userId: number): Promise<User[]> {
      const friendships = await this.friendshipsRepository.find({
          where: [
              { userOneId: userId, status: FriendshipStatus.ACCEPTED },
              { userTwoId: userId, status: FriendshipStatus.ACCEPTED },
          ],
          relations: ['userOne', 'userTwo']
      });

      const friends = friendships.map(f => f.userOneId === userId ? f.userTwo : f.userOne);
      // Usuwamy hasła przed zwróceniem
      return friends.map(({ password, ...rest}) => rest as User);
  }
}
