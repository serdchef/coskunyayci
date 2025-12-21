import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Try to find by SKU first, then by ID (UUID)
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { sku: id },
          { id: id },
        ],
      },
      include: {
        variants: true,
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      basePrice: product.basePrice,
      image: product.image,
      variants: product.variants,
    });
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
