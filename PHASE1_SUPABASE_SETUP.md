# 🏛️ PHASE 1: SUPABASE SETUP
## PostgreSQL Veritabanı Kurulumu (Adım-Adım)

**Durum:** Prisma schema PostgreSQL'e çevrildi ✅  
**Sıradaki:** DATABASE_URL bağlantı dizesi Supabase'den alınmalı

---

## ⚡ HIZLI BAŞLANGÇ (5 dakika)

### 1. Supabase Hesabı Oluştur

```
https://supabase.com → "Start your project" → Sign Up
Email: serdchef@gmail.com
Password: [Güçlü şifre belirle]
```

### 2. Yeni Proje Oluştur

```
Supabase Dashboard → "New Project"

Project Details:
- Name: coskun-yayci-baklava
- Database Password: [Güçlü şifre - not et!]
- Region: EU (Ireland) veya Türkiye (eğer var)
- Plan: Free tier uygun

→ "Create new project" tıkla
```

**⏳ Bekleme:** 1-2 dakika...

### 3. Connection String Al

```
Dashboard → Settings → Database

POSTGRESQL CONNECTION:
Host: [xxxx.supabase.co]
Database: postgres
User: postgres
Password: [oluşturduğun şifre]
Port: 5432

FULL URL (kopyala):
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

ÖRNEK:
postgresql://postgres:abc123xyz@aaaabbbbccccdddd.supabase.co:5432/postgres
```

### 4. .env.local Dosyasını Oluştur

Terminal'de proje kök dizininde çalıştır:

```bash
echo 'DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"' > .env.local
```

**Örnek (gerçek değerleri kullan):**

```bash
echo 'DATABASE_URL="postgresql://postgres:MySecurePassword123@aaaabbbbccccdddd.supabase.co:5432/postgres"' > .env.local
```

### 5. Verify

```bash
cat .env.local
# Çıktı: DATABASE_URL="postgresql://..."
```

---

## ✅ KOMUT ÇALIŞTIRILMA SIRALAMASI

Tüm bu adımları tamamladıktan sonra, terminalde sırasıyla çalıştır:

### Step 1: Prisma Schema'yı Doğrula

```bash
npx prisma validate
# ✅ Prisma schema is valid
```

### Step 2: Database'i Introspect Et (isteğe bağlı)

```bash
npx prisma db pull --force
# Eğer var olan tablolar varsa introspect et
```

### Step 3: Migration Oluştur ve Çalıştır

```bash
npx prisma migrate dev --name "initial_postgres_setup"
# Sorular:
# - Migration name: initial_postgres_setup (önceden ayarlandı)
# - Generate Prisma Client: Y
# - Run migrations: Y

# ✅ Çıktı:
# Your database has been created with success
# Migration `20251222_initial_postgres_setup` has been applied
```

### Step 4: Seed Script Çalıştır

```bash
npx prisma db seed

# ✅ Çıktı:
# 🏛️ PHASE 1: Starting PostgreSQL seed with SUPER_ADMIN setup...
# ✅ SUPER_ADMIN User Created/Updated:
#    Email: serdchef@gmail.com
#    Role: SUPER_ADMIN
# ✅ Test User Created:
#    Email: test@example.com
# ✅ Products Created: 16
# ✅ Product Variants Created: 64
```

### Step 5: Prisma Studio'da Verify

```bash
npx prisma studio
# Browser'da: http://localhost:5555
# Kontrol et:
# - User table: 2 users (SUPER_ADMIN + test user)
# - Product table: 16 products
# - ProductVariant table: 64 variants
```

### Step 6: Vercel Environment Variables

Vercel Dashboard'a git:

```
https://vercel.com → Project: coskunyayci-5zzk → Settings → Environment Variables

Ekle:
NAME: DATABASE_URL
VALUE: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
ENVIRONMENTS: Production, Preview, Development
→ Save

Ekle:
NAME: NEXTAUTH_SECRET
VALUE: [64-char random string - aşağıda gösteriş]
ENVIRONMENTS: Production, Preview, Development
→ Save

Ekle:
NAME: NEXTAUTH_URL
VALUE: https://coskunyayci-5zzk.vercel.app
ENVIRONMENTS: Production
→ Save
```

### 64-Char Random String Oluştur

```bash
openssl rand -base64 32 | tr -d '\n='

# Çıktı (örnek):
# abc123defghijklmnopqrstuvwxyz...

# Bunu NEXTAUTH_SECRET olarak Vercel'e kopyala
```

### Step 7: Vercel Redeploy

```
Vercel Dashboard → Deployments → Latest → "Redeploy"

Bekleme: 2-3 dakika...

✅ Verification: https://coskunyayci-5zzk.vercel.app
```

---

## 🔒 GÜVENLIK KONTROL LİSTESİ

```
[ ] .env.local dosyası oluşturuldu
[ ] DATABASE_URL .env.local'da doğru (PostgreSQL URL)
[ ] .gitignore'da .env.local var (commit edilmeyecek)
[ ] Supabase password notuma kaydedildi (1Password/LastPass)
[ ] Vercel Environment Variables:
    [ ] DATABASE_URL eklendi
    [ ] NEXTAUTH_SECRET eklendi
    [ ] NEXTAUTH_URL eklendi
[ ] Local: npx prisma studio çalıştı (16 products, 64 variants görüldü)
[ ] Vercel: Deployment başarılı (no database errors)
```

---

## ⚠️ SORUN GIDERME

### Error: "URL must start with postgresql://"

```
→ DATABASE_URL formatını kontrol et
→ Supabase Connection Info'dan kopyala (postgres:// kullanma, postgresql:// kullan)
```

### Error: "P1000: Authentication failed"

```
→ Supabase password doğru mu?
→ Host URL doğru mu?
→ User email doğru mu (postgres)?
```

### Error: "Database seed failed"

```bash
# Mevcut migration sorununu temizle
npx prisma migrate reset  # ⚠️ Tüm data silinir!

# Sonra tekrar
npx prisma migrate dev --name "initial_postgres_setup"
npx prisma db seed
```

### Local çalışıyor ama Vercel'de "Database not found"

```
→ Vercel'deki DATABASE_URL doğru mu?
→ Vercel redeployed mi?
→ Vercel logs'ta PostgreSQL hatası var mı?
   Vercel Dashboard → Deployments → Logs
```

---

## 📋 PHASE 1 COMPLETION CHECKLIST

```
✅ Prisma schema PostgreSQL'e çevrildi
✅ .env.local oluşturuldu
✅ npx prisma migrate dev başarılı
✅ npx prisma db seed başarılı
  ✅ SUPER_ADMIN user (serdchef@gmail.com) oluşturuldu
  ✅ 16 baklava products oluşturuldu
  ✅ 64 product variants oluşturuldu
✅ Vercel Environment Variables eklendi
✅ Vercel redeploy başarılı
✅ Local Prisma Studio: 16 products + 64 variants görüldü
[ ] Vercel site açılıyor (database bağlantısı yok)
[ ] Vercel logs temiz (no database errors)
```

---

## 🎯 PHASE 1 SONRASI

Phase 1 tamamlandığında, Git'e commit et:

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "🏛️ Phase 1: PostgreSQL migration + SUPER_ADMIN setup"
git push origin main
```

**NOT:** `.env.local` asla Git'e commit etme!

---

## 🚀 NEXT PHASE

Phase 1 sona erdikten sonra, Phase 2 başlat:

- Google OAuth integration
- Enhanced middleware security
- NextAuth.js password reset
- Email verification (Phase 4 için hazırlık)

---

**PHASE 1 = SARAYIN OMURGASI KURULU ✅**
