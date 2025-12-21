import { NextResponse } from 'next/server';
import { getProductsForB2C } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await getProductsForB2C();
    
    return NextResponse.json({
      success: true,
      products: products,
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

    const product = await prisma.product.findUnique({
      where: { sku },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
