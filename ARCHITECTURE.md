# 🏗️ Sistem Mimarisi

## Genel Bakış

```
┌─────────────────────────────────────────────────────────────┐
│                       KULLANICI TARAFILAR                    │
├─────────────────────────────────────────────────────────────┤
│  Web Browser  │  Mobile Browser  │  Admin Dashboard         │
└────────┬──────┴────────┬─────────┴──────────┬───────────────┘
         │               │                    │
         └───────────────┴────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │         Next.js Frontend          │
         │  - App Router (React)             │
         │  - TailwindCSS                    │
         │  - SWR / React Query              │
         │  - ChatbotWidget                  │
         └───────────┬───────────────────────┘
                     │
                     ▼
         ┌───────────────────────────────────┐
         │      Next.js API Routes           │
         │  (/api/orders, /api/chatbot)      │
         │  - Input Validation (Zod)         │
         │  - Rate Limiting                  │
         │  - CSRF Protection                │
         └───────┬──────────┬────────────────┘
                 │          │
                 │          └─────────────────┐
                 ▼                            ▼
    ┌────────────────────┐      ┌─────────────────────┐
    │  Lib / Services    │      │  External APIs      │
    ├────────────────────┤      ├─────────────────────┤
    │ • db.ts (Prisma)   │      │ • OpenAI            │
    │ • auth.ts          │      │ • Stripe            │
    │ • openai.ts        │      │ • Twilio            │
    │ • twilio.ts        │      │ • AWS S3            │
    │ • payments.ts      │      │ • iyzico (TR)       │
    │ • videoStudio.ts   │      └─────────────────────┘
    │ • security.ts      │
    │ • logger.ts        │
    └─────────┬──────────┘
              │
              ▼
    ┌──────────────────────────┐
    │   PostgreSQL Database    │
    │   + Prisma ORM           │
    ├──────────────────────────┤
    │ • users                  │
    │ • products               │
    │ • orders                 │
    │ • video_jobs             │
    │ • coupons                │
    │ • audit_logs             │
    │ • analytics_events       │
    └──────────────────────────┘

    ┌──────────────────────────┐
    │    Redis (Queue)         │
    ├──────────────────────────┤
    │ • BullMQ (video jobs)    │
    │ • Rate limiting cache    │
    │ • Session storage        │
    └──────────────────────────┘

    ┌──────────────────────────┐
    │    Worker Process        │
    ├──────────────────────────┤
    │ • videoWorker.ts         │
    │ • Background jobs        │
    │ • AI video generation    │
    └──────────────────────────┘
```

## Katmanlar

### 1. Presentation Layer (Frontend)

**Teknolojiler:**
- Next.js 14 App Router
- React 18 Server/Client Components
- TailwindCSS
- TypeScript

**Bileşenler:**
```
/app
  layout.tsx          # Root layout
  page.tsx            # Ana sayfa
  /admin              # Admin paneli
  /order              # Sipariş sayfaları

/components
  Header.tsx          # Global header
  Footer.tsx          # Global footer
  ChatbotWidget.tsx   # AI chatbot
  ProductCard.tsx     # Ürün kartı
```

### 2. API Layer

**Teknolojiler:**
- Next.js API Routes (Serverless)
- Zod validation
- Rate limiting
- CSRF protection

**Endpoint'ler:**
```
POST /api/orders          # Sipariş oluşturma
GET  /api/orders          # Sipariş listesi (admin)
GET  /api/orders/[id]     # Sipariş detayı
PATCH /api/orders/[id]    # Sipariş güncelleme

POST /api/chatbot         # Chatbot mesaj işleme

POST /api/videos          # Video job oluşturma

POST /api/webhooks/stripe # Stripe webhook
POST /api/webhooks/twilio # Twilio webhook

GET  /api/health          # Health check
```

### 3. Business Logic Layer

**Adapter'lar:**

```typescript
// lib/db.ts - Database client
export const prisma: PrismaClient

// lib/auth.ts - Authentication
export const authOptions: NextAuthOptions

// lib/openai.ts - AI services
export function processChatbotMessage()
export function generateVideoScript()

// lib/twilio.ts - Messaging
export function notifyBusinessOwner()
export function notifyCustomer()

// lib/payments.ts - Payment processing
export function createStripeCheckoutSession()
export function handleStripeWebhook()

// lib/security.ts - Security utilities
export function checkRateLimit()
export function validateInput()
export function sanitizeHtml()
```

### 4. Data Layer

**Database Schema:**

```prisma
// Kullanıcı yönetimi
model User {
  role: UserRole (CUSTOMER, ADMIN, OPERATOR, SUPER_ADMIN)
}

// Ürün kataloğu
model Product {
  sku, name, priceCents, weightGr, stockQty
}

// Sipariş yönetimi
model Order {
  orderNumber, items (JSON), totalCents
  status: OrderStatus (PENDING -> CONFIRMED -> PREPARING -> DELIVERED)
  paymentStatus: PaymentStatus
}

// Video üretimi
model VideoJob {
  jobId, templateId, status, resultUrl
}

// Analytics
model AnalyticsEvent {
  eventName, properties, userId
}

// Audit
model AuditLog {
  entity, action, payload, actorId
}
```

### 5. Background Jobs

**Worker Process:**

```typescript
// worker/videoWorker.ts
- BullMQ queue consumer
- Video generation tasks
- Retry logic (3 attempts)
- Error handling
- Progress tracking
```

## Veri Akışı

### Sipariş Akışı

```
1. Kullanıcı chatbot'a "Fıstıklı baklava istiyorum" yazar
   ↓
2. POST /api/chatbot
   - OpenAI ile slot extraction
   - Missing slots belirlenir
   ↓
3. Tüm slotlar dolduktan sonra
   ↓
4. POST /api/orders
   - Validation (Zod)
   - Rate limiting kontrolü
   - Ürün & stok kontrolü
   - Fiyat hesaplama
   - Kupon uygulaması
   - Order oluşturma (DB)
   - Twilio notification (async)
   - Stripe checkout session (opsiyonel)
   ↓
5. Kullanıcıya confirmation
   - Order number
   - Payment link (varsa)
   ↓
6. Webhook'lar
   - Stripe: payment.succeeded → Order.paymentStatus = PAID
   - Twilio: Incoming message → Process & respond
```

### Video Üretim Akışı

```
1. Admin POST /api/videos
   - VideoJob kaydı oluşturulur (status: PENDING)
   - Job queue'ya eklenir
   ↓
2. Worker job'u alır
   - Status → PROCESSING
   - OpenAI ile script üretimi
   - Video provider API çağrısı (Runway/Synthesia)
   ↓
3. Video tamamlanınca
   - S3'e upload
   - Status → COMPLETED
   - resultUrl DB'ye yazılır
   ↓
4. Admin panelde görüntülenir
```

## Güvenlik Katmanları

### 1. Network Level
- HTTPS (SSL/TLS)
- Cloudflare DDoS protection
- Rate limiting (IP based)

### 2. Application Level
```typescript
// Input validation
validateInput(createOrderSchema, body)

// XSS prevention
sanitizeHtml(userInput)

// CSRF protection
verifyCsrfToken(token, expectedToken)

// SQL injection prevention
prisma.order.create() // Parametreli sorgular
```

### 3. Authentication
```typescript
// NextAuth.js
- JWT sessions
- bcrypt password hashing (12 rounds)
- Role-based access control
```

### 4. API Security
```typescript
// Rate limiting
checkRateLimit(clientIp, { windowMs: 60000, maxRequests: 100 })

// Webhook signature verification
validateWebhookSignature(signature, payload, secret)
```

## Ölçeklenebilirlik

### Horizontal Scaling

**Next.js:**
- Vercel serverless (otomatik scale)
- veya AWS Lambda + ALB
- Stateless API routes

**Database:**
- PostgreSQL read replicas
- Connection pooling (PgBouncer)
- Indexes optimize

**Redis:**
- Redis Cluster
- Sentinel (HA)

**Worker:**
- Multiple worker instances
- Job concurrency control
- Queue distribution

### Vertical Scaling

- Database: Daha güçlü instance (CPU/RAM)
- Redis: Memory artırma
- Worker: More powerful machines

## Monitoring & Observability

### Metrics

```typescript
// Application metrics
- API response times
- Error rates
- Order conversion rate
- Chatbot success rate

// Infrastructure metrics
- CPU/Memory usage
- Database connections
- Queue length
- Cache hit rate
```

### Logging

```typescript
// Structured logging (Pino)
logger.info({ orderId, amount }, 'Order created')
logger.error({ error, context }, 'Payment failed')

// Log aggregation
- CloudWatch Logs (AWS)
- Vercel Logs
- Datadog
```

### Alerting

```yaml
Alerts:
  - High error rate (>5%)
  - Slow API response (>2s)
  - Database connection failures
  - Queue backup (>100 jobs)
  - Payment webhook failures
```

## Performance Optimizations

### Frontend
- Image optimization (Next.js Image)
- Code splitting (automatic)
- Static page generation (ISR)
- Client-side caching (SWR)

### Backend
- Database query optimization
- Redis caching
- CDN for static assets
- Lazy loading

### Database
```sql
-- Critical indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_users_email ON users(email);
```

## Deployment Stratejisi

### CI/CD Pipeline

```yaml
1. Commit → GitHub
2. GitHub Actions:
   - Lint & type check
   - Unit tests
   - Build
   - E2E tests
   - Security scan
3. Deploy:
   - Staging (develop branch)
   - Production (main branch)
4. Smoke tests
5. Monitoring alerts
```

### Blue-Green Deployment

```
Current (Blue) → 100% traffic
New (Green) → 0% traffic

Test Green → Shift 10% traffic → Monitor → Shift 100%

If error → Instant rollback to Blue
```

## Disaster Recovery

### Backup Strategy
- Database: Daily automated backups (7-day retention)
- S3: Versioning enabled
- Redis: RDB snapshots

### Recovery Plan
1. Database restore: < 1 hour RTO
2. Application redeploy: < 15 minutes
3. DNS failover: < 5 minutes

---

**Sistem sürekli geliştirilmektedir. Detaylar için:**
- `README.md` - Genel dokümantasyon
- `DEPLOYMENT.md` - Production deploy
- `QUICKSTART.md` - Hızlı başlangıç
