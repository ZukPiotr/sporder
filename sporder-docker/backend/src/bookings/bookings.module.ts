import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { EventParticipant } from './event-participant.entity';
import { Event } from '../events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventParticipant, Event])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
