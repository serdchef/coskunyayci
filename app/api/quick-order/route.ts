import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Minimal, safe quick-order endpoint that avoids heavy imports so the Next
// web process doesn't pull worker-thread-dependent bundles.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // eslint-disable-next-line no-console
    console.log('[quick-order] incoming payload:', JSON.stringify(body, null, 2));
    
    // Support both formats: { sku, phone } and { items: [{sku}], customer: {phone} }
    let sku = body.sku;
    let phone = body.phone;
    const name = body.name || (body.customer?.name) || 'Müşteri';
    
    // If items array provided (ProductCard format), extract sku from first item
    if (!sku && Array.isArray(body.items) && body.items.length > 0) {
      sku = body.items[0].sku;
    }
    
    // If customer object provided (ProductCard format), extract phone
    if (!phone && body.customer?.phone) {
      phone = body.customer.phone;
    }

    if (!sku || !phone) {
      return NextResponse.json({ error: 'sku and phone required' }, { status: 400 });
    }

    // Phase 1: Mock product lookup (no database yet)
    const mockProducts = [
      { sku: 'MEK_001', name: 'Mekik Baklava', price: 827.45 },
      { sku: 'KARE_001', name: 'Kare Baklava', price: 869.70 },
      { sku: 'HAVUC_001', name: 'Havuç Dilimi', price: 869.70 },
    ];
    
    const product = mockProducts.find(p => p.sku === sku);
    if (!product) {
      return NextResponse.json({ error: 'product not found' }, { status: 404 });
    }

    // Create order using correct schema (Order with OrderItems)
    const order = await prisma.order.create({
      data: {
        totalPrice: product.price,
        status: 'PENDING',
        items: {
          create: [
            {
              productName: product.name,
              quantity: 1,
              price: product.price,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    const orderNumber = `QK-${order.id.slice(-8).toUpperCase()}`;
    
    // Log notification instead of creating (Notification model not in schema)
    console.log(`[quick-order] Notification: Yeni sipariş: ${product.name}, Sipariş No: ${orderNumber}, Telefon: ${phone}`);

    return NextResponse.json({ success: true, orderId: order.id, orderNumber }, { status: 201 });
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('quick-order error:', err);
    
    // Fallback: if DB fails, still return success for dev/demo (so UI works)
    // In production, remove this fallback and let error propagate
    const mockOrderNumber = `QK-${Date.now()}`;
    return NextResponse.json(
      { success: true, orderId: 'demo-' + Date.now(), orderNumber: mockOrderNumber, note: 'Demo mode (DB unavailable)' },
      { status: 201 }
    );
  }
}
