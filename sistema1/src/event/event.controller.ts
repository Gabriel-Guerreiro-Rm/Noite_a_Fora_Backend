import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateTicketLotDto } from './dto/create-ticket-lot.dto';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateTicketLotDto } from './dto/update-ticket-lot.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const organizerId = req.user.sub;
    return this.eventService.createEvent(organizerId, createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAllEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOneEvent(id);
  }
  
  @Get('lot/:id')
  findOneTicketLot(@Param('id') lotId: string) {
    return this.eventService.findOneTicketLot(lotId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const organizerId = req.user.sub;
    return this.eventService.updateEvent(organizerId, id, updateEventDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const organizerId = req.user.sub;
    return this.eventService.deleteEvent(organizerId, id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/lot')
  addTicketLot(
    @Request() req,
    @Param('id') eventId: string,
    @Body() createTicketLotDto: CreateTicketLotDto,
  ) {
    const organizerId = req.user.sub;
    return this.eventService.addTicketLot(
      organizerId,
      eventId,
      createTicketLotDto,
    );
  }
  
  @UseGuards(AuthGuard)
  @Patch('lot/:id')
  updateTicketLot(
    @Request() req,
    @Param('id') lotId: string,
    @Body() updateTicketLotDto: UpdateTicketLotDto,
  ) {
    const organizerId = req.user.sub;
    return this.eventService.updateTicketLot(
      organizerId,
      lotId,
      updateTicketLotDto,
    );
  }
  
  @UseGuards(AuthGuard)
  @Delete('lot/:id')
  deleteTicketLot(@Request() req, @Param('id') lotId: string) {
    const organizerId = req.user.sub;
    return this.eventService.deleteTicketLot(organizerId, lotId);
  }

  @UseGuards(ApiKeyGuard)
  @Post('internal/purchase')
  purchase(@Body() body: { ticketLotId: string }) {
    return this.eventService.purchaseTicket(body.ticketLotId);
  }
}