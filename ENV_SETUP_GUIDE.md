# 🏛️ Sarayın Omurgası - One-Click Database Activation

## ⚡ Quick Start (5 dakika)

```powershell
# 1. Run the automation script
.\setup-env.ps1

# 2. Choose your setup:
#    - 1 = SQLite (local, recommended for development)
#    - 2 = Supabase PostgreSQL (production ready)

# 3. Provide Supabase URL or use default

# 4. Migrations run automatically

# 5. Database populated with 16 products + 64 variants
```

## 📝 Configuration Options

### Option 1: SQLite (Default Development)
- **Best for:** Local development, testing
- **Setup time:** Instant
- **File:** `prisma/dev.db` (auto-created)

```
DATABASE_URL="file:./prisma/dev.db"
```

### Option 2: Supabase PostgreSQL (Production)
- **Best for:** Staging, production
- **Setup time:** 2-3 minutes
- **Steps:**
  1. Create account: https://supabase.com
  2. New project (free tier available)
  3. Copy connection string from Settings > Database > Connection Pooling
  4. Paste in setup script

```
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require"
```

## 🔐 Security Notes

After setup completes, you'll have:
- ✅ `.env.local` with all configurations
- ✅ `NEXTAUTH_SECRET` auto-generated (secure)
- ✅ Database initialized with schema
- ✅ SUPER_ADMIN user: `serdraal@gmail.com` / `TempPassword123!`
- ✅ Test user: `test@example.com` / `test123`

**⚠️ Important:**
1. Change TempPassword123! immediately after login
2. Never commit `.env.local` to git
3. Keep NEXTAUTH_SECRET secure

## 🚀 Next: Start Development

```bash
npm run dev
```

Then open: http://localhost:3000

## 📊 What Gets Created

```
Database:
├── Users (2)
│   ├── serdraal@gmail.com (SUPER_ADMIN) 👑
│   └── test@example.com (CUSTOMER)
├── Products (16)
│   ├── Premium Baklava Collections
│   ├── Seasonal Specials
│   └── Gift Sets
└── Variants (64)
    ├── Different sizes
    ├── Box types
    └── Packaging options
```

## 🆘 Troubleshooting

### "Cannot find .env.local"
```powershell
# Run setup script again
.\setup-env.ps1
```

### "Database connection failed"
- Check DATABASE_URL in .env.local
- Verify Supabase credentials if using PostgreSQL
- Try SQLite first (option 1)

### "Migrations error"
```bash
# Reset and retry
npx prisma migrate reset
npx prisma migrate dev
npx ts-node prisma/seed.ts
```

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

## 📚 Additional Resources

- [PHASE1_LAUNCH_COMPLETE.md](PHASE1_LAUNCH_COMPLETE.md) - Full setup guide
- [MASTERPLAN_EXCELLENCE.md](MASTERPLAN_EXCELLENCE.md) - Architecture overview
- [SUPABASE_SETUP_VISUAL_GUIDE.md](SUPABASE_SETUP_VISUAL_GUIDE.md) - Visual walkthrough

---

**Ready? Run this command:**

```powershell
.\setup-env.ps1
```

Sarayın omurgası canlanıyor! 🏛️✨
