import { User } from '../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sport: string;

  @Column()
  level: string;

  @Column()
  city: string;

  @Column()
  place: string;

  @Column({ type: 'timestamptz' })
  when: Date;

  @Column()
  spots: number;

  @Column({ name: 'host_id' })
  hostId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'host_id' })
  host: User;
}
