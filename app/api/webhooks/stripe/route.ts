/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler - Payment confirmation and order status updates
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  if (!webhookSecret) {
    console.error('[WEBHOOK_ERROR] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('[WEBHOOK_ERROR] Signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[PAYMENT_SUCCESS]', paymentIntent.id);

        // Find order by payment intent - update status to IN_OVEN
        await prisma.order.updateMany({
          where: { metadata: { path: ['paymentIntentId'], equals: paymentIntent.id } },
          data: { status: 'IN_OVEN' },
        });

        console.log('[ORDER_UPDATED] Status → IN_OVEN (Fırında)');
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        console.log('[PAYMENT_FAILED]', charge.id);

        // Update order to FAILED status
        await prisma.order.updateMany({
          where: { metadata: { path: ['chargeId'], equals: charge.id } },
          data: { status: 'FAILED' },
        });

        console.log('[ORDER_FAILED] Ödeme başarısız');
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[CHECKOUT_COMPLETED]', session.id);
        break;
      }

      default:
        console.log('[WEBHOOK] Unhandled event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WEBHOOK_ERROR] Processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
