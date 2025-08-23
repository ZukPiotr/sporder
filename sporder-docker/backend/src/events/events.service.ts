import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  findAll(): Promise<Event[]> {
    // Pobieramy wydarzenia wraz z danymi organizatora (host)
    return this.eventsRepository.find({ relations: ['host'] });
  }

  async create(createEventDto: CreateEventDto, hostId: number): Promise<Event> {
    const newEvent = this.eventsRepository.create({
      ...createEventDto,
      hostId: hostId,
    });
    return this.eventsRepository.save(newEvent);
  }
}
