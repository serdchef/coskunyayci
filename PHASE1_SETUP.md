# Phase 1 Setup Guide: Database + Auth + Email

## 🎯 Overview
This guide documents the Phase 1 implementation of the Coşkun Yaycı platform, focusing on database persistence, authentication, and email notifications.

## ✅ Completed Features

### 1. Database Schema (PostgreSQL/Supabase)
- ✅ Updated Prisma schema to use PostgreSQL
- ✅ User model with NextAuth support (locale, isActive, lastLoginAt)
- ✅ Order model with proper relationships
- ✅ OrderItem model with productName
- ✅ Address model for customer addresses
- ✅ Existing models maintained (B2BProfile, Product, etc.)

### 2. Authentication (NextAuth.js)
- ✅ Already configured with Prisma adapter
- ✅ Credentials provider (email/password)
- ✅ Google OAuth provider
- ✅ Protected routes middleware
- ✅ Session management with JWT

### 3. Email Service (Resend)
- ✅ Resend integration with React Email
- ✅ Order confirmation email template (Ghost style, luxury design)
- ✅ Emails sent to both customer and admin
- ✅ Beautiful responsive HTML emails

### 4. API Endpoints
- ✅ POST /api/orders - Create new order with database persistence
- ✅ GET /api/orders/[id] - Get order details by ID
- ✅ GET /api/orders/my-orders - Get authenticated user's orders
- ✅ Email sending integrated into order creation

### 5. Checkout Flow
- ✅ Updated to POST to real API
- ✅ Real order IDs generated
- ✅ Database persistence
- ✅ Error handling and loading states

### 6. Success Page
- ✅ Fetches real order data from API
- ✅ Displays order items and details
- ✅ Shows email confirmation message
- ✅ Loading and error states

### 7. Middleware Protection
- ✅ Protected /siparislerim route (requires authentication)
- ✅ Redirects to login with callback URL

## 🔧 Environment Variables Required

Create a `.env.local` file with the following variables:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="your-secret-here-minimum-32-characters"
# Generate with: openssl rand -base64 32

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Resend Email Service
RESEND_API_KEY="re_your_api_key_here"
ADMIN_EMAIL="admin@coskunyayci.com"

# Other existing variables...
```

## 📝 Setup Instructions

### 1. Database Setup (Supabase)

1. Create a Supabase project at https://supabase.com
2. Get your PostgreSQL connection string from Settings > Database
3. Add it to `.env.local` as `DATABASE_URL`
4. Run migrations:

```bash
npx prisma migrate dev --name init
```

5. Generate Prisma client:

```bash
npx prisma generate
```

### 2. Resend Email Setup

1. Sign up at https://resend.com
2. Get your API key
3. Add to `.env.local` as `RESEND_API_KEY`
4. Verify your domain or use test mode

### 3. NextAuth Setup

1. Generate a secret:
```bash
openssl rand -base64 32
```

2. Add to `.env.local` as `NEXTAUTH_SECRET`

3. (Optional) Set up Google OAuth:
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:4000/api/auth/callback/google`
   - Add client ID and secret to `.env.local`

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:4000

## 🧪 Testing the Flow

### End-to-End Order Flow:

1. **Add items to cart**
   - Navigate to `/products`
   - Add products to cart

2. **Checkout**
   - Go to `/checkout`
   - Fill in customer details and address
   - Fill in payment card info (mock payment)
   - Submit order

3. **Order Created**
   - Order saved to database
   - Email sent to customer and admin
   - Redirected to success page

4. **Success Page**
   - Real order ID displayed
   - Order details fetched from database
   - Shows items, total, and address

5. **Check Email**
   - Customer receives confirmation email
   - Admin receives notification email
   - Beautiful Ghost-style design

## 📊 Database Schema

### Key Models:

```prisma
model User {
  id          String      @id @default(cuid())
  email       String      @unique
  password    String?
  name        String
  phone       String?
  role        String      @default("USER")
  locale      String      @default("tr")
  isActive    Boolean     @default(true)
  lastLoginAt DateTime?
  orders      Order[]
  addresses   Address[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Order {
  id         String      @id @default(cuid())
  userId     String?
  status     String      @default("CONFIRMED")
  totalPrice Float
  items      OrderItem[]
  address    String?
  city       String?
  district   String?
  zipCode    String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  productName String
  quantity    Int
  price       Float
  createdAt   DateTime @default(now())
}

model Address {
  id        String   @id @default(cuid())
  userId    String
  street    String
  city      String
  district  String
  zipCode   String
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🎨 Email Design

The email templates follow a **Ghost-inspired luxury minimal design**:
- Clean, spacious layout
- Gold accent color (#d4af37)
- Professional typography
- Responsive design
- Order summary with itemized list
- Clear next steps
- Brand footer

## 🚀 Next Steps (Phase 2)

- [ ] Admin dashboard for order management
- [ ] Order status updates via email
- [ ] Real payment integration (Stripe)
- [ ] User profile page
- [ ] Order tracking page
- [ ] Analytics and reporting

## 📁 File Structure

```
lib/
  email.ts                    # Email service with Resend
  emails/
    OrderConfirmation.tsx     # Email template
  
app/
  api/
    orders/
      route.ts                # POST /api/orders, GET /api/orders
      [id]/
        route.ts              # GET /api/orders/[id]
      my-orders/
        route.ts              # GET /api/orders/my-orders
  checkout/
    page.tsx                  # Checkout form
    success/
      [orderId]/
        page.tsx              # Order success page

prisma/
  schema.prisma               # Database schema
  
middleware.ts                 # Route protection
```

## 🔒 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT session tokens
- ✅ Protected routes with middleware
- ✅ CSRF protection (NextAuth)
- ✅ XSS protection headers
- ✅ Environment variable validation

## 🐛 Troubleshooting

### Prisma Client not found
```bash
npx prisma generate
```

### Database connection error
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure network access is allowed

### Email not sending
- Verify RESEND_API_KEY is valid
- Check Resend dashboard for errors
- Ensure sender email is verified

### TypeScript errors
```bash
npm run type-check
```

### Build errors
```bash
npm run build
```

## 📚 Documentation Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Resend Documentation](https://resend.com/docs)
- [React Email Documentation](https://react.email)
- [Supabase Documentation](https://supabase.com/docs)

---

**Status**: Phase 1 implementation complete and ready for testing
**Last Updated**: December 21, 2024
