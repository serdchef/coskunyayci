/**
 * OpenAI Adapter
 * Chatbot ve AI video script generation için wrapper
 */

import OpenAI from 'openai';
// Avoid importing logger at module init to prevent pulling pino/thread-stream
// into server bundles. Logger will be lazy-loaded where needed.

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// CHATBOT - Sipariş Slot Filling
// ============================================================================

export type ChatbotSlot = {
  productSku?: string;
  qty?: number;
  deliveryType?: 'pickup' | 'delivery';
  address?: string;
  phone?: string;
  paymentChoice?: 'cash' | 'link';
};

export type ChatbotResponse = {
  message: string;
  missingSlots: string[];
  extractedSlots: Partial<ChatbotSlot>;
  isComplete: boolean;
  intent?: 'order' | 'inquiry' | 'complaint' | 'other';
};

const SYSTEM_PROMPT = `Sen Coşkun Yayçı Baklava'nın dijital asistanısın. Türkçe konuşuyorsun.
Görevin: Müşterilerin baklava siparişi vermesine yardımcı olmak.

Zorunlu slotlar:
1. productSku (FISTIK_1KG, CLASSIC_1KG, SARMA_500G, CHOCO_500G, SPECIAL_1KG)
2. qty (adet)
3. deliveryType (pickup veya delivery)
4. phone (müşteri telefonu)
5. address (sadece deliveryType=delivery ise)
6. paymentChoice (cash=kapıda ödeme, link=online ödeme)

Kurallar:
- Dostça ve profesyonel ol
- Her seferinde bir slot sor
- Kullanıcının verdiği bilgiyi doğrula
- Belirsizlik varsa açıklama iste
- Tüm slotlar dolunca özet göster`;

export async function processChatbotMessage(
  userMessage: string,
  currentSlots: Partial<ChatbotSlot> = {},
  conversationHistory: OpenAI.Chat.ChatCompletionMessageParam[] = []
): Promise<ChatbotResponse> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      {
        role: 'user',
        content: `Kullanıcı mesajı: "${userMessage}"\n\nMevcut slotlar: ${JSON.stringify(currentSlots)}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
      functions: [
        {
          name: 'extract_order_slots',
          description: 'Kullanıcı mesajından sipariş bilgilerini çıkar',
          parameters: {
            type: 'object',
            properties: {
              productSku: {
                type: 'string',
                enum: ['FISTIK_1KG', 'CLASSIC_1KG', 'SARMA_500G', 'CHOCO_500G', 'SPECIAL_1KG'],
              },
              qty: { type: 'number' },
              deliveryType: { type: 'string', enum: ['pickup', 'delivery'] },
              address: { type: 'string' },
              phone: { type: 'string' },
              paymentChoice: { type: 'string', enum: ['cash', 'link'] },
            },
          },
        },
      ],
      function_call: 'auto',
    });

    const responseMessage = completion.choices[0].message;
    let extractedSlots: Partial<ChatbotSlot> = { ...currentSlots };
    let botMessage = responseMessage.content || 'Üzgünüm, anlayamadım. Tekrar eder misiniz?';

    // Function call varsa slot'ları güncelle
    if (responseMessage.function_call) {
      try {
        const args = JSON.parse(responseMessage.function_call.arguments);
        extractedSlots = { ...extractedSlots, ...args };
      } catch (e) {
        (async () => {
          const { default: logger } = await import('./logger');
          logger.error({ error: e }, 'Function call parse hatası');
        })();
      }
    }

    // Eksik slot'ları belirle
    const requiredSlots = ['productSku', 'qty', 'deliveryType', 'phone', 'paymentChoice'];
    if (extractedSlots.deliveryType === 'delivery') {
      requiredSlots.push('address');
    }

    const missingSlots = requiredSlots.filter((slot) => !extractedSlots[slot as keyof ChatbotSlot]);
    const isComplete = missingSlots.length === 0;

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info({ extractedSlots, missingSlots, isComplete }, 'Chatbot slot extraction');
    })();

    return {
      message: botMessage,
      missingSlots,
      extractedSlots,
      isComplete,
    };
  } catch (error) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error }, 'OpenAI chatbot error');
    })();
    throw new Error('Chatbot işlemi başarısız oldu');
  }
}

// ============================================================================
// VIDEO SCRIPT GENERATION
// ============================================================================

export type VideoScriptScene = {
  sceneNumber: number;
  duration: number; // saniye
  visualDescription: string;
  voiceover: string;
  textOverlay?: string;
};

export type VideoScriptParams = {
  productName: string;
  productDescription: string;
  targetAudience: string;
  duration: number; // toplam saniye
  language: 'tr' | 'en';
  theme?: string; // örn: 'modern', 'traditional', 'luxury'
};

export async function generateVideoScript(params: VideoScriptParams): Promise<VideoScriptScene[]> {
  try {
    const prompt = `${params.language === 'tr' ? 'Türkçe' : 'İngilizce'} bir reklam video senaryosu oluştur:

Ürün: ${params.productName}
Açıklama: ${params.productDescription}
Hedef Kitle: ${params.targetAudience}
Video Süresi: ${params.duration} saniye
Tema: ${params.theme || 'modern ve çekici'}

Senaryo ${params.duration <= 15 ? '3' : params.duration <= 30 ? '5' : '7'} sahne içermelidir.
Her sahne için:
- Görsel açıklama (kamera açısı, ürün görüntüsü)
- Voiceover metni (kısa ve etkili)
- Ekran metni (varsa)

JSON formatında döndür:
[{
  "sceneNumber": 1,
  "duration": 5,
  "visualDescription": "...",
  "voiceover": "...",
  "textOverlay": "..."
}]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Sen profesyonel bir reklam senaryosu yazarısın. JSON formatında cevap ver.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(responseContent);
    const scenes: VideoScriptScene[] = parsed.scenes || [];

    (async () => {
      const { default: logger } = await import('./logger');
      logger.info({ productName: params.productName, scenesCount: scenes.length }, 'Video script generated');
    })();

    return scenes;
  } catch (error) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error, params }, 'Video script generation error');
    })();
    throw new Error('Video senaryosu oluşturulamadı');
  }
}

export default openai;
