import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn, // <-- NOWY IMPORT
} from 'typeorm';
import { User } from '../users/user.entity';
import { EventParticipant } from './event-participant.entity'; // <-- NOWY IMPORT

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

  @Column()
  when: Date;

  @Column()
  spots: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'host_id' })
  host: User;

  // !! NOWA RELACJA !!
  // Mówi TypeORM, że jedno wydarzenie może mieć wiele wpisów w tabeli event_participants
  @OneToMany(() => EventParticipant, (participant) => participant.event)
  participants: EventParticipant[];

  // Ta właściwość nie jest kolumną w bazie danych.
  // Będziemy ją obliczać w serwisie przed wysłaniem danych do frontendu.
  taken: number;
}