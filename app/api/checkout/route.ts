import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';

/**
 * POST /api/checkout
 * Create Stripe checkout session from cart items
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItems } = await req.json();

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart items required' },
        { status: 400 }
      );
    }

    // Get full product details for line items
    const productIds = [...new Set(cartItems.map((item: any) => item.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });

    // Build checkout line items
    const checkoutItems = cartItems.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);

      if (!product || !variant) {
        throw new Error(`Product or variant not found: ${item.productId}`);
      }

      return {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantSize: variant.size,
        variantPrice: variant.price,
        quantity: item.quantity,
        image: product.image || 'https://via.placeholder.com/200',
      };
    });

    // Create Stripe session
    const sessionId = await createCheckoutSession(
      checkoutItems,
      session.user.email,
      `${process.env.NEXTAUTH_URL || 'http://localhost:4000'}/checkout/success`,
      `${process.env.NEXTAUTH_URL || 'http://localhost:4000'}/sepetim`
    );

    // Create database order record (status: PENDING)
    const order = await prisma.order.create({
      data: {
        status: 'PENDING',
        userEmail: session.user.email,
        items: {
          createMany: {
            data: checkoutItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.variantPrice,
            })),
          },
        },
        stripeSessionId: sessionId,
        metadata: {
          checkoutAt: new Date().toISOString(),
          itemCount: checkoutItems.length,
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      sessionId,
      orderId: order.id,
      redirectUrl: `https://checkout.stripe.com/pay/${sessionId}`,
    });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return NextResponse.json(
      { error: 'Checkout session creation failed' },
      { status: 500 }
    );
  }
}
