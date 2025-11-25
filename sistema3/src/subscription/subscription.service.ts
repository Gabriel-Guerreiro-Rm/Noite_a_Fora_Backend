import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(clientId: string) {
    return this.prisma.subscription.create({
      data: {
        clientId: clientId,
        status: SubscriptionStatus.INACTIVE,
      },
    });
  }

  async getSubscriptionStatus(clientId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { clientId: clientId },
    });

    if (!subscription) {
      return { status: SubscriptionStatus.INACTIVE };
    }

    return { status: subscription.status };
  }

  async activateSubscription(clientId: string) {
    return this.prisma.subscription.update({
      where: { clientId: clientId },
      data: { status: SubscriptionStatus.ACTIVE },
    });
  }
}