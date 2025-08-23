import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events/:eventId/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  join(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.bookingsService.joinEvent(eventId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  leave(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Request() req,
  ) {
    const userId = req.user.sub;
    return this.bookingsService.leaveEvent(eventId, userId);
  }

  @Get()
  getParticipants(@Param('eventId', ParseIntPipe) eventId: number) {
      return this.bookingsService.findParticipants(eventId);
  }
}
