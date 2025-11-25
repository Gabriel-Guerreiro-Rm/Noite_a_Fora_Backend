import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error(
        'A variável de ambiente STRIPE_SECRET_KEY não está definida.',
      );
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-10-29.clover',
    });
  }

  async createCheckoutSession(clientId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Assinatura TicketHub',
              description: 'Acesso completo à plataforma de eventos.',
            },
            unit_amount: 990,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/payment-success',
      cancel_url: 'http://localhost:3000/payment-cancel',
      client_reference_id: clientId,
    });

    return { url: session.url };
  }

  async constructWebhookEvent(body: Buffer, sig: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      throw new Error('Chave secreta do Webhook não definida');
    }

    return this.stripe.webhooks.constructEvent(body, sig, secret);
  }
}