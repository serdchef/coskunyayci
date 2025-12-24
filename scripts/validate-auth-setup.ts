/**
 * 🏛️ AUTH VALIDATION SCRIPT
 * Verifies SUPER_ADMIN role assignment logic for serdraal@gmail.com
 * 
 * Run with: npx ts-node scripts/validate-auth-setup.ts
 */

import { prisma } from '../lib/db';

async function validateAuthSetup() {
  console.log('🏛️ SUPER_ADMIN AUTHENTICATION VALIDATION\n');
  console.log('='.repeat(60));

  // 1. Check environment variables
  console.log('\n1️⃣ ENVIRONMENT VARIABLES CHECK:\n');
  const requiredEnvVars = [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'SUPER_ADMIN_EMAIL',
  ];

  let envStatus = true;
  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar];
    const status = value ? '✅' : '❌';
    const displayValue = value
      ? value.substring(0, 20) + (value.length > 20 ? '...' : '')
      : 'MISSING';
    console.log(`  ${status} ${envVar}: ${displayValue}`);
    if (!value) envStatus = false;
  });

  if (!envStatus) {
    console.log(
      '\n⚠️ WARNING: Some environment variables are missing.\n' +
      'Check .env.local file for completeness.'
    );
  }

  // 2. Check Database Connection
  console.log('\n2️⃣ DATABASE CONNECTION CHECK:\n');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as alive`;
    console.log('  ✅ Database connection successful');
    console.log('  Database provider: PostgreSQL (or SQLite in dev)');
  } catch (error) {
    console.log('  ❌ Database connection failed');
    console.log(`  Error: ${(error as Error).message}`);
  }

  // 3. Check SUPER_ADMIN User
  console.log('\n3️⃣ SUPER_ADMIN USER CHECK:\n');
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'serdraal@gmail.com';

  try {
    const superAdminUser = await prisma.user.findUnique({
      where: { email: superAdminEmail },
    });

    if (superAdminUser) {
      console.log(`  ✅ SUPER_ADMIN found in database`);
      console.log(`     Email: ${superAdminUser.email}`);
      console.log(`     Role: ${superAdminUser.role}`);
      console.log(`     Name: ${superAdminUser.name}`);
      console.log(`     ID: ${superAdminUser.id}`);
      console.log(`     Created: ${superAdminUser.createdAt}`);

      if (superAdminUser.role !== 'SUPER_ADMIN') {
        console.log(
          `\n  ⚠️ WARNING: User exists but role is "${superAdminUser.role}", ` +
          `not "SUPER_ADMIN"`
        );
        console.log(
          `     This could happen if user was created before role fix.\n` +
          `     To fix: UPDATE users SET role = 'SUPER_ADMIN' WHERE email = '${superAdminEmail}'`
        );
      }
    } else {
      console.log(
        `  ℹ️ SUPER_ADMIN user not yet created in database.\n` +
        `     Will be created automatically on first Google OAuth login.\n` +
        `     Login email: ${superAdminEmail}`
      );
    }
  } catch (error) {
    console.log(`  ❌ Error checking SUPER_ADMIN user:`);
    console.log(`     ${(error as Error).message}`);
  }

  // 4. Check Auth Configuration
  console.log('\n4️⃣ AUTH CONFIGURATION CHECK:\n');
  
  const nextauthSecret = process.env.NEXTAUTH_SECRET;
  if (!nextauthSecret) {
    console.log('  ❌ NEXTAUTH_SECRET is missing');
  } else if (nextauthSecret.length < 32) {
    console.log(
      `  ⚠️ NEXTAUTH_SECRET is only ${nextauthSecret.length} chars ` +
      `(recommended: 32+)`
    );
  } else {
    console.log('  ✅ NEXTAUTH_SECRET is properly configured');
  }

  const nextauthUrl = process.env.NEXTAUTH_URL;
  console.log(`  ${nextauthUrl ? '✅' : '❌'} NEXTAUTH_URL: ${nextauthUrl || 'MISSING'}`);

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  console.log(
    `  ${googleClientId ? '✅' : '❌'} GOOGLE_CLIENT_ID: ` +
    `${googleClientId ? googleClientId.substring(0, 20) + '...' : 'MISSING'}`
  );

  // 5. Auth Flow Diagram
  console.log('\n5️⃣ GOOGLE OAUTH FLOW FOR SUPER_ADMIN:\n');
  console.log('  1. User clicks "Login with Google"');
  console.log('  2. Redirects to Google OAuth consent screen');
  console.log('  3. User enters: serdraal@gmail.com');
  console.log('  4. Returns to app with Google profile');
  console.log('  5. NextAuth checks email in profile');
  console.log('  6. Matches serdraal@gmail.com? → YES');
  console.log('     ↓');
  console.log('  7. Set role = "SUPER_ADMIN"');
  console.log('  8. First login? → Create user in DB with SUPER_ADMIN role');
  console.log('  9. Subsequent logins? → Use existing role from DB');
  console.log('  10. Create JWT token with role="SUPER_ADMIN"');
  console.log('  11. User session has role="SUPER_ADMIN"');
  console.log('  12. Access to /admin and other protected routes');

  // 6. Manual SUPER_ADMIN Creation (if needed)
  console.log('\n6️⃣ MANUAL SUPER_ADMIN CREATION (if needed):\n');
  console.log('  If you need to manually create or update SUPER_ADMIN:\n');
  console.log(`  const user = await prisma.user.upsert({`);
  console.log(`    where: { email: '${superAdminEmail}' },`);
  console.log(`    update: { role: 'SUPER_ADMIN' },`);
  console.log(`    create: {`);
  console.log(`      email: '${superAdminEmail}',`);
  console.log(`      name: 'Coşkun Yayci Admin',`);
  console.log(`      role: 'SUPER_ADMIN',`);
  console.log(`    },`);
  console.log(`  });`);

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Validation complete!\n');

  await prisma.$disconnect();
}

// Run validation
validateAuthSetup().catch((error) => {
  console.error('❌ Validation failed:', error);
  process.exit(1);
});
