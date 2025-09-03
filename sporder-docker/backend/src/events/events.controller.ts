import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Delete, // <-- NOWY IMPORT
  Param,  // <-- NOWY IMPORT
  ParseIntPipe, // <-- NOWY IMPORT
  HttpCode, // <-- NOWY IMPORT
  HttpStatus, // <-- NOWY IMPORT
} from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    const hostId = req.user.sub;
    return this.eventsService.create(createEventDto, hostId);
  }

  // --- NOWY ENDPOINT DO DOŁĄCZANIA (tworzenia rezerwacji) ---
  @UseGuards(JwtAuthGuard)
  @Post(':id/bookings')
  joinEvent(@Param('id', ParseIntPipe) eventId: number, @Request() req) {
    const userId = req.user.sub;
    return this.eventsService.addParticipant(eventId, userId);
  }

  // --- NOWY ENDPOINT DO OPUSZCZANIA (usuwania rezerwacji) - NAPRAWIA BŁĄD 404 ---
  @UseGuards(JwtAuthGuard)
  @Delete(':id/bookings')
  @HttpCode(HttpStatus.NO_CONTENT) // Ustawiamy kod 204 No Content dla pomyślnego usunięcia
  leaveEvent(@Param('id', ParseIntPipe) eventId: number, @Request() req) {
    const userId = req.user.sub;
    return this.eventsService.removeParticipant(eventId, userId);
  }
}