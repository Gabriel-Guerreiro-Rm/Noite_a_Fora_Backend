import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientAuthGuard } from 'src/auth/guards/client-auth.guard';
import { SubscriptionGuard } from 'src/auth/guards/subscription.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(ClientAuthGuard, SubscriptionGuard) 
  @Post('buy')
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const clientId = req.user.sub;
    return this.orderService.createOrder(clientId, createOrderDto);
  }

  @UseGuards(ClientAuthGuard)
  @Get('me')
  findAll(@Request() req) {
    const clientId = req.user.sub;
    return this.orderService.findAllByClient(clientId);
  }

  @UseGuards(ClientAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') orderId: string) {
    const clientId = req.user.sub;
    return this.orderService.findOneByClient(orderId, clientId);
  }
}