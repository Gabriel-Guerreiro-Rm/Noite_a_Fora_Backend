import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientAuthGuard } from 'src/auth/guards/client-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(ClientAuthGuard)
  @Post('buy')
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const clientId = req.user.sub;
    return this.orderService.createOrder(clientId, createOrderDto);
  }
}