import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

export default stripe;

/**
 * Create a Stripe checkout session for cart items
 * @param cartItems Array of cart items with product and variant details
 * @param userEmail User's email for receipt
 * @returns Stripe Session ID
 */
export async function createCheckoutSession(
  cartItems: Array<{
    productId: string;
    productName: string;
    variantId: string;
    variantSize: string;
    variantPrice: number;
    quantity: number;
    image: string;
  }>,
  userEmail: string,
  successUrl: string = `${process.env.NEXTAUTH_URL || 'http://localhost:4000'}/checkout/success`,
  cancelUrl: string = `${process.env.NEXTAUTH_URL || 'http://localhost:4000'}/sepetim`
) {
  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'try',
      product_data: {
        name: `${item.productName} (${item.variantSize})`,
        description: `Sarayın Zümrütü - Boz Fıstık Başyapıtı`,
        images: [item.image],
        metadata: {
          productId: item.productId,
          variantId: item.variantId,
          variantSize: item.variantSize,
        },
      },
      unit_amount: Math.round(item.variantPrice * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: userEmail,
    metadata: {
      userEmail,
      itemCount: cartItems.length.toString(),
    },
  });

  return session.id;
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  body: string | Buffer,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(body, signature, secret);
}
