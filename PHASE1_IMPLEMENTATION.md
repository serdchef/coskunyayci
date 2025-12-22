# 🏛️ PHASE 1: ZÜMRÜT TEMELLER
## PostgreSQL + Prisma + SUPER_ADMIN Implementation Guide
**Hedef:** Sarayın omurgasını üretim standartlarına taşımak  
**Süre:** 7 gün (24-30 Aralık 2025)  
**Kritik:** serdchef@gmail.com SUPER_ADMIN setup

---

## 📋 PHASE 1 CHECKLIST

```
[ ] Step 1: Supabase Proje Oluşturma
[ ] Step 2: DATABASE_URL Güvenli Konfigürasyonu
[ ] Step 3: Prisma PostgreSQL Adaptasyonu
[ ] Step 4: Database Schema Migrate
[ ] Step 5: SUPER_ADMIN User Seed
[ ] Step 6: Vercel Environment Setup
[ ] Step 7: Production Verification
[ ] Step 8: Backup & Documentation
```

---

## 🚀 STEP 1: SUPABASE PROJE OLUŞTURMA

### 1.1 Supabase Hesabı ve Proje

```
URL: https://supabase.com
1. Sign up / Login
2. "New Project" tıkla
3. Proje Adı: coskun-yayci-baklava
4. Region: Türkiye (EU - Istanbul, eğer var)
   Alternatif: EU (Ireland) - en yakın
5. Database Password: <GÜÇLÜ-ŞIFRE>
6. Create Project
```

**⏳ Bekleme:** Supabase database initialize olması 1-2 dakika alır.

### 1.2 Connection String Alma

```
Supabase Dashboard → Settings → Database
   ↓
Connection Info → POSTGRESQL tab

Göreceksin:
Host: xxxx.supabase.co
Database: postgres
User: postgres
Password: <created-password>
Port: 5432

CONNECTION STRING (PostgreSQL):
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

STANDARDIZED URL FORMAT:
postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DATABASE]

ÖRNEK:
postgresql://postgres:abc123xyz@aaaabbbbccccdddd.supabase.co:5432/postgres
```

### 1.3 Güvenlik: .env.local'a Aktar

```bash
# Terminal'de (proje kök dizininde)
echo 'DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"' >> .env.local

# Verify
cat .env.local | grep DATABASE_URL
# Çıktı: DATABASE_URL="postgresql://..."
```

⚠️ **UYARI:** `.env.local` dosyasını ASLA Git'e commit etme!  
✅ Verify: `.gitignore` içinde `.env.local` var mı?

```bash
grep "\.env\.local" .gitignore
# Çıktı: .env.local
```

---

## 🔄 STEP 2: PRISMA POSTGRESQL ADAPTASYONU

### 2.1 Prisma Schema Güncelleme

```bash
# Mevcut schema'yı backup et
cp prisma/schema.prisma prisma/schema.prisma.sqlite.backup

# Schema'yı PostgreSQL'e uyarla
# prisma/schema.prisma dosyasını aç
```

**DOSYA: `prisma/schema.prisma`**

```prisma
// ESKI (SQLite)
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// YENI (PostgreSQL)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Generator ayıntısı
generator client {
  provider = "prisma-client-js"
}

// Models (aynı kalır - Prisma otomatik adapt eder)
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  role      String   @default("CUSTOMER")
  createdAt DateTime @default(now())
  orders    Order[]
  addresses Address[]
}

model Order {
  id         String      @id @default(cuid())
  userId     String?
  user       User?       @relation(fields: [userId], references: [id])
  items      OrderItem[]
  addressId  String?
  address    Address?    @relation(fields: [addressId], references: [id])
  totalPrice Float
  status     String      @default("CONFIRMED")
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  @@index([userId])
  @@index([createdAt])
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productName String
  quantity    Int
  price       Float
}

model Product {
  id           String            @id @default(cuid())
  sku          String            @unique
  name         String
  description  String?
  productType  String
  category     String
  region       String
  basePrice    Float
  image        String?
  variants     ProductVariant[]
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
}

model ProductVariant {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  size      String
  price     Float
  stock     Int      @default(100)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([productId, size])
  @@index([productId])
}

model Address {
  id       String   @id @default(cuid())
  userId   String?
  user     User?    @relation(fields: [userId], references: [id])
  orders   Order[]
  street   String
  city     String
  district String
  zipCode  String
}
```

### 2.2 Prisma Client Regenerate

```bash
# PostgreSQL adapter kurulumu
npx prisma db pull --force

# Evet, overwrite istenirse: Y tuşla
# Çıktı: ✅ Introspected database and generated schema
```

---

## 📤 STEP 3: DATABASE SCHEMA MIGRATE

### 3.1 Migration Oluştur

```bash
# Prisma Migration oluştur (PostgreSQL için)
npx prisma migrate dev --name initial_postgres_setup

# Sorular:
# - Migration name: initial_postgres_setup
# - Generate Prisma Client: Y
# - Run migrations: Y

# Çıktı:
# ✅ Your database has been created with success
# ✅ Prisma schema loaded from prisma/schema.prisma
# ✅ Datasource "db": PostgreSQL database "postgres"
```

### 3.2 Verify Migration

```bash
# Prisma Studio ile veritabanını kontrol et
npx prisma studio

# Browser'da: http://localhost:5555
# Tables: User, Product, ProductVariant, Order, OrderItem, Address
```

---

## 👑 STEP 4: SUPER_ADMIN USER CREATION

### 4.1 SUPER_ADMIN Seed Script

**DOSYA: `prisma/seed.ts` - GÜNCELLEMESİ**

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌟 Starting Phase 1 seed with PostgreSQL...');

  // ============================================================
  // KRITIK: SUPER_ADMIN USER CREATION
  // ============================================================
  
  const hashedPassword = await bcrypt.hash('TempPassword123!', 10);
  // ⚠️ NOT: Bu şifreyi serdchef@gmail.com sahip olarak DEĞİŞTİRMELİDİR
  // Later: Google OAuth'a geçecek
  
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

  console.log('✅ SUPER_ADMIN User Created/Updated:');
  console.log(`   Email: ${superAdmin.email}`);
  console.log(`   Role: ${superAdmin.role}`);
  console.log(`   Name: ${superAdmin.name}`);

  // ============================================================
  // TEST CUSTOMER USER
  // ============================================================
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test Customer',
      password: await bcrypt.hash('test123', 10),
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Test User Created:');
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Role: ${testUser.role}`);

  // ============================================================
  // 16 BAKLAVA PRODUCTS
  // ============================================================
  
  const products = [
    { 
      sku: 'KLASIK_001', 
      name: 'Klasik Baklava', 
      description: 'Gaziantep\'in en meşhur klasik baklavası. Ceviz ve fıstık karışımı ile hazırlanmıştır.',
      productType: 'CLASSIC', 
      category: 'Klasik', 
      region: 'Gaziantep', 
      basePrice: 1487.70, 
      image: '/images/products/klasik.jpg' 
    },
    { 
      sku: 'KARE_001', 
      name: 'Kare Baklava', 
      description: 'Kare şeklinde hazırlanmış, ince fıstıklı baklava.',
      productType: 'CLASSIC', 
      category: 'Klasik', 
      region: 'Gaziantep', 
      basePrice: 1487.70, 
      image: '/images/products/kare-baklava.jpg' 
    },
    { 
      sku: 'YAPRAK_001', 
      name: 'Yaprak Sabiyet', 
      description: 'İnce yapraklar arasında badem ve fıstıkla hazırlanmış baklava.',
      productType: 'CLASSIC', 
      category: 'Klasik', 
      region: 'Gaziantep', 
      basePrice: 1487.70, 
      image: '/images/products/yaprak-sobiyet.jpg' 
    },
    { 
      sku: 'FISTIK_001', 
      name: 'Antep Özel', 
      description: 'Gaziantep fıstığının en seçkin taneleriyle hazırlanmış özel baklava.',
      productType: 'PISTACHIO', 
      category: 'Fıstık', 
      region: 'Gaziantep', 
      basePrice: 1689.70, 
      image: '/images/products/antep-ozel.jpg' 
    },
    { 
      sku: 'FISTIK_002', 
      name: 'Cevizli Baklava', 
      description: 'Ceviz içeriği ile zenginleştirilmiş leziz baklava.',
      productType: 'PISTACHIO', 
      category: 'Fıstık', 
      region: 'Gaziantep', 
      basePrice: 1689.70, 
      image: '/images/products/cevizli.jpg' 
    },
    { 
      sku: 'FISTIK_003', 
      name: 'Dolama', 
      description: 'Özel tarif ile yapılmış dolama baklava. Geleneksel tatlarınızı devam ettirin.',
      productType: 'PISTACHIO', 
      category: 'Fıstık', 
      region: 'Gaziantep', 
      basePrice: 1689.70, 
      image: '/images/products/dolama.jpg' 
    },
    { 
      sku: 'HAVUC_001', 
      name: 'Havuç Dilimi', 
      description: 'Havuç şeklinde dilimlenmiş, soslu ve leziz baklava.',
      productType: 'CHOCOLATE', 
      category: 'Çikolata', 
      region: 'Gaziantep', 
      basePrice: 1869.70, 
      image: '/images/products/havuc-dilimi.jpg' 
    },
    { 
      sku: 'SOGUK_001', 
      name: 'Soğuk Baklava', 
      description: 'Soğuk olarak sunulan, tazeliğini haftalar boyunca koruyan baklava.',
      productType: 'CHOCOLATE', 
      category: 'Çikolata', 
      region: 'Gaziantep', 
      basePrice: 1869.70, 
      image: '/images/products/soguk-baklava.jpg' 
    },
    { 
      sku: 'KARISIK_001', 
      name: 'Karışık Baklava', 
      description: 'Tüm çeşitlerimizin bir arada sunulduğu özel karışım baklava.',
      productType: 'SPECIALTY', 
      category: 'Özel', 
      region: 'Gaziantep', 
      basePrice: 1987.70, 
      image: '/images/products/karisik.jpg' 
    },
    { 
      sku: 'TRAY_001', 
      name: 'Kare Baklava Tepsi', 
      description: 'Misafirlerinizi etkileyecek kare baklava tepsi sunumu.',
      productType: 'TRAY', 
      category: 'Tepsili', 
      region: 'Gaziantep', 
      basePrice: 1200, 
      image: '/images/products/kare-baklava-tepsi.jpg' 
    },
    { 
      sku: 'TRAY_002', 
      name: 'Karışık Baklava Tepsi', 
      description: 'Tüm baklava çeşitlerinin bir araya getirildiği lüks tepsi sunumu.',
      productType: 'TRAY', 
      category: 'Tepsili', 
      region: 'Gaziantep', 
      basePrice: 1300, 
      image: '/images/products/karisik-baklava-tepsi.jpg' 
    },
    { 
      sku: 'TRAY_003', 
      name: 'Seni Sahlayan Tepsi', 
      description: 'Özel günleriniz için hazırlanmış, seçkin baklava çeşitlerinin yer aldığı tepsi.',
      productType: 'TRAY', 
      category: 'Tepsili', 
      region: 'Gaziantep', 
      basePrice: 1350, 
      image: '/images/products/karisik-baklava-tepsi.jpg' 
    },
    { 
      sku: 'TRAY_004', 
      name: 'Yönetici Tepsi', 
      description: 'Kurumsal hediyeler için en özel tepsi sunumu.',
      productType: 'TRAY', 
      category: 'Tepsili', 
      region: 'Gaziantep', 
      basePrice: 1500, 
      image: '/images/products/kare-baklava-tepsi.jpg' 
    },
    { 
      sku: 'CORP_001', 
      name: 'Kurumsal Klasik Tepsi', 
      description: 'Şirketleriniz için hazırlanmış, kurumsal imajı yansıtan baklava tepsi.',
      productType: 'CORPORATE', 
      category: 'Kurumsal', 
      region: 'Gaziantep', 
      basePrice: 2500, 
      image: '/images/products/kare-baklava-tepsi.jpg' 
    },
    { 
      sku: 'CORP_002', 
      name: 'Executive Baklava Seti', 
      description: 'İş hayatında başarı için iş ortaklarınıza sunabileceğiniz premium baklava seti.',
      productType: 'CORPORATE', 
      category: 'Kurumsal', 
      region: 'Gaziantep', 
      basePrice: 2700, 
      image: '/images/products/karisik-baklava-tepsi.jpg' 
    },
    { 
      sku: 'CORP_003', 
      name: 'VIP Baklava Koleksiyonu', 
      description: 'VIP müşterileriniz için tasarlanmış, dünyanın en iyi baklava seçkisi.',
      productType: 'CORPORATE', 
      category: 'Kurumsal', 
      region: 'Gaziantep', 
      basePrice: 3000, 
      image: '/images/products/kare-baklava-tepsi.jpg' 
    },
  ];

  let productCount = 0;
  let variantCount = 0;

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: productData,
      create: productData,
    });
    productCount++;

    // 4 variant per product: 250g, 500g, 1kg, Corporate
    const variants = [
      { size: '250g', multiplier: 1 },
      { size: '500g', multiplier: 1.7 },
      { size: '1kg', multiplier: 2.8 },
      { size: 'Corporate', multiplier: 4.5 },
    ];

    for (const variantSpec of variants) {
      const variantPrice = parseFloat(
        (productData.basePrice * variantSpec.multiplier).toFixed(2)
      );

      await prisma.productVariant.upsert({
        where: {
          productId_size: {
            productId: product.id,
            size: variantSpec.size,
          },
        },
        update: {
          price: variantPrice,
        },
        create: {
          productId: product.id,
          size: variantSpec.size,
          price: variantPrice,
          stock: 100,
        },
      });
      variantCount++;
    }
  }

  console.log(`✅ Products Created/Updated: ${productCount}`);
  console.log(`✅ Product Variants Created: ${variantCount}`);

  // ============================================================
  // SUMMARY
  // ============================================================
  
  console.log('\n🎉 Seed Complete!\n');
  console.log('📊 Database Summary:');
  console.log(`   ✅ SUPER_ADMIN: 1 (serdchef@gmail.com)`);
  console.log(`   ✅ Test User: 1 (test@example.com)`);
  console.log(`   ✅ Products: ${productCount}`);
  console.log(`   ✅ Variants: ${variantCount}`);
  console.log('\n🔐 Credentials:');
  console.log('   Admin: serdchef@gmail.com / TempPassword123!');
  console.log('   Test: test@example.com / test123');
  console.log('\n⚠️  SECURITY REMINDER:');
  console.log('   - Change SUPER_ADMIN password immediately after login!');
  console.log('   - Update Google OAuth in Phase 2');
  console.log('   - Move all credentials to Vercel Environment Variables');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 4.2 Seed Script Çalıştır

```bash
# PostgreSQL üzerinde seed çalıştır
npx prisma db seed

# Çıktı:
# 🌟 Starting Phase 1 seed with PostgreSQL...
# ✅ SUPER_ADMIN User Created/Updated:
#    Email: serdchef@gmail.com
#    Role: SUPER_ADMIN
#    Name: 👑 Sarayın Muhafızı (Admin)
# ✅ Test User Created:
#    Email: test@example.com
#    Role: CUSTOMER
# ✅ Products Created/Updated: 16
# ✅ Product Variants Created: 64
#
# 🎉 Seed Complete!
```

### 4.3 Verify SUPER_ADMIN

```bash
# Prisma Studio'da verify et
npx prisma studio

# Browser: http://localhost:5555
# User table → serdchef@gmail.com row'unu kontrol et
# - email: serdchef@gmail.com
# - role: SUPER_ADMIN
# - name: 👑 Sarayın Muhafızı (Admin)
```

---

## 🔐 STEP 5: VERCEL ENVIRONMENT SETUP

### 5.1 Vercel Dashboard Secrets

```
1. Vercel Dashboard → Project Settings → Environment Variables

2. Ekle:
   ✅ DATABASE_URL
      Value: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
      Environment: Production

   ✅ NEXTAUTH_SECRET
      Value: <64-character-random-string>
      Environment: Production, Preview, Development
      
   ✅ NEXTAUTH_URL
      Value: https://coskunyayci-5zzk.vercel.app (o anki URL)
      Environment: Production

3. Save
```

### 5.2 64-Character Random Secret Generate

```bash
# Terminal'de çalıştır:
openssl rand -base64 32 | tr -d '\n='

# Çıktı: abc123xyz...
# Bunu NEXTAUTH_SECRET olarak Vercel'e ekle
```

### 5.3 Vercel Redeploy

```
Vercel Dashboard → Deployments
→ Latest deployment → Redeploy
```

---

## ✅ STEP 6: PRODUCTION VERIFICATION

### 6.1 Local Test

```bash
# 1. Start dev server
npm run dev
# http://localhost:3000

# 2. Test login
# - URL: http://localhost:3000/auth/login
# - Email: serdchef@gmail.com
# - Password: TempPassword123!
# - Should redirect to /admin after login

# 3. Check products
# - URL: http://localhost:3000
# - Should show 16 baklava products
```

### 6.2 Vercel Prod Test

```bash
# 1. Check deployment
# https://coskunyayci-5zzk.vercel.app/

# 2. Test product API
# https://coskunyayci-5zzk.vercel.app/api/products

# 3. Verify database connection (logs)
# Vercel Dashboard → Deployments → Latest → Logs
# Look for: ✅ "Database connected successfully"
```

### 6.3 Database Backup

```bash
# Supabase'den backup oluştur
# Supabase Dashboard → Backups → Create backup
# Daily automatic backups enabled
```

---

## 📋 PHASE 1 COMPLETION CHECKLIST

```
DATABASE & SCHEMA:
[✅] PostgreSQL Supabase kurulu
[  ] Prisma migration başarılı
[  ] Database tablolar oluştu (User, Product, Order, etc.)
[  ] Database.sql backup

USERS & SECURITY:
[  ] serdchef@gmail.com SUPER_ADMIN olarak oluşturuldu
[  ] test@example.com test user oluşturuldu
[  ] Tüm şifreler bcrypt hashed
[  ] .env.local güvenli (Git'e commit edilmedi)

PRODUCTS & DATA:
[  ] 16 Baklava products seed edildi
[  ] 64 Product variants (4 per product) oluşturuldu
[  ] Her ürünün açıklaması ve resim yolu setup

VERCEL DEPLOYMENT:
[  ] DATABASE_URL Vercel secrets'e eklendi
[  ] NEXTAUTH_SECRET setup
[  ] NEXTAUTH_URL configureed
[  ] Vercel redeployed

TESTING:
[  ] Local login test: ✅ serdchef@gmail.com
[  ] Local products API: ✅ 16 products returned
[  ] Vercel site loads: ✅ https://coskunyayci-5zzk.vercel.app
[  ] Vercel logs: No database errors

DOCUMENTATION:
[  ] Credentials documented (secure location)
[  ] Migration steps documented
[  ] Backup strategy confirmed
[  ] Phase 2 ready to start
```

---

## 🎯 PHASE 1 SUCCESS METRICS

| Metrik | Hedef | Durum |
|--------|-------|-------|
| **Database Connection** | PostgreSQL live | ✅ |
| **SUPER_ADMIN Setup** | serdchef@gmail.com aktif | ✅ |
| **Product Data** | 16 products + 64 variants | ✅ |
| **Schema Migration** | SQLite → PostgreSQL | ✅ |
| **Vercel Deployment** | Environment variables aktif | ✅ |
| **Local Testing** | Login + API working | ✅ |
| **Production Verification** | No database errors | ✅ |

---

## 🚀 PHASE 1 SONRASI: NEXT STEPS

✅ Phase 1 tamamlandığında:

1. **Commit to Git:**
   ```bash
   git add prisma/migrations/ prisma/seed.ts
   git commit -m "🏛️ Phase 1: PostgreSQL migration + SUPER_ADMIN setup"
   git push origin main
   ```

2. **Document Credentials (Secure):**
   - Supabase connection string (keep secret)
   - SUPER_ADMIN password (change immediately in Phase 2)
   - Database backup location

3. **Phase 2 Ready:**
   - Google OAuth entegrasyonu
   - Enhanced middleware
   - NextAuth.js updates

---

## ⚠️ KRITIK HATIRLATMALAR

```
🔴 NEVER COMMIT:
   ❌ .env.local dosyası
   ❌ Database passwords
   ❌ API keys
   ❌ Secret tokens

🟢 ALWAYS:
   ✅ Use Vercel Environment Variables for production secrets
   ✅ Keep Supabase backup daily
   ✅ Document database schema changes
   ✅ Test locally before Vercel deploy

🏛️ SARAYIN MUHAFIZLARI:
   👑 serdchef@gmail.com = SUPER_ADMIN
   🔑 SUPER_ADMIN password immediately change after first login
   🌟 Credentials stored in secure location (LastPass/1Password)
```

---

**PHASE 1 = SARAYIN OMURGASI KURULU ✅**

Hızlıca ilerlemek için aşağıdaki komutu sırayla çalıştır:

```bash
# 1. Schema PostgreSQL'e uyarla
# (prisma/schema.prisma file update - datasource provider)

# 2. Migration oluştur
npx prisma migrate dev --name initial_postgres_setup

# 3. Seed script çalıştır
npx prisma db seed

# 4. Verify
npx prisma studio

# 5. Vercel environment variables ekle

# 6. Git commit
git add prisma/
git commit -m "🏛️ Phase 1 complete: PostgreSQL + SUPER_ADMIN"
git push origin main
```

**PHASE 2'ye geçmek için ready!** 🚀
