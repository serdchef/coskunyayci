/**
 * Order Confirmation Email Template
 * Ghost Style - Minimal Luxury Design
 */

import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface OrderConfirmationEmailProps {
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
  isAdmin?: boolean;
}

export const OrderConfirmationEmail = ({
  orderId,
  orderNumber,
  customerName,
  items,
  totalPrice,
  address,
  isAdmin = false,
}: OrderConfirmationEmailProps) => {
  const displayOrderId = orderNumber || orderId;

  return (
    <Html>
      <Head />
      <Preview>
        {isAdmin
          ? `Yeni sipariş: ${customerName} - ${displayOrderId}`
          : `Siparişiniz alındı - ${displayOrderId}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Gold Accent */}
          <Section style={header}>
            <div style={goldBar} />
            <Heading style={h1}>
              {isAdmin ? '🔔 Yeni Sipariş' : '✨ Siparişiniz Alındı'}
            </Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={paragraph}>
              {isAdmin
                ? `Yeni bir sipariş aldınız.`
                : `Merhaba ${customerName},`}
            </Text>

            <Text style={paragraph}>
              {isAdmin
                ? `Müşteri: ${customerName}`
                : 'Siparişiniz başarıyla alındı ve hazırlık aşamasına geçti.'}
            </Text>

            {/* Order Number Card */}
            <Section style={orderNumberCard}>
              <Text style={orderNumberLabel}>Sipariş Numarası</Text>
              <Text style={orderNumberValue}>{displayOrderId}</Text>
            </Section>

            {/* Order Items */}
            <Section style={itemsSection}>
              <Text style={sectionTitle}>Sipariş Detayları</Text>
              {items.map((item, index) => (
                <div key={index} style={itemRow}>
                  <Text style={itemName}>
                    {item.quantity}x {item.productName}
                  </Text>
                  <Text style={itemPrice}>
                    {(item.price * item.quantity).toFixed(2)} TL
                  </Text>
                </div>
              ))}
              <Hr style={divider} />
              <div style={totalRow}>
                <Text style={totalLabel}>Toplam</Text>
                <Text style={totalValue}>{totalPrice.toFixed(2)} TL</Text>
              </div>
            </Section>

            {/* Delivery Address */}
            {address && (
              <Section style={addressSection}>
                <Text style={sectionTitle}>Teslimat Adresi</Text>
                <Text style={addressText}>
                  {address.street}
                  <br />
                  {address.district}, {address.city}
                  <br />
                  {address.zipCode}
                </Text>
              </Section>
            )}

            {/* Next Steps */}
            {!isAdmin && (
              <Section style={nextStepsSection}>
                <Text style={sectionTitle}>Sonraki Adımlar</Text>
                <Text style={stepText}>
                  1️⃣ Siparişiniz 1-2 iş günü içinde hazırlanacak
                </Text>
                <Text style={stepText}>
                  2️⃣ Kargoya verildiğinde size bilgi verilecek
                </Text>
                <Text style={stepText}>
                  3️⃣ Takip numaranız ile takip edebilirsiniz
                </Text>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              <strong>Coşkun Yaycı</strong>
              <br />
              Lüks Baklava & Tatlı Deneyimi
              <br />
              <br />
              Sorularınız için: orders@coskunyayci.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles - Ghost-inspired minimal luxury
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
};

const goldBar = {
  width: '60px',
  height: '4px',
  backgroundColor: '#d4af37',
  margin: '0 auto 20px',
  borderRadius: '2px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
  lineHeight: '1.2',
};

const content = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
};

const paragraph = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const orderNumberCard = {
  backgroundColor: '#fafaf9',
  border: '2px solid #d4af37',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const orderNumberLabel = {
  color: '#999',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
};

const orderNumberValue = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '700',
  fontFamily: 'monospace',
  margin: '0',
};

const itemsSection = {
  margin: '30px 0',
};

const sectionTitle = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 20px',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
};

const itemName = {
  color: '#4a4a4a',
  fontSize: '15px',
  margin: '0',
};

const itemPrice = {
  color: '#4a4a4a',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0',
};

const divider = {
  borderColor: '#e5e5e5',
  margin: '20px 0',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: '12px',
};

const totalLabel = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
};

const totalValue = {
  color: '#d4af37',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
};

const addressSection = {
  backgroundColor: '#fafaf9',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const addressText = {
  color: '#4a4a4a',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
};

const nextStepsSection = {
  margin: '30px 0',
};

const stepText = {
  color: '#4a4a4a',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 0 8px',
};

const footer = {
  marginTop: '40px',
};

const footerDivider = {
  borderColor: '#e5e5e5',
  margin: '30px 0 20px',
};

const footerText = {
  color: '#999',
  fontSize: '13px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '0',
};

export default OrderConfirmationEmail;
