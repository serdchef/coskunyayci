param([string]$DbProvider = "sqlite")

Write-Host ""
Write-Host "Setup: Sarayin Omurgasi"
Write-Host ""

# Read current schema
$schema = Get-Content "prisma/schema.prisma" -Raw

# Determine provider and URL
if ($DbProvider -eq "postgresql" -or $DbProvider -eq "postgres") {
    $provider = "postgresql"
    $dbUrl = Read-Host "Enter Supabase DATABASE_URL (postgresql://...)"
} else {
    $provider = "sqlite"
    $dbUrl = "file:./prisma/dev.db"
}

# Update schema temporarily
$newSchema = $schema -replace 'provider = "(sqlite|postgresql)"', "provider = `"$provider`""
Set-Content "prisma/schema.prisma" $newSchema

Write-Host "Using: $provider"
Write-Host "URL: $dbUrl"
Write-Host ""

# Create .env.local
$secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })

$env_content = @"
DATABASE_URL="$dbUrl"
NEXTAUTH_SECRET="$secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
"@

Set-Content ".env.local" $env_content
Write-Host "Created: .env.local"
Write-Host ""

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

Write-Host "Running migrations..."
npx prisma migrate dev --name "initial_phase1_setup"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Seeding database..."
    npx ts-node prisma/seed.ts
    
    Write-Host ""
    Write-Host "========================================"
    Write-Host "SETUP COMPLETE"
    Write-Host "========================================"
    Write-Host ""
    Write-Host "Admin: serdraal@gmail.com"
    Write-Host "Password: TempPassword123!"
    Write-Host ""
    Write-Host "Run: npm run dev"
    Write-Host ""
} else {
    Write-Host "ERROR during setup"
}

# Restore original schema provider
if ($DbProvider -ne "postgresql" -and $DbProvider -ne "postgres") {
    Set-Content "prisma/schema.prisma" $schema
    Write-Host "Schema restored to original provider"
}
