/**
 * Twilio Adapter
 * SMS ve WhatsApp bildirimleri
 */

import twilio from 'twilio';
// Logger is imported lazily inside functions to avoid pulling pino/thread-stream
// into server bundles during module initialization.

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export type NotificationType = 'sms' | 'whatsapp';

export type OrderNotification = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  items: string; // Örn: "2x Fıstıklı Baklava"
  totalAmount: string;
  deliveryType: string;
  address?: string;
  phone: string;
};

// ============================================================================
// İŞLETME SAHİBİNE BİLDİRİM (Yeni Sipariş)
// ============================================================================

export async function notifyBusinessOwner(
  notification: OrderNotification,
  type: NotificationType = 'whatsapp'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const businessPhone = process.env.BUSINESS_PHONE_NUMBER;
    if (!businessPhone) {
      throw new Error('BUSINESS_PHONE_NUMBER tanımlı değil');
    }

    const message = formatBusinessNotification(notification);
    const from = type === 'whatsapp'
      ? process.env.TWILIO_WHATSAPP_NUMBER
      : process.env.TWILIO_PHONE_NUMBER;

    const to = type === 'whatsapp' ? `whatsapp:${businessPhone}` : businessPhone;

    const result = await client.messages.create({
      body: message,
      from,
      to,
    });

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info(
        {
          orderId: notification.orderId,
          messageId: result.sid,
          type,
          to: businessPhone,
        },
        'Business notification sent'
      );
    })();

    return { success: true, messageId: result.sid };
  } catch (error: any) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error, notification }, 'Twilio notification error');
    })();
    return { success: false, error: error.message };
  }
}

function formatBusinessNotification(notification: OrderNotification): string {
  return `🔔 *YENİ SİPARİŞ*

📋 Sipariş No: ${notification.orderNumber}
👤 Müşteri: ${notification.customerName}
📞 Telefon: ${notification.phone}

🛍️ Ürünler:
${notification.items}

💰 Toplam: ${notification.totalAmount}

🚚 Teslimat: ${notification.deliveryType}
${notification.address ? `📍 Adres: ${notification.address}` : ''}

Yönetim panelinden detayları görüntüleyebilirsiniz.`;
}

export { formatBusinessNotification };

// ============================================================================
// MÜŞTERİYE BİLDİRİM (Sipariş Onayı, Durum Güncellemeleri)
// ============================================================================

export type CustomerNotificationParams = {
  phone: string;
  orderNumber: string;
  status: string; // 'confirmed', 'preparing', 'ready', 'in_delivery', 'delivered'
  estimatedTime?: string;
  type?: NotificationType;
};

export async function notifyCustomer(
  params: CustomerNotificationParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const message = formatCustomerNotification(params);
    const type = params.type || 'sms';
    const from = type === 'whatsapp'
      ? process.env.TWILIO_WHATSAPP_NUMBER
      : process.env.TWILIO_PHONE_NUMBER;

    const to = type === 'whatsapp' ? `whatsapp:${params.phone}` : params.phone;

    const result = await client.messages.create({
      body: message,
      from,
      to,
    });

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info(
        {
          orderNumber: params.orderNumber,
          messageId: result.sid,
          status: params.status,
          type,
        },
        'Customer notification sent'
      );
    })();

    return { success: true, messageId: result.sid };
  } catch (error: any) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error, params }, 'Customer notification error');
    })();
    return { success: false, error: error.message };
  }
}

function formatCustomerNotification(params: CustomerNotificationParams): string {
  const statusMessages: Record<string, string> = {
    confirmed: `✅ Siparişiniz Onaylandı!\n\nSipariş No: ${params.orderNumber}\n\nSiparişiniz alındı ve hazırlanmaya başlandı.${params.estimatedTime ? `\n⏱️ Tahmini süre: ${params.estimatedTime}` : ''}`,
    preparing: `👨‍🍳 Siparişiniz Hazırlanıyor\n\nSipariş No: ${params.orderNumber}\n\nÜrünleriniz özenle hazırlanıyor.`,
    ready: `✨ Siparişiniz Hazır!\n\nSipariş No: ${params.orderNumber}\n\nSiparişiniz hazır ve teslimata çıkmak üzere.`,
    in_delivery: `🚚 Siparişiniz Yolda\n\nSipariş No: ${params.orderNumber}\n\nKurye yola çıktı, yakında kapınızda olacak!`,
    delivered: `🎉 Siparişiniz Teslim Edildi\n\nSipariş No: ${params.orderNumber}\n\nAfiyet olsun! Bizi tercih ettiğiniz için teşekkür ederiz.`,
  };

  return statusMessages[params.status] || `Sipariş durumu güncellendi: ${params.status}`;
}

// ============================================================================
// WEBHOOK İMZA DOĞRULAMA
// ============================================================================

export function validateWebhookSignature(
  signature: string,
  url: string,
  params: Record<string, any>
): boolean {
  try {
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    return twilio.validateRequest(authToken, signature, url, params);
  } catch (error) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error }, 'Webhook signature validation error');
    })();
    return false;
  }
}

// ============================================================================
// SMS/WHATSAPP RATE LIMIT KONTROLÜ
// ============================================================================

const messageCache = new Map<string, number[]>();
const MAX_MESSAGES_PER_HOUR = 10;

export function checkRateLimit(phone: string): boolean {
  const now = Date.now();
  const hourAgo = now - 3600000;

  const timestamps = messageCache.get(phone) || [];
  const recentMessages = timestamps.filter((ts) => ts > hourAgo);

  if (recentMessages.length >= MAX_MESSAGES_PER_HOUR) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.warn({ phone, count: recentMessages.length }, 'Rate limit exceeded for phone');
    })();
    return false;
  }

  recentMessages.push(now);
  messageCache.set(phone, recentMessages);

  return true;
}

export default client;
