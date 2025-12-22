# 🏛️ DIJITAL ZÜMRÜT SARAYINA GİDİŞ ROZETASI
## Mükemmellik İçin Kapsamlı Yol Haritası - Hızlı Referans

---

## 📋 MASTER PLAN ÖZET

### 6 Phase, 6 Hafta, 1 Hedef: **Küresel Liderlik**

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: VERI ALTYAPISI (24-30 Aralık)                         │
│ ✅ PostgreSQL Kurulumu (Supabase)                               │
│ ✅ Prisma Migration                                             │
│ ✅ SUPER_ADMIN (serdchef@gmail.com) Setup                      │
│ ✅ Seed Scripts                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: GÜVENLİK & ERIŞIM (31 Aralık - 6 Ocak)              │
│ ✅ Google OAuth (Admin Only)                                    │
│ ✅ Enhanced Middleware Protection                               │
│ ✅ Secret Management (Vercel Vault)                             │
│ ✅ Role-Based Access Control                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: ÖDEME SİSTEMLERİ (7-13 Ocak)                          │
│ ✅ Stripe Live Integration                                      │
│ ✅ Checkout Endpoint (TRY Support)                             │
│ ✅ Webhook Automation (Order Status)                            │
│ ✅ Invoice Template ("Ghost Gold" Premium)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: İLETİŞİM KANALLARI (14-20 Ocak)                      │
│ ✅ Resend Domain Verification (coskunyayci.com)               │
│ ✅ Order Confirmation + Status Emails                           │
│ ✅ Twilio WhatsApp Notifications                                │
│ ✅ Admin Alert System                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: PERFORMANCE & UX (21-27 Ocak)                        │
│ ✅ Lighthouse 85+ Optimization                                 │
│ ✅ Next/Image Implementation                                    │
│ ✅ AI Sommelier Enhancement                                     │
│ ✅ B2B Kurumsal Portalı                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 6: TEST & LAUNCH (28 Ocak - 3 Şubat)                   │
│ ✅ E2E Testing (Playwright)                                     │
│ ✅ Analytics Setup (PostHog)                                    │
│ ✅ Pre-Launch Checklist                                         │
│ 🚀 GO LIVE                                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 PHASE 1: VERI VE ALTYAPI MİMARİSİ
**Hedef:** Kalıcı, ölçeklenebilir veritabanı

### Kritik İşler:
```
□ Supabase.com'da PostgreSQL oluştur
  - Free tier sufficient for MVP
  - Copy DATABASE_URL
  - Backup enable et

□ Prisma Migration
  npx prisma migrate dev --name initial_postgres

□ SUPER_ADMIN Setup
  email: serdchef@gmail.com
  role: SUPER_ADMIN
  password: <değiştir sonra>

□ Production Seed
  npx prisma db seed
  - 16 Products
  - 64 Product Variants (4 per product)
  - Test Users
  - Sample Orders

□ Vercel Environment Variables
  DATABASE_URL="postgresql://..."
  NEXTAUTH_URL, NEXTAUTH_SECRET
```

### Başarı Kriterleri:
- ✅ `npx prisma studio` çalışıyor
- ✅ Ürünler ve siparişler görünüyor
- ✅ serdchef@gmail.com SUPER_ADMIN role'ü var

---

## 🔐 PHASE 2: GÜVENLİK & ERIŞIM YÖNETIMI
**Hedef:** "Sarayın Muhafızları" tam entegre

### Kritik İşler:
```
□ Google Cloud Console
  - OAuth 2.0 Client ID oluştur
  - Authorized URLs:
    • http://localhost:3000
    • https://yourdomain.com
  - Copy: CLIENT_ID + SECRET

□ NextAuth.js Google Provider
  - CredentialsProvider + GoogleProvider
  - Admin-only filtering (serdchef@gmail.com)
  - Role-based JWT/Session

□ Enhanced Middleware
  - /admin/* protection
  - Role-based authorization
  - Security headers (CSP, HSTS, XSS)

□ Vercel Secret Management
  □ GOOGLE_CLIENT_ID
  □ GOOGLE_CLIENT_SECRET
  □ NEXTAUTH_SECRET (64-char random)
  □ Diğer API keys
```

### Başarı Kriterleri:
- ✅ serdchef@gmail.com Google OAuth ile login yapabiliyor
- ✅ /admin/* sadece ADMIN+ access
- ✅ Security headers aktif

---

## 💳 PHASE 3: ÖDEME SİSTEMLERİ (HAZİNE DAIRESI)
**Hedef:** Stripe live + otomatik order status

### Kritik İşler:
```
□ Stripe Dashboard
  - Activate live mode
  - Copy live keys:
    • STRIPE_SECRET_KEY
    • STRIPE_PUBLISHABLE_KEY
  - Enable 3D Secure

□ Checkout Endpoint (/api/checkout)
  POST → Create Stripe Session
  Return: sessionId, checkout URL

□ Webhook Listener (/api/webhooks/stripe)
  - Signature verification
  - checkout.session.completed event
  - Update Order status → CRAFTING
  - Send confirmation email

□ Invoice Template
  - "Ghost Gold" estetik
  - Playfair Display typography
  - müşteri + admin bilgileri

□ Stripe Test
  Test card: 4242 4242 4242 4242
  Exp: 12/25 | CVC: 123
```

### Başarı Kriterleri:
- ✅ Test ödeme tamamlanıyor
- ✅ Order status CRAFTING oluyor
- ✅ Confirmation email gidiyor

---

## 📧 PHASE 4: İLETİŞİM KANALLARI
**Hedef:** Kurumsal email + WhatsApp notifications

### Kritik İşler:
```
□ Resend Setup
  - Domain verification (coskunyayci.com)
  - DKIM, SPF, DMARC records
  - Sender: orders@coskunyayci.com

□ Email Sequences
  1. Order Confirmation
     - Müşteri adı, sipariş detayları
     - "Altın Mühür" tasarımı
  
  2. Status Updates
     - 👨‍🍳 CRAFTING (Hazırlanıyor)
     - 🔥 IN_OVEN (Fırında)
     - ❄️ COOLING (Soğuması)
     - 📦 PACKING (Paketleme)
     - 🚚 SHIPPED (Yolda)
     - ✅ DELIVERED (Teslim)

□ Twilio WhatsApp
  - Sandbox number setup
  - sendWhatsAppOrderNotification()
  - Admin alerts (>5000₺)

□ Integration with Webhooks
  - Stripe → Email + WhatsApp
  - Admin notification system
```

### Başarı Kriterleri:
- ✅ Test email coskunyayci.com'dan geliyor
- ✅ WhatsApp mesaj alınıyor
- ✅ Status updates otomatik

---

## ⚡ PHASE 5: PERFORMANCE & UX
**Hedef:** Lighthouse 85+, AI Sommelier, B2B Portal

### Kritik İşler:
```
□ Lighthouse Optimization
  1. CSS Filter Removal
     - Gereksiz brightness/saturate kaldır
     - Static background suffices
  
  2. Next/Image Implementation
     - ProductCard'larda lazy-load
     - Priority images (hero)
     - Responsive sizes
  
  3. Bundle Size
     - Framer Motion splitting
     - Code splitting
     - Tree-shaking

□ AI Sommelier Enhancement
  - BAKLAVA_KNOWLEDGE prompt
  - Detaylı ürün özellikleri
  - Kişiselleştirilmiş öneriler
  - Fiyat ve paket bilgileri

□ B2B Kurumsal Portalı (/kurumsal/kayit)
  - Company registration form
  - Tax ID + company size
  - Authorized person details
  - Admin approval workflow
  - Bulk order discounts
```

### Başarı Kriterleri:
- ✅ Lighthouse score: 85+ (Performance)
- ✅ NextLighthouse score: 90+ (SEO)
- ✅ Sommelier detailed baklava advice verebiliyor
- ✅ B2B registration form çalışıyor

---

## 🧪 PHASE 6: TESTING & LAUNCH
**Hedef:** Production-ready go-live

### Kritik İşler:
```
□ E2E Testing (Playwright)
  1. Chatbot → Product → Order Flow
  2. Payment → Stripe → Success Page
  3. Email + WhatsApp notifications
  4. Admin dashboard
  5. Order status updates

□ Analytics Setup (PostHog)
  - identifyUser() on login
  - trackEvent() on key actions
  - Dashboard metrics
  - Funnel analysis

□ Pre-Launch Checklist
  ✅ Database backups
  ✅ SSL certificate
  ✅ Domain DNS
  ✅ Email forwarding
  ✅ Monitoring active
  ✅ Incident response plan

□ Go-Live Steps
  1. Final database backup
  2. Deploy to production
  3. Verify all endpoints
  4. Monitor error logs
  5. Check payment transactions
  6. Confirm emails delivered
  7. Test WhatsApp alerts
```

### Başarı Kriterleri:
- ✅ E2E tests: 100% pass
- ✅ Lighthouse: 85+
- ✅ Uptime: 99.9%
- ✅ All KPIs met

---

## 📊 QUICK IMPLEMENTATION REFERENCE

### Dosya Yapısı (Yeni/Güncellenecek)

```
NEW:
├── app/api/checkout/route.ts           (Stripe checkout)
├── app/api/webhooks/stripe/route.ts    (Webhook listener)
├── app/kurumsal/kayit/page.tsx         (B2B portal)
├── app/api/b2b/register/route.ts       (B2B registration API)
├── lib/whatsapp.ts                     (Twilio WhatsApp)
├── lib/invoice.ts                      (Invoice template)
└── e2e/complete-flow.spec.ts           (E2E tests)

UPDATED:
├── lib/auth.ts                         (Google OAuth)
├── middleware.ts                       (Enhanced security)
├── lib/payments.ts                     (Stripe live)
├── lib/email.ts                        (Resend domain)
├── app/globals.css                     (CSS optimization)
├── next.config.js                      (Bundle optimization)
├── prisma/seed.ts                      (PostgreSQL seed)
└── .env.production                     (Vercel secrets)
```

### Environment Variables Checklist

```env
# Database (PHASE 1)
DATABASE_URL="postgresql://..."

# Authentication (PHASE 2)
NEXTAUTH_URL="https://coskunyayci.com"
NEXTAUTH_SECRET="<64-char-random>"
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# Payment (PHASE 3)
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_PUBLISHABLE_KEY="pk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Email (PHASE 4)
RESEND_API_KEY="re_xxx"

# Communication (PHASE 4)
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
BUSINESS_PHONE_NUMBER="+905321234567"

# Analytics (PHASE 6)
NEXT_PUBLIC_POSTHOG_KEY="phc_xxx"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Other
OPENAI_API_KEY="sk-xxx"
ADMIN_EMAIL="serdchef@gmail.com"
```

---

## 🎯 HAFTALIK HEDEFLER

```
HAFTA 1: PostgreSQL + SUPER_ADMIN Setup ✅
HAFTA 2: Google OAuth + Middleware 🔐
HAFTA 3: Stripe Live + Webhooks 💳
HAFTA 4: Email + WhatsApp 📧
HAFTA 5: Lighthouse 85+ + B2B 🚀
HAFTA 6: Testing + Go-Live 🎉

TARGET LAUNCH: 3 Şubat 2025
```

---

## 🚀 GO-LIVE COMMAND

```bash
# Tüm checks tamamlandığında:
npm run build          # Production build
npm run start          # Verify locally
git add -A
git commit -m "🚀 Production ready - launching Digital Emerald Palace"
git push origin main
# Vercel auto-deploys
# 🎉 LIVE!
```

---

## 📞 CRITICAL CONTACTS

```
🏛️ Platform Owner: serdchef@gmail.com
🗄️ Database: Supabase
💳 Payment: Stripe
📧 Email: Resend
💬 SMS: Twilio
📊 Analytics: PostHog
🎯 Monitoring: Sentry
```

---

## ✨ VİZYON

> "Coşkun Yayçı Baklava, beş yıl içinde küresel baklava e-ticaret lideri
> olacaktır. Dijital Zümrüt Sarayı, Gaziantep'in lüks mirasını
> dünyaya taşıyan bir sarsılmaz otorite olacak."

🏛️ **Mükemmelliğe giden yol başlamıştır.**

---

**Son Güncelleme:** 22 Aralık 2025
**Durum:** READY FOR PHASE 1 ✅
**Sonraki Adım:** PostgreSQL Setup (Hafta 1)
