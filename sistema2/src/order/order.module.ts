import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventModule } from 'src/event/event.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, EventModule, AuthModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}