import { NextResponse } from 'next/server';

// Baklava database
const BAKLAVAS = [
  {
    id: 1,
    name: 'Antep Fıstıklı Klasik Baklava',
    category: 'Klasik',
    flavor: 'Yoğun Antep fıstığı, hafif şerbet',
    texture: 'crispy',
    price: 350,
    bestFor: ['teatime', 'solo', 'sharing'],
    pairing: ['çay', 'kahve'],
    tags: ['nutty', 'crispy', 'classic'],
  },
  {
    id: 2,
    name: 'Belçika Çikolatalı Baklava',
    category: 'Çikolatalı',
    flavor: 'Belçika çikolatası, hafif şerbet',
    texture: 'buttery',
    price: 450,
    bestFor: ['gift', 'small_group'],
    pairing: ['kahve', 'sıcak çikolata'],
    tags: ['chocolate', 'buttery', 'premium'],
  },
  {
    id: 3,
    name: 'Kaymaklı Baklava',
    category: 'Özel',
    flavor: 'Clotted cream, hafif şerbet',
    texture: 'buttery',
    price: 520,
    bestFor: ['gift', 'teatime', 'small_group'],
    pairing: ['kahve', 'çay'],
    tags: ['regional', 'buttery', 'luxury'],
  },
  {
    id: 4,
    name: 'Cevizli Baklava',
    category: 'Özel',
    flavor: 'Şam cevizi, klasik şerbet',
    texture: 'balanced',
    price: 400,
    bestFor: ['sharing', 'small_group'],
    pairing: ['çay', 'kahve'],
    tags: ['nutty', 'balanced', 'traditional'],
  },
  {
    id: 5,
    name: 'Dut Pekmezi Baklava',
    category: 'Özel',
    flavor: 'Dut pekmezi, doğal tatlandırma',
    texture: 'balanced',
    price: 480,
    bestFor: ['sharing', 'gift'],
    pairing: ['çay', 'maden suyu'],
    tags: ['sweet', 'regional', 'healthy'],
  },
  {
    id: 6,
    name: 'Sarıyer Baklava',
    category: 'Klasik',
    flavor: 'Yoğun şerbet, geleneksel',
    texture: 'crispy',
    price: 380,
    bestFor: ['teatime', 'sharing'],
    pairing: ['çay', 'kahve'],
    tags: ['sweet', 'crispy', 'classic'],
  },
];

export async function POST(request: Request) {
  try {
    const { answers } = await request.json();

    if (!answers || answers.length === 0) {
      return NextResponse.json({ error: 'Cevaplar gerekli' }, { status: 400 });
    }

    // Basit eşleştirme algoritması
    let scoreMap: { [key: number]: number } = {};
    BAKLAVAS.forEach((b) => {
      scoreMap[b.id] = 0;
    });

    // Tag tabanlı matching
    const answerTags = answers;
    BAKLAVAS.forEach((baklava) => {
      answerTags.forEach((tag: string) => {
        if (baklava.tags.includes(tag)) {
          scoreMap[baklava.id]++;
        }
      });
    });

    // En yüksek puan alan baklava
    const bestMatch = Object.keys(scoreMap).reduce((prev, current) =>
      scoreMap[parseInt(current)] > scoreMap[parseInt(prev)] ? current : prev
    );

    const recommendation = BAKLAVAS.find((b) => b.id === parseInt(bestMatch)) || BAKLAVAS[0];

    return NextResponse.json({
      success: true,
      recommendation: {
        productName: recommendation.name,
        category: recommendation.category,
        flavor: recommendation.flavor,
        texture: recommendation.texture,
        price: recommendation.price,
        bestFor: recommendation.bestFor,
        pairing: recommendation.pairing,
        reason: `${recommendation.name} sizin tercihlerinize perfect uyum sağlıyor.`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'API hatası' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    baklavas: BAKLAVAS,
    totalProducts: BAKLAVAS.length,
  });
}
