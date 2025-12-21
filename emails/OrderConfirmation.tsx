// Render a minimal brand-aligned HTML email (Ghost Gold style)
interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalPrice: number;
  orderDate: string;
  deliveryDate: string;
}

export function renderOrderConfirmationHTML(props: OrderConfirmationProps) {
  const { orderId, customerName, items, totalPrice, orderDate, deliveryDate } = props;
  const itemsHtml = items
    .map(
      (it) => `
        <tr>
          <td style="padding:8px 0; font-size:14px; color:#78716C">${escapeHtml(it.productName)}</td>
          <td style="padding:8px 0; text-align:center; color:#A1A1A1">x${it.quantity}</td>
          <td style="padding:8px 0; text-align:right; color:#D97706">₺${(it.price * it.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `<!doctype html>
  <html lang="tr">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Sipariş Onayı</title>
    </head>
    <body style="font-family: -apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif; background: #f9f9f9; margin:0; padding:20px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center">
            <table style="max-width:600px; width:100%; background:#fff; border-radius:10px; padding:28px; border:1px solid rgba(217,119,6,0.06);">
              <tr>
                <td align="center" style="padding-bottom:18px;">
                  <div style="width:60px; height:4px; background:linear-gradient(90deg,#D97706 0%,#F59E0B 100%); margin-bottom:12px;"></div>
                  <h1 style="font-size:20px; color:#78716C; margin:0;">Coşkun Yaycı</h1>
                  <div style="color:#D97706; font-weight:600; margin-top:6px;">Dijital Zümrüt Sarayı</div>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 0 8px 0; text-align:center;">
                  <h2 style="font-size:22px; color:#78716C; margin:0 0 6px 0;">✨ Lezzet Yolculuğunuz Başladı!</h2>
                  <p style="color:#957F5D; margin:8px 0 0;">Siparişiniz başarıyla alındı ve fırına verildi.</p>
                </td>
              </tr>

              <tr>
                <td style="padding:18px 0;">
                  <table width="100%" role="presentation">
                    <tr>
                      <td style="vertical-align:top;">
                        <div style="font-size:12px; color:#A1A1A1; text-transform:uppercase; letter-spacing:0.5px;">Sipariş Numarası</div>
                        <div style="font-family:monospace; font-size:18px; color:#D97706; font-weight:700;">${escapeHtml(orderId)}</div>
                      </td>
                      <td style="vertical-align:top; text-align:right;">
                        <div style="font-size:12px; color:#A1A1A1; text-transform:uppercase; letter-spacing:0.5px;">Tarih</div>
                        <div style="font-size:14px; color:#78716C;">${escapeHtml(orderDate)}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td>
                  <table width="100%" role="presentation" style="margin-top:8px; border-top:2px solid rgba(217,119,6,0.06); padding-top:12px;">
                    ${itemsHtml}
                    <tr>
                      <td style="padding-top:12px; font-size:12px; color:#78716C; font-weight:700;">TOPLAM</td>
                      <td></td>
                      <td style="text-align:right; color:#D97706; font-weight:700;">₺${totalPrice.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding-top:20px;">
                  <div style="background:rgba(217,119,6,0.06); padding:12px; border-radius:8px;">
                    <strong style="color:#D97706;">Bilgi</strong>
                    <div style="color:#78716C; font-size:13px; margin-top:6px;">Siparişinizin durumu değiştiğinde size SMS ve e-posta ile bildirim gönderilecektir.</div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding-top:18px; text-align:center;">
                  <a href="/" style="display:inline-block; padding:12px 28px; background:#D97706; color:#fff; border-radius:6px; text-decoration:none;">Siparişini Takip Et</a>
                </td>
              </tr>

              <tr>
                <td style="padding-top:20px; text-align:center; color:#A1A1A1; font-size:12px;">
                  © 2025 Coşkun Yaycı. Tüm Hakları Saklıdır.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
