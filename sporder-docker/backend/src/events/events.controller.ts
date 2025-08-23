import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @UseGuards(JwtAuthGuard) // Zabezpieczamy ten endpoint - tylko zalogowani mogą tworzyć wydarzenia
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    // Z tokenu JWT pobieramy ID zalogowanego użytkownika
    const hostId = req.user.sub;
    return this.eventsService.create(createEventDto, hostId);
  }
}
