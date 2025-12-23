import { NextRequest, NextResponse } from 'next/server';
import { getSommelierRecommendation, BAKLAVA_PRODUCTS } from '@/lib/openai';

export const runtime = 'nodejs';

/**
 * POST /api/sommelier
 * AI Sommelier chat endpoint - "Dijital Zümrüt Sarayı" luxury recommendations
 */
export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    const recommendation = await getSommelierRecommendation(
      message,
      conversationHistory
    );

    return NextResponse.json({
      response: recommendation,
      timestamp: new Date().toISOString(),
      availableProducts: BAKLAVA_PRODUCTS.length,
    });
  } catch (error) {
    console.error('[SOMMELIER_ERROR]', error);
    return NextResponse.json(
      { error: 'Sommelier service unavailable' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sommelier
 * Get available baklava products
 */
export async function GET() {
  return NextResponse.json({
    products: BAKLAVA_PRODUCTS,
    totalProducts: BAKLAVA_PRODUCTS.length,
    message: 'Welcome to AI Sommelier - Dijital Zümrüt Sarayı',
  });
}

