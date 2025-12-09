# ⚡ Quick Start Guide

Bu doküman projeyi **5 dakikada** çalıştırmanız için hazırlanmıştır.

## 🎯 Önkoşullar

```bash
node --version    # v18+
pnpm --version    # v8+ (yoksa: npm install -g pnpm)
psql --version    # PostgreSQL 14+
```

## 📦 Kurulum (3 Adım)

### 1. Bağımlılıkları Yükle

```bash
cd coskunyaycibaklava
pnpm install
```

### 2. Database Oluştur

**PostgreSQL başlat:**

```bash
# Windows (PostgreSQL yüklü ise)
net start postgresql-x64-14

# veya Docker ile
docker run --name baklava-db -e POSTGRES_PASSWORD=baklava123 -p 5432:5432 -d postgres:14
```

**Database oluştur:**

```bash
psql -U postgres
CREATE DATABASE baklava_db;
\q
```

### 3. Environment Setup

```bash
# .env dosyası oluştur
cp .env.example .env
```

**Minimal .env** (test için):

```env
DATABASE_URL="postgresql://postgres:baklava123@localhost:5432/baklava_db"
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="test-secret-minimum-32-characters-long-string"
OPENAI_API_KEY="sk-test-mock-key-for-dev"
TWILIO_ACCOUNT_SID="ACtest"
TWILIO_AUTH_TOKEN="test"
TWILIO_PHONE_NUMBER="+1234567890"
TWILIO_WHATSAPP_NUMBER="whatsapp:+1234567890"
BUSINESS_PHONE_NUMBER="+905321234567"
STRIPE_SECRET_KEY="sk_test_mock"
STRIPE_WEBHOOK_SECRET="whsec_test"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_mock"
```

## 🚀 Başlat

```bash
# 1. Prisma setup
pnpm prisma:generate
pnpm prisma migrate dev --name init
pnpm prisma:seed

# 2. Development server
pnpm dev
```

**Tarayıcıda aç:** http://localhost:4000

## ✅ İlk Test

### 1. Ana Sayfayı Kontrol Et

- http://localhost:4000
- Ürünler görünmeli
- Header/Footer yüklenmeli

### 2. Chatbot'u Test Et

1. Sağ alttaki yuvarlak butona tıkla
2. "Fıstıklı baklava istiyorum" yaz
3. Bot yanıt vermeli (OpenAI bağlı değilse mock response)

### 3. Test Kullanıcıları

**Admin Girişi:**
- Email: `admin@baklavaci.com`
- Şifre: `Admin123!`
- URL: http://localhost:4000/admin (TODO: implement)

## 🧪 Test Komutu

```bash
# Unit testler
pnpm test

# E2E testler (Playwright)
pnpm e2e
```

## 🔧 Sorun Giderme

### Port 3000 Kullanımda

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Prisma Hatası

```bash
npx prisma generate --force
npx prisma migrate reset --force
```

### Dependencies Hatası

```bash
rm -rf node_modules .next
pnpm install
pnpm build
```

## 📝 Sonraki Adımlar

1. **API Keys Ekle** (gerçek test için):
   - OpenAI API key
   - Stripe test keys
   - Twilio credentials

2. **Admin Panelini Test Et:**
   ```bash
   # Admin route'ları implement et
   mkdir -p app/admin
   ```

3. **Production Deploy:**
   - `DEPLOYMENT.md` dosyasına bak
   - Vercel veya AWS/EC2

## 🎨 Development Tips

### Hot Reload

Next.js otomatik hot reload destekler. Dosya kaydettiğinizde sayfa yenilenir.

### Database Studio

```bash
pnpm prisma:studio
```

http://localhost:5555 - Visual database editor

### Logs

```bash
# API logs
tail -f .next/trace

# Database queries (development)
# Zaten console'da görünür
```

### Environment Variables Değiştirme

`.env` dosyasını değiştirdikten sonra:

```bash
# Server'ı yeniden başlat
# Ctrl+C sonra pnpm dev
```

## 🆘 Yardım

- **README.md** - Detaylı dokümantasyon
- **DEPLOYMENT.md** - Production deployment
- **GitHub Issues** - Bug reports

---

**Hazırsınız! 🎉**

Ana sayfa: http://localhost:4000
Chatbot: Sağ alt köşe
Admin: http://localhost:4000/admin (TODO)
