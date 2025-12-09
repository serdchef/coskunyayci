# 🚀 Deployment Guide

## Vercel Deployment (Önerilen)

### 1. Vercel Project Oluşturma

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Login
vercel login

# Proje oluştur
vercel
```

### 2. Environment Variables (Vercel Dashboard)

Vercel Dashboard > Settings > Environment Variables

**Production Variables:**

```
DATABASE_URL=postgresql://user:pass@host:5432/prod_db
NEXTAUTH_URL=https://baklavaci.com
NEXTAUTH_SECRET=<64-char-secret>
OPENAI_API_KEY=sk-...
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
BUSINESS_PHONE_NUMBER=+905321234567
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=baklava-media-prod
NEXT_PUBLIC_S3_BUCKET_URL=https://baklava-media-prod.s3.eu-central-1.amazonaws.com
REDIS_URL=redis://:password@host:6379
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_APP_URL=https://baklavaci.com
```

### 3. Build & Deploy

```bash
# Staging
vercel

# Production
vercel --prod
```

### 4. Database Migration (Production)

```bash
# Vercel project'e bağlan
vercel link

# Environment variables'ı çek
vercel env pull

# Migration çalıştır
pnpm prisma migrate deploy
```

---

## AWS/EC2 Deployment (Alternatif)

### 1. EC2 Instance Setup

**Instance specs:**
- t3.medium veya daha güçlü
- Ubuntu 22.04 LTS
- 20GB+ storage

```bash
# SSH ile bağlan
ssh -i key.pem ubuntu@<ec2-ip>

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL kurulumu
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Redis kurulumu
sudo apt install redis-server -y
sudo systemctl start redis
sudo systemctl enable redis

# Nginx kurulumu
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# PM2 kurulumu (process manager)
sudo npm install -g pm2
```

### 2. Proje Deploy

```bash
# Proje dizini oluştur
mkdir -p /var/www/baklava-site
cd /var/www/baklava-site

# Git clone
git clone https://github.com/your-org/baklava-site.git .

# Dependencies
npm install -g pnpm
pnpm install --frozen-lockfile

# Environment
cp .env.example .env
nano .env  # Değerleri düzenle

# Build
pnpm build

# Prisma
pnpm prisma:generate
pnpm prisma migrate deploy
pnpm prisma:seed
```

### 3. PM2 Configuration

`ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'baklava-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '1G',
    },
    {
      name: 'baklava-worker',
      script: 'dist/worker/videoWorker.js',
      env: {
        NODE_ENV: 'production',
      },
      instances: 1,
      max_memory_restart: '512M',
    },
  ],
};
```

```bash
# PM2 ile başlat
pm2 start ecosystem.config.js

# Startup script
pm2 startup
pm2 save
```

### 4. Nginx Configuration

`/etc/nginx/sites-available/baklava`:

```nginx
upstream nextjs_upstream {
  server localhost:4000;
}

server {
  listen 80;
  server_name baklavaci.com www.baklavaci.com;

  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name baklavaci.com www.baklavaci.com;

  ssl_certificate /etc/letsencrypt/live/baklavaci.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/baklavaci.com/privkey.pem;

  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Gzip
  gzip on;
  gzip_vary on;
  gzip_min_length 1024;
  gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

  location / {
    proxy_pass http://nextjs_upstream;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/baklava /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d baklavaci.com -d www.baklavaci.com
```

---

## Docker Deployment

`Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/baklava
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  worker:
    build: .
    command: node dist/worker/videoWorker.js
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/baklava
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=baklava
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## Database Backup

### Automated Backup Script

`scripts/backup-db.sh`:

```bash
#!/bin/bash

# Config
DB_NAME="baklava_db"
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"

# Create backup
pg_dump $DB_NAME | gzip > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://baklava-backups/db/

# Keep only last 7 days locally
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

### Cron Job

```bash
# Edit crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /var/www/baklava-site/scripts/backup-db.sh
```

---

## Monitoring

### Health Check Endpoint

`app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Database check
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: 'Database connection failed' },
      { status: 500 }
    );
  }
}
```

### Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com
- **Datadog**: https://www.datadoghq.com

Monitor endpoint: `https://baklavaci.com/api/health`

---

## Security Checklist

- [ ] Environment variables güvenli (secrets manager)
- [ ] SSL/TLS sertifikası aktif
- [ ] Database bağlantısı şifreli
- [ ] API rate limiting aktif
- [ ] CORS yapılandırması doğru
- [ ] Security headers (CSP, HSTS, etc.)
- [ ] Webhook signature validation
- [ ] Input sanitization aktif
- [ ] Regular security updates

---

## Rollback Plan

### Vercel

```bash
# Previous deployment'a dön
vercel rollback
```

### PM2

```bash
# Previous version'a dön
git checkout <previous-commit>
pnpm install
pnpm build
pm2 reload all
```

### Database Rollback

```bash
# Backup'tan restore
gunzip < backup.sql.gz | psql baklava_db
```
