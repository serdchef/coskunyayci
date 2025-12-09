import { NextResponse } from 'next/server';

// Mock B2B pricing tiers
const PRICING_TIERS = [
  { minQty: 0, maxQty: 499, pricePerUnit: 25, discount: 0 },
  { minQty: 500, maxQty: 999, pricePerUnit: 20, discount: 20 },
  { minQty: 1000, maxQty: 4999, pricePerUnit: 18, discount: 28 },
  { minQty: 5000, maxQty: 9999, pricePerUnit: 15, discount: 40 },
  { minQty: 10000, maxQty: Infinity, pricePerUnit: 12, discount: 52 },
];

// Mock orders
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    companyName: 'Acme Corp',
    date: '2025-11-15',
    product: 'Antep Fıstıklı Baklava',
    quantity: 1000,
    unitPrice: 18,
    totalPrice: 18000,
    status: 'delivered',
    customization: { logo: true, text: 'Acme Corp' },
    deliveryDate: '2025-11-20',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'tiers') {
    return NextResponse.json(PRICING_TIERS);
  }

  if (action === 'orders') {
    return NextResponse.json(MOCK_ORDERS);
  }

  return NextResponse.json(PRICING_TIERS);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { quantity } = data;

  // Find matching tier
  const tier = PRICING_TIERS.find(
    (t) => quantity >= t.minQty && quantity <= t.maxQty
  );

  if (!tier) {
    return NextResponse.json(
      { error: 'Geçersiz miktar' },
      { status: 400 }
    );
  }

  const basePrice = quantity * tier.pricePerUnit;
  let totalPrice = basePrice;

  // Add customization costs
  if (data.customLogo) totalPrice += 500;
  if (data.customText) totalPrice += 200;

  // Add packaging costs
  if (data.packaging === 'premium') totalPrice += quantity * 2;
  if (data.packaging === 'corporate') totalPrice += quantity * 3;

  return NextResponse.json({
    quantity,
    unitPrice: tier.pricePerUnit,
    basePrice,
    customizationFees: {
      logo: data.customLogo ? 500 : 0,
      text: data.customText ? 200 : 0,
      packaging: data.packaging === 'premium' ? quantity * 2 : data.packaging === 'corporate' ? quantity * 3 : 0,
    },
    totalPrice,
    discount: `${tier.discount}%`,
    discountAmount: basePrice * (tier.discount / 100),
  });
}
