/**
 * POST /api/payments/create-intent
 * Stripe Payment Intent oluştur
 * Müşteri ödeme yapmak istediğinde bu endpoint çağrılır
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/payments';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, customerEmail, customerName, description } = body;

    // Validasyon
    if (!orderId || !amount || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Order'ın var olduğunu kontrol et
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Payment intent oluştur
    const result = await createPaymentIntent({
      orderId,
      amount: Math.round(amount * 100), // Convert to cents
      customerEmail,
      customerName: customerName || 'Guest',
      description: description || `Order #${orderId}`,
    });

    return NextResponse.json(
      {
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
