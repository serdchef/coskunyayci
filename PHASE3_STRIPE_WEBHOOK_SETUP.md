# 🏛️ PHASE 3: STRIPE WEBHOOK & DATABASE RECONCILIATION

**Status**: ✅ Ready for Production  
**Last Updated**: December 24, 2025

---

## 📊 Current Implementation Status

### ✅ Schema Changes (PostgreSQL Ready)

**Order Model** has been enhanced:
```prisma
model Order {
  // ... existing fields ...
  status     String      @default("CONFIRMED")
  stripePaymentId String? // NEW: For payment reconciliation
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  
  @@index([status])      // NEW: Query optimization
}
```

### ✅ Webhook Handler

**Location**: [app/api/webhooks/stripe/route.ts](app/api/webhooks/stripe/route.ts)

**Supported Events**:
- `payment_intent.succeeded` → Update order to IN_OVEN
- `payment_intent.payment_failed` → Update order to PAYMENT_FAILED
- `checkout.session.completed` → Create order from session

**Current Limitation**: Uses metadata query (should use direct field)

---

## 🔧 REQUIRED DATABASE MIGRATION

### Step 1: Prepare Migration

```bash
# Generate migration based on schema changes
npm run prisma:migrate -- --name stripe_payment_tracking
```

### Step 2: Review Migration

Prisma will create migration file. Verify it includes:
```sql
ALTER TABLE "Order" ADD COLUMN "stripePaymentId" TEXT;
ALTER TABLE "Order" ADD INDEX "Order_status_idx" ("status");
```

### Step 3: Apply Migration

```bash
# Local testing
npm run prisma:migrate -- dev

# Production (Vercel) - automatic on deploy
# Or manual: vercel env pull && npx prisma migrate deploy
```

---

## 🔌 WEBHOOK ENDPOINT CONFIGURATION

### Setup in Stripe Dashboard

1. **Go to**: [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)

2. **Add Endpoint**:
   - URL: `https://coskunyayci-5zzk.vercel.app/api/webhooks/stripe`
   - Events to send:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
     - `checkout.session.completed`

3. **Get Signing Secret**:
   - Copy `whsec_...` value
   - Add to Vercel: `STRIPE_WEBHOOK_SECRET`

### Verification

```bash
# Test webhook from Stripe Dashboard
# Or use Stripe CLI locally:
stripe listen --forward-to localhost:4000/api/webhooks/stripe

# In another terminal, trigger event:
stripe trigger payment_intent.succeeded
```

---

## 🔄 PAYMENT FLOW (End-to-End)

### 1. Customer Initiates Payment
```
User clicks "Pay with Stripe"
↓
[app/api/checkout/route.ts] creates Stripe Session
↓
Session ID → Frontend
```

### 2. Stripe Payment Processing
```
User confirms payment in Stripe Checkout
↓
Payment processed
↓
Stripe sends webhook to our endpoint
```

### 3. Webhook Received
```
POST /api/webhooks/stripe
Headers: stripe-signature (signed with STRIPE_WEBHOOK_SECRET)
Body: Stripe Event (payment_intent.succeeded)

→ Verify signature with webhook secret
→ Extract paymentIntentId
→ Find matching order
→ Update stripePaymentId field
→ Update order status to IN_OVEN
```

### 4. Order Updated
```
Order in Database:
- stripePaymentId: "pi_1234567890"
- status: "IN_OVEN"
- updatedAt: [current timestamp]
```

---

## 💾 DATABASE SCHEMA FOR STRIPE

### Order Model Relationships

```
┌─────────────────────────────────────────────┐
│              Order                          │
├─────────────────────────────────────────────┤
│ id              String @id                  │
│ userId          String? (nullable)          │
│ addressId       String? (nullable)          │
│ totalPrice      Float                       │
│ status          String                      │
│ stripePaymentId String? (NEW - nullable)    │
│ createdAt       DateTime                    │
│ updatedAt       DateTime                    │
└─────────────────────────────────────────────┘
        ↓           ↓
      User       Address
    (foreign)   (foreign)
```

### Order Status Flow

```
CONFIRMED (Initial)
    ↓ (Customer pays successfully)
IN_OVEN
    ↓ (Preparing)
READY_FOR_PICKUP
    ↓ (Shipped)
DELIVERED
    ↓
COMPLETED

(Failure path)
CONFIRMED → PAYMENT_FAILED → CANCELLED
```

---

## 🛡️ WEBHOOK SECURITY

### ✅ Implemented Safeguards

1. **Signature Verification**:
   - Every webhook is signed with STRIPE_WEBHOOK_SECRET
   - Webhook handler verifies signature before processing
   - Invalid signatures are rejected with 400 status

2. **Secret Management**:
   - STRIPE_WEBHOOK_SECRET stored only in Vercel env vars
   - Never logged or exposed
   - Different secret per Stripe account (test vs prod)

3. **Idempotency**:
   - Stripe retries failed webhooks multiple times
   - Our code should handle duplicate events gracefully
   - Check `stripePaymentId` field to avoid double-processing

### ⚠️ Best Practices

- Always verify webhook signature
- Use HTTPS (Vercel provides this)
- Handle webhook timeouts gracefully (return 200 quickly)
- Log all webhook events for debugging
- Test with Stripe CLI before deploying

---

## 📝 UPDATE WEBHOOK HANDLER (Recommended)

### Current Implementation

```typescript
// Current: Uses metadata query (slower)
await prisma.order.updateMany({
  where: { metadata: { path: ['paymentIntentId'], equals: paymentIntent.id } },
  data: { status: 'IN_OVEN' },
});
```

### Recommended Implementation

```typescript
// Better: Direct field query (faster)
await prisma.order.update({
  where: { stripePaymentId: paymentIntent.id },
  data: { status: 'IN_OVEN' },
});
```

**File to Update**: [app/api/webhooks/stripe/route.ts](app/api/webhooks/stripe/route.ts#L44)

---

## 🧪 TESTING CHECKLIST

### Local Testing
- [ ] Start dev server: `npm run dev`
- [ ] Create test order
- [ ] Use Stripe test card: `4242 4242 4242 4242`
- [ ] Use Stripe CLI: `stripe listen --forward-to localhost:4000/api/webhooks/stripe`
- [ ] Trigger test payment: `stripe trigger payment_intent.succeeded`
- [ ] Verify order status updated to IN_OVEN
- [ ] Check `stripePaymentId` is populated

### Production Testing (Vercel)
- [ ] Deploy to Vercel
- [ ] Register webhook endpoint in Stripe Dashboard
- [ ] Create test order with Stripe test key
- [ ] Verify webhook received (check Stripe Dashboard logs)
- [ ] Confirm order status updated in database
- [ ] Test with real card (small amount) if needed

---

## 📊 MONITORING & DEBUGGING

### Check Webhook Delivery

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click your endpoint
3. View recent webhook attempts
4. Check response status and body

### Enable Logging

In [app/api/webhooks/stripe/route.ts](app/api/webhooks/stripe/route.ts):

```typescript
console.log('[STRIPE_WEBHOOK]', {
  eventType: event.type,
  paymentId: paymentIntent?.id,
  status: paymentIntent?.status,
  orderStatus: updatedOrder?.status,
});
```

### Debug Connection Issues

If webhook endpoint shows "Failed" in Stripe Dashboard:

1. Check STRIPE_WEBHOOK_SECRET is correct
2. Verify Vercel deployment was successful
3. Check Vercel logs for errors
4. Test endpoint manually: `curl https://coskunyayci-5zzk.vercel.app/api/webhooks/stripe`

---

## 🚀 DEPLOYMENT STEPS

### 1. Update Vercel Environment

```
STRIPE_WEBHOOK_SECRET="whsec_your_secret_from_stripe"
STRIPE_SECRET_KEY="sk_test_your_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
```

### 2. Run Database Migration

```bash
# Option A: Local migration (test first)
npm run prisma:migrate -- dev

# Option B: Production migration (after deploy)
vercel env pull
npx prisma migrate deploy
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Phase 3: Add Stripe payment tracking"
git push
```

### 4. Update Stripe Dashboard

```
1. Add webhook endpoint
2. Set to receive: payment_intent.succeeded, etc.
3. Copy signing secret to Vercel
```

### 5. Verify

```
1. Go to https://coskunyayci-5zzk.vercel.app
2. Create test order
3. Use Stripe test card
4. Confirm webhook was received
5. Check order status in database
```

---

## 📞 TROUBLESHOOTING

### Problem: "Webhook not configured"
**Solution**: Check STRIPE_WEBHOOK_SECRET is set in Vercel and matches Stripe Dashboard

### Problem: "Signature verification failed"  
**Solution**: Verify webhook secret hasn't been rotated. Check Stripe Dashboard for latest secret.

### Problem: Order status not updating
**Solution**: Check webhook was received in Stripe Dashboard. Verify `stripePaymentId` field exists in schema.

### Problem: Duplicate orders created
**Solution**: Implement idempotency check - verify payment_id not already in database before creating.

---

## 🎯 NEXT MILESTONE

**After Webhook Activation**:
1. ✅ Stripe payments processed
2. ✅ Order status tracked
3. ✅ Ready for notifications (SMS/Email)
4. ✅ Ready for AI recommendations

**Phase 3.5: AI Sommelier** (Next Sprint)
- Recommend baklava based on payment history
- Personalized offers for returning customers
- ChatBot integration

---

**Generated**: December 24, 2025  
**For**: Phase 3 Activation  
**Owner**: serdraal@gmail.com (SUPER_ADMIN)  
**Vision**: Make every transaction a delightful experience 🌹
