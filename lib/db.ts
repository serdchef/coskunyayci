/**
 * Prisma Database Client
 * Global singleton pattern ile connection pool yönetimi
 */

import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrisma = (): PrismaClient => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });
};

const prismaInstance = globalThis.prisma ?? createPrisma();

// assign globally in dev to prevent hot-reload duplicates
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismaInstance;
}

// Graceful shutdown for real Prisma client
if (typeof window === 'undefined' && prismaInstance && typeof prismaInstance.$disconnect === 'function') {
  process.on('beforeExit', async () => {
    try {
      await prismaInstance.$disconnect();
    } catch {
      // ignore
    }
  });
}

// Export with the PrismaClient type so editor/tsserver can infer model types
export const prisma = prismaInstance;
export default prisma;

/**
 * ============================================
 * DATA FETCHING HELPERS
 * ============================================
 */

/**
 * Tüm ürünleri veritabanından çek (B2C için)
 * Phase 1: Mock data döndürülüyor (ürün modeli henüz yok)
 */
export async function getProductsForB2C() {
  try {
    // Phase 1: Mock product data (no database yet)
    const mockProducts = [
      {
        id: 'mock-1',
        sku: 'MEK_001',
        name: 'Mekik Baklava',
        description: 'Gaziantep\'in en klasik baklava çeşidi. İnce yapılı ve lezzetli Mekik Baklava.',
        basePrice: 827.45,
        category: 'Baklavalar',
        region: 'Gaziantep',
        image: '/images/products/klasik.jpg',
        productType: 'BAKLAVA',
        variants: [],
      },
      {
        id: 'mock-2',
        sku: 'KARE_001',
        name: 'Kare Baklava',
        description: 'Kare şeklinde kesilen, eşit ölçülü premium baklava. Her parça eşit ve mükemmel.',
        basePrice: 869.70,
        category: 'Baklavalar',
        region: 'Gaziantep',
        image: '/images/products/kare-baklava.jpg',
        productType: 'BAKLAVA',
        variants: [],
      },
      {
        id: 'mock-3',
        sku: 'HAVUC_001',
        name: 'Havuç Dilimi',
        description: 'Parlak ve göz kamaştırıcı baklava. Sunumda şaşırtıcı, lezzette mükemmel.',
        basePrice: 869.70,
        category: 'Baklavalar',
        region: 'Gaziantep',
        image: '/images/products/havuc-dilimi.jpg',
        productType: 'BAKLAVA',
        variants: [],
      },
    ];

    return mockProducts;
  } catch (error) {
    console.error('Error fetching B2C products:', error);
    return [];
  }
}

/**
 * Belirli bir ürünü ID ile çek
 * Phase 1: Mock data döndürülüyor (ürün modeli henüz yok)
 */
export async function getProductById(productId: string) {
  try {
    // Phase 1: Mock product data (no database yet)
    const mockProducts = [
      {
        id: 'mock-1',
        sku: 'MEK_001',
        name: 'Mekik Baklava',
        description: 'Gaziantep\'in en klasik baklava çeşidi. İnce yapılı ve lezzetli Mekik Baklava.',
        basePrice: 827.45,
        category: 'Baklavalar',
        region: 'Gaziantep',
        image: '/images/products/klasik.jpg',
        productType: 'BAKLAVA',
        variants: [],
      },
      {
        id: 'mock-2',
        sku: 'KARE_001',
        name: 'Kare Baklava',
        description: 'Kare şeklinde kesilen, eşit ölçülü premium baklava. Her parça eşit ve mükemmel.',
        basePrice: 869.70,
        category: 'Baklavalar',
        region: 'Gaziantep',
        image: '/images/products/kare-baklava.jpg',
        productType: 'BAKLAVA',
        variants: [],
      },
      {
        id: 'mock-3',
        sku: 'HAVUC_001',
        name: 'Havuç Dilimi',
        description: 'Parlak ve göz kamaştırıcı baklava. Sunumda şaşırtıcı, lezzette mükemmel.',
        basePrice: 869.70,
        category: 'Baklavalar',
        region: 'Gaziantep',
        image: '/images/products/havuc-dilimi.jpg',
        productType: 'BAKLAVA',
        variants: [],
      },
    ];

    // Find product by ID or SKU
    const product = mockProducts.find(p => p.id === productId || p.sku === productId);
    return product || null;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

/**
 * Kullanıcının sipariş geçmişini çek
 */
export async function getOrderHistory(userId: string, limit: number = 10) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    return orders;
  } catch (error) {
    console.error(`Error fetching order history for user ${userId}:`, error);
    return [];
  }
}

/**
 * Yeni bir sipariş oluştur
 */
export async function createOrder(data: {
  userId: string;
  totalPrice: number;
  addressId?: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}) {
  try {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalPrice: data.totalPrice,
        addressId: data.addressId,
        status: 'CONFIRMED',
        items: {
          create: data.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

/**
 * Toplu sipariş (B2B) oluştur
 * Not: B2B profili şemada henüz yok, basit sipariş olarak oluşturulur
 */
export async function createB2BOrder(data: {
  userId: string;
  totalPrice: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  notes?: string;
}) {
  try {
    // B2B indirim oranı (sabit)
    const discountRate = 0.15;
    const discountedPrice = data.totalPrice * (1 - discountRate);

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalPrice: discountedPrice,
        status: data.items.reduce((sum, item) => sum + item.quantity, 0) > 100 ? 'PENDING' : 'CONFIRMED',
        items: {
          create: data.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price * (1 - discountRate),
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return order;
  } catch (error) {
    console.error('Error creating B2B order:', error);
    return null;
  }
}

/**
 * B2B kayıt oluştur
 * Not: B2B profili şemada henüz yok, null döner
 */
export async function createB2BProfile(data: {
  userId: string;
  companyName: string;
  taxId: string;
  department: string;
  authorizedName: string;
  industry: string;
  companySize?: string;
  address?: string;
}) {
  // B2B profili şemada yok, şimdilik sadece log
  console.log('B2B profile creation requested for user:', data.userId);
  console.log('Company:', data.companyName);
  return null;
}
