# ⚡ Kurulum Komutları (Sırayla Çalıştırın)

## 1. Bağımlılıkları Yükle

```powershell
cd C:\Users\x\Desktop\coskunyaycibaklava
pnpm install
```

**Alternatif (pnpm yoksa):**
```powershell
npm install -g pnpm
pnpm install
```

## 2. PostgreSQL Kontrolü

### PostgreSQL Çalışıyor mu?

```powershell
# Windows Service kontrol
Get-Service postgresql*

# Çalışmıyorsa başlat
net start postgresql-x64-14
```

### Database Oluştur

```powershell
# PostgreSQL'e bağlan
psql -U postgres

# Database oluştur
CREATE DATABASE baklava_db;
\q
```

**Docker ile (alternatif):**
```powershell
docker run --name baklava-postgres -e POSTGRES_PASSWORD=baklava123 -p 5432:5432 -d postgres:14
```

## 3. Environment Variables

```powershell
# .env dosyası oluştur
Copy-Item .env.example .env

# Notepad ile düzenle
notepad .env
```

**Minimum değerler (.env içine):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/baklava_db"
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="super-secret-key-minimum-32-characters-long-change-this"
OPENAI_API_KEY="sk-test"
TWILIO_ACCOUNT_SID="ACtest"
TWILIO_AUTH_TOKEN="test"
STRIPE_SECRET_KEY="sk_test_mock"
```

## 4. Prisma Setup

```powershell
# Prisma client oluştur
pnpm prisma:generate

# Database migration
pnpm prisma migrate dev --name init

# Seed data (örnek ürünler + admin)
pnpm prisma:seed
```

**Hata alırsanız:**
```powershell
# Prisma cache temizle
Remove-Item -Recurse -Force node_modules\.prisma
pnpm prisma:generate --force
```

## 5. Development Server Başlat

```powershell
pnpm dev
```

**Tarayıcıda:**
- Ana sayfa: http://localhost:4000
- Health check: http://localhost:4000/api/health

## 6. Test Kullanıcıları

Seed script aşağıdaki kullanıcıları oluşturur:

| Email | Şifre | Rol |
|-------|-------|-----|
| admin@baklavaci.com | Admin123! | SUPER_ADMIN |
| siparis@baklavaci.com | Admin123! | OPERATOR |
| musteri@example.com | Admin123! | CUSTOMER |

## 7. Testleri Çalıştır (Opsiyonel)

```powershell
# Unit testler
pnpm test

# Playwright E2E (ilk kez)
npx playwright install
pnpm e2e
```

## 8. Worker Başlat (Opsiyonel - Video Jobs için)

**Ayrı PowerShell penceresinde:**

```powershell
cd C:\Users\x\Desktop\coskunyaycibaklava

# Redis gerekli (Docker ile)
docker run --name baklava-redis -p 6379:6379 -d redis:7

# Worker başlat
pnpm worker:dev
```

## 9. Prisma Studio (Database GUI)

```powershell
pnpm prisma:studio
```

**Açılacak:** http://localhost:5555

---

## Sorun Giderme

### Port 3000 Kullanımda

```powershell
# Port'u kullanan process'i bul
netstat -ano | findstr :3000

# Process'i sonlandır
taskkill /PID <PID> /F
```

### Database Connection Error

```powershell
# PostgreSQL çalışıyor mu?
Test-NetConnection -ComputerName localhost -Port 5432

# DATABASE_URL doğru mu?
type .env | findstr DATABASE_URL
```

### Prisma Migration Hatası

```powershell
# Migration'ları sıfırla (DİKKAT: Tüm veri silinir)
pnpm prisma migrate reset --force
pnpm prisma:seed
```

### Module Not Found

```powershell
# Node modules temizle
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
pnpm install
```

### TypeScript Hatası

```powershell
# TypeScript cache temizle
Remove-Item -Recurse -Force .next
pnpm build
```

---

## Hızlı Başlangıç (Tek Komut)

**İlk kurulum:**
```powershell
pnpm install && `
pnpm prisma:generate && `
pnpm prisma migrate dev --name init && `
pnpm prisma:seed && `
pnpm dev
```

**Sonraki başlatmalar:**
```powershell
pnpm dev
```

---

## Production Build Test

```powershell
# Build
pnpm build

# Production mode'da çalıştır
pnpm start
```

---

## Yararlı Komutlar

```powershell
# Linting
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check

# Coverage
pnpm test:coverage

# Prisma Studio
pnpm prisma:studio

# Logs
Get-Content .next\trace -Tail 50 -Wait
```

---

## Next Steps

1. ✅ Server çalışıyor → http://localhost:4000
2. ✅ Ürünler görünüyor
3. ✅ Chatbot açılıyor
4. 🎯 Admin panel implement et
5. 🎯 Production'a deploy et (Vercel)

**Dokümantasyon:**
- `README.md` - Genel bakış
- `QUICKSTART.md` - Hızlı başlangıç
- `DEPLOYMENT.md` - Production deploy
- `ARCHITECTURE.md` - Sistem mimarisi
- `SPRINT_PLAN.md` - 7 günlük plan
