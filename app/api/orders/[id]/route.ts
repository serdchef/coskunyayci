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

// GET - Sipariş detayı (Phase 2)
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    try {
      const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          address: true,
        },
      });

      if (!order) {
        // For mock orders, still return fallback
        if (params.id.startsWith('ORDER-')) {
          return NextResponse.json({
            order: {
              id: params.id,
              status: 'CONFIRMED',
              totalPrice: 0,
              items: [],
              createdAt: new Date().toISOString(),
              fallback: true,
            },
          });
        }
        return NextResponse.json(
          { error: 'Sipariş bulunamadı' },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    } catch (dbError) {
      // Phase 2: Fallback for database errors with mock IDs
      if (params.id.startsWith('ORDER-')) {
        return NextResponse.json({
          order: {
            id: params.id,
            status: 'CONFIRMED',
            totalPrice: 0,
            items: [],
            createdAt: new Date().toISOString(),
            fallback: true,
          },
        });
      }
      throw dbError;
    }
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

    try {
      // Mevcut siparişi kontrol et
      const existingOrder = await prisma.order.findUnique({
        where: { id: params.id },
      });

      if (!existingOrder) {
        // Phase 1: Fallback for mock orders
        if (params.id.startsWith('ORDER-')) {
          return NextResponse.json({
            success: true,
            order: {
              id: params.id,
              status: status || 'CONFIRMED',
              totalPrice: 0,
              items: [],
              createdAt: new Date().toISOString(),
              fallback: true,
            },
            message: 'Sipariş güncellendi (Phase 1 Mock)',
          });
        }
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

      return NextResponse.json({
        success: true,
        order,
        message: 'Sipariş güncellendi',
      });
    } catch (dbError) {
      // Phase 1: Fallback for database errors with mock orders
      if (params.id.startsWith('ORDER-')) {
        return NextResponse.json({
          success: true,
          order: {
            id: params.id,
            status: status || 'CONFIRMED',
            totalPrice: 0,
            items: [],
            createdAt: new Date().toISOString(),
            fallback: true,
          },
          message: 'Sipariş güncellendi (Phase 1 Mock)',
        });
      }
      throw dbError;
    }
  } catch (error) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error, orderId: params.id }, 'Update order error');
    return NextResponse.json(
      { error: 'Sipariş güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}
