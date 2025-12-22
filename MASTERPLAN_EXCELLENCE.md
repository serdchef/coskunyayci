# 🏛️ Dijital Zümrüt Sarayı - Mükemmellik Yol Haritası
## Kapsamlı Implementation Guide (Zaman Sınırız)

---

## 📋 PHASE BREAKDOWN & TIMELINE

### Phase 1: Database & Infrastructure (Hafta 1)
**Hedef:** PostgreSQL production database kurulumu + Prisma migration

### Phase 2: Security & Authentication (Hafta 2)
**Hedef:** Google OAuth + Middleware enhancement + Secret management

### Phase 3: Payment System (Hafta 3)
**Hedef:** Stripe live integration + Webhook automation

### Phase 4: Communications (Hafta 4)
**Hedef:** Email domain setup + Twilio WhatsApp integration

### Phase 5: Performance & UX (Hafta 5)
**Hedef:** Lighthouse 85+, AI Sommelier, B2B portal

### Phase 6: Testing & Launch (Hafta 6)
**Hedef:** E2E test, Analytics, Go-Live

---

## 🏗️ PHASE 1: VERI VE ALTYAPI MİMARİSİ
**Süre:** 1 Hafta | **Başlangıç:** Hafta 1 (24-30 Aralık)

### 1.1 PostgreSQL Geçişi (Supabase/Render seçimi)

#### Adım 1: Platform Seçimi

**Seçenek 1: Supabase** (Önerilen)
```
Avantajlar:
✅ Postgres + Real-time + Auth entegre
✅ Free tier: 500MB, good for MVP
✅ API auto-generated
✅ Vercel integration direct
✅ Türkiye sunucusu (EU)

Kurulum:
1. https://supabase.com → Sign up
2. New Project oluştur → PostgreSQL seç
3. Connection string copy et (DATABASE_URL)
4. Vercel environment variables'a ekle
```

**Seçenek 2: Render.com**
```
Avantajlar:
✅ Free tier PostgreSQL
✅ Simple dashboard
✅ Automatic backups
✅ Easy scaling

Kurulum:
1. https://render.com → Sign up
2. New PostgreSQL → seç
3. connection string copy et
```

**ÖNERİ:** Supabase kullan (Real-time + Auth built-in)

#### Adım 2: Prisma Schema Migration

```bash
# 1. Supabase'de database seç
# 2. .env.local güncelle
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[db]"

# 3. Prisma migration oluştur
npx prisma migrate dev --name initial_postgres

# 4. Production seed script çalıştır
npx prisma db seed

# 5. Verify
npx prisma studio
```

#### Adım 3: Test Verification
```bash
# User creation test
npx ts-node -e "
import { prisma } from './lib/prisma';
async function test() {
  const user = await prisma.user.create({
    data: {
      email: 'test-pg@example.com',
      name: 'Test User',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ User created:', user);
  await prisma.$disconnect();
}
test();
"
```

### 1.2 SUPER_ADMIN Setup

```typescript
// prisma/seed.ts - Güncelle

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Database seed starting...');

  // CRITICAL: SUPER_ADMIN user creation
  const hashedPassword = await bcrypt.hash('CHANGE_ME_IMMEDIATELY', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'serdchef@gmail.com' },
    update: {
      role: 'SUPER_ADMIN',
      name: '👑 Sarayın Muhafızı (Admin)',
    },
    create: {
      email: 'serdchef@gmail.com',
      name: '👑 Sarayın Muhafızı (Admin)',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ SUPER_ADMIN created:', superAdmin.email);

  // 16 baklava products
  const products = [
    { sku: 'KLASIK_001', name: 'Klasik Baklava', basePrice: 1487.70, category: 'Klasik', region: 'Gaziantep' },
    // ... 15 daha
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: productData,
      create: productData,
    });

    // 4 variant per product (250g, 500g, 1kg, Corporate)
    for (const size of ['250g', '500g', '1kg', 'Corporate']) {
      await prisma.productVariant.upsert({
        where: {
          productId_size: {
            productId: product.id,
            size,
          },
        },
        update: {},
        create: {
          productId: product.id,
          size,
          price: calculatePrice(productData.basePrice, size),
          stock: 100,
        },
      });
    }
  }

  console.log('✅ Seed completed');
}

function calculatePrice(basePrice: number, size: string): number {
  const multipliers: Record<string, number> = {
    '250g': 1,
    '500g': 1.7,
    '1kg': 2.8,
    'Corporate': 4.5,
  };
  return basePrice * (multipliers[size] || 1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 1.3 Vercel Environment Setup

```env
# .env.production (Vercel Dashboard)

# Database (Supabase)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<64-char-random-secret>"

# Diğer gerekli keys (şimdilik placeholder)
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."
TWILIO_ACCOUNT_SID="AC..."
```

---

## 🔐 PHASE 2: GÜVENLİK VE ERIŞIM YÖNETİMİ
**Süre:** 1 Hafta | **Başlangıç:** Hafta 2 (31 Aralık - 6 Ocak)

### 2.1 Google OAuth Integration

#### Adım 1: Google Cloud Console

```
1. https://console.cloud.google.com
2. "Credentials" → "Create OAuth 2.0 Client ID"
3. Application type: Web application
4. Authorized origins:
   - http://localhost:3000
   - https://yourdomain.com
5. Copy: Client ID + Secret
```

#### Adım 2: NextAuth Configuration Update

```typescript
// lib/auth.ts - Google provider ekle

import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    // Existing Credentials provider
    CredentialsProvider({...}),

    // NEW: Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role: profile.email === 'serdchef@gmail.com' ? 'SUPER_ADMIN' : 'CUSTOMER',
          locale: 'tr',
        };
      },
    }),
  ],
  
  callbacks: {
    // Admin-only Google OAuth
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Only serdchef@gmail.com can use Google OAuth
        if (user.email !== 'serdchef@gmail.com') {
          return false; // Deny sign in
        }
      }
      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'CUSTOMER';
      }
      return token;
    },
  },
};
```

#### Adım 3: Environment Variables

```env
# .env.local
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# Vercel Dashboard'a da ekle
```

### 2.2 Enhanced Middleware Protection

```typescript
// middleware.ts - Güvenlik seviyesi max

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ADMIN ROUTES
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 1. Authentication check
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Authorization check (role-based)
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(token.role as string)) {
      return NextResponse.redirect(new URL('/admin/unauthorized', request.url));
    }

    // 3. SUPER_ADMIN-only routes
    if (request.nextUrl.pathname.startsWith('/admin/settings')) {
      if (token.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  // CUSTOMER ROUTES
  if (request.nextUrl.pathname.startsWith('/siparislerim')) {
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Strict-Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.com *.google.com; style-src 'self' 'unsafe-inline'; connect-src 'self' *.vercel.app *.stripe.com *.openai.com"
  );
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/siparislerim/:path*', '/api/admin/:path*'],
};
```

### 2.3 Secret Management (Vercel)

```
Vercel Dashboard → Settings → Environment Variables

Üretim (Production) Secret'ları:
□ DATABASE_URL (Supabase)
□ NEXTAUTH_SECRET (64-char random)
□ NEXTAUTH_URL (https://domain.com)
□ GOOGLE_CLIENT_ID
□ GOOGLE_CLIENT_SECRET
□ STRIPE_SECRET_KEY
□ STRIPE_PUBLISHABLE_KEY
□ RESEND_API_KEY
□ TWILIO_ACCOUNT_SID
□ TWILIO_AUTH_TOKEN
□ OPENAI_API_KEY

NOT: Local .env.local'a asla production key'leri koyma!
```

---

## 💳 PHASE 3: ÖDEME SİSTEMLERİ (HAZINE DAIRESI)
**Süre:** 1 Hafta | **Başlangıç:** Hafta 3 (7-13 Ocak)

### 3.1 Stripe Live Integration

#### Adım 1: Stripe Dashboard Setup

```
1. https://dashboard.stripe.com
2. Activate live mode
3. Copy: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY
4. Enable 3D Secure (TRY support)
5. Configure webhook endpoint
```

#### Adım 2: Checkout Endpoint Oluştur

```typescript
// app/api/checkout/route.ts - YENİ FILE

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      orderId,
      customerEmail,
      successUrl,
      cancelUrl,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Calculate total
    const totalCents = items.reduce(
      (sum: number, item: any) => sum + (item.priceCents * item.quantity),
      0
    );

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'try',
          product_data: {
            name: item.name,
            description: 'Coşkun Yayçı Baklava - Dijital Zümrüt Sarayı',
            images: [item.image || '/baklava-default.jpg'],
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        orderId,
      },
    });

    // Store session in DB for webhook verification
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'AWAITING_PAYMENT',
        },
      });
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### Adım 3: Webhook Listener

```typescript
// app/api/webhooks/stripe/route.ts - YENİ/UPDATE

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Update order status
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'CRAFTING', // "Hazırlanıyor" - Fırına gidiyor
            updatedAt: new Date(),
          },
          include: { items: true },
        });

        // Send confirmation email
        try {
          await sendOrderConfirmationEmail({
            orderId: order.id,
            customerName: order.user?.name || 'Müşteri',
            customerEmail: session.customer_email || '',
            items: order.items,
            totalPrice: order.totalPrice,
            orderDate: new Date().toISOString(),
            deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          });
        } catch (emailError) {
          console.error('Email send failed:', emailError);
          // Don't fail webhook on email error
        }

        console.log(`✅ Order ${orderId} payment confirmed, status: CRAFTING`);
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      // Handle refund logic
      console.log(`💳 Refund processed: ${charge.id}`);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

#### Adım 4: Webhook Configuration

```bash
# Stripe CLI ile test
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Üretimde: Stripe Dashboard → Webhooks → Add endpoint
# URL: https://yourdomain.com/api/webhooks/stripe
# Events: payment_intent.succeeded, charge.refunded
```

### 3.2 Lüks Fatura Tasarımı

```typescript
// lib/invoice.ts - YENİ FILE

export function generateInvoiceHTML({
  orderId,
  customerName,
  items,
  totalPrice,
  orderDate,
  deliveryDate,
}: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Playfair Display', serif;
          color: #0f766e;
          background: #f5f5f0;
          margin: 0;
          padding: 20px;
        }
        .invoice {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-left: 8px solid #0f766e;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #d4a574;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #0f766e;
          letter-spacing: 2px;
        }
        .subtitle {
          font-size: 12px;
          color: #d4a574;
          margin-top: 8px;
        }
        .order-number {
          background: #0f766e;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          display: inline-block;
          margin: 20px 0;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        th {
          background: #f5f5f0;
          padding: 12px;
          text-align: left;
          border-bottom: 2px solid #0f766e;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e0e0e0;
        }
        .total {
          font-size: 24px;
          font-weight: bold;
          color: #0f766e;
          text-align: right;
          padding: 20px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .ghost-gold {
          color: #d4a574;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="logo">🏛️ COŞKUN YAYCI</div>
          <div class="subtitle">Dijital Zümrüt Sarayı</div>
          <div class="subtitle">Gaziantep'in En Seçkin Baklavası</div>
        </div>

        <div class="order-number">SIPARIŞ NO: ${orderId}</div>

        <div style="margin: 20px 0;">
          <strong>Değerli Müşterimiz ${customerName},</strong>
          <p>Siparişiniz başarıyla alınmış ve onaylanmıştır.</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Miktar</th>
              <th>Birim Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item: any) => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>₺${(item.price / item.quantity).toFixed(2)}</td>
                <td>₺${item.price.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px;">
          <div style="margin: 10px 0;">
            <strong>Toplam Tutar:</strong>
            <span class="total">₺${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div style="background: #f5f5f0; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <strong>Teslimat Bilgileri:</strong>
          <p>Siparişiniz fırınında hazırlanmakta olup, 
            <span class="ghost-gold">${deliveryDate}</span> 
            tarihinde sizde olacaktır.</p>
        </div>

        <div class="footer">
          <p>Coşkun Yayçı Baklava | Gaziantep, Türkiye</p>
          <p>Web: coskunyayci.com | Email: orders@coskunyayci.com</p>
          <p style="color: #d4a574; margin-top: 10px;">
            "Beş yıl içinde küresel liderlik için hazırlanıyor..."
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
```

---

## 📧 PHASE 4: İLETİŞİM KANALLARI
**Süre:** 1 Hafta | **Başlangıç:** Hafta 4 (14-20 Ocak)

### 4.1 Resend Domain Verification

#### Adım 1: Domain Doğrulama

```
1. https://resend.com → Dashboard
2. Domains → Add Domain
3. Domain: coskunyayci.com (veya subdomain)
4. DNS records ekle:
   - DKIM
   - SPF
   - DMARC
5. Verify butonuna tıkla
```

#### Adım 2: Email Sender Setup

```typescript
// lib/email.ts - Update sender

import { renderOrderConfirmationHTML } from '@/emails/OrderConfirmation';

function getResendClient() {
  const { Resend } = require('resend');
  return new Resend(process.env.RESEND_API_KEY || '');
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

    const result = await resend.emails.send({
      from: 'orders@coskunyayci.com', // Verified domain
      to: customerEmail,
      subject: `Siparişiniz Onaylandı - ${orderId}`,
      html: renderOrderConfirmationHTML({
        orderId,
        customerName,
        items,
        totalPrice,
        orderDate,
        deliveryDate,
      }),
      replyTo: 'support@coskunyayci.com',
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    console.log('✅ Email sent:', result.id);
    return result;
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }
}

// Otomatik status update emails
export async function sendOrderStatusEmail({
  orderId,
  customerEmail,
  status,
  statusMessage,
}: {
  orderId: string;
  customerEmail: string;
  status: 'CRAFTING' | 'IN_OVEN' | 'COOLING' | 'PACKING' | 'SHIPPED' | 'DELIVERED';
  statusMessage: string;
}) {
  try {
    const resend = getResendClient();
    const statusEmoji: Record<string, string> = {
      CRAFTING: '👨‍🍳',
      IN_OVEN: '🔥',
      COOLING: '❄️',
      PACKING: '📦',
      SHIPPED: '🚚',
      DELIVERED: '✅',
    };

    await resend.emails.send({
      from: 'orders@coskunyayci.com',
      to: customerEmail,
      subject: `Sipariş Durum Güncellemesi: ${statusEmoji[status]} ${statusMessage}`,
      html: `
        <div style="font-family: Playfair Display; color: #0f766e;">
          <h2>${statusEmoji[status]} ${statusMessage}</h2>
          <p>Sipariş ID: ${orderId}</p>
          <p>Siparişiniz durumu güncellenmiştir.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Status email failed:', error);
  }
}
```

### 4.2 Twilio WhatsApp Integration

#### Adım 1: Twilio Setup

```
1. https://www.twilio.com
2. Console → Messaging → Try it out
3. WhatsApp sandbox oluştur
4. Copy: ACCOUNT_SID, AUTH_TOKEN, WHATSAPP_NUMBER
```

#### Adım 2: WhatsApp Order Notification

```typescript
// lib/whatsapp.ts - YENİ FILE

import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppOrderNotification({
  customerPhone,
  orderId,
  totalPrice,
  deliveryDate,
}: {
  customerPhone: string;
  orderId: string;
  totalPrice: number;
  deliveryDate: string;
}) {
  try {
    const message = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+90${customerPhone.replace(/^0/, '')}`, // Turkish format
      body: `
🏛️ **Coşkun Yayçı Baklava**

Siparişiniz onaylandı! ✅

Sipariş No: ${orderId}
Tutar: ₺${totalPrice.toFixed(2)}
Tahmini Teslimat: ${deliveryDate}

Teşekkür ederiz! 🥮

https://coskunyayci.com/siparislerim/${orderId}
      `.trim(),
    });

    console.log('✅ WhatsApp sent:', message.sid);
    return message;
  } catch (error) {
    console.error('WhatsApp send failed:', error);
    throw error;
  }
}

// Lüks sipariş (>5000₺) için admin notification
export async function sendAdminWhatsAppNotification({
  orderId,
  customerName,
  totalPrice,
}: {
  orderId: string;
  customerName: string;
  totalPrice: number;
}) {
  try {
    const adminPhone = process.env.BUSINESS_PHONE_NUMBER!;
    
    if (totalPrice > 5000) {
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${adminPhone}`,
        body: `
🏆 **LÜX SİPARİŞ ALINDI**

Müşteri: ${customerName}
Tutar: ₺${totalPrice.toFixed(2)} 💎
Sipariş No: ${orderId}

İşlem yapılmaya hazırdır.
        `.trim(),
      });
    }
  } catch (error) {
    console.error('Admin WhatsApp failed:', error);
  }
}
```

#### Adım 3: Webhook Entegrasyonu

Stripe webhook'unda WhatsApp tetikle:

```typescript
// app/api/webhooks/stripe/route.ts - Add to checkout.session.completed

case 'checkout.session.completed': {
  // ... existing code ...

  // Send WhatsApp notification
  if (session.customer_email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.customer_email },
      });

      if (user?.phone) {
        await sendWhatsAppOrderNotification({
          customerPhone: user.phone,
          orderId: order.id,
          totalPrice: order.totalPrice,
          deliveryDate: calculateDeliveryDate().toLocaleDateString('tr-TR'),
        });
      }
    } catch (whatsappError) {
      console.error('WhatsApp notification failed:', whatsappError);
    }
  }
}
```

---

## ⚡ PHASE 5: PERFORMANCE & UX
**Süre:** 1 Hafta | **Başlangıç:** Hafta 5 (21-27 Ocak)

### 5.1 Lighthouse 85+ Optimization

#### Problem 1: CSS Filter Overuse

```typescript
// ESKI - globals.css (PROBLEM)
body {
  filter: brightness(1.02) saturate(1.05);
}

body::before {
  filter: saturate(1.5) hue-rotate(5deg) brightness(1.1);
}

// SOLUTION: CSS variables + lazy filter
```

```css
/* globals.css - UPDATE */

@layer base {
  :root {
    --teal-primary: #0f766e;
    --gold-accent: #d4a574;
  }

  html {
    background: var(--teal-primary) !important;
  }

  body {
    background: linear-gradient(
      135deg,
      var(--teal-primary) 0%,
      #0d5a52 50%,
      var(--teal-primary) 100%
    ) !important;
    background-attachment: fixed !important;
    /* Remove: filter: brightness(1.02) saturate(1.05); */
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/logo.png');
    background-size: 100px 100px;
    background-attachment: scroll;
    background-repeat: repeat;
    opacity: 0.08; /* Adjusted from 0.10 */
    pointer-events: none;
    z-index: 0;
    /* Remove filter - static background sufices */
  }
}
```

#### Problem 2: Image Lazy Loading

```tsx
// ESKI - page.tsx (PROBLEM)
<img src="/images/products/klasik.jpg" />

// SOLUTION: Next/Image with lazy loading
```

```tsx
// app/page.tsx - UPDATE

import Image from 'next/image';

// Hero section
<Image
  src="/images/hero-baklava.jpg"
  alt="Coşkun Yayçı Baklava - Dijital Zümrüt Sarayı"
  width={1200}
  height={600}
  priority={true}
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
/>

// ProductCard component
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-64 w-full">
        <Image
          src={product.image || '/placeholder.jpg'}
          alt={`${product.name} - ${product.category}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={80}
          className="object-cover hover:scale-105 transition-transform"
        />
      </div>
      {/* Rest of component */}
    </div>
  );
}
```

#### Problem 3: Bundle Size Optimization

```javascript
// next.config.js - ADD

const nextConfig = {
  // Existing config...

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
    ],
  },

  // Bundle analysis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        framer: {
          test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
          name: 'framer',
          priority: 10,
        },
      };
    }
    return config;
  },

  // Compression
  compress: true,
  poweredByHeader: false,
};
```

### 5.2 AI Sommelier Kalibrasyonu

```typescript
// lib/openai.ts - Enhanced sommelier

const BAKLAVA_KNOWLEDGE = `
Coşkun Yayçı Baklavası - Türkiye'nin En Seçkin Örneği

ÜRÜNLERİMİZ:
1. Klasik Baklava (Mekik) - İnce yapraklı, ceviz dolgusu
2. Antep Özel - Gaziantep fıstığının en seçkin taneleri
3. Havuç Dilimi - Parlak ıslak baklava
4. Soğuk Baklava - Hafif, tazelik süreleri uzun
5. Sütlü Nuriye - Sütlü şurup ile yapılan hafif
... ve 11 çeşit daha

ÖZELLİKLERİ:
- Taş fırında geleneksel yöntemle hazırlanır
- Gaziantep fıstığı veya Antep cevizi kullanılır
- Şerbet ağırlığı orijinal olmalıdır
- Her parça eşit boyutlandırılır
- Kaymak veya sütlü versiyon mevcut

TÜKETİM ÖNERİLERİ:
- Oda sıcaklığında veya çıkmış halde tüketilir
- Çay, kahve veya Türk kahvesiyle servis edilir
- Soğuk baklava: Buzdolabında 20 gün tazeliğini korur
- Normal baklava: Oda sıcaklığında 1 hafta

FİYAT ARALIKLARI:
- 250g: 370₺ - 500₺
- 500g: 630₺ - 850₺
- 1kg: 1037₺ - 1400₺
- Kurumsal (4.5kg+): 5250₺+
`;

export async function generateSommelierResponse(
  customerMessage: string
): Promise<string> {
  const client = getOpenAI();
  if (!client) return 'Şu anda hizmet veremiyorum. Lütfen daha sonra tekrar deneyin.';

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
Sen Coşkun Yayçı Baklavası'nın AI Sommelieri'sisin. 
Müşterilere premium baklava önerileri yaparsın.

KIŞISEL ÖZELLİKLER:
- Adın: Saray Sommelieri
- Dil: Türkçe (resmi, saygılı)
- Ton: Lüks, bilgili, yardımcı
- Emoji: Kullan (🥮 🏛️ 👨‍🍳 ✨)

${BAKLAVA_KNOWLEDGE}

DAVRANIŞLAR:
1. Müşterinin tercihini (tatlılık, kıvam, vb.) sor
2. En uygun ürünü öner ve açıkla
3. Paket ve miktarını uyarla
4. Özel günler için sunum öner (kurumsal, hediye, vb.)
5. Fiyat ve teslimat bilgisi ver

YASAKLI:
- Rakip markaları söyleme
- Yanıltıcı fiyat verme
- Başka ürünler önerme
          `,
        },
        {
          role: 'user',
          content: customerMessage,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content ||
      'İşlem tamamlanamadı. Lütfen tekrar deneyin.'
    );
  } catch (error) {
    console.error('Sommelier error:', error);
    return 'Şu anda hizmet veremiyorum.';
  }
}
```

### 5.3 B2B Kurumsal Bölümü

```typescript
// app/kurumsal/kayit/page.tsx - YENİ FILE

'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CorporateRegistration() {
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    authorizedName: '',
    department: '',
    email: '',
    phone: '',
    industry: '',
    companySize: 'SMALL',
    address: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/b2b/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl text-teal-900 mb-4">
              🏢 Kurumsal Ortaklık
            </h1>
            <p className="text-xl text-gray-600">
              Coşkun Yayçı Baklava ile B2B iş ortaklığına başlayın
            </p>
          </div>

          {/* Success Message */}
          {submitted ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
              <h2 className="text-2xl text-green-900 mb-4">✅ Başvuru Alındı</h2>
              <p className="text-green-700 mb-4">
                Kurumsal iş ortaklığı başvurunuz alınmıştır.
              </p>
              <p className="text-gray-600">
                En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
              {/* Company Info */}
              <div>
                <label className="block text-teal-900 font-semibold mb-2">
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Şirketinizin adı"
                />
              </div>

              {/* Tax ID */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-teal-900 font-semibold mb-2">
                    Vergi Kimlik Numarası *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.taxId}
                    onChange={(e) =>
                      setFormData({ ...formData, taxId: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="VKN"
                  />
                </div>

                <div>
                  <label className="block text-teal-900 font-semibold mb-2">
                    Çalışan Sayısı *
                  </label>
                  <select
                    value={formData.companySize}
                    onChange={(e) =>
                      setFormData({ ...formData, companySize: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="SMALL">1-50</option>
                    <option value="MEDIUM">51-250</option>
                    <option value="LARGE">251-1000</option>
                    <option value="ENTERPRISE">1000+</option>
                  </select>
                </div>
              </div>

              {/* Authorized Person */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-teal-900 font-semibold mb-2">
                    Yetkili Kişi Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorizedName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        authorizedName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-teal-900 font-semibold mb-2">
                    Departman *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="Örn: Satın Alma, İnsan Kaynakları"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-teal-900 font-semibold mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-teal-900 font-semibold mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Industry & Notes */}
              <div>
                <label className="block text-teal-900 font-semibold mb-2">
                  Endüstri/Sektör
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Örn: Perakende, Hospitality, Kurumsal Hediyeler"
                />
              </div>

              <div>
                <label className="block text-teal-900 font-semibold mb-2">
                  Ek Notlar
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-32"
                  placeholder="Ortaklık hakkında detaylar..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Başvur
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

```typescript
// app/api/b2b/register/route.ts - YENİ FILE

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create B2B registration record (if model exists)
    // For now, send email to admin
    const registrationData = {
      companyName: body.companyName,
      taxId: body.taxId,
      authorizedName: body.authorizedName,
      department: body.department,
      email: body.email,
      phone: body.phone,
      industry: body.industry,
      companySize: body.companySize,
      address: body.address,
      notes: body.notes,
      submittedAt: new Date().toISOString(),
    };

    // Log registration
    console.log('📋 B2B Registration:', registrationData);

    // Send notification email to admin
    // (Resend integration - after phase 4)

    return NextResponse.json({
      success: true,
      message: 'Başvuru alındı',
    });
  } catch (error) {
    console.error('B2B registration error:', error);
    return NextResponse.json(
      { error: 'Başvuru işlenemedi' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 PHASE 6: TESTING & LAUNCH
**Süre:** 1 Hafta | **Başlangıç:** Hafta 6 (28 Ocak - 3 Şubat)

### 6.1 E2E Testing

```typescript
// e2e/complete-flow.spec.ts - YENİ/UPDATE

import { test, expect } from '@playwright/test';

test.describe('Complete Order Flow', () => {
  test('Customer can order through chatbot and pay with Stripe', async ({
    page,
  }) => {
    // 1. Visit homepage
    await page.goto('https://coskunyayci-5zzk.vercel.app');

    // 2. Open chatbot
    await page.click('[data-testid="chatbot-trigger"]');
    expect(page.locator('[data-testid="chatbot-widget"]')).toBeVisible();

    // 3. Send message
    await page.fill('[data-testid="chatbot-input"]', 'Klasik baklava sipariş edebilir miyim?');
    await page.click('[data-testid="chatbot-send"]');

    // 4. Wait for bot response
    await page.waitForSelector('[data-testid="bot-message"]');

    // 5. Click product button
    await page.click('[data-testid="product-button-KLASIK_001"]');

    // 6. Fill quick order form
    await page.fill('[data-testid="quick-order-name"]', 'Test Customer');
    await page.fill('[data-testid="quick-order-phone"]', '5321234567');

    // 7. Submit order
    await page.click('[data-testid="quick-order-submit"]');

    // 8. Verify order created
    await page.waitForURL('**/checkout/**');

    // 9. Stripe checkout
    const stripeFrame = page.frameLocator('iframe[title="Stripe"]');
    await stripeFrame
      .locator('[placeholder="Card number"]')
      .fill('4242 4242 4242 4242');
    await stripeFrame
      .locator('[placeholder="MM / YY"]')
      .fill('12 / 25');
    await stripeFrame.locator('[placeholder="CVC"]').fill('123');
    await stripeFrame.locator('input[name="postal"]').fill('10001');

    // 10. Complete payment
    await page.click('button:has-text("Pay now")');

    // 11. Verify success page
    await page.waitForURL('**/checkout/success/**');
    expect(page.locator('text=Sipariş Onaylandı')).toBeVisible();

    // 12. Verify email sent (check logs)
    // DB verification would be: await prisma.order.findFirst({...})
  });

  test('Admin can view and update order status', async ({ page }) => {
    // 1. Login as admin
    await page.goto('https://coskunyayci-5zzk.vercel.app/admin/login');
    await page.fill('[data-testid="admin-email"]', 'serdchef@gmail.com');
    await page.fill('[data-testid="admin-password"]', 'test123');
    await page.click('[data-testid="admin-login"]');

    // 2. Verify admin dashboard
    await page.waitForURL('**/admin/**');
    expect(page.locator('text=Admin Paneli')).toBeVisible();

    // 3. View orders
    await page.click('a:has-text("Siparişler")');

    // 4. Update order status
    await page.click('[data-testid="order-row-0"] >> [data-testid="edit-button"]');
    await page.selectOption('[data-testid="status-select"]', 'CRAFTING');
    await page.click('[data-testid="save-button"]');

    // 5. Verify update
    expect(page.locator('text=CRAFTING')).toBeVisible();
  });
});
```

### 6.2 Analytics Setup

```typescript
// lib/analytics.ts - YENİ FILE

import { PostHog } from 'posthog-js';

let posthog: PostHog | null = null;

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  if (!posthog && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (ph) => {
        // PostHog loaded
      },
    });
  }
}

export function trackEvent(
  event: string,
  properties?: Record<string, any>
) {
  if (!posthog) return;
  posthog.capture(event, properties);
}

export function identifyUser(
  userId: string,
  properties?: Record<string, any>
) {
  if (!posthog) return;
  posthog.identify(userId, properties);
}

// Tracking events
export const EVENTS = {
  // Chatbot
  CHATBOT_OPENED: 'chatbot_opened',
  CHATBOT_MESSAGE_SENT: 'chatbot_message_sent',
  PRODUCT_VIEWED: 'product_viewed',

  // Orders
  ORDER_CREATED: 'order_created',
  ORDER_PAID: 'order_paid',
  ORDER_DELIVERED: 'order_delivered',

  // Admin
  ADMIN_LOGGED_IN: 'admin_logged_in',
  ORDER_STATUS_UPDATED: 'order_status_updated',
};
```

### 6.3 Go-Live Checklist

```markdown
## 🚀 Pre-Launch Checklist

### Database & Infrastructure
- [ ] PostgreSQL production database live
- [ ] Prisma migrations applied
- [ ] Seed script completed
- [ ] Database backups configured
- [ ] Connection pooling enabled

### Authentication & Security
- [ ] Google OAuth configured
- [ ] NextAuth secrets set (Vercel)
- [ ] SSL certificate active
- [ ] CORS headers configured
- [ ] Security headers verified

### Payment System
- [ ] Stripe live keys configured
- [ ] Webhook endpoint verified
- [ ] Order status automation working
- [ ] Invoice generation tested
- [ ] Refund process documented

### Communication
- [ ] Resend domain verified
- [ ] Email templates tested
- [ ] Twilio WhatsApp sandbox tested
- [ ] SMS notification working
- [ ] Admin alerts configured

### Performance & Monitoring
- [ ] Lighthouse score 85+
- [ ] Images optimized (Next/Image)
- [ ] Bundle size checked
- [ ] Sentry configured
- [ ] PostHog analytics active

### Testing
- [ ] E2E tests pass (Playwright)
- [ ] Unit tests pass (Jest)
- [ ] Manual checkout test completed
- [ ] Mobile responsive verified
- [ ] Cross-browser tested

### Content & SEO
- [ ] Robots.txt configured
- [ ] Sitemap.xml generated
- [ ] Meta tags checked
- [ ] OG images set
- [ ] 404 page created

### Operations
- [ ] DNS configured (coskunyayci.com)
- [ ] Email forwarding setup
- [ ] Monitoring alerts active
- [ ] Backup schedule confirmed
- [ ] Incident response plan created

### Final Verification
- [ ] Admin dashboard functional
- [ ] Order list shows real data
- [ ] Payment processing works
- [ ] Emails delivered
- [ ] WhatsApp notifications sent
- [ ] Analytics tracking active

### Go-Live Decision
- [ ] All checks passed ✅
- [ ] Team approval obtained ✅
- [ ] Customer support ready ✅
- [ ] 🚀 LAUNCH! 🎉
```

---

## 📊 SUCCESS METRICS

### Phase Completion Goals

```
Phase 1 (Database):      ✅ PostgreSQL + Prisma
Phase 2 (Security):      ✅ Google OAuth + Middleware
Phase 3 (Payments):      ✅ Stripe Live + Webhooks
Phase 4 (Communication): ✅ Email + WhatsApp
Phase 5 (Performance):   ✅ Lighthouse 85+
Phase 6 (Launch):        ✅ E2E Tests + Go-Live
```

### Key Performance Indicators

| KPI | Target | How to Measure |
|-----|--------|----------------|
| **Page Load Time** | <2s | Lighthouse / Web Vitals |
| **Stripe Conversion** | >3% | Analytics dashboard |
| **Email Delivery** | 99% | Resend dashboard |
| **Admin Response Time** | <500ms | API monitoring |
| **Customer Satisfaction** | >4.5/5 | Survey / Reviews |
| **System Uptime** | 99.9% | Vercel monitoring |

---

## 🎯 TIMELINE SUMMARY

```
Hafta 1 (24-30 Aralık):  PostgreSQL + Prisma Setup ✅
Hafta 2 (31 Aralık-6 Ocak): Google OAuth + Security 🔐
Hafta 3 (7-13 Ocak):     Stripe Live + Webhooks 💳
Hafta 4 (14-20 Ocak):    Email + WhatsApp 📧
Hafta 5 (21-27 Ocak):    Lighthouse + B2B 🚀
Hafta 6 (28 Jan-3 Feb):  Testing + Launch 🎉

🏆 EXPECTED LAUNCH: 3 Şubat 2025
```

---

**Bu yol haritası adım adım takip edilerek, Coşkun Yayçı Baklava
dijital dünyada sarsılmaz bir otorite haline gelecektir.**

🏛️ **Dijital Zümrüt Sarayı → Küresel Lider**
