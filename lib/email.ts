/**
 * Email Service with Resend
 * Ghost Style, Luxury Minimal Design
 */

import { Resend } from 'resend';
import { OrderConfirmationEmail } from './emails/OrderConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderEmailData {
  orderId: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  address?: {
    street: string;
    city: string;
    district: string;
    zipCode: string;
  };
  status: string;
}

/**
 * Send order confirmation email to customer and admin
 */
export async function sendOrderConfirmation(orderData: OrderEmailData) {
  try {
    const { customerEmail, customerName, orderId, orderNumber } = orderData;
    
    // Send to customer
    const customerEmailResult = await resend.emails.send({
      from: 'Coşkun Yaycı <orders@coskunyayci.com>',
      to: customerEmail,
      subject: `✨ Siparişiniz Başarılı - #${orderNumber || orderId}`,
      react: OrderConfirmationEmail({ 
        ...orderData, 
        isAdmin: false 
      }),
    });

    // Send to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'serdchef@gmail.com';
    const adminEmailResult = await resend.emails.send({
      from: 'Coşkun Yaycı <orders@coskunyayci.com>',
      to: adminEmail,
      subject: `🎯 Yeni Sipariş - #${orderNumber || orderId}`,
      react: OrderConfirmationEmail({ 
        ...orderData, 
        isAdmin: true 
      }),
    });

    return {
      success: true,
      customerEmailId: customerEmailResult.data?.id,
      adminEmailId: adminEmailResult.data?.id,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdate(
  email: string,
  orderData: OrderEmailData
) {
  try {
    const result = await resend.emails.send({
      from: 'Coşkun Yaycı <orders@coskunyayci.com>',
      to: email,
      subject: `📦 Sipariş Durumu Güncellendi - ${orderData.orderNumber || orderData.orderId}`,
      html: generateStatusUpdateHTML(orderData),
    });

    return {
      success: true,
      emailId: result.data?.id,
    };
  } catch (error) {
    console.error('Status update email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate HTML for status update (simple version)
 */
function generateStatusUpdateHTML(orderData: OrderEmailData): string {
  const statusMessages: Record<string, string> = {
    CONFIRMED: '✅ Siparişiniz onaylandı',
    PREPARING: '👨‍🍳 Siparişiniz hazırlanıyor',
    SHIPPED: '🚚 Siparişiniz yola çıktı',
    DELIVERED: '✨ Siparişiniz teslim edildi',
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sipariş Durumu</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 40px 40px 20px;">
                    <h1 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #1a1a1a; text-align: center;">
                      ${statusMessages[orderData.status] || 'Sipariş Güncellendi'}
                    </h1>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #666; text-align: center;">
                      Sipariş No: <strong>${orderData.orderNumber || orderData.orderId}</strong>
                    </p>
                    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
                      <p style="margin: 0; font-size: 14px; color: #999; text-align: center;">
                        Müşteri: ${orderData.customerName}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #999; text-align: center;">
                      Coşkun Yaycı ile alışveriş yaptığınız için teşekkür ederiz.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
