import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [PrismaModule, SubscriptionModule, StripeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}