import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('user_sports')
export class UserSport {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'sport_name', type: 'varchar', length: 100 })
  sportName: string;

  @Column({ name: 'skill_level', type: 'varchar', length: 50 })
  skillLevel: string;

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;

  @ManyToOne(() => User, (user) => user.sports, {onDelete: 'CASCADE'})
  @JoinColumn({ name: 'user_id' })
  user: User;
}