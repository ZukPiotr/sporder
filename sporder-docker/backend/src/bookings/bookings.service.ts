import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventParticipant } from './event-participant.entity';
import { Event } from '../events/event.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(EventParticipant)
    private participantsRepository: Repository<EventParticipant>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async joinEvent(eventId: number, userId: number): Promise<EventParticipant> {
    // Sprawdź, czy wydarzenie istnieje
    const event = await this.eventsRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Wydarzenie nie zostało znalezione.');
    }

    // Sprawdź, czy użytkownik już nie dołączył
    const existingParticipation = await this.participantsRepository.findOneBy({
      eventId,
      userId,
    });
    if (existingParticipation) {
      throw new ConflictException('Jesteś już zapisany/a na to wydarzenie.');
    }

    // Sprawdź, czy są wolne miejsca
    const participantsCount = await this.participantsRepository.countBy({ eventId });
    if (participantsCount >= event.spots) {
      throw new ConflictException('Brak wolnych miejsc na to wydarzenie.');
    }

    const participation = this.participantsRepository.create({ eventId, userId });
    return this.participantsRepository.save(participation);
  }

  async leaveEvent(eventId: number, userId: number): Promise<void> {
    const participation = await this.participantsRepository.findOneBy({
      eventId,
      userId,
    });

    if (!participation) {
      throw new NotFoundException('Nie jesteś zapisany/a na to wydarzenie.');
    }

    await this.participantsRepository.remove(participation);
  }

  async findParticipants(eventId: number): Promise<EventParticipant[]> {
    return this.participantsRepository.find({
        where: { eventId },
        relations: ['user'] // Dołączamy dane użytkowników
    });
  }
}
