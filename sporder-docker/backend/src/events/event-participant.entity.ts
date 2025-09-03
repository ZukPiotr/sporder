// Lokalizacja: src/events/event-participant.entity.ts

import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Event } from './event.entity';

@Entity('event_participants')
export class EventParticipant {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'event_id' })
  eventId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}