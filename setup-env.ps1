# ╔═══════════════════════════════════════════════════════════╗
# ║     🏛️  SARAYIN OMURGASI - ENV SETUP AUTOMATION           ║
# ║           Phase 1: Lightning-Fast Database Setup           ║
# ╚═══════════════════════════════════════════════════════════╝

Write-Host "`n" -ForegroundColor Cyan
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 Coskunyayci - Environment Setup Wizard                ║" -ForegroundColor Cyan
Write-Host "║     Phase 1: Database Configuration & Initialization      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local already exists
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "📋 Current .env.local found. Creating backup..." -ForegroundColor Yellow
    Copy-Item $envFile "$envFile.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Host "✅ Backup created`n" -ForegroundColor Green
}

# Step 1: Database Configuration
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║  STEP 1: Database Configuration                           ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

Write-Host "Choose your database setup:" -ForegroundColor White
Write-Host "  1️⃣  SQLite (Local Development - Default)"
Write-Host "  2️⃣  PostgreSQL (Supabase Production)"
Write-Host "  3️⃣  Custom Database URL"
Write-Host ""

$dbChoice = Read-Host "Enter choice (1/2/3)"

$databaseUrl = ""

switch ($dbChoice) {
    "1" {
        $databaseUrl = "file:./prisma/dev.db"
        Write-Host "✅ SQLite selected: $databaseUrl`n" -ForegroundColor Green
    }
    "2" {
        Write-Host "`n🔗 Supabase PostgreSQL Setup:" -ForegroundColor Cyan
        Write-Host "   Visit: https://supabase.com/dashboard"
        Write-Host "   Create new project or use existing one"
        Write-Host "   Copy connection string from Settings > Database`n"
        
        $databaseUrl = Read-Host "Paste your Supabase DATABASE_URL"
        
        if (-not $databaseUrl.StartsWith("postgresql://")) {
            Write-Host "⚠️  Warning: URL doesn't look like a PostgreSQL connection string" -ForegroundColor Yellow
        }
        Write-Host "✅ Supabase PostgreSQL configured`n" -ForegroundColor Green
    }
    "3" {
        $databaseUrl = Read-Host "Enter your complete DATABASE_URL"
        Write-Host "✅ Custom database URL configured`n" -ForegroundColor Green
    }
    default {
        $databaseUrl = "file:./prisma/dev.db"
        Write-Host "✅ Using default SQLite setup`n" -ForegroundColor Green
    }
}

# Step 2: Authentication Keys
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║  STEP 2: NextAuth Configuration                           ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

# Generate NEXTAUTH_SECRET if not provided
Write-Host "Generating secure NEXTAUTH_SECRET..." -ForegroundColor Cyan
$nextAuthSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
Write-Host "✅ Secret generated (32 characters)`n" -ForegroundColor Green

# Get application URL
Write-Host "What's your application URL?" -ForegroundColor White
Write-Host "  • Local: http://localhost:3000"
Write-Host "  • Vercel: https://your-app.vercel.app"
Write-Host ""
$nextAuthUrl = Read-Host "Enter NEXTAUTH_URL (default: http://localhost:3000)"
if (-not $nextAuthUrl) {
    $nextAuthUrl = "http://localhost:3000"
}
Write-Host "✅ Auth URL configured: $nextAuthUrl`n" -ForegroundColor Green

# Step 3: Optional - Google OAuth (Phase 2)
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║  STEP 3: Optional Features (Phase 2)                      ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

$setupGoogle = Read-Host "Setup Google OAuth now? (y/n) - Recommended: skip for Phase 1"
$googleClientId = ""
$googleSecret = ""

if ($setupGoogle -eq "y" -or $setupGoogle -eq "Y") {
    Write-Host "`n🔐 Google OAuth Setup:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://console.cloud.google.com/"
    Write-Host "   2. Create new OAuth 2.0 credentials"
    Write-Host "   3. Set redirect URI: $nextAuthUrl/api/auth/callback/google`n"
    
    $googleClientId = Read-Host "Google Client ID"
    $googleSecret = Read-Host "Google Client Secret"
    Write-Host "✅ Google OAuth configured`n" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipping Google OAuth setup (Phase 2)`n" -ForegroundColor Yellow
}

# Step 4: Create .env.local
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║  STEP 4: Writing Configuration                            ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

$envContent = @"
# ═════════════════════════════════════════════════════════════
# 🏛️  SARAYIN OMURGASI - ENVIRONMENT CONFIGURATION
# ═════════════════════════════════════════════════════════════

# DATABASE
DATABASE_URL="$databaseUrl"

# NEXTAUTH
NEXTAUTH_SECRET="$nextAuthSecret"
NEXTAUTH_URL="$nextAuthUrl"

# GOOGLE OAUTH (Phase 2)
GOOGLE_CLIENT_ID="$googleClientId"
GOOGLE_CLIENT_SECRET="$googleSecret"

# ═════════════════════════════════════════════════════════════
# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# Setup completed by: Automation Script v1.0
# ═════════════════════════════════════════════════════════════
"@

Set-Content -Path $envFile -Value $envContent
Write-Host "✅ .env.local created successfully`n" -ForegroundColor Green

# Step 5: Database Migration
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║  STEP 5: Database Initialization                          ║" -ForegroundColor Blue
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Blue
Write-Host ""

Write-Host "Preparing database..." -ForegroundColor Cyan
Write-Host "  • npx prisma migrate dev --name initial" -ForegroundColor Gray
Write-Host "  • npx prisma db seed" -ForegroundColor Gray
Write-Host ""

$runMigrations = Read-Host "Run migrations and seed data now? (y/n)"

if ($runMigrations -eq "y" -or $runMigrations -eq "Y") {
    Write-Host "`n🔄 Running migrations..." -ForegroundColor Cyan
    npx prisma migrate dev --name "initial_phase1_setup"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migrations completed`n" -ForegroundColor Green
        
        Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
        if ($databaseUrl -like "*sqlite*" -or $databaseUrl -like "file:*") {
            npx ts-node prisma/seed.ts
        } else {
            npx ts-node prisma/seed_phase1.ts
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database seeded successfully`n" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Seeding had issues. Check the output above.`n" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Migration had issues. Check the output above.`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping migrations for now`n" -ForegroundColor Yellow
    Write-Host "Run these commands manually when ready:" -ForegroundColor Cyan
    Write-Host "  npx prisma migrate dev --name initial_phase1_setup" -ForegroundColor Gray
    Write-Host "  npx ts-node prisma/seed.ts" -ForegroundColor Gray
}

# Final Summary
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ SETUP COMPLETE                                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Configuration Summary:" -ForegroundColor White
Write-Host "  • Database: $(if ($databaseUrl -like 'file:*') { 'SQLite (Local)' } else { 'PostgreSQL (Supabase)' })" -ForegroundColor Cyan
Write-Host "  • Auth URL: $nextAuthUrl" -ForegroundColor Cyan
Write-Host "  • Google OAuth: $(if ($googleClientId) { '✅ Configured' } else { '⏭️  Phase 2' })" -ForegroundColor Cyan
Write-Host "  • File: .env.local ✅" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor White
Write-Host "  1. Start dev server: npm run dev" -ForegroundColor Gray
Write-Host "  2. Open browser: $nextAuthUrl" -ForegroundColor Gray
Write-Host "  3. Login with: serdraal@gmail.com / TempPassword123!" -ForegroundColor Gray
Write-Host "  4. Access admin dashboard: /admin" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor White
Write-Host "  • Phase 1: PHASE1_LAUNCH_COMPLETE.md" -ForegroundColor Gray
Write-Host "  • Setup Guide: PHASE1_SUPABASE_SETUP.md" -ForegroundColor Gray
Write-Host "  • Master Plan: MASTERPLAN_EXCELLENCE.md" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Remember:" -ForegroundColor Yellow
Write-Host "  ⚠️  Change TempPassword123! after first login" -ForegroundColor Yellow
Write-Host "  🔐 Keep NEXTAUTH_SECRET and database credentials secure" -ForegroundColor Yellow
Write-Host "  📈 Monitor logs in production" -ForegroundColor Yellow
Write-Host ""

Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                   Sarayın omurgası ayakta!" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
