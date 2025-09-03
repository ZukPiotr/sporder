// Lokalizacja: src/events/events.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventParticipant } from './event-participant.entity'; // <-- NOWY IMPORT
import { User } from '../users/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    // 1. WSTRZYKUJEMY REPOZYTORIUM DO OBSŁUGI UCZESTNIKÓW
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>,
  ) {}

  async findAll(): Promise<Event[]> {
    // 1. Pobieramy wydarzenia WRAZ z relacją do uczestników ('participants')
    const events = await this.eventsRepository.find({
      relations: ['host', 'participants'],
    });
  
    // 2. Mapujemy wyniki, aby do każdego wydarzenia dodać obliczone pole 'taken'
    return events.map(event => ({
      ...event,
      // Liczba zajętych miejsc to po prostu długość tablicy uczestników
      taken: event.participants ? event.participants.length : 0,
    }));
  }

  async create(createEventDto: CreateEventDto, hostId: number): Promise<Event> {
    const newEvent = this.eventsRepository.create({
      ...createEventDto,
      // 2. POPRAWKA: Tak TypeORM poprawnie tworzy relację na podstawie ID
      host: { id: hostId },
    });
    return this.eventsRepository.save(newEvent);
  }

  // 3. NOWA METODA DO DOŁĄCZANIA DO WYDARZENIA
  async addParticipant(eventId: number, userId: number): Promise<EventParticipant> {
    // Sprawdzamy, czy rezerwacja już istnieje, aby uniknąć duplikatów
    const existingBooking = await this.eventParticipantRepository.findOne({ where: { eventId, userId } });
    if (existingBooking) {
        return existingBooking; // Jeśli już istnieje, po prostu ją zwracamy
    }
    
    const booking = this.eventParticipantRepository.create({ eventId, userId });
    return this.eventParticipantRepository.save(booking);
  }

  // 4. NOWA METODA DO OPUSZCZANIA WYDARZENIA
  async removeParticipant(eventId: number, userId: number): Promise<void> {
    const result = await this.eventParticipantRepository.delete({ eventId, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Nie znaleziono rezerwacji do usunięcia');
    }
  }
}