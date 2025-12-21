import { NextRequest, NextResponse } from 'next/server';
import { getProductsForB2C } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const products = await getProductsForB2C();
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.slice(0, 3), // İlk 3 ürünü göster
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
