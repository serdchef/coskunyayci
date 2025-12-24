# 🏛️ PHASE 3 DEPLOYMENT: VERCEL PRODUCTION CHECKLIST

**Status**: Ready for Final Activation  
**Date**: December 24, 2025  
**SUPER_ADMIN**: serdraal@gmail.com  
**Production URL**: https://coskunyayci-5zzk.vercel.app

---

## 📋 PRE-DEPLOYMENT REQUIREMENTS

### 1. ✅ NEXTAUTH_SECRET - Session Encryption Key

**Status**: ✅ Already Generated & Stored in `.env.local`

Current Value in Local `.env.local`:
```
NEXTAUTH_SECRET="gMUuEnvKywrbaI7GPtVL53CSxD8joXfd"
```

**For Vercel Production**:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select Project: `coskunyayci-5zzk`
3. Go to **Settings > Environment Variables**
4. Add new variable:
   - Name: `NEXTAUTH_SECRET`
   - Value: `gMUuEnvKywrbaI7GPtVL53CSxD8joXfd`
   - Environments: Production, Preview, Development

**If you need a NEW secret** (for security rotation):
```bash
# macOS/Linux
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToHexString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

### 2. 🔄 DATABASE URL - PostgreSQL Migration

**Current Local Setup**:
```
DATABASE_URL="file:./prisma/dev.db"  # SQLite (local only)
```

**For Vercel Production** - Switch to PostgreSQL:

#### Option A: Supabase (Recommended for Vercel)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project or use existing
3. Get connection string from **Settings > Database > Connection String**
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public`

#### Option B: Neon (PostgreSQL)
1. Go to [Neon Console](https://console.neon.tech/)
2. Create database
3. Get connection string

#### Add to Vercel:
1. Vercel Dashboard > Settings > Environment Variables
2. Add `DATABASE_URL` with PostgreSQL connection string
3. Add `SHADOW_DATABASE_URL` (for schema migrations)
   - Same provider, different database name (e.g., append `_shadow`)

---

### 3. 🔐 Google OAuth - Redirect URI Fix

**Current Error**: Invalid Redirect URI

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select Project
3. Go to **APIs & Services > Credentials**
4. Select OAuth 2.0 Client ID
5. Under **Authorized JavaScript origins**, add:
   - `https://coskunyayci-5zzk.vercel.app`
6. Under **Authorized redirect URIs**, add:
   ```
   https://coskunyayci-5zzk.vercel.app/api/auth/callback/google
   ```
7. Save

**Verify in Vercel Environment Variables**:
```
GOOGLE_CLIENT_ID="1049177101410-q6dskgielp2monlo7k7usi358sb871mg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
NEXTAUTH_URL="https://coskunyayci-5zzk.vercel.app"
```

---

### 4. 💳 Stripe Webhook Configuration

**Current Status**: Endpoint configured to Vercel URL

**Verify Webhook Setup**:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Endpoint should be: `https://coskunyayci-5zzk.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy Signing Secret: `whsec_...`

**Add to Vercel**:
```
STRIPE_WEBHOOK_SECRET="whsec_your_secret_from_stripe"
STRIPE_SECRET_KEY="sk_test_your_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
```

---

### 5. 🍷 OpenAI Configuration

**Status**: API key ready

1. Get key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to Vercel:
   ```
   OPENAI_API_KEY="sk-proj-your-key-here"
   OPENAI_MODEL="gpt-4-turbo-preview"
   ```

---

## 🏛️ SUPER_ADMIN ACTIVATION

### Auto-Assignment Logic (Already Implemented)

**When serdraal@gmail.com logs in via Google OAuth**:

1. `auth.ts` (Line 113-119) checks:
   ```typescript
   const isSuperAdmin = _profile.email === 'serdraal@gmail.com';
   
   return {
     id: _profile.sub,
     email: _profile.email,
     name: _profile.name,
     phone: null,
     role: isSuperAdmin ? 'SUPER_ADMIN' : 'CUSTOMER',
     locale: _profile.locale?.startsWith('tr') ? 'tr' : 'en',
   };
   ```

2. On first login, `signIn` callback (Line 193-210) creates user with SUPER_ADMIN role
3. JWT token is populated with role (Line 218)
4. Session has role available (Line 226)

**Test Steps**:
1. Clear browser cookies
2. Go to `https://coskunyayci-5zzk.vercel.app/auth/login`
3. Click "Login with Google"
4. Use serdraal@gmail.com
5. Should be redirected to `/admin` or see admin controls

---

## 📊 SCHEMA MIGRATION STRATEGY

### Changes Made to `prisma/schema.prisma`:

✅ **Changed datasource** from SQLite to PostgreSQL:
```diff
- provider = "sqlite"
+ provider = "postgresql"
+ shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
```

✅ **Enhanced User model** with fields for Google OAuth:
```diff
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    name      String?
+   phone     String?
    password  String?
    role      String   @default("CUSTOMER")
+   locale    String   @default("en")
    createdAt DateTime @default(now())
+   updatedAt DateTime @updatedAt
    orders    Order[]
    addresses Address[]
  }
```

✅ **Enhanced Order model** for Stripe reconciliation:
```diff
  model Order {
    id         String      @id @default(cuid())
    userId     String?
-   user       User?       @relation(fields: [userId], references: [id])
+   user       User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
    items      OrderItem[]
    addressId  String?
-   address    Address?    @relation(fields: [addressId], references: [id])
+   address    Address?    @relation(fields: [addressId], references: [id], onDelete: SetNull)
    totalPrice Float
    status     String      @default("CONFIRMED")
+   stripePaymentId String?
    createdAt  DateTime    @default(now())
    updatedAt  DateTime    @updatedAt

    @@index([userId])
    @@index([createdAt])
+   @@index([status])
  }
```

---

## 🚀 DEPLOYMENT WORKFLOW

### Step 1: Local Testing with PostgreSQL
```bash
# Install Supabase CLI or use local PostgreSQL
# Update DATABASE_URL in .env.local to PostgreSQL

# Run migrations
npm run prisma:migrate

# Test locally
npm run dev

# Test Google OAuth: Use "Dev Mode" callback or ngrok
```

### Step 2: Supabase Setup (Production Database)
```bash
1. Create Supabase project
2. Note connection string
3. Add SHADOW_DATABASE_URL for migrations
4. Deploy schema
```

### Step 3: Update Vercel Environment Variables
```
✓ NEXTAUTH_SECRET
✓ NEXTAUTH_URL (already set to https://coskunyayci-5zzk.vercel.app)
✓ DATABASE_URL (PostgreSQL)
✓ SHADOW_DATABASE_URL (for migrations)
✓ GOOGLE_CLIENT_ID
✓ GOOGLE_CLIENT_SECRET
✓ STRIPE_SECRET_KEY
✓ STRIPE_WEBHOOK_SECRET
✓ OPENAI_API_KEY
```

### Step 4: Update OAuth Credentials
- Google Cloud Console: Add Vercel URL to Authorized URIs
- Stripe: Verify webhook endpoint URL

### Step 5: Push to GitHub
```bash
git add .
git commit -m "Phase 3: PostgreSQL migration & Vercel deployment"
git push
```

Vercel will auto-deploy when you push to `main` branch.

### Step 6: Verify Production
```
1. Visit https://coskunyayci-5zzk.vercel.app
2. Click "Login with Google"
3. Use serdraal@gmail.com
4. Should see Admin Dashboard
5. Try placing test order with Stripe
```

---

## 🛡️ SECURITY CHECKLIST

- [ ] NEXTAUTH_SECRET is unique (32+ chars, hex encoded)
- [ ] DATABASE_URL uses PostgreSQL (never SQLite in production)
- [ ] GOOGLE_CLIENT_SECRET is kept secret (only in Vercel Env Vars)
- [ ] STRIPE_SECRET_KEY is kept secret (never in frontend)
- [ ] Webhook signing secrets are verified in code
- [ ] serdraal@gmail.com is the only automatic SUPER_ADMIN
- [ ] No credentials hardcoded in git repo
- [ ] .env.local is in .gitignore
- [ ] Rate limiting enabled for API routes

---

## 📞 TROUBLESHOOTING

### Error: "Invalid Redirect URI"
→ Add https://coskunyayci-5zzk.vercel.app/api/auth/callback/google to Google Cloud Console

### Error: "Database connection failed"
→ Verify DATABASE_URL format and PostgreSQL server is running
→ Check SHADOW_DATABASE_URL exists

### Error: "Invalid session token"
→ Regenerate NEXTAUTH_SECRET and update all environments

### Error: "Stripe webhook not received"
→ Verify signing secret in .env matches Stripe dashboard
→ Check webhook endpoint URL is public and responding

### serdraal@gmail.com NOT becoming SUPER_ADMIN
→ Clear browser cookies
→ Check auth.ts line 113 has correct email
→ Verify Google OAuth is working first

---

## 📈 NEXT PHASE ROADMAP

After Phase 3 activation:

**Phase 3.5**: AI Sommelier Launch
- [ ] Create `/api/sommelier` endpoint
- [ ] Connect OpenAI API for recommendations
- [ ] Train on 16-product dataset

**Phase 4**: Notification System
- [ ] Twilio SMS/WhatsApp integration
- [ ] Order tracking notifications
- [ ] Promotional campaigns

**Phase 5**: Analytics & Optimization
- [ ] PostHog integration
- [ ] Conversion funnel analysis
- [ ] A/B testing framework

---

**Generated**: December 24, 2025  
**Author**: GitHub Copilot  
**Vision**: Transform Coşkun Yayci's premium baklava into a global digital experience 🌍
