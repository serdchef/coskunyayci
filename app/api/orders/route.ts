import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmationEmail, formatOrderDate, calculateDeliveryDate } from '@/lib/email';

// Minimal, brand-aligned orders API for Phase 2 (with real database).
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, items, address, totalPrice } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    try {
      // Phase 2: Create order with real data persistence
      let dbUser = null;
      if (user?.email) {
        dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name || undefined },
          create: { email: user.email, name: user.name || undefined },
        });
      }

      let dbAddress = null;
      if (address) {
        dbAddress = await prisma.address.create({
          data: {
            userId: dbUser?.id,
            street: address.street || '',
            city: address.city || '',
            district: address.district || '',
            zipCode: address.zipCode || '',
          },
        });
      }

      const order = await prisma.order.create({
        data: {
          userId: dbUser?.id,
          addressId: dbAddress?.id,
          totalPrice: totalPrice || 0,
          status: 'CONFIRMED',
          items: {
            create: items.map((it: any) => ({
              productName: it.productName,
              quantity: Number(it.quantity) || 1,
              price: Number(it.price) || 0,
            })),
          },
        },
        include: { items: true, address: true },
      });

      const orderDate = new Date();
      const formattedOrderDate = formatOrderDate(orderDate);
      const deliveryDate = calculateDeliveryDate(orderDate);

      // Phase 2: Try to send email notification
      try {
        const emailResult = await sendOrderConfirmationEmail({
          orderId: order.id,
          customerName: dbUser?.name || 'Müşteri',
          customerEmail: dbUser?.email || (user?.email ?? ''),
          items: order.items.map((it: any) => ({ productName: it.productName, quantity: it.quantity, price: it.price })),
          totalPrice: order.totalPrice,
          orderDate: formattedOrderDate,
          deliveryDate,
        });
        console.log('Email sent:', emailResult);
      } catch (emailError) {
        console.warn('Email notification failed (non-blocking):', emailError);
      }

      return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
    } catch (dbError: any) {
      // Phase 2: Log database errors for debugging
      console.error('Database error:', dbError.message);
      
      // Fallback: Return mock order response
      const mockOrderId = `ORDER-${Date.now()}`;
      
      return NextResponse.json(
        { 
          success: true, 
          orderId: mockOrderId,
          fallback: true,
          message: 'Order created (Fallback Mode)'
        }, 
        { status: 201 }
      );
    }
  } catch (err) {
    console.error('POST /api/orders error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    try {
      const orders = await prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true, address: true },
      });

      const total = await prisma.order.count();

      return NextResponse.json({ success: true, orders, pagination: { page, limit, total } });
    } catch (dbError) {
      // Phase 1: Fallback to empty orders (database unavailable)
      console.warn('Database unavailable, returning empty orders:', dbError);
      return NextResponse.json({ 
        success: true, 
        orders: [], 
        pagination: { page, limit, total: 0 },
        fallback: true 
      });
    }
  } catch (err) {
    console.error('GET /api/orders error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

