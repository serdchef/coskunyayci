/**
 * GET /api/orders/[id] - Sipariş detayı
 * PATCH /api/orders/[id] - Sipariş güncelleme (durum)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
// Logger is imported lazily inside handlers to avoid pulling pino/thread-stream
// into the Next server bundle during module initialization.

type RouteContext = {
  params: {
    id: string;
  };
};

// GET - Sipariş detayı
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });

  } catch (error) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error, orderId: params.id }, 'Get order error');
    return NextResponse.json(
      { error: 'Sipariş bilgisi alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// PATCH - Sipariş durumu güncelleme
export async function PATCH(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    // TODO: Auth kontrolü - sadece admin/operator
    const body = await _request.json();
    const { status, notes } = body;

    // Mevcut siparişi kontrol et
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    // Durum güncellemesi
    const updateData: any = {};
    if (status) {
      updateData.status = status;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    const { logOrder } = await import('@/lib/logger');
    logOrder(order.id, 'status_updated', {
      oldStatus: existingOrder.status,
      newStatus: status,
    });

    // Müşteriye bildirim gönder (TODO: Phone numarası eklendiğinde)
    if (status && status !== existingOrder.status) {
      // TODO: Implement notification
      // notifyCustomer({
      //   phone: order.phone,
      //   orderNumber: order.orderNumber,
      //   status: status.toLowerCase(),
      // }).catch((error) => {
      //   (async () => {
      //     const { default: logger } = await import('@/lib/logger');
      //     logger.error({ error, orderId: order.id }, 'Failed to notify customer');
      //   })();
      // });
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Sipariş güncellendi',
    });

  } catch (error) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error, orderId: params.id }, 'Update order error');
    return NextResponse.json(
      { error: 'Sipariş güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
