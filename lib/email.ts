import { renderOrderConfirmationHTML } from '@/emails/OrderConfirmation';

// Lazy-load Resend client to avoid initialization errors at build time
let resendClient: any = null;

function getResendClient() {
  if (!resendClient) {
    const { Resend } = require('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY || '');
  }
  return resendClient;
}

interface SendOrderConfirmationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  orderDate: string;
  deliveryDate: string;
}

export async function sendOrderConfirmationEmail({
  orderId,
  customerName,
  customerEmail,
  items,
  totalPrice,
  orderDate,
  deliveryDate,
}: SendOrderConfirmationProps) {
  try {
    const resend = getResendClient();
    const adminEmail = process.env.ADMIN_EMAIL || 'orders@coskunyayci.com';

    // Render HTML once
    const html = renderOrderConfirmationHTML({
      orderId,
      customerName,
      customerEmail,
      items,
      totalPrice,
      orderDate,
      deliveryDate,
    });

    // Send to customer
    const customerResponse = await resend.emails.send({
      from: 'orders@coskunyayci.com',
      to: customerEmail,
      subject: `✨ Siparişiniz Başarılı - #${orderId}`,
      html,
    });

    // Send to admin
    const adminResponse = await resend.emails.send({
      from: 'orders@coskunyayci.com',
      to: adminEmail,
      subject: `🎯 Yeni Sipariş - #${orderId}`,
      html,
    });

    console.log('✅ Order confirmation email sent:', {
      customer: customerResponse,
      admin: adminResponse,
    });

    return {
      success: true,
      customerEmailId: customerResponse.data?.id || 'sent',
      adminEmailId: adminResponse.data?.id || 'sent',
    };
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format order date to Turkish locale
 */
export function formatOrderDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate estimated delivery date (2-3 business days)
 */
export function calculateDeliveryDate(orderDate: Date): string {
  const deliveryDate = new Date(orderDate);
  // Add 2-3 business days (simplified: just add 3 days)
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return deliveryDate.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
