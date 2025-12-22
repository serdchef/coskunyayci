import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/test-phase2
 * Test endpoint for Phase 2 database operations
 * Zümrüt Temeller - Database Persistence Test
 */

export async function GET() {
  try {
    console.log('🏛️ ZÜMRÜT TEMELLER - DATABASE PERSISTENCE TEST');
    console.log('========================================');

    // Test 1: Create a test user (Müşteri)
    const testUser = await prisma.user.create({
      data: {
        email: `zumrut-${Date.now()}@coskunyayci.com`,
        name: 'Zümrüt Müşterisi',
      },
    });
    console.log('✅ Step 1: Müşteri oluşturuldu:', testUser.id);

    // Test 2: Create a test address (Adres)
    const testAddress = await prisma.address.create({
      data: {
        userId: testUser.id,
        street: 'Zümrüt Sarayı Sokak No: 42',
        city: 'İstanbul',
        district: 'Beyoğlu',
        zipCode: '34437',
      },
    });
    console.log('✅ Step 2: Teslimat Adresi oluşturuldu:', testAddress.id);

    // Test 3: Create a test order (Sipariş)
    const testOrder = await prisma.order.create({
      data: {
        userId: testUser.id,
        addressId: testAddress.id,
        totalPrice: 1697.15,
        status: 'CONFIRMED',
        items: {
          create: [
            {
              productName: 'Mekik Baklava (500g)',
              quantity: 2,
              price: 827.45,
            },
            {
              productName: 'Havuç Dilimi Premium (250g)',
              quantity: 1,
              price: 869.70,
            },
          ],
        },
      },
      include: {
        items: true,
        user: true,
        address: true,
      },
    });
    console.log('✅ Step 3: Sipariş veritabanına yazıldı:', testOrder.id);

    // Test 4: Fetch the order back
    const fetchedOrder = await prisma.order.findUnique({
      where: { id: testOrder.id },
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
        address: true,
      },
    });
    console.log('✅ Step 4: Sipariş veritabanından çekildi');

    // Test 5: Get statistics
    const stats = {
      totalOrders: await prisma.order.count(),
      totalUsers: await prisma.user.count(),
      totalAddresses: await prisma.address.count(),
    };
    console.log('📊 Veritabanı İstatistikleri:', stats);

    return NextResponse.json(
      {
        success: true,
        message: '🏆 ZÜMRÜT TEMELLER - DATABASE PERSISTENCE TEST BAŞARILI!',
        steps: [
          '✅ Müşteri oluşturuldu',
          '✅ Teslimat Adresi oluşturuldu',
          '✅ Sipariş veritabanına yazıldı',
          '✅ Sipariş geri çekildi',
        ],
        data: {
          user: {
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
          },
          address: {
            id: testAddress.id,
            street: testAddress.street,
            city: testAddress.city,
            district: testAddress.district,
          },
          order: {
            id: testOrder.id,
            totalPrice: testOrder.totalPrice,
            status: testOrder.status,
            itemCount: testOrder.items.length,
            items: testOrder.items.map((item: any) => ({
              productName: item.productName,
              quantity: item.quantity,
              price: item.price,
            })),
            createdAt: testOrder.createdAt,
          },
        },
        stats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Database Test Hatası:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: 'SQLite database bağlantısını kontrol et: prisma/dev.db',
      },
      { status: 500 }
    );
  }
}
