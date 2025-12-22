# 🏛️ Sarayın Omurgası - ONE-CLICK Database Activation Guide

## ⚡ Quick Start (Fastest Path)

### Option 1: SQLite (Local Testing)
```powershell
# Update schema to SQLite temporarily
$schema = Get-Content prisma\schema.prisma
$schema -replace 'provider = "postgresql"', 'provider = "sqlite"' | Set-Content prisma\schema.prisma

# Run setup
.\setup.ps1 "file:./prisma/dev.db"

# Restore PostgreSQL provider
$schema -replace 'provider = "sqlite"', 'provider = "postgresql"' | Set-Content prisma\schema.prisma
```

### Option 2: Supabase PostgreSQL (Recommended)
```powershell
# 1. Create Supabase project: https://supabase.com
# 2. Copy connection string from Settings > Database > Connection Pooling
# 3. Run setup with your URL:

.\setup.ps1 "postgresql://[user]:[password]@[host]:[port]/[database]"
```

## 📋 What the Script Does

```
1. Create .env.local with:
   - DATABASE_URL
   - NEXTAUTH_SECRET (auto-generated)
   - NEXTAUTH_URL (http://localhost:3000)

2. Run Prisma migrations:
   - npx prisma migrate dev

3. Seed database with:
   - 2 Users (serdraal@gmail.com + test@example.com)
   - 16 Premium Products
   - 64 Product Variants
```

## 🔐 Credentials After Setup

```
Admin Access:
- Email: serdraal@gmail.com
- Password: TempPassword123!
- Role: SUPER_ADMIN

Test User:
- Email: test@example.com
- Password: test123
- Role: CUSTOMER
```

## 🚀 After Setup

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000

# Access admin dashboard
# /admin (with serdraal@gmail.com)
```

## 📚 Files Modified

```
Created/Updated:
├── .env.local (NEW)
├── prisma/dev.db (auto-created with SQLite)
└── Database schema initialized
```

## ⚠️ Important Notes

1. **Change Password**: Update TempPassword123! immediately after first login
2. **Keep .env.local Secure**: Never commit to git
3. **Database URL**: Ensure format matches provider
4. **Backups**: Script auto-creates .env.local backups

## 🔧 Manual Setup (If Script Fails)

```bash
# 1. Create .env.local
cat > .env.local << EOF
DATABASE_URL="your_connection_string_here"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
EOF

# 2. Run migrations
npx prisma migrate dev --name initial_setup

# 3. Seed database
npx ts-node prisma/seed.ts

# 4. Start dev
npm run dev
```

## 📞 Troubleshooting

### "No database available"
→ Update DATABASE_URL in .env.local
→ Ensure Supabase/local database is running

### "Migration failed"
```bash
npx prisma migrate reset
npx prisma migrate dev --name initial
```

### "Port 3000 in use"
```bash
npm run dev -- -p 3001
```

### "Seed failed"
```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

---

**Ready?** Run the setup script and your database will be active in seconds! 🚀
