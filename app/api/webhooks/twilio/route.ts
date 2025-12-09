/**
 * POST /api/webhooks/twilio
 * Twilio webhook handler
 * 
 * Gelen SMS/WhatsApp mesajlarını işler
 * Twilio signature doğrulaması yapar
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateWebhookSignature } from '@/lib/twilio';
// Lazy-load logger inside handler to avoid pulling pino/thread-stream into Next
// server bundles during module initialization.

export async function POST(request: NextRequest) {
  try {
    // Webhook signature doğrulama
    const signature = request.headers.get('x-twilio-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Form data parse et
    const formData = await request.formData();
    const params: Record<string, any> = {};
    formData.forEach((value, key) => {
      params[key] = value;
    });

    // Signature doğrulama
    const url = request.url;
    const isValid = validateWebhookSignature(signature, url, params);

    if (!isValid) {
      const { default: logger } = await import('@/lib/logger');
      logger.error({ url }, 'Invalid Twilio signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Mesaj detayları
    const from = params.From as string;
    const body = params.Body as string;
    const messageId = params.MessageSid as string;

  const { default: logger } = await import('@/lib/logger');
  logger.info({ from, body, messageId }, 'Twilio message received');

    // Gelen mesajı işle
    // Bu kısım genişletilebilir:
    // - Sipariş durumu sorgulaması
    // - Müşteri desteği mesajları
    // - Otomatik yanıtlar

    // Basit otomatik yanıt örneği
    const response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Mesajınızı aldık. En kısa sürede size dönüş yapacağız. Sipariş bilgisi için: ${process.env.NEXT_PUBLIC_APP_URL}</Message>
</Response>`;

    // Analytics
    // await prisma.analyticsEvent.create({
    //   data: {
    //     eventName: 'inbound_message',
    //     properties: {
    //       from,
    //       messageId,
    //       channel: from.startsWith('whatsapp:') ? 'whatsapp' : 'sms',
    //     },
    //   },
    // });

    return new NextResponse(response, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error }, 'Twilio webhook error');
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
