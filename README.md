# 🥮 Coşkun Yayçı Baklava - Dijital Platform

Türkiye'nin en kaliteli baklavası için **production-ready**, ölçeklenebilir, güvenli ve 5 yıl içinde küresel liderliğe gidecek tam kapsamlı dijital platform.

## 🎯 Özellikler

### Müşteri Tarafı
- ✅ **Ürün Kataloğu**: SKU, gramaj, fiyat, stok yönetimi
- ✅ **AI Chatbot Sipariş**: Doğal dil ile konuşarak sipariş verme (OpenAI GPT-4)
- ✅ **Ödeme Entegrasyonu**: Stripe (global) + iyzico (Türkiye) + kapıda ödeme
- ✅ **WhatsApp/SMS Bildirimleri**: Twilio entegrasyonu ile anında bildirim
- ✅ **Çoklu Dil**: TR/EN desteği
- ✅ **Erişilebilirlik**: WCAG AA standartları

### İşletme Tarafı (Admin)
- ✅ **Sipariş Yönetimi**: Gelen siparişler, durum güncelleme, filtreleme
- ✅ **Video Studio**: AI ile reklam video senaryosu üretimi
- ✅ **Kampanya Yönetimi**: Kupon ve indirim yönetimi
- ✅ **Analytics Dashboard**: PostHog entegrasyonu
- ✅ **Rol Tabanlı Yetkilendirme**: Admin, Operator, Müşteri

### Teknik Altyapı
- ✅ **Full-Stack TypeScript**: Tip güvenliği her katmanda
- ✅ **Database**: PostgreSQL + Prisma ORM
- ✅ **Authentication**: NextAuth.js (email/password + OAuth)
- ✅ **Security**: Rate limiting, input validation, CSRF protection
- ✅ **Testing**: Jest + React Testing Library + Playwright E2E
- ✅ **CI/CD**: GitHub Actions + Vercel deployment

## 🛠️ Teknoloji Yığını

```
Frontend:  Next.js 14 (App Router) + React + TailwindCSS + TypeScript
Backend:   Next.js API Routes (Serverless) + Node.js Worker
Database:  PostgreSQL + Prisma ORM
Auth:      NextAuth.js
AI:        OpenAI GPT-4 (Chatbot + Video Script)
Payment:   Stripe + iyzico
Messaging: Twilio (WhatsApp + SMS)
Storage:   AWS S3
Queue:     BullMQ + Redis
Analytics: PostHog
Testing:   Jest + Playwright
CI/CD:     GitHub Actions + Vercel
```

## 📦 Kurulum

### Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (opsiyonel, rate limiting için)
- pnpm 8+ (veya npm/yarn)

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/your-org/baklava-site.git
cd baklava-site
```

### 2. Bağımlılıkları Yükleyin

```bash
pnpm install
```

### 3. Environment Variables

`.env` dosyası oluşturun (`.env.example`'dan kopyalayın):

```bash
cp .env.example .env
```

**Kritik değişkenler:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/baklava_db"

# NextAuth
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="<32+ karakter gizli anahtar>"

# OpenAI
OPENAI_API_KEY="sk-..."

# Twilio
TWILIO_ACCOUNT_SID="ACxxxxx"
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
BUSINESS_PHONE_NUMBER="+905321234567"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Redis (opsiyonel)
REDIS_URL="redis://localhost:6379"
```

### 4. Database Setup

```bash
# Prisma schema'yı oluştur
npx prisma generate

# Database migrate
npx prisma migrate dev --name init

# Seed data (örnek ürünler, admin kullanıcı)
pnpm prisma:seed
```

**Test kullanıcıları:**
- **Admin**: `admin@baklavaci.com` / `Admin123!`
- **Operator**: `siparis@baklavaci.com` / `Admin123!`
- **Müşteri**: `musteri@example.com` / `Admin123!`

### 5. Development Server

```bash
pnpm dev
```

Tarayıcıda açın: **http://localhost:4000**

### 6. Worker (Video Jobs) - Opsiyonel

Ayrı terminal'de:

```bash
pnpm worker:dev
```

## 🧪 Testler

### Unit Testler

```bash
pnpm test
```

### E2E Testler (Playwright)

```bash
# Playwright kurulumu (ilk kez)
npx playwright install

# Testleri çalıştır
pnpm e2e

# UI mode
pnpm e2e:ui
```

### Coverage

```bash
pnpm test:coverage
```

## 🚀 Production Deployment

### Vercel Deployment

1. GitHub repository'nizle Vercel'i bağlayın
2. Environment variables'ı Vercel dashboard'da ayarlayın
3. `main` branch'e push yapın

```bash
git push origin main
```

Vercel otomatik deploy edecektir.

### Manual Build

```bash
pnpm build
pnpm start
```

## 📖 API Dokümantasyonu

### POST /api/orders

**Sipariş oluşturma**

**Request:**
```json
{
  "items": [
    {
      "sku": "FISTIK_1KG",
      "qty": 1
    }
  ],
  "customer": {
    "name": "Ahmet Yılmaz",
    "phone": "+905551234567",
    "email": "ahmet@example.com"
  },
  "deliveryType": "delivery",
  "address": {
    "street": "Atatürk Cad. No:123",
    "district": "Çankaya",
    "city": "Ankara",
    "postalCode": "06100"
  },
  "paymentMethod": "link"
}
```

**Response (201):**
```json
{
  "success": true,
  "orderId": "clx...",
  "orderNumber": "BK-20250115-ABC1",
  "totalCents": 85000,
  "paymentLink": "https://checkout.stripe.com/..."
}
```

**Acceptance Criteria:**
- ✅ Valid body ile 201 dönmeli
- ✅ Order DB'de oluşmalı
- ✅ Twilio notification gönderilmeli
- ✅ Payment link döndürülmeli (paymentMethod=link ise)
- ✅ Hatalı telefon formatında 400 dönmeli
- ✅ Rate limit aşılırsa 429 dönmeli

**cURL Örneği:**
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"sku": "FISTIK_1KG", "qty": 1}],
    "customer": {"name": "Test", "phone": "+905551234567"},
    "deliveryType": "pickup",
    "paymentMethod": "cash"
  }'
```

### POST /api/chatbot

**Chatbot mesaj işleme**

**Request:**
```json
{
  "message": "Fıstıklı baklava istiyorum",
  "currentSlots": {},
  "conversationHistory": []
}
```

**Response:**
```json
{
  "message": "Kaç kilo istersiniz?",
  "extractedSlots": {
    "productSku": "FISTIK_1KG"
  },
  "missingSlots": ["qty", "deliveryType", "phone", "paymentChoice"],
  "isComplete": false
}
```

### POST /api/webhooks/stripe

**Stripe webhook handler**

Stripe webhook'larını dinler (signature doğrulaması ile).

### POST /api/webhooks/twilio

**Twilio webhook handler**

Gelen SMS/WhatsApp mesajlarını işler (signature doğrulaması ile).

## 🔐 Güvenlik

### Rate Limiting

API endpoint'leri için rate limiting aktif:
- `/api/orders`: 10 istek / 5 dakika
- `/api/chatbot`: 30 istek / 1 dakika

### Input Validation

Tüm endpoint'lerde Zod schema validation:
- Telefon format kontrolü
- Email doğrulama
- Adres alanları sanitization

### CSRF Protection

Form submission'larda CSRF token kontrolü.

### Webhook Security

- Stripe: Signature verification
- Twilio: HMAC signature validation

### PCI-DSS Compliance

Kart bilgileri **asla** sunucuda saklanmaz. Tüm ödemeler Stripe üzerinden.

## 📊 Analytics & Monitoring

### PostHog Events

```typescript
// Örnek event tracking
await prisma.analyticsEvent.create({
  data: {
    eventName: 'order_placed',
    properties: { orderNumber, totalCents },
  },
});
```

### Sentry (Opsiyonel)

Error tracking için `SENTRY_DSN` environment variable'ını ayarlayın.

## 🎨 Component Storybook (Gelecek)

```bash
pnpm storybook
```

## 🗂️ Proje Yapısı

```
/baklava-site
  /app
    /api
      /orders         # Sipariş API
      /webhooks       # Stripe, Twilio webhooks
      /videos         # Video job API
      /chatbot        # Chatbot API
    /admin            # Admin panel
    layout.tsx
    page.tsx          # Ana sayfa
    globals.css
  /components
    Header.tsx
    Footer.tsx
    ProductCard.tsx
    ChatbotWidget.tsx
  /lib
    db.ts             # Prisma client
    auth.ts           # NextAuth config
    openai.ts         # OpenAI adapter
    twilio.ts         # Twilio adapter
    payments.ts       # Stripe adapter
    security.ts       # Security utilities
    videoStudio.ts    # Video generation
    logger.ts         # Pino logger
  /prisma
    schema.prisma     # Database schema
    seed.ts           # Seed script
  /tests
    /unit
    /e2e
  /worker
    videoWorker.ts    # Background job processor
  next.config.js
  package.json
  README.md
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# PostgreSQL çalışıyor mu?
pg_isready

# Connection string doğru mu?
echo $DATABASE_URL
```

### Prisma Generate Error

```bash
npx prisma generate --force
```

### Port Already in Use

```bash
# 3000 portunu kullanan process'i bul
lsof -ti:3000

# Kill et
kill -9 <PID>
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Convention

```
feat: Yeni özellik
fix: Bug fix
docs: Dokümantasyon
style: Formatting
refactor: Code refactoring
test: Test ekleme
chore: Maintenance
```

## 📝 Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Email**: dev@baklavaci.com
- **Website**: https://baklavaci.com
- **Twitter**: @baklavaci

---

**Built with ❤️ for Coşkun Yayçı Baklava**
