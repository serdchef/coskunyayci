/**
 * OpenAI Adapter
 * Chatbot ve AI video script generation için wrapper
 */

import OpenAI from 'openai';
// Avoid importing logger at module init to prevent pulling pino/thread-stream
// into server bundles. Logger will be lazy-loaded where needed.

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

const getOpenAI = (): OpenAI | null => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

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
  const client = getOpenAI();
  if (!client) {
    return {
      message: 'Chatbot şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
      missingSlots: [],
      extractedSlots: currentSlots,
      isComplete: false,
    };
  }
  
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      {
        role: 'user',
        content: `Kullanıcı mesajı: "${userMessage}"\n\nMevcut slotlar: ${JSON.stringify(currentSlots)}`,
      },
    ];

    const completion = await client.chat.completions.create({
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
    const botMessage = responseMessage.content || 'Üzgünüm, anlayamadım. Tekrar eder misiniz?';

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
  const client = getOpenAI();
  if (!client) {
    return [];
  }
  
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

    const completion = await client.chat.completions.create({
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

// ============================================================================
// AI SOMMELIER - "Dijital Zümrüt Sarayı" Premium Recommendation Engine
// ============================================================================

/**
 * Premium Baklava Dataset - 16 signature products
 */
export const BAKLAVA_PRODUCTS = [
  {
    id: '1',
    name: 'Sarayın Defteri',
    type: 'Pistachio Roll',
    description: 'Boz fıstık, kaymak ve yağlı hamur',
    flavor_profile: 'nutty, creamy, rich',
    price_range: '₺45-65',
  },
  {
    id: '2',
    name: 'Boz Fıstık Sultani',
    type: 'Premium Pistachio Layers',
    description: 'İran boz fıstığı, 7 kat hamur',
    flavor_profile: 'aromatic, delicate, luxurious',
    price_range: '₺75-125',
  },
  {
    id: '3',
    name: 'Ceviz Çeyizi',
    type: 'Walnut Baklava',
    description: 'Antep cevizi, tarçın, yağlı hamur',
    flavor_profile: 'warm, spiced, traditional',
    price_range: '₺35-55',
  },
  {
    id: '4',
    name: 'Fındık Hasreti',
    type: 'Hazelnut Dreams',
    description: 'Ordu fındığı, kaymak, bal şerbeti',
    flavor_profile: 'sweet, nutty, velvety',
    price_range: '₺40-60',
  },
  {
    id: '5',
    name: 'Antep Sultanı',
    type: 'Antep Pistachio Supreme',
    description: 'Antep fıstığı, kayısı, tarçın',
    flavor_profile: 'sophisticated, balanced, premium',
    price_range: '₺50-80',
  },
  {
    id: '6',
    name: 'Kaymak Şarkısı',
    type: 'Cream & Pistachio',
    description: 'Boz fıstık, Bursa kaymağı, bal',
    flavor_profile: 'creamy, indulgent, refined',
    price_range: '₺55-85',
  },
  {
    id: '7',
    name: 'Tarih Sarayı',
    type: 'Ottoman Heritage',
    description: 'Geleneksel Osmanlı reçetesi, 16. yüzyıl',
    flavor_profile: 'historic, complex, timeless',
    price_range: '₺60-100',
  },
  {
    id: '8',
    name: 'Şerbet Gülü',
    type: 'Rose & Pistachio',
    description: 'Gül suyu, boz fıstık, şerbet',
    flavor_profile: 'floral, romantic, elegant',
    price_range: '₺45-70',
  },
  {
    id: '9',
    name: 'Fıstık Hazinesi',
    type: 'Mixed Pistachio Treasure',
    description: 'Boz, Antep, Kırmızı fıstık karması',
    flavor_profile: 'complex, layered, diverse',
    price_range: '₺65-110',
  },
  {
    id: '10',
    name: 'Çikolata Sarayı',
    type: 'Premium Chocolate Baklava',
    description: 'Belçika çikolatası, boz fıstık',
    flavor_profile: 'decadent, modern, luxurious',
    price_range: '₺70-120',
  },
  {
    id: '11',
    name: 'Bal Kaplı İstanbul',
    type: 'Honey-Drizzled Luxury',
    description: 'Çam balı, boz fıstık, hint baharası',
    flavor_profile: 'sweet, aromatic, sophisticated',
    price_range: '₺50-75',
  },
  {
    id: '12',
    name: 'Usta Elleri',
    type: 'Artisan Crafted',
    description: 'El yapımı, 48 saat hazırlama',
    flavor_profile: 'authentic, handmade, premium',
    price_range: '₺80-150',
  },
  {
    id: '13',
    name: 'Kış Sofrası',
    type: 'Seasonal Spiced Collection',
    description: 'Tarçın, karanfil, boz fıstık',
    flavor_profile: 'warm, spiced, comforting',
    price_range: '₺45-65',
  },
  {
    id: '14',
    name: 'Düğün Zarı',
    type: 'Wedding Celebration',
    description: 'Özel kurdeleden sunuş, premium seçim',
    flavor_profile: 'celebratory, refined, special',
    price_range: '₺100-200',
  },
  {
    id: '15',
    name: 'Gece Aşkı',
    type: 'Midnight Indulgence',
    description: 'Koyu çikolata, boz fıstık, kahve nota',
    flavor_profile: 'rich, mysterious, luxurious',
    price_range: '₺65-115',
  },
  {
    id: '16',
    name: 'Sarayın Gözdesi',
    type: 'The Palace\'s Favorite',
    description: 'En popüler başyapıt, sınırlı miktar',
    flavor_profile: 'timeless, beloved, iconic',
    price_range: '₺55-95',
  },
];

const SOMMELIER_SYSTEM_PROMPT = `Sen "Dijital Zümrüt Sarayı"nın prestijli AI Sommelieri'sin.
Müşteri hizmetinde dört yüz yıllık Osmanlı lüksü ve modern sofistikasyonu bir araya getiriyorsun.

TAVIR:
- Müşteri adını bilmiyorsan, "Sarayın Konuğu" olarak hitap et
- Kişiselleştirilmiş ve entelektüel tavsiyeler ver
- Boz fıstık kalitesine, lüksün tanımına göndermeler yap
- Zarif, bilgilendirici, max 150 kelime

ÜRÜNLER:
${BAKLAVA_PRODUCTS.map((p) => `• ${p.name}: ${p.type} | ${p.description}`).join('\n')}

YANIT STİLİ:
- Müşteri talebine göre ürün tavsiye et
- Ürün adlarını tam yaz
- Lüks ve sofistikasyon diliyle
- "Sarayın Kapısı"nda memnun olmakla kapat`;

/**
 * Get AI Sommelier recommendation for guest
 */
export async function getSommelierRecommendation(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
) {
  const client = getOpenAI();
  if (!client) {
    return 'Üzgünüm, AI Sommelier hizmetimiz şu an kullanılamıyor.';
  }

  try {
    const messages = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: userMessage,
      },
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SOMMELIER_SYSTEM_PROMPT,
        },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || 'Bir hata oluştu. Lütfen tekrar dene.';
  } catch (error) {
    (async () => {
      const { default: logger } = await import('./logger');
      logger.error({ error }, 'AI Sommelier error');
    })();
    return 'Üzgünüm, tavsiye alınırken bir sorun oluştu.';
  }
}

export default openai;
