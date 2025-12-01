import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateTicketLotDto } from './dto/create-ticket-lot.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateTicketLotDto } from './dto/update-ticket-lot.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async createEvent(organizerId: string, createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
        organizerId: organizerId,
      },
    });
  }

  async findAllEvents() {
    return this.prisma.event.findMany({
      include: {
        ticketLots: true,
      },
    });
  }
  
  async findOneEvent(id: string) {
    const event = await this.prisma.event.findUnique({
        where: { id },
        include: { ticketLots: true },
    });
    if (!event) {
        throw new NotFoundException('Evento não encontrado');
    }
    return event;
  }

  async updateEvent(
    organizerId: string,
    id: string,
    updateEventDto: UpdateEventDto,
  ) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) { throw new NotFoundException('Evento não encontrado'); }
    if (event.organizerId !== organizerId) { throw new UnauthorizedException('Você não é o dono deste evento'); }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
      },
    });
  }

  async deleteEvent(organizerId: string, id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) { throw new NotFoundException('Evento não encontrado'); }
    if (event.organizerId !== organizerId) { throw new UnauthorizedException('Você não é o dono deste evento'); }

    await this.prisma.ticketLot.deleteMany({
      where: { eventId: id },
    });

    await this.prisma.event.delete({ where: { id } });
    return { message: 'Evento excluído com sucesso' };
  }

  async addTicketLot(
    organizerId: string,
    eventId: string,
    createTicketLotDto: CreateTicketLotDto,
  ) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizerId !== organizerId) {
      throw new UnauthorizedException('Evento não encontrado ou acesso negado');
    }

    return this.prisma.ticketLot.create({
      data: { ...createTicketLotDto, eventId: eventId },
    });
  }
  
  async updateTicketLot(
    organizerId: string,
    lotId: string,
    updateTicketLotDto: UpdateTicketLotDto,
  ) {
    const lot = await this.prisma.ticketLot.findUnique({
      where: { id: lotId },
      include: { event: true },
    });

    if (!lot || lot.event.organizerId !== organizerId) {
      throw new UnauthorizedException('Lote não encontrado ou acesso negado');
    }

    return this.prisma.ticketLot.update({
      where: { id: lotId },
      data: updateTicketLotDto,
    });
  }

  async deleteTicketLot(organizerId: string, lotId: string) {
    const lot = await this.prisma.ticketLot.findUnique({
      where: { id: lotId },
      include: { event: true },
    });
    
    if (!lot || lot.event.organizerId !== organizerId) {
      throw new UnauthorizedException('Lote não encontrado ou acesso negado');
    }
    
    await this.prisma.ticketLot.delete({ where: { id: lotId } });
    return { message: 'Lote excluído com sucesso' };
  }
  
  async findOneTicketLot(lotId: string) {
    const lot = await this.prisma.ticketLot.findUnique({
        where: { id: lotId },
        include: { event: true },
    });
    if (!lot) {
        throw new NotFoundException('Lote não encontrado');
    }
    return lot;
  }

  async purchaseTicket(ticketLotId: string) {
    const ticketLot = await this.prisma.ticketLot.findUnique({
      where: { id: ticketLotId },
    });

    if (!ticketLot) { throw new UnauthorizedException('Lote de ingresso não encontrado'); }
    if (ticketLot.quantity <= 0) { throw new UnauthorizedException('Ingressos esgotados'); }

    await this.prisma.ticketLot.update({
      where: { id: ticketLotId },
      data: { quantity: { decrement: 1 } },
    });
    return { message: 'Compra validada com sucesso' };
  }
}