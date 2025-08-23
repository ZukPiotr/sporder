import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('user_sports')
export class UserSport {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'sport_name' })
  sportName: string;

  @Column({ name: 'skill_level' })
  skillLevel: string;

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;

  @ManyToOne(() => User, (user) => user.sports)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
