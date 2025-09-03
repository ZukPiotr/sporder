// Lokalizacja: src/events/events.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { EventParticipant } from './event-participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventParticipant])
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}