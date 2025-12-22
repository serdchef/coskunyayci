#!/bin/bash

# Sarayın Omurgası - One-Command Database Activation

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Instant Environment Setup                               ║"
echo "║  Sarayın Omurgası - Database Activation                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Default to SQLite
DB_URL="${1:-file:./prisma/dev.db}"
APP_URL="${2:-http://localhost:3000}"

# Create backup
if [ -f ".env.local" ]; then
    BACKUP=".env.local.backup.$(date +%s)"
    cp ".env.local" "$BACKUP"
    echo "Backup created: $BACKUP"
fi

# Generate secret
SECRET=$(openssl rand -base64 32)

# Create .env.local
cat > ".env.local" << EOF
# Sarayın Omurgası - Environment Configuration
# Generated: $(date)

# DATABASE
DATABASE_URL="$DB_URL"

# NEXTAUTH
NEXTAUTH_SECRET="$SECRET"
NEXTAUTH_URL="$APP_URL"

# GOOGLE OAUTH (Phase 2)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EOF

echo "✅ .env.local created"
echo ""

# Run migrations
echo "Setting up database..."
npx prisma migrate dev --name "initial_phase1_setup" --skip-generate

if [ $? -eq 0 ]; then
    echo "Seeding data..."
    npx ts-node prisma/seed.ts
    
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║  Setup Complete!                                          ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Admin: serdraal@gmail.com / TempPassword123!"
    echo "Test: test@example.com / test123"
    echo ""
    echo "npm run dev"
    echo ""
else
    echo "Setup failed - check database"
fi
