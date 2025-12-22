import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Phase 1: Mock product data (no database yet)
    const mockProducts = {
      'MEK_001': {
        id: 'mock-1',
        sku: 'MEK_001',
        name: 'Mekik Baklava',
        description: 'Gaziantep\'in en klasik baklava çeşidi. İnce yapılı ve lezzetli Mekik Baklava.',
        category: 'Baklavalar',
        basePrice: 827.45,
        image: '/images/products/klasik.jpg',
        variants: [],
      },
      'KARE_001': {
        id: 'mock-2',
        sku: 'KARE_001',
        name: 'Kare Baklava',
        description: 'Kare şeklinde kesilen, eşit ölçülü premium baklava. Her parça eşit ve mükemmel.',
        category: 'Baklavalar',
        basePrice: 869.70,
        image: '/images/products/kare-baklava.jpg',
        variants: [],
      },
      'HAVUC_001': {
        id: 'mock-3',
        sku: 'HAVUC_001',
        name: 'Havuç Dilimi',
        description: 'Parlak ve göz kamaştırıcı baklava. Sunumda şaşırtıcı, lezzette mükemmel.',
        category: 'Baklavalar',
        basePrice: 869.70,
        image: '/images/products/havuc-dilimi.jpg',
        variants: [],
      },
    };

    const product = mockProducts[id as keyof typeof mockProducts];

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Error fetching product',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
