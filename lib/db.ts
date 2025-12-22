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
 * Kullanıcının B2B profilini çek
 */
export async function getB2BProfile(userId: string) {
  try {
    const profile = await prisma.b2bProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });
    return profile;
  } catch (error) {
    console.error(`Error fetching B2B profile for user ${userId}:`, error);
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
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
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
  address: string;
  city: string;
  zipCode: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}) {
  try {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalPrice: data.totalPrice,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        status: 'CONFIRMED',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
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
 */
export async function createB2BOrder(data: {
  userId: string;
  totalPrice: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  notes?: string;
}) {
  try {
    // Önce B2B profilini al (discount bilgisi için)
    const b2bProfile = await getB2BProfile(data.userId);
    
    if (!b2bProfile) {
      throw new Error('B2B profile not found');
    }

    // Toplam fiyata indirim uygula
    const discountRate = b2bProfile.discountRate || 0.15;
    const discountedPrice = data.totalPrice * (1 - discountRate);

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalPrice: discountedPrice,
        address: b2bProfile.address || 'Şirket Adresi',
        city: 'İstanbul',
        zipCode: '34000',
        status: data.items.reduce((sum, item) => sum + item.quantity, 0) > 100 ? 'PENDING' : 'CONFIRMED',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
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
  try {
    const profile = await prisma.b2bProfile.create({
      data: {
        userId: data.userId,
        companyName: data.companyName,
        taxId: data.taxId,
        department: data.department,
        authorizedName: data.authorizedName,
        industry: data.industry,
        companySize: data.companySize || 'SMALL',
        address: data.address,
        creditLimit: 25000, // Default credit limit
        discountRate: 0.15, // Default 15% discount
        approved: false, // Admin onayı gerekli
      },
    });
    return profile;
  } catch (error) {
    console.error('Error creating B2B profile:', error);
    return null;
  }
}
