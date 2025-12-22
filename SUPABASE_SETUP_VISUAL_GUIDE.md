# 🌐 SUPABASE KURULUM REHBERI
## Adım-Adım Görsel Rehber (Phase 1 - İlk Gün)

**Hedef:** PostgreSQL database oluşturmak, CONNECTION_STRING almak, migration çalıştırmak  
**Tahmini Süre:** 15 dakika

---

## ADIM 1: SUPABASE HESABI OLUŞTUR

### 1.1 Website'e Git

```
https://supabase.com
```

**Ekran:** Landing page ile karşılaşacaksın.

### 1.2 "Start Your Project" Butonuna Tıkla

**Seçenekler:**
- Sign Up → Email & Password ile kaydol
- GitHub ile Login (daha hızlı)

**Tavsiye:** serdchef@gmail.com email kullan

### 1.3 Email Verify Et

Supabase from verification email gönderecek:
```
✉️ Confirm your email address
→ Link'e tıkla
→ Dashboard'a yönlendirileceksin
```

---

## ADIM 2: YENİ PROJE OLUŞTUR

### 2.1 Dashboard → "New Project"

```
Dashboard page:
  ↓
  "Create a New Project" / "New Project" button
  ↓
  Click
```

### 2.2 Proje Detayları Gir

```
FORM:
┌─────────────────────────────────┐
│ Organization: [Select/Create]   │
│ Project Name: [TEXT FIELD]      │
│ Database Password: [SECURE]     │
│ Region: [DROPDOWN]              │
│ Plan: [FREE / PRO]              │
└─────────────────────────────────┘

DOLDUR:
  Organization:    Yeni bir organization oluştur
  Project Name:    coskun-yayci-baklava
  Password:        MySecurePassword123!
                   (en az 15 char, uppercase+number+special)
  Region:          EU (Ireland) [closest in Europe]
                   OR Türkiye [if available]
  Plan:            Free (yeterli)
```

### 2.3 Create Project Tıkla

```
Button: "Create New Project"
↓
⏳ Status: "Setting up your database..."
↓
⏳ 2-3 dakika bekleme...
↓
✅ Database Ready
```

---

## ADIM 3: CONNECTION STRING AL

### 3.1 Dashboard → Settings

```
Left sidebar:
  ↓
  "Settings" (⚙️ icon)
  ↓
  Click
```

### 3.2 Database Tab'ı Aç

```
Settings page:
  ↓
  "Database" tab (top)
  ↓
  Click
```

### 3.3 Connection Info Bölümü

```
GÖRÜNEŞEK:
┌─────────────────────────────────────┐
│ Connection Info                     │
│ ┌─────────────────────────────────┐ │
│ │ [POSTGRESQL] [URI] [PARAMETERS] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Host:       xxxx.supabase.co        │
│ Database:   postgres                │
│ User:       postgres                │
│ Password:   [***hidden***]          │
│ Port:       5432                    │
│                                     │
│ URI: postgresql://postgres:PASS...  │
└─────────────────────────────────────┘
```

### 3.4 Full Connection String Kopyala

```
FULL URL FORMAT:
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

ÖRNEK (hayali):
postgresql://postgres:MySecurePassword123@aaaabbbbccccdddd.supabase.co:5432/postgres

KOPYALAMA:
  1. "URI" alanında: postgresql://postgres:... başlayan text
  2. Copy button veya mouse select
  3. Clipboard'a kopyala
```

---

## ADIM 4: TERMINAL'DE SETUP

### 4.1 Proje Dizinine Gir

```bash
# PowerShell veya Terminal aç
cd c:\Users\x\Desktop\coskunyaycibaklava
```

### 4.2 .env.local Dosyasını Oluştur

```bash
# OPTION A: Doğrudan terminal
echo 'DATABASE_URL="postgresql://postgres:MySecurePassword123@aaaabbbbccccdddd.supabase.co:5432/postgres"' > .env.local

# OPTION B: VS Code'da manual oluştur
# Dosya: .env.local
# İçerik:
# DATABASE_URL="postgresql://postgres:MySecurePassword123@aaaabbbbccccdddd.supabase.co:5432/postgres"
```

### 4.3 Verify

```bash
# .env.local var mı?
cat .env.local

# EXPECTED OUTPUT:
# DATABASE_URL="postgresql://postgres:..."
```

### ⚠️ GÜVENLİK: .gitignore'da .env.local Var mı?

```bash
# Check
grep "\.env\.local" .gitignore

# Should output:
# .env.local

# If not, add it:
echo ".env.local" >> .gitignore
```

---

## ADIM 5: PRISMA MIGRATION ÇALIŞTIRIR

### 5.1 Schema Validate

```bash
npx prisma validate

# Expected:
# ✅ Prisma schema is valid
```

### 5.2 Migration Oluştur ve Çalıştır

```bash
npx prisma migrate dev --name "initial_postgres_setup"

# Sorular veya otomatik:
# - Migration name: initial_postgres_setup
# - Generate Prisma Client: Y
# - Run migrations: Y

# Expected Output:
# 🚀 Starting migration engine
# 🔨 Migration `20251222_initial_postgres_setup` has been applied
# ✅ Your database has been created with success
```

### 5.3 Seed Script Çalıştır

```bash
npx prisma db seed

# Expected Output:
# 🏛️ PHASE 1: Starting PostgreSQL seed with SUPER_ADMIN setup...
#
# ✅ SUPER_ADMIN User Created/Updated:
#    Email: serdchef@gmail.com
#    Role: SUPER_ADMIN
#
# ✅ Test User Created:
#    Email: test@example.com
#
# ✅ Products Created: 16
# ✅ Product Variants Created: 64
#
# 🎉 Seed Complete!
#
# 📊 Database Summary:
#    ✅ SUPER_ADMIN: 1 (serdchef@gmail.com)
#    ✅ Test User: 1 (test@example.com)
#    ✅ Products: 16
#    ✅ Variants: 64
```

---

## ADIM 6: PRISMA STUDIO'DA VERIFY

### 6.1 Prisma Studio Aç

```bash
npx prisma studio

# Output:
# ✅ Prisma Studio is running on: http://localhost:5555
```

### 6.2 Browser'da Aç

```
http://localhost:5555
```

### 6.3 Tables Kontrol Et

```
Left sidebar tables:
  ✅ User         → 2 records (serdchef@gmail.com + test@example.com)
  ✅ Product      → 16 records (Klasik, Fıstık, Çikolata, vb.)
  ✅ ProductVariant → 64 records (4 per product: 250g, 500g, 1kg, Corporate)
  ✅ Address      → 1 record (test user address)
```

**Eğer tüm bu tablolar 0 record gösteriyorsa:**
→ Seed script'i tekrar çalıştır: `npx prisma db seed`

---

## ADIM 7: VERCEL ENVIRONMENT VARIABLES

### 7.1 Vercel Dashboard'a Git

```
https://vercel.com
→ Project: coskunyayci-5zzk
→ Settings (top)
```

### 7.2 Environment Variables Bölümü

```
Left sidebar:
  ↓
  "Environment Variables"
  ↓
  Click
```

### 7.3 DATABASE_URL Ekle

```
FORM:
┌────────────────────────────────┐
│ NAME:  DATABASE_URL            │
│ VALUE: postgresql://postgres:M...│
│ ENVS:  ☑ Production            │
│        ☑ Preview               │
│        ☑ Development           │
│                                │
│ [Add] button                   │
└────────────────────────────────┘

VALUE'ye Supabase connection string kopyala:
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

Sonra "Add" tıkla
```

### 7.4 NEXTAUTH_SECRET Ekle

```bash
# Önce Terminal'de random string oluştur:
openssl rand -base64 32 | tr -d '\n='

# Örnek output:
# abc123defghijklmnopqrstuvwxyz1234567890

# Vercel'e ekle:
# NAME:  NEXTAUTH_SECRET
# VALUE: [generated string]
# ENVS:  ☑ Production
#        ☑ Preview
#        ☑ Development
```

### 7.5 NEXTAUTH_URL Ekle

```
NAME:  NEXTAUTH_URL
VALUE: https://coskunyayci-5zzk.vercel.app
ENVS:  ☑ Production

(Preview/Development için optional)
```

---

## ADIM 8: VERCEL REDEPLOY

### 8.1 Deployments Sayfasına Git

```
Vercel Dashboard
  ↓
  "Deployments" (top)
  ↓
  Latest deployment
  ↓
  3-dot menu (...)
  ↓
  "Redeploy"
```

### 8.2 Redeploy Başlasın

```
⏳ Status: "Queued for building"
↓
⏳ "Building..."
↓
✅ "Ready"  (2-3 dakika)
```

### 8.3 Logs Kontrol Et (hata varsa)

```
Deployments
  ↓
  Latest
  ↓
  "Logs" tab
  ↓
  Scroll down
  ↓
  Look for database connection messages
```

---

## ADIM 9: FINAL VERIFICATION

### 9.1 Site Açılıyor mu?

```
https://coskunyayci-5zzk.vercel.app
→ Açılmalı
→ Products görülmeli
→ Hata yok
```

### 9.2 API Endpoint'i Test Et

```
https://coskunyayci-5zzk.vercel.app/api/products

Expected:
{
  "products": [
    { "name": "Klasik Baklava", "variants": [...] },
    { "name": "Kare Baklava", ... },
    ...
  ]
}
```

### 9.3 Local Login Test

```bash
# Proje kök'te:
npm run dev

# Browser:
http://localhost:3000/auth/login

# Credentials:
Email:    serdchef@gmail.com
Password: TempPassword123!

# Expected:
✅ Login başarılı
✅ Admin dashboard'a yönlendir
```

---

## 🎯 CHECKPOINT

| Step | Task | Status |
|------|------|--------|
| 1 | Supabase hesabı oluştur | ✅ |
| 2 | Proje oluştur (coskun-yayci-baklava) | ✅ |
| 3 | CONNECTION_STRING al | ✅ |
| 4 | .env.local dosyası | ✅ |
| 5 | `npx prisma migrate dev` | ✅ |
| 6 | `npx prisma db seed` | ✅ |
| 7 | Prisma Studio verify | ✅ |
| 8 | Vercel env variables | ✅ |
| 9 | Vercel redeploy | ✅ |
| 10 | Site test | ✅ |

---

## ❌ SORUN GIDERME

### Error: "URL must start with postgresql://"

```
Çözüm: DATABASE_URL formatını kontrol et
- Supabase'ten FULL URI kopyala
- Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
- postgres:// değil, postgresql:// kullan
```

### Error: "Authentication failed against database"

```
Çözüm:
1. Password doğru mu?
2. HOST doğru mu?
3. Supabase'te user = "postgres" mi?
4. Supabase'de data password bulmuş muyum?
```

### Error: "Database seed failed"

```
Çözüm:
1. npx prisma generate
2. npx prisma migrate dev --name fix_schema
3. npx prisma db seed
```

### Vercel'de "Database not found" hatası

```
Çözüm:
1. DATABASE_URL Vercel'de doğru mu?
2. Redeploy çalışmış mı?
3. Vercel logs'ta hata var mı?
   (Deployments → Logs → Scroll down)
```

---

## 📋 TAMAMLAMA LISTESI

```
✅ Supabase proje oluşturuldu (coskun-yayci-baklava)
✅ DATABASE_URL alındı
✅ .env.local dosyası oluşturuldu
✅ Prisma migration başarılı
✅ Seed tamamlandı (16 products + SUPER_ADMIN)
✅ Prisma Studio: 16 products + 64 variants görüldü
✅ Vercel env variables eklendi
✅ Vercel redeploy başarılı
✅ Site açılıyor (https://coskunyayci-5zzk.vercel.app)
✅ API test başarılı (/api/products)
✅ Local login test başarılı

NEXT: Phase 2 - Google OAuth
```

---

## 🚀 QUICK COMMAND REFERENCE

```bash
# All-in-one (Supabase password için kısa komutlar)

# 1. Proje dizinine gir
cd c:\Users\x\Desktop\coskunyaycibaklava

# 2. .env.local dosyasını oluştur (Supabase CONNECTION_STRING'i değiştir)
echo 'DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"' > .env.local

# 3. Validate
npx prisma validate

# 4. Migrate
npx prisma migrate dev --name "initial_postgres_setup"

# 5. Seed
npx prisma db seed

# 6. Verify
npx prisma studio  # http://localhost:5555

# 7. Vercel environment variables (manual - dashboard'dan)

# 8. Local test
npm run dev  # http://localhost:3000/auth/login
```

---

**SUPABASE SETUP REHBERI TAMAMLANMIŞTIR** 🎉

Sorular veya sorunlar varsa, PHASE1_SUPABASE_SETUP.md veya PHASE1_IMPLEMENTATION.md'ye bakınız.
