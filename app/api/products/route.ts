import { NextResponse } from 'next/server';
import { getProductsForB2C } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Gerçek veritabanından ürünleri çek
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Veritabanında ürün yoksa mock data döndür
    if (!products || products.length === 0) {
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
          variants: [],
        },
      ];
      return NextResponse.json({
        success: true,
        products: mockProducts,
      });
    }

    // Gerçek ürünleri format et
    const formattedProducts = products.map(product => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      region: product.region,
      productType: product.productType,
      image: product.image || '/images/placeholder.jpg',
      variants: product.variants.map(v => ({
        id: v.id,
        size: v.size,
        price: v.price,
        stock: v.stock,
      })),
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // For testing chatbot SKU validation
  try {
    const body = await req.json();
    const { sku } = body;

    if (!sku) {
      return NextResponse.json({ error: 'sku required' }, { status: 400 });
    }

    // Phase 1: Mock product data (no database yet)
    const mockProduct = {
      id: 'mock-' + sku,
      sku,
      name: 'Mock Product',
      description: 'This is a mock product for Phase 1',
      basePrice: 100.00,
      image: '/images/products/klasik.jpg',
      variants: [],
    };

    return NextResponse.json(mockProduct);
  } catch (error: any) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
