#!/usr/bin/env node

/**
 * 🏛️ PRODUCTION DEPLOYMENT HELPER
 * Automates NEXTAUTH_SECRET generation and database setup checks
 * 
 * Usage:
 *   npx ts-node scripts/pre-deploy.ts [command]
 * 
 * Commands:
 *   generate-secret     → Generate new NEXTAUTH_SECRET
 *   check-env          → Verify all required environment variables
 *   setup-super-admin  → Create SUPER_ADMIN user in database
 *   validate-all       → Run all checks
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SUPER_ADMIN_EMAIL = 'serdraal@gmail.com';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function generateNEXTAUTH_SECRET(): string {
  return crypto.randomBytes(32).toString('hex');
}

function generateCommand() {
  log('\n🔐 GENERATING NEXTAUTH_SECRET\n', colors.bold);
  
  const secret = generateNEXTAUTH_SECRET();
  
  log(`Generated Secret:`, colors.green);
  log(`  ${secret}\n`);
  
  log(`✅ Copy this value to:`, colors.green);
  log(`  1. .env.local file: NEXTAUTH_SECRET="${secret}"\n`);
  log(`  2. Vercel Dashboard:`);
  log(`     → Settings > Environment Variables`);
  log(`     → Name: NEXTAUTH_SECRET`);
  log(`     → Value: ${secret}`);
  log(`     → Environments: Production, Preview, Development\n`);
  
  log(`📋 Instructions for Vercel:`, colors.blue);
  log(`  1. Visit: https://vercel.com/dashboard`);
  log(`  2. Select Project: coskunyayci-5zzk`);
  log(`  3. Click Settings`);
  log(`  4. Scroll to "Environment Variables"`);
  log(`  5. Click "Add New"`);
  log(`  6. Fill in above values`);
  log(`  7. Redeploy project`);
}

function checkEnvCommand() {
  log('\n📋 ENVIRONMENT VARIABLES CHECK\n', colors.bold);
  
  const envFilePath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, 'utf-8');
  }
  
  const requiredVars = {
    'NEXTAUTH_SECRET': { optional: false, production: true },
    'NEXTAUTH_URL': { optional: false, production: true },
    'DATABASE_URL': { optional: false, production: true },
    'GOOGLE_CLIENT_ID': { optional: false, production: true },
    'GOOGLE_CLIENT_SECRET': { optional: false, production: true },
    'STRIPE_SECRET_KEY': { optional: false, production: true },
    'STRIPE_WEBHOOK_SECRET': { optional: true, production: true },
    'OPENAI_API_KEY': { optional: true, production: false },
  };
  
  log('Local (.env.local) Status:\n', colors.blue);
  
  let allPresent = true;
  for (const [varName, config] of Object.entries(requiredVars)) {
    const value = process.env[varName];
    const envFileHas = envContent.includes(`${varName}=`);
    
    const hasValue = value || envFileHas;
    const icon = hasValue ? '✅' : config.optional ? '⚠️' : '❌';
    const required = config.optional ? '(optional)' : '(required)';
    
    log(`  ${icon} ${varName} ${required}`, 
        hasValue ? colors.green : (config.optional ? colors.yellow : colors.red));
    
    if (!hasValue && !config.optional) {
      allPresent = false;
    }
  }
  
  log(`\nProduction (Vercel) Setup:`, colors.blue);
  log(`  📝 You need to add these to Vercel Environment Variables:`);
  log(`  1. NEXTAUTH_SECRET (generated with 'generate-secret' command)`);
  log(`  2. DATABASE_URL (PostgreSQL connection string from Supabase/Neon)`);
  log(`  3. SHADOW_DATABASE_URL (for Prisma migrations)`);
  log(`  4. GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET`);
  log(`  5. STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET`);
  log(`  6. OPENAI_API_KEY\n`);
  
  if (!allPresent) {
    log(`⚠️ Some required variables are missing from .env.local`, colors.yellow);
  } else {
    log(`✅ All required variables are configured`, colors.green);
  }
}

function setupSuperAdminCommand() {
  log('\n🏛️ SUPER_ADMIN SETUP\n', colors.bold);
  
  log(`Email: ${SUPER_ADMIN_EMAIL}`, colors.green);
  log(`Role: SUPER_ADMIN`, colors.green);
  log(`Permissions: Full system access\n`, colors.green);
  
  log(`Auto-Assignment Flow:`, colors.blue);
  log(`  1. User logs in with Google OAuth`);
  log(`  2. Email verified: ${SUPER_ADMIN_EMAIL}`);
  log(`  3. Role automatically set to: SUPER_ADMIN`);
  log(`  4. User can access /admin dashboard\n`);
  
  log(`Manual Setup (if needed):`, colors.blue);
  log(`  Run this in Prisma Studio or database client:\n`);
  log(`  const user = await prisma.user.upsert({`, colors.yellow);
  log(`    where: { email: '${SUPER_ADMIN_EMAIL}' },`);
  log(`    update: { role: 'SUPER_ADMIN' },`);
  log(`    create: {`);
  log(`      email: '${SUPER_ADMIN_EMAIL}',`);
  log(`      name: 'Coşkun Yayci Admin',`);
  log(`      role: 'SUPER_ADMIN',`);
  log(`      locale: 'tr',`);
  log(`    },`);
  log(`  });`);
}

function validateAllCommand() {
  log('\n' + '='.repeat(70), colors.bold);
  log('🏛️ COMPLETE PRE-DEPLOYMENT VALIDATION', colors.bold);
  log('='.repeat(70) + '\n');
  
  generateCommand();
  checkEnvCommand();
  setupSuperAdminCommand();
  
  log('\n' + '='.repeat(70), colors.bold);
  log('📋 DEPLOYMENT CHECKLIST', colors.bold);
  log('='.repeat(70) + '\n');
  
  const checklist = [
    ['[ ] Generate NEXTAUTH_SECRET', 'generate-secret'],
    ['[ ] Verify all env variables', 'check-env'],
    ['[ ] Database URL set to PostgreSQL', 'manual'],
    ['[ ] Google OAuth URIs updated in Cloud Console', 'manual'],
    ['[ ] Stripe webhook endpoint configured', 'manual'],
    ['[ ] Push changes to GitHub', 'manual'],
    ['[ ] Verify Vercel auto-deployment', 'manual'],
    ['[ ] Test Google OAuth login with serdraal@gmail.com', 'manual'],
  ];
  
  checklist.forEach(([item, command]) => {
    const cmdText = command !== 'manual' ? ` (run: ${command})` : '';
    log(`  ${item}${cmdText}`);
  });
  
  log('\n' + '='.repeat(70) + '\n');
}

// Main CLI
const command = process.argv[2] || 'validate-all';

switch (command) {
  case 'generate-secret':
    generateCommand();
    break;
  case 'check-env':
    checkEnvCommand();
    break;
  case 'setup-super-admin':
    setupSuperAdminCommand();
    break;
  case 'validate-all':
    validateAllCommand();
    break;
  default:
    log(`\nUnknown command: ${command}\n`, colors.red);
    log('Available commands:', colors.bold);
    log('  generate-secret    - Generate new NEXTAUTH_SECRET');
    log('  check-env         - Verify environment variables');
    log('  setup-super-admin - Show SUPER_ADMIN setup instructions');
    log('  validate-all      - Run all validations');
}

process.exit(0);
