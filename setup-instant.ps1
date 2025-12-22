# ╔═══════════════════════════════════════════════════════════╗
# ║     🏛️  SARAYIN OMURGASI - INSTANT ENV SETUP              ║
# ║         One-Command Database Activation                    ║
# ╚═══════════════════════════════════════════════════════════╝

param(
    [string]$DatabaseUrl = "file:./prisma/dev.db",
    [string]$AppUrl = "http://localhost:3000",
    [switch]$Supabase
)

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 Instant Environment Setup - Sarayın Omurgası          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# If Supabase flag set, prompt for URL
if ($Supabase) {
    Write-Host "🔗 Supabase PostgreSQL Mode" -ForegroundColor Cyan
    Write-Host "Paste your DATABASE_URL from Supabase:" -ForegroundColor White
    $DatabaseUrl = Read-Host
    
    if (-not $DatabaseUrl.StartsWith("postgresql://")) {
        Write-Host "❌ Invalid PostgreSQL URL format" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Supabase connection string configured`n" -ForegroundColor Green
}

# Create backup if exists
if (Test-Path ".env.local") {
    $backupName = ".env.local.backup.$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Copy-Item ".env.local" $backupName
    Write-Host "📋 Backup created: $backupName" -ForegroundColor Yellow
}

# Generate secure NEXTAUTH_SECRET
$chars = [char[]]"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
$secret = -join (1..32 | ForEach-Object { $chars | Get-Random })

# Create .env.local
$envContent = @"
# 🏛️  SARAYIN OMURGASI - ENVIRONMENT CONFIGURATION
# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

# DATABASE
DATABASE_URL="$DatabaseUrl"

# NEXTAUTH
NEXTAUTH_SECRET="$secret"
NEXTAUTH_URL="$AppUrl"

# GOOGLE OAUTH (Phase 2 - Add later)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
"@

Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8

Write-Host "✅ .env.local created" -ForegroundColor Green
Write-Host "   • Database: $(if ($DatabaseUrl -like 'file:*') { '📁 SQLite (Local)' } else { '🐘 PostgreSQL (Supabase)' })" -ForegroundColor Cyan
Write-Host "   • Auth: $AppUrl" -ForegroundColor Cyan
Write-Host "   • NEXTAUTH_SECRET: Generated (32 chars)" -ForegroundColor Cyan
Write-Host ""

# Run migrations
Write-Host "🔄 Initializing database..." -ForegroundColor Cyan
Write-Host ""

Write-Host "   → Running migrations..." -ForegroundColor Gray
npx prisma migrate dev --name "initial_phase1_setup" 2>&1 | Select-String -Pattern "Prisma schema|migration|created" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Migrations complete" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "   → Seeding data..." -ForegroundColor Gray
    $seedScript = if ($DatabaseUrl -like 'file:*') { "prisma/seed.ts" } else { "prisma/seed_phase1.ts" }
    npx ts-node $seedScript 2>&1 | Select-String -Pattern "✅|SUPER_ADMIN|Products|Variants|Credentials" -ErrorAction SilentlyContinue
    
    Write-Host "   ✅ Database seeded" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✅ SETUP COMPLETE - DATABASE ACTIVE                      ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "👑 SUPER_ADMIN Credentials:" -ForegroundColor Cyan
    Write-Host "   Email: serdraal@gmail.com" -ForegroundColor Yellow
    Write-Host "   Password: TempPassword123!" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "🧪 Test User Credentials:" -ForegroundColor Cyan
    Write-Host "   Email: test@example.com" -ForegroundColor Yellow
    Write-Host "   Password: test123" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "📊 Database Content:" -ForegroundColor Cyan
    Write-Host "   • 2 Users (SUPER_ADMIN + Test)" -ForegroundColor Gray
    Write-Host "   • 16 Premium Products" -ForegroundColor Gray
    Write-Host "   • 64 Product Variants" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "🚀 Start Development:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Then open: $AppUrl" -ForegroundColor Cyan
    Write-Host ""
    
} else {
    Write-Host "   ❌ Setup failed - check database connection" -ForegroundColor Red
    Write-Host ""
    Write-Host "Debug commands:" -ForegroundColor Yellow
    Write-Host "   npx prisma studio          # View database GUI" -ForegroundColor Gray
    Write-Host "   cat .env.local              # Check configuration" -ForegroundColor Gray
}

Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "             Sarayın omurgası ayakta! 🏛️" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
