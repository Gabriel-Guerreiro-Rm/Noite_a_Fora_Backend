import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [PrismaModule, StripeModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}