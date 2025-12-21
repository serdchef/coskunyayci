# 🏛️ PHASE 1: ZÜMRÜT TEMELLER — LANSMAN REHBERI

**Tarih:** 21 Aralık 2025  
**Durum:** Kod hazır, veritabanı ve e-posta hizmetleri bekleniyor  
**Hedef:** İlk gerçek siparişi D+0 içinde işleyip, "Dijital Milat" kutlamak

---

## 📋 KRITIK YOL (CRITICAL PATH) — 15 Dakika

### ✅ ADIM 1: Supabase Kurulumu (5 dk)

**Hedef:** PostgreSQL veritabanını Istanbul regionunda oluşturmak

1. **supabase.com** → Sign Up / Login
2. **"New Project"** tıkla
3. **Proje Detayları:**
   - Name: `coskunyayci` (veya `baklavaci`)
   - Region: **Istanbul (Turkey)** — MUTLAKA seç!
   - Password: Güçlü şifre (örn: `P@ssw0rd!Zm2025`)
4. **Bekle** — Proje oluşturulacak (~2-3 dk)
5. **Sol Panel** → **Settings** → **Database**
6. **Connection String** bölümü → **"Connection pooling"** seç
7. **PostgreSQL** → Bağlantı stringini kopyala:
   ```
   postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
   ```
8. Bu `DATABASE_URL` değerin.

### ✅ ADIM 2: Resend API Anahtarı (2 dk)

**Hedef:** E-posta gönderme API key'ini almak

1. **resend.com** → Sign Up / Login
2. **Dashboard** → **API Keys** (sol menu)
3. **New API Key** veya mevcut key'i kopyala (başlayacak: `re_...`)
4. Bu `RESEND_API_KEY` değerin.

### ✅ ADIM 3: `.env.local` Oluşturma (2 dk)

**Hedef:** Lokal ortam değişkenlerini ayarlamak

1. Proje kökünde (`.gitignore`'da zaten hidden):
   ```bash
   # Windows PowerShell ile
   Copy-Item ".env.local.template" ".env.local"
   ```
   
   Veya manuel olarak `.env.local` dosyası oluştur ve doldur:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres"
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxx"
   ADMIN_EMAIL="serdchef@gmail.com"
   ```

2. **Dosyayı kaydet** (Ctrl+S)

### ✅ ADIM 4: Prisma Komutları (5 dk)

**Hedef:** Veritabanı tablolarını oluşturmak ve client'ı güncellemek

```bash
# Terminal'de (proje kökünden)

# 1️⃣ Prisma client'ı güncelle
npx prisma generate

# 2️⃣ Veritabanında tabloları oluştur (Supabase'e gönder)
npx prisma db push
# → "Create User, Order, OrderItem, Address tables?" → Y (yes)

# 3️⃣ [Optional] Veritabanını görsel olarak gözlemle
npx prisma studio
# → http://localhost:5555 açılacak
```

### ✅ ADIM 5: Dev Server'ı Başlat

```bash
npm run dev
# Terminal çıktısı:
# ▲ Next.js 14.2.33
# - Local:        http://localhost:4000
```

---

## 🎯 LANSMAN TESTI — END-TO-END (E2E)

### Test 1️⃣: Checkout Sayfasına Gir

1. Browser: **http://localhost:4000/checkout**
2. Formu doldur:
   - Ad: `Test Müşteri`
   - E-mail: `test@example.com`
   - Ürün: Artan boş checkout'tan bir şey seç
   - Adres: `İstanbul, Kadıköy, Merkez Mah, 34000`

3. **"Sipariş Oluştur"** butonunu tıkla

### Test 2️⃣: Veritabanında Kontrol

1. Terminal'de (ayrı pencere):
   ```bash
   npx prisma studio
   ```
2. **User** → Test e-mail var mı?
3. **Order** → Yeni Order ID var mı?
4. **OrderItem** → Ürünler kaydedildi mi?

### Test 3️⃣: E-posta Kontrolü

1. **Resend Dashboard** → **Emails** tab
2. `test@example.com` adresine sipariş onayı gönderildi mi?
3. E-postada "Ghost Gold" tasarımı var mı?

### Test 4️⃣: Success Sayfası

1. Checkout'tan başarı sonrası redirect edildi mi?
2. **http://localhost:4000/checkout/success/[orderId]** sayfasında Order ID görülüyor mu?

---

## 🚨 TROUBLESHOOTING

### "Cannot find module 'resend'"

**Neden:** `npm install` çalışmamış

**Çözüm:**
```bash
npm install
npm run type-check  # TypeScript doğrulaması
```

### "ECONNREFUSED: Connection refused (DATABASE_URL)"

**Neden:** `.env.local` eksik veya yanlış

**Çözüm:**
1. `.env.local` dosyasının var olup olmadığını kontrol et
2. `DATABASE_URL` değer doğru mu? (Supabase Connection String)
3. Terminal'i yeniden başlat (`npm run dev` yeniden çalıştır)

### "OrderConfirmationEmail is not a function"

**Neden:** Email template import hatası

**Çözüm:**
```bash
npx prisma generate
npm run type-check
```

---

## 📊 SUCCESS CHECKLIST

Aşağıdaki tüm kutular ✅ olduğunda "Dijital Milat" kutlanabilir:

- [ ] Supabase projesi oluşturuldu (Istanbul region)
- [ ] DATABASE_URL Supabase'den kopyalandı
- [ ] Resend API key alındı
- [ ] `.env.local` dosyası dolduruldu
- [ ] `npx prisma db push` başarıyla tamamlandı
- [ ] `npm run dev` sunucu açıldı
- [ ] Checkout form başarıyla dolduruldu
- [ ] Veritabanında Order kaydı görüldü
- [ ] E-posta Resend dashboard'unda gözüktü
- [ ] Success sayfasında Order ID gösterildi

---

## 🎉 SONRAKI AŞAMALAR (Phase 2+)

1. **NextAuth Integration** — Google OAuth + Email Login
2. **Admin Dashboard** — Sipariş yönetimi & status tracking
3. **Payment Integration** — Stripe checkout
4. **SMS Notifications** — Twilio via Resend
5. **Production Deployment** — Vercel + Supabase Production

---

**"Zümrüt Temeller beton olacak. Hadiiiiii!" 👊**
