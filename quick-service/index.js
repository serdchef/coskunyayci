/* Minimal quick-order microservice
   - Listens on port 5001
   - POST /quick-order { sku, name?, phone }
   - Creates a minimal Order row, Notification row, and enqueues a BullMQ job
*/

const http = require('http');
const { PrismaClient } = require('@prisma/client');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const prisma = new PrismaClient();
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
const notificationQueue = new Queue('notifications', { connection });

const PORT = process.env.QUICK_SERVICE_PORT || 5001;

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  // Add permissive CORS headers so the browser can call this service from
  // the frontend origin (development). In production narrow this to the
  // actual allowed origin.
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.QUICK_SERVICE_CORS_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-KEY',
  };

  res.writeHead(status, corsHeaders);
  res.end(body);
}

// Simple in-memory rate limiter and validation + API key
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
const ipMap = new Map(); // ip -> { count, windowStart }

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

async function handleQuickOrder(req, res) {
  try {
    // API key check (simple header-based)
    const expectedKey = process.env.QUICK_SERVICE_API_KEY;
    if (expectedKey) {
      const got = req.headers['x-api-key'] || req.headers['x-api-key'.toLowerCase()];
      if (!got || got !== expectedKey) {
        return sendJson(res, 401, { error: 'invalid api key' });
      }
    }

    const ip = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
    if (isRateLimited(ip)) return sendJson(res, 429, { error: 'rate_limited' });

    let raw = '';
    for await (const chunk of req) raw += chunk;
    let body = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      return sendJson(res, 400, { error: 'invalid_json' });
    }

    // Basic validation: accept { sku, phone, name } or { items: [{ sku, qty }], customer: { phone } }
    let sku = body.sku;
    let phone = body.phone;
    let name = body.name || (body.customer && body.customer.name) || 'Müşteri';
    if (!sku && Array.isArray(body.items) && body.items.length > 0) sku = body.items[0].sku;
    if (!phone && body.customer && body.customer.phone) phone = body.customer.phone;
    if (!sku || !phone) return sendJson(res, 400, { error: 'sku and phone required' });

    const product = await prisma.product.findUnique({ where: { sku } });
    if (!product) return sendJson(res, 404, { error: 'product not found' });

    const now = new Date();
    const order = await prisma.order.create({
      data: {
        orderNumber: `QK-${now.getTime()}`,
        customerName: name,
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

    await notificationQueue.add('send', {
      notificationId: notif.id,
      orderId: order.id,
      type: 'whatsapp',
      to: notif.to,
      body: notif.body,
    }, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
    });

    sendJson(res, 201, { success: true, orderId: order.id, orderNumber: order.orderNumber });
  } catch (err) {
    console.error('quick-order error', err);
    sendJson(res, 500, { error: 'internal' });
  }
}

const server = http.createServer((req, res) => {
  // Log incoming requests (method, url, remote ip) for debugging from browser
  const ip = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
  console.log(`[quick] ${new Date().toISOString()} ${ip} -> ${req.method} ${req.url}`);
  // CORS preflight
  if (req.method === 'OPTIONS' && req.url === '/quick-order') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': process.env.QUICK_SERVICE_CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-KEY',
    });
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/quick-order') {
    return handleQuickOrder(req, res);
  }
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Quick-order service listening on ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('shutting down quick service');
  await prisma.$disconnect();
  await connection.quit();
  process.exit(0);
});
