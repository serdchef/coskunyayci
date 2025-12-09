/**
 * POST /api/chatbot
 * Chatbot mesaj işleme endpoint'i
 */

import { NextRequest, NextResponse } from 'next/server';
import { processChatbotMessage } from '@/lib/openai';
// Lazy-load logger inside handler to avoid pulling pino/thread-stream into Next
// server bundles during module initialization.
import { checkRateLimit } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimitResult = await checkRateLimit(`chatbot:${clientIp}`, {
      windowMs: 60000, // 1 dakika
      maxRequests: 30,
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen biraz bekleyin.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, currentSlots, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      );
    }

    // OpenAI ile mesajı işle
    const result = await processChatbotMessage(
      message,
      currentSlots || {},
      conversationHistory || []
    );

    const { default: logger } = await import('@/lib/logger');
    logger.info(
      {
        messageLength: message.length,
        isComplete: result.isComplete,
        missingSlots: result.missingSlots,
      },
      'Chatbot message processed'
    );

    return NextResponse.json(result);

  } catch (error: any) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error }, 'Chatbot processing error');
    return NextResponse.json(
      { 
        error: 'Mesaj işlenemedi',
        message: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' 
      },
      { status: 500 }
    );
  }
}
