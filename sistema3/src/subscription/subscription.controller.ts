import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { RawBody } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
  ) {}

  @Post()
  create(@Body() body: { clientId: string }) {
    return this.subscriptionService.createSubscription(body.clientId);
  }

  @Get('status/:clientId')
  getStatus(@Param('clientId') clientId: string) {
    return this.subscriptionService.getSubscriptionStatus(clientId);
  }

  @Post('pay')
  async createPayment(@Body() body: { clientId: string }) {
    return this.stripeService.createCheckoutSession(body.clientId);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @RawBody() body: Buffer,
  ) {
    const event = await this.stripeService.constructWebhookEvent(body, sig);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const clientId = session.client_reference_id;

      if (!clientId) {
        throw new Error('Webhook recebido sem client_reference_id');
      }

      await this.subscriptionService.activateSubscription(clientId);
    }

    return { received: true };
  }
}