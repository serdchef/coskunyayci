param([string]$DatabaseUrl = "postgresql://localhost/coskunyayci")

Write-Host ""
Write-Host "Setup: Sarayin Omurgasi - Database Activation"
Write-Host ""

if (Test-Path ".env.local") {
    $backup = ".env.local.backup." + (Get-Date -Format 'yyyyMMdd_HHmmss')
    Copy-Item ".env.local" $backup
    Write-Host "Backup created: $backup"
}

$secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })

$env_content = @"
DATABASE_URL="$DatabaseUrl"
NEXTAUTH_SECRET="$secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
"@

Set-Content -Path ".env.local" -Value $env_content

Write-Host "Created: .env.local"
Write-Host ""
Write-Host "Running: npx prisma migrate dev"

npx prisma migrate dev --name "initial_phase1_setup"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Running: npx ts-node prisma/seed.ts"
    npx ts-node prisma/seed.ts
    
    Write-Host ""
    Write-Host "SETUP COMPLETE"
    Write-Host ""
    Write-Host "Admin: serdraal@gmail.com"
    Write-Host "Password: TempPassword123!"
    Write-Host ""
}
