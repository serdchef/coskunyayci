import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock Stripe payment processing
async function processPayment(cardNumber: string, expiry: string, cvc: string, amount: number) {
  // In production: call Stripe API
  // For now: validate card format and simulate success
  
  const cleanCard = cardNumber.replace(/\s/g, '');
  
  // Validate card format
  if (cleanCard.length !== 16 || !/^\d+$/.test(cleanCard)) {
    throw new Error('Geçersiz kart numarası');
  }

  // Validate expiry format
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    throw new Error('Geçersiz geçerlilik tarihi');
  }

  // Validate CVC
  if (!/^\d{3}$/.test(cvc)) {
    throw new Error('Geçersiz CVC');
  }

  // Check for test card 4242 (always succeeds in test mode)
  if (!cleanCard.startsWith('4242')) {
    // In production: validate with payment processor
    // For now: reject non-test cards in test mode
    throw new Error('Test mode: 4242 4242 4242 4242 kartını kullanın');
  }

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    transactionId: `TXN-${Date.now()}`,
    status: 'succeeded',
    amount,
    timestamp: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate payment data
    if (!data.orderId || !data.amount || !data.cardNumber || !data.expiry || !data.cvc) {
      return NextResponse.json(
        { error: 'Ödeme bilgileri eksik' },
        { status: 400 }
      );
    }

    // Process payment
    const paymentResult = await processPayment(
      data.cardNumber,
      data.expiry,
      data.cvc,
      data.amount
    );

    // TODO: Update order status in database to 'PAID'
    // TODO: Send confirmation email to customer
    // TODO: Trigger order fulfillment workflow

    return NextResponse.json(
      {
        success: true,
        orderId: data.orderId,
        transactionId: paymentResult.transactionId,
        status: 'PAYMENT_SUCCESSFUL',
        message: '✅ Ödemeniz başarıyla alındı. Kısa süre içinde onay e-postası alacaksınız.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ödeme işlemi başarısız oldu';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
