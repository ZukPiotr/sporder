import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
}

@Entity('friendships')
export class Friendship {
  @PrimaryColumn({ name: 'user_one_id' })
  userOneId: number;

  @PrimaryColumn({ name: 'user_two_id' })
  userTwoId: number;

  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus;

  @Column({ name: 'action_user_id' })
  actionUserId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_one_id' })
  userOne: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_two_id' })
  userTwo: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'action_user_id' })
  actionUser: User;
}
