/**
 * Security Utilities
 * Rate limiting, input validation, CSRF protection
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
// Lazy-load logger inside functions to avoid pulling pino/thread-stream into
// server bundles during module initialization.

// ============================================================================
// RATE LIMITING (Redis tabanlı)
// ============================================================================

type RateLimitStore = Map<string, { count: number; resetAt: number }>;
const rateLimitStore: RateLimitStore = new Map();

export type RateLimitConfig = {
  windowMs: number; // Zaman penceresi (ms)
  maxRequests: number; // Maksimum istek sayısı
};

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {
    windowMs: 60000, // 1 dakika
    maxRequests: 100,
  }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const key = `rate_limit:${identifier}`;

  // Mevcut kayıt
  let record = rateLimitStore.get(key);

  // Süresi dolmuşsa sıfırla
  if (!record || now > record.resetAt) {
    record = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }

  // İstek sayısını artır
  record.count += 1;
  rateLimitStore.set(key, record);

  // Limit kontrolü
  const allowed = record.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - record.count);

  if (!allowed) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.warn({ identifier, count: record.count }, 'Rate limit exceeded');
    })();
  }

  return {
    allowed,
    remaining,
    resetAt: record.resetAt,
  };
}

// Rate limit header'ları döndür
export function getRateLimitHeaders(result: {
  remaining: number;
  resetAt: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
  };
}

// ============================================================================
// INPUT VALIDATION (Zod schemas)
// ============================================================================

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Geçersiz telefon numarası')
  .transform((val) => val.replace(/\s/g, ''));

export const emailSchema = z.string().email('Geçersiz e-posta adresi');

export const orderItemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  qty: z.number().int().positive(),
  priceCents: z.number().int().positive(),
  options: z.record(z.unknown()).optional(),
});

export const addressSchema = z.object({
  street: z.string().min(5, 'Adres çok kısa'),
  district: z.string().min(2),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'En az bir ürün seçmelisiniz'),
  customer: z.object({
    name: z.string().min(2, 'İsim çok kısa'),
    phone: phoneSchema,
    email: emailSchema.optional(),
  }),
  deliveryType: z.enum(['pickup', 'delivery']),
  address: addressSchema.optional(),
  paymentMethod: z.enum(['cash', 'link', 'bank_transfer']),
  couponCode: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// ============================================================================
// CSRF PROTECTION
// ============================================================================

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCsrfToken(token: string, expectedToken: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken));
}

// ============================================================================
// INPUT SANITIZATION
// ============================================================================

export function sanitizeHtml(input: string): string {
  // Basit HTML sanitization - production'da dompurify kullanılmalı
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input.trim().slice(0, maxLength);
}

// ============================================================================
// IP ve USER AGENT EXTRACTION
// ============================================================================

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// ============================================================================
// WEBHOOK SIGNATURE VERIFICATION
// ============================================================================

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    const expectedSignature = `sha256=${digest}`;
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error }, 'Webhook signature verification error');
    })();
    return false;
  }
}

// ============================================================================
// PASSWORD HASHING
// ============================================================================

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
}

// ============================================================================
// SECURE RANDOM STRING
// ============================================================================

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

// ============================================================================
// XSS PROTECTION HEADERS
// ============================================================================

export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
