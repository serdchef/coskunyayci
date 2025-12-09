/**
 * POST /api/webhooks/stripe
 * Stripe webhook handler
 * 
 * Events:
 * - checkout.session.completed
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { handleStripeWebhook, processStripePayment } from '@/lib/payments';
import { notifyCustomer } from '@/lib/twilio';
// Lazy-load logger and helpers inside the handler to avoid bundling pino/thread-stream
// into Next server bundles at module init.
import { PaymentStatus } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Webhook signature doğrulama
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Webhook'u doğrula ve parse et
    const event = await handleStripeWebhook(body, signature);

  const { default: logger } = await import('@/lib/logger');
  logger.info({ type: event.type }, 'Stripe webhook received');

    // Event'i işle
    const result = await processStripePayment(event as any);

    // Sipariş durumunu güncelle
    if (result.orderId) {
      const order = await prisma.order.findUnique({
        where: { id: result.orderId },
      });

      if (!order) {
        logger.error({ orderId: result.orderId }, 'Order not found for payment');
        return NextResponse.json({ received: true });
      }

      if (result.status === 'success') {
        // Ödeme başarılı
        await prisma.order.update({
          where: { id: result.orderId },
          data: {
            paymentStatus: PaymentStatus.PAID,
            paymentIntentId: result.paymentIntentId,
            paidAt: new Date(),
            status: 'CONFIRMED',
          },
        });

  const { logPayment } = await import('@/lib/logger');
  logPayment(result.paymentIntentId || '', 'succeeded', order.totalCents);

        // Müşteriye onay bildirimi
        await notifyCustomer({
          phone: order.customerPhone,
          orderNumber: order.orderNumber,
          status: 'confirmed',
        }).catch((error) => {
          (async () => {
            const { default: logger } = await import('@/lib/logger');
            logger.error({ error }, 'Failed to send payment confirmation');
          })();
        });

        // Analytics
        await prisma.analyticsEvent.create({
          data: {
            eventName: 'payment_completed',
            properties: {
              orderId: result.orderId,
              orderNumber: order.orderNumber,
              amount: order.totalCents,
              paymentMethod: 'stripe',
            },
          },
        });

      } else if (result.status === 'failed') {
        // Ödeme başarısız
        await prisma.order.update({
          where: { id: result.orderId },
          data: {
            paymentStatus: PaymentStatus.FAILED,
          },
        });

  const { logPayment } = await import('@/lib/logger');
  logPayment(result.paymentIntentId || '', 'failed', order.totalCents);
      }

      // Audit log
      await prisma.auditLog.create({
        data: {
          entity: 'Order',
          entityId: result.orderId,
          action: 'PAYMENT',
          payload: {
            status: result.status,
            paymentIntentId: result.paymentIntentId,
          },
          actorType: 'system',
        },
      });
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error }, 'Stripe webhook error');
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
