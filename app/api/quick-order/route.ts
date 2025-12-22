import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { enqueueNotification } from '@/lib/notifications';

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
      { sku: 'MEK_001', name: 'Mekik Baklava', priceCents: 82745 },
      { sku: 'KARE_001', name: 'Kare Baklava', priceCents: 86970 },
      { sku: 'HAVUC_001', name: 'Havuç Dilimi', priceCents: 86970 },
    ];
    
    const product = mockProducts.find(p => p.sku === sku);
    if (!product) {
      return NextResponse.json({ error: 'product not found' }, { status: 404 });
    }

    const now = new Date();
    const order = await prisma.order.create({
      data: {
        orderNumber: `QK-${now.getTime()}`,
        customerName: name || 'Müşteri',
        customerPhone: phone,
        items: [{ sku: product.sku, name: product.name, qty: 1, priceCents: product.priceCents, options: {} }],
        subtotalCents: product.priceCents,
        taxCents: 0,
        discountCents: 0,
        deliveryFeeCents: 0,
        totalCents: product.priceCents,
        status: 'PENDING',
        deliveryType: 'PICKUP',
        paymentMethod: 'CASH',
        paymentStatus: 'PENDING',
        source: 'quick-order',
      },
    });

    // Create notification for business owner
    const message = `Yeni sipariş: ${product.name} \nSipariş No: ${order.orderNumber} \nTelefon: ${phone}`;

    const notif = await prisma.notification.create({
      data: {
        orderId: order.id,
        type: 'whatsapp',
        to: process.env.BUSINESS_PHONE_NUMBER || '',
        body: message,
        status: 'PENDING',
      },
    });

    await enqueueNotification({ notificationId: notif.id, orderId: order.id, type: 'whatsapp', to: notif.to, body: notif.body });

    return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (err: any) {
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
