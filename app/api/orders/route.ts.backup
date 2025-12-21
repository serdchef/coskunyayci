/**
 * POST /api/orders
 * Yeni sipariş oluşturma endpoint'i
 * 
 * Acceptance Criteria:
 * ✅ Valid body ile 201 dönmeli
 * ✅ Order DB'de oluşmalı
 * ✅ Twilio notification gönderilmeli
 * ✅ Payment link döndürülmeli (paymentMethod=link ise)
 * ✅ Hatalı telefon formatında 400 dönmeli
 * ✅ Rate limit aşılırsa 429 dönmeli
 */

import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/db';
import { 
  createOrderSchema, 
  validateInput, 
  checkRateLimit, 
  getClientIp,
  getUserAgent,
  getRateLimitHeaders 
} from '@/lib/security';
import { formatBusinessNotification } from '@/lib/twilio';
import { createStripeCheckoutSession } from '@/lib/payments';
// Logger is dynamically imported at runtime to avoid pulling pino/thread-stream
// into the Next server bundle during module initialization.
import { OrderStatus, PaymentMethod, PaymentStatus, DeliveryType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(`order:${clientIp}`, {
      windowMs: 300000, // 5 dakika
      maxRequests: 10,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen biraz bekleyip tekrar deneyin.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Request body'yi parse et
    const body = await request.json();

    // Input validation
    const validation = validateInput(createOrderSchema, body);
    if (!validation.success) {
      const errors = validation.errors?.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return NextResponse.json(
        { error: 'Geçersiz veri', details: errors },
        { status: 400 }
      );
    }

    const data = validation.data!;

    // Delivery type kontrolü
    if (data.deliveryType === 'delivery' && !data.address) {
      return NextResponse.json(
        { error: 'Adrese teslimat için adres bilgisi gerekli' },
        { status: 400 }
      );
    }

    // Ürünleri validate et ve fiyatları hesapla
    const productSkus = data.items.map((item) => item.sku);
    const products = await prisma.product.findMany({
      where: { 
        sku: { in: productSkus },
        isActive: true 
      },
    });

    if (products.length !== data.items.length) {
      return NextResponse.json(
        { error: 'Bazı ürünler bulunamadı veya aktif değil' },
        { status: 400 }
      );
    }

    // Stok kontrolü
    for (const item of data.items) {
      const product = products.find((p: any) => p.sku === item.sku);
      if (product && product.stockQty < item.qty) {
        return NextResponse.json(
          { error: `${product.name} için yeterli stok yok` },
          { status: 400 }
        );
      }
    }

    // Fiyat hesaplama
    let subtotalCents = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p: any) => p.sku === item.sku)!;
      const itemTotal = product.priceCents * item.qty;
      subtotalCents += itemTotal;

      return {
        sku: product.sku,
        name: product.name,
        qty: item.qty,
        priceCents: product.priceCents,
        options: {},
      };
    });

    // Kupon kontrolü ve indirim hesaplama
    let discountCents = 0;
    let couponCode: string | undefined;

    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const now = new Date();
        const isValid =
          (!coupon.validFrom || coupon.validFrom <= now) &&
          (!coupon.validTo || coupon.validTo >= now) &&
          (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) &&
          (!coupon.minOrderAmount || subtotalCents >= coupon.minOrderAmount);

        if (isValid) {
          if (coupon.type === 'PERCENTAGE' && coupon.discountPercent) {
            discountCents = Math.floor((subtotalCents * coupon.discountPercent) / 100);
          } else if (coupon.type === 'FIXED_AMOUNT' && coupon.discountAmount) {
            discountCents = coupon.discountAmount;
          }

          // Maksimum indirim kontrolü
          if (coupon.maxDiscountAmount && discountCents > coupon.maxDiscountAmount) {
            discountCents = coupon.maxDiscountAmount;
          }

          couponCode = coupon.code;
        }
      }
    }

    // Teslimat ücreti
    const deliveryFeeCents = data.deliveryType === 'delivery' 
      ? (subtotalCents >= 50000 ? 0 : 0) // 500 TL üzeri ücretsiz
      : 0;

    // Vergi hesaplama
    const taxCents = Math.floor((subtotalCents - discountCents + deliveryFeeCents) * 0.18);

    // Toplam tutar
    const totalCents = subtotalCents - discountCents + deliveryFeeCents + taxCents;

    // Sipariş numarası oluştur
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const randomPart = nanoid(4).toUpperCase();
    const orderNumber = `BK-${dateStr}-${randomPart}`;

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customer.name,
        customerPhone: data.customer.phone,
        customerEmail: data.customer.email,
        items: orderItems,
        subtotalCents,
        taxCents,
        discountCents,
        deliveryFeeCents,
        totalCents,
        status: OrderStatus.PENDING,
        deliveryType: data.deliveryType as DeliveryType,
        address: data.address,
        paymentMethod: data.paymentMethod === 'cash' 
          ? PaymentMethod.CASH 
          : PaymentMethod.STRIPE,
        paymentStatus: PaymentStatus.PENDING,
        couponCode,
        source: 'chatbot',
        ipAddress: clientIp,
        userAgent: getUserAgent(request),
        notes: data.notes,
      },
    });

    // Kupon kullanım sayısını artır
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usageCount: { increment: 1 } },
      });
    }

    // Stok güncelle
    for (const item of orderItems) {
      await prisma.product.update({
        where: { sku: item.sku },
        data: { stockQty: { decrement: item.qty } },
      });
    }

  // Lazy-load logger helpers to avoid importing heavy logging libraries when
  // the module is evaluated by Next during bundling.
  const { logOrder } = await import('@/lib/logger');
  logOrder(order.id, 'created', { orderNumber, totalCents });

    // Create a persistent Notification record and enqueue it for background sending
    const itemsText = orderItems.map((item) => `${item.qty}x ${item.name}`).join('\n');
    const messageBody = formatBusinessNotification({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      items: itemsText,
      totalAmount: `${(totalCents / 100).toFixed(2)} TL`,
      deliveryType: data.deliveryType === 'delivery' ? 'Adrese Teslimat' : 'Mağazadan Teslim',
      address: data.address ? `${data.address.street}, ${data.address.district}, ${data.address.city}` : undefined,
      phone: order.customerPhone,
    });

    try {
      const notif = await prisma.notification.create({
        data: {
          orderId: order.id,
          type: 'whatsapp',
          to: process.env.BUSINESS_PHONE_NUMBER || '',
          body: messageBody,
          status: 'PENDING',
        },
      });

      // Enqueue background job
      const { enqueueNotification } = await import('@/lib/notifications');
      await enqueueNotification({
        notificationId: notif.id,
        orderId: order.id,
        type: 'whatsapp',
        to: process.env.BUSINESS_PHONE_NUMBER || '',
        body: messageBody,
      });
    } catch (err) {
      const { default: logger } = await import('@/lib/logger');
      logger.error({ err, orderId: order.id }, 'Failed to persist/enqueue business notification');
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        entity: 'Order',
        entityId: order.id,
        action: 'CREATE',
        payload: { orderNumber, totalCents },
        actorType: 'customer',
        ipAddress: clientIp,
        userAgent: getUserAgent(request),
      },
    });

    // Analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventName: 'order_placed',
        properties: {
          orderNumber,
          totalCents,
          itemCount: orderItems.length,
          paymentMethod: data.paymentMethod,
        },
        sessionId: request.headers.get('x-session-id') || undefined,
      },
    });

    // Ödeme linki oluştur (paymentMethod=link ise)
    let paymentLink: string | undefined;
    if (data.paymentMethod === 'link') {
      try {
        const checkoutSession = await createStripeCheckoutSession({
          orderId: order.id,
          orderNumber: order.orderNumber,
          items: orderItems.map((item) => ({
            name: item.name,
            quantity: item.qty,
            priceCents: item.priceCents,
          })),
          totalCents,
          customerEmail: data.customer.email,
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?orderId=${order.id}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/order/cancel?orderId=${order.id}`,
        });

        paymentLink = checkoutSession.url;

        // Payment intent ID'yi kaydet
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentIntentId: checkoutSession.sessionId },
        });
      } catch (error) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error, orderId: order.id }, 'Failed to create payment link');
        // Ödeme linki oluşturulamazsa kapıda ödeme'ye geri dön
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentMethod: PaymentMethod.CASH },
        });
      }
    }

    // Response
    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalCents,
        paymentLink,
        message: 'Siparişiniz başarıyla oluşturuldu',
      },
      { 
        status: 201,
        headers: getRateLimitHeaders(rateLimitResult)
      }
    );

  } catch (error: any) {
  const { default: logger } = await import('@/lib/logger');
  logger.error({ error }, 'Order creation error');

    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Sipariş listesi (Admin için)
export async function GET(request: NextRequest) {
  try {
    // TODO: Auth kontrolü ekle (NextAuth session)
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error }, 'Get orders error');
    return NextResponse.json(
      { error: 'Siparişler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}
