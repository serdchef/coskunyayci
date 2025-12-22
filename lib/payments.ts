/**
 * Payment Adapters
 * Stripe ve iyzico entegrasyonu
 */

import Stripe from 'stripe';
// Lazy-load logger inside functions to avoid pulling pino/thread-stream into
// server bundles during module initialization.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // use a supported API version string to satisfy typings
  apiVersion: '2023-10-16' as any,
  typescript: true,
});

// ============================================================================
// STRIPE PAYMENT
// ============================================================================

export type CreateCheckoutSessionParams = {
  orderId: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    priceCents: number;
  }>;
  totalCents: number;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export async function createStripeCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ url: string; sessionId: string }> {
  try {
    const lineItems = params.items.map((item) => ({
      price_data: {
        currency: 'try',
        product_data: {
          name: item.name,
          description: 'Coşkun Yayçı Baklava',
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      client_reference_id: params.orderId,
      metadata: {
        orderId: params.orderId,
        orderNumber: params.orderNumber,
        ...params.metadata,
      },
      locale: 'tr',
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      payment_intent_data: {
        metadata: {
          orderId: params.orderId,
          orderNumber: params.orderNumber,
        },
      },
    });

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info(
        {
          orderId: params.orderId,
          sessionId: session.id,
          totalCents: params.totalCents,
        },
        'Stripe checkout session created'
      );
    })();

    return {
      url: session.url!,
      sessionId: session.id,
    };
  } catch (error: any) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error, params }, 'Stripe checkout session error');
    })();
    throw new Error(`Ödeme oturumu oluşturulamadı: ${error.message}`);
  }
}

// ============================================================================
// STRIPE WEBHOOK HANDLER
// ============================================================================

export async function handleStripeWebhook(
  payload: string | Buffer,
  signature: string
): Promise<{
  type: string;
  data: any;
}> {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info({ type: event.type, id: event.id }, 'Stripe webhook received');
    })();

    return {
      type: event.type,
      data: event.data.object,
    };
  } catch (error: any) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error }, 'Stripe webhook verification failed');
    })();
    throw new Error(`Webhook doğrulaması başarısız: ${error.message}`);
  }
}

export async function processStripePayment(event: Stripe.Event): Promise<{
  orderId?: string;
  status: 'success' | 'failed';
  paymentIntentId?: string;
}> {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const paymentIntentId = session.payment_intent as string;

        (async () => {
          const { default: logger } = await import('./logger');
          logger.info({ orderId, paymentIntentId }, 'Payment completed');
        })();

        return {
          orderId,
          status: 'success',
          paymentIntentId,
        };
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        (async () => {
          const { default: logger } = await import('./logger');
          logger.info({ orderId, paymentIntentId: paymentIntent.id }, 'Payment intent succeeded');
        })();

        return {
          orderId,
          status: 'success',
          paymentIntentId: paymentIntent.id,
        };
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        (async () => {
          const { default: logger } = await import('./logger');
          logger.warn({ orderId, paymentIntentId: paymentIntent.id }, 'Payment failed');
        })();

        return {
          orderId,
          status: 'failed',
          paymentIntentId: paymentIntent.id,
        };
      }

      default:
        (async () => {
          const { default: logger } = await import('./logger');
          logger.info({ type: event.type }, 'Unhandled webhook event type');
        })();
        return { status: 'success' };
    }
  } catch (error) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error, eventType: event.type }, 'Stripe payment processing error');
    })();
    throw error;
  }
}

// ============================================================================
// REFUND
// ============================================================================

export async function createRefund(
  paymentIntentId: string,
  amountCents?: number,
  reason?: string
): Promise<{ refundId: string; status: string }> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amountCents,
      reason: reason as Stripe.RefundCreateParams.Reason,
    });

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info(
        {
          refundId: refund.id,
          paymentIntentId,
          amountCents: refund.amount,
          status: refund.status,
        },
        'Refund created'
      );
    })();

    return {
      refundId: refund.id,
      // refund.status can be null in some stripe typings; coerce to string for our return type
      status: refund.status ?? 'unknown',
    };
  } catch (error: any) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error, paymentIntentId }, 'Refund creation error');
    })();
    throw new Error(`İade oluşturulamadı: ${error.message}`);
  }
}

// ============================================================================
// iyzico ADAPTER (Türkiye için alternatif)
// ============================================================================

export type IyzicoPaymentParams = {
  orderId: string;
  totalCents: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    priceCents: number;
  }>;
};

/**
 * iyzico entegrasyonu için placeholder
 * Gerçek implementasyon iyzico API dokümantasyonuna göre yapılmalıdır
 * @see https://dev.iyzipay.com/tr/api
 */
export async function createIyzicoPayment(
  params: IyzicoPaymentParams
): Promise<{ paymentPageUrl: string; token: string }> {
  // Bu bir placeholder implementasyondur
  // Gerçek üretim ortamında iyzico SDK kullanılmalıdır
  
  (async () => {
    const { default: logger } = await import('./logger');
    logger.warn('iyzico integration is not implemented yet - using placeholder');
  })();

  // Mock response
  return {
    paymentPageUrl: `https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/auth/easypos/d?token=mock-${params.orderId}`,
    token: `mock-${params.orderId}`,
  };
}

// ============================================================================
// PAYMENT INTENT ADAPTER
// ============================================================================

export type CreatePaymentIntentParams = {
  orderId: string;
  amount: number; // cents
  customerEmail: string;
  customerName: string;
  description?: string;
};

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: 'try',
      description: params.description || `Order #${params.orderId}`,
      metadata: {
        orderId: params.orderId,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
      },
      receipt_email: params.customerEmail,
    });

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info(
        {
          orderId: params.orderId,
          paymentIntentId: paymentIntent.id,
          amount: params.amount,
        },
        'Payment intent created'
      );
    })();

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error, params }, 'Payment intent creation error');
    })();
    throw new Error(`Ödeme amacı oluşturulamadı: ${error.message}`);
  }
}

export default stripe;
