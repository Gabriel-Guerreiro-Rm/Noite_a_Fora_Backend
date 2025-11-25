import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventService } from 'src/event/event.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private eventService: EventService,
  ) {}

  async createOrder(clientId: string, createOrderDto: CreateOrderDto) {
    await this.eventService.purchaseTicket(createOrderDto.ticketLotId);

    const order = await this.prisma.order.create({
      data: {
        clientId: clientId,
      },
    });

    return order;
  }
}