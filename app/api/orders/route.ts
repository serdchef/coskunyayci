/**
 * POST /api/orders
 * Create new order with database persistence and email notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    // Validate required fields
    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Customer info and items are required' },
        { status: 400 }
      );
    }

    const { customer, items, address, totalPrice } = body;

    // Calculate total from items
    const calculatedTotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Find or create user (if email provided)
    let userId = session?.user?.id;
    if (!userId && customer.email) {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: customer.email },
      });

      if (existingUser) {
        userId = existingUser.id;
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        status: 'CONFIRMED',
        totalPrice: totalPrice || calculatedTotal,
        address: address?.street || null,
        city: address?.city || null,
        district: address?.district || null,
        zipCode: address?.zipCode || null,
        items: {
          create: items.map((item: any) => ({
            productName: item.name || item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Send confirmation emails
    try {
      await sendOrderConfirmation({
        orderId: order.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: order.items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: order.totalPrice,
        address: address
          ? {
              street: address.street,
              city: address.city,
              district: address.district,
              zipCode: address.zipCode,
            }
          : undefined,
        status: order.status,
      });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      // Continue - order is created even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        message: 'Order created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders/[id]
 * Get order details by ID
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(request.url);
    const orderId = url.searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check authorization - user can only see their own orders unless admin
    if (
      order.userId &&
      session?.user?.id !== order.userId &&
      session?.user?.role !== 'ADMIN' &&
      session?.user?.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
