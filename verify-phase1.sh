#!/bin/bash

# Phase 1 Implementation Verification Script
# This script verifies that all components are in place

echo "🔍 Phase 1 Implementation Verification"
echo "========================================"
echo ""

# Check if required files exist
echo "📁 Checking required files..."

files=(
    "lib/email.ts"
    "lib/emails/OrderConfirmation.tsx"
    "app/api/orders/route.ts"
    "app/api/orders/[id]/route.ts"
    "app/api/orders/my-orders/route.ts"
    "prisma/schema.prisma"
    "PHASE1_SETUP.md"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        all_exist=false
    fi
done

echo ""
echo "📦 Checking dependencies..."

# Check if resend is installed
if grep -q '"resend"' package.json; then
    echo "✅ Resend package in package.json"
else
    echo "❌ Resend package missing"
    all_exist=false
fi

# Check if react-email is installed
if grep -q '"react-email"' package.json || grep -q '"@react-email/components"' package.json; then
    echo "✅ React Email package in package.json"
else
    echo "❌ React Email package missing"
    all_exist=false
fi

echo ""
echo "🗄️ Checking database schema..."

# Check if schema has PostgreSQL
if grep -q 'provider = "postgresql"' prisma/schema.prisma; then
    echo "✅ PostgreSQL provider configured"
else
    echo "❌ PostgreSQL provider not configured"
    all_exist=false
fi

# Check if Address model exists
if grep -q 'model Address' prisma/schema.prisma; then
    echo "✅ Address model exists"
else
    echo "❌ Address model missing"
    all_exist=false
fi

# Check if OrderItem has productName
if grep -q 'productName String' prisma/schema.prisma; then
    echo "✅ OrderItem.productName field exists"
else
    echo "❌ OrderItem.productName field missing"
    all_exist=false
fi

echo ""
echo "🔐 Checking environment configuration..."

if [ -f ".env.example" ]; then
    if grep -q 'RESEND_API_KEY' .env.example; then
        echo "✅ RESEND_API_KEY in .env.example"
    else
        echo "⚠️  RESEND_API_KEY not in .env.example"
    fi
    
    if grep -q 'ADMIN_EMAIL' .env.example; then
        echo "✅ ADMIN_EMAIL in .env.example"
    else
        echo "⚠️  ADMIN_EMAIL not in .env.example"
    fi
else
    echo "⚠️  .env.example not found"
fi

echo ""
echo "🧪 Checking TypeScript compilation..."
npm run type-check &> /dev/null
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation passes"
else
    echo "⚠️  TypeScript compilation has errors (run 'npm run type-check' to see details)"
fi

echo ""
echo "📝 Summary"
echo "=========="

if [ "$all_exist" = true ]; then
    echo "✅ All required files and configurations are in place!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up Supabase database and add DATABASE_URL to .env.local"
    echo "2. Get Resend API key and add to .env.local"
    echo "3. Run 'npx prisma migrate dev --name init'"
    echo "4. Run 'npm run dev' to start development server"
    echo ""
    echo "📖 See PHASE1_SETUP.md for detailed instructions"
else
    echo "❌ Some files or configurations are missing"
    echo "Please review the errors above"
fi

echo ""
