import { NextResponse } from 'next/server';

// Mock product data for development - 15 baklava varieties
const MOCK_PRODUCTS = [
  // KLASIK (3)
  { id: 'prod-1', sku: 'KLASIK_001', name: 'Antep Fıstıklı Klasik Baklava', category: 'Klasik', region: 'Gaziantep', basePrice: 350, description: 'Gaziantep\'in en ünlü fıstıklı baklavası. Katmanları arasında en kaliteli Antep fıstığı.', imageUrl: '/products/klasik-fistik.jpg', sortOrder: 1, isActive: true, isFeatured: true, variants: [ { id: 'v-1-1', size: '250g', price: 350 }, { id: 'v-1-2', size: '500g', price: 595 }, { id: 'v-1-3', size: '1kg', price: 980 } ] },
  { id: 'prod-2', sku: 'KLASIK_002', name: 'Sarıyer Baklava', category: 'Klasik', region: 'İstanbul', basePrice: 380, description: 'İstanbul Sarıyer\'in meşhur sarı renkli baklavası. Yoğun şerbeti ile efsanevi lezzeti.', imageUrl: '/products/sarıyer.jpg', sortOrder: 2, isActive: true, isFeatured: true, variants: [ { id: 'v-2-1', size: '250g', price: 380 }, { id: 'v-2-2', size: '500g', price: 646 }, { id: 'v-2-3', size: '1kg', price: 1064 } ] },
  { id: 'prod-3', sku: 'KLASIK_003', name: 'Bursa Baklava', category: 'Klasik', region: 'Bursa', basePrice: 360, description: 'Bursa\'nın kültürel mirasını yaşatan orijinal baklava.', imageUrl: '/products/bursa.jpg', sortOrder: 3, isActive: true, isFeatured: false, variants: [ { id: 'v-3-1', size: '250g', price: 360 }, { id: 'v-3-2', size: '500g', price: 612 }, { id: 'v-3-3', size: '1kg', price: 1008 } ] },
  // ANTEP FISTIKLI (2)
  { id: 'prod-4', sku: 'FISTIK_001', name: 'Premium Antep Fıstıklı', category: 'Antep Fıstıklı', region: 'Gaziantep', basePrice: 420, description: 'Seçilmiş Antep fıstığı ile hazırlanan premium baklava.', imageUrl: '/products/premium-fistik.jpg', sortOrder: 4, isActive: true, isFeatured: true, variants: [ { id: 'v-4-1', size: '250g', price: 420 }, { id: 'v-4-2', size: '500g', price: 714 }, { id: 'v-4-3', size: '1kg', price: 1176 } ] },
  { id: 'prod-5', sku: 'FISTIK_002', name: 'Mahalli Antep Fıstığı Baklava', category: 'Antep Fıstıklı', region: 'Gaziantep', basePrice: 390, description: 'Antep fıstığı ile yapılan, şerbetçi aşkı ile eşsiz baklava.', imageUrl: '/products/mahalli-fistik.jpg', sortOrder: 5, isActive: true, isFeatured: false, variants: [ { id: 'v-5-1', size: '250g', price: 390 }, { id: 'v-5-2', size: '500g', price: 663 }, { id: 'v-5-3', size: '1kg', price: 1092 } ] },
  // CIKOLATALI (2)
  { id: 'prod-6', sku: 'CHOCO_001', name: 'Belçika Çikolatalı Baklava', category: 'Çikolatalı', region: 'İstanbul', basePrice: 450, description: 'Belçika\'dan özel ithal çikolata ile yapılan modern baklava.', imageUrl: '/products/choco-belcika.jpg', sortOrder: 6, isActive: true, isFeatured: true, variants: [ { id: 'v-6-1', size: '250g', price: 450 }, { id: 'v-6-2', size: '500g', price: 765 }, { id: 'v-6-3', size: '1kg', price: 1260 } ] },
  { id: 'prod-7', sku: 'CHOCO_002', name: 'Siyah Çikolatalı Baklava', category: 'Çikolatalı', region: 'İstanbul', basePrice: 460, description: 'Yüksek kakao içerikli siyah çikolata ile sofistike baklava.', imageUrl: '/products/choco-siyah.jpg', sortOrder: 7, isActive: true, isFeatured: false, variants: [ { id: 'v-7-1', size: '250g', price: 460 }, { id: 'v-7-2', size: '500g', price: 782 }, { id: 'v-7-3', size: '1kg', price: 1288 } ] },
  // SERBETLI (2)
  { id: 'prod-8', sku: 'SERBETLI_001', name: 'Şerbetli Baklava Ekstra Tatlı', category: 'Şerbetli', region: 'Gaziantep', basePrice: 340, description: 'Ekstra şerbetli, tatlı severler için özel yapılmış baklava.', imageUrl: '/products/serbetli.jpg', sortOrder: 8, isActive: true, isFeatured: true, variants: [ { id: 'v-8-1', size: '250g', price: 340 }, { id: 'v-8-2', size: '500g', price: 578 }, { id: 'v-8-3', size: '1kg', price: 952 } ] },
  { id: 'prod-9', sku: 'SERBETLI_002', name: 'Hafif Şerbetli Baklava', category: 'Şerbetli', region: 'İstanbul', basePrice: 345, description: 'Az şerbeti ile yapılan, daha hafif ve zarif baklava.', imageUrl: '/products/hafif-serbetli.jpg', sortOrder: 9, isActive: true, isFeatured: false, variants: [ { id: 'v-9-1', size: '250g', price: 345 }, { id: 'v-9-2', size: '500g', price: 586 }, { id: 'v-9-3', size: '1kg', price: 966 } ] },
  // OZEL (3)
  { id: 'prod-10', sku: 'SPECIAL_001', name: 'Kaymaklı Baklava', category: 'Özel', region: 'İstanbul', basePrice: 520, description: 'Clotted cream ile yapılan lüks baklava.', imageUrl: '/products/kaymakli.jpg', sortOrder: 10, isActive: true, isFeatured: true, variants: [ { id: 'v-10-1', size: '250g', price: 520 }, { id: 'v-10-2', size: '500g', price: 884 }, { id: 'v-10-3', size: '1kg', price: 1456 } ] },
  { id: 'prod-11', sku: 'SPECIAL_002', name: 'Cevizli Baklava', category: 'Özel', region: 'Gaziantep', basePrice: 400, description: 'Şam cevizi ile yapılan sade ama zarif baklava.', imageUrl: '/products/cevizli.jpg', sortOrder: 11, isActive: true, isFeatured: false, variants: [ { id: 'v-11-1', size: '250g', price: 400 }, { id: 'v-11-2', size: '500g', price: 680 }, { id: 'v-11-3', size: '1kg', price: 1120 } ] },
  { id: 'prod-12', sku: 'SPECIAL_003', name: 'Dut Pekmezi Baklava', category: 'Özel', region: 'İzmir', basePrice: 480, description: 'Dut pekmezi ile tatlandırılan, sağlıklı ve doğal baklava.', imageUrl: '/products/dut-pekmezi.jpg', sortOrder: 12, isActive: true, isFeatured: true, variants: [ { id: 'v-12-1', size: '250g', price: 480 }, { id: 'v-12-2', size: '500g', price: 816 }, { id: 'v-12-3', size: '1kg', price: 1344 } ] },
  // KURUMSAL (3)
  { id: 'prod-13', sku: 'CORP_001', name: 'Kurumsal Prestij Seti', category: 'Kurumsal', region: 'İstanbul', basePrice: 1200, description: 'Şirketinizin değerini yansıtan premium kurumsal baklava seti.', imageUrl: '/products/corp-prestige.jpg', sortOrder: 13, isActive: true, isFeatured: true, variants: [ { id: 'v-13-1', size: '2kg', price: 1200 }, { id: 'v-13-2', size: '5kg', price: 2700 } ] },
  { id: 'prod-14', sku: 'CORP_002', name: 'Lüks İş Seti', category: 'Kurumsal', region: 'İstanbul', basePrice: 2500, description: 'Yönetici ve iş ortakları için hazırlanan eksklusif lüks baklava seti.', imageUrl: '/products/corp-luxury.jpg', sortOrder: 14, isActive: true, isFeatured: true, variants: [ { id: 'v-14-1', size: '5kg', price: 2500 }, { id: 'v-14-2', size: '10kg', price: 4500 } ] },
  { id: 'prod-15', sku: 'CORP_003', name: 'Kurumsal VIP Koleksiyonu', category: 'Kurumsal', region: 'İstanbul', basePrice: 3500, description: 'Tüm spesyal baklavalardan oluşan VIP kurumsal hediye seti.', imageUrl: '/products/corp-vip.jpg', sortOrder: 15, isActive: true, isFeatured: true, variants: [ { id: 'v-15-1', size: '10kg', price: 3500 }, { id: 'v-15-2', size: '20kg', price: 6300 } ] },
];

export async function GET() {
  return NextResponse.json(MOCK_PRODUCTS);
}

export async function POST(req: Request) {
  // For testing chatbot SKU validation
  const body = await req.json();
  const { sku } = body;

  if (!sku) {
    return NextResponse.json({ error: 'sku required' }, { status: 400 });
  }

  const product = MOCK_PRODUCTS.find((p) => p.sku === sku);
  if (!product) {
    return NextResponse.json({ error: 'product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
