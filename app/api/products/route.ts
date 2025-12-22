import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Define product types inline (Prisma types may not be available at build time)
interface ProductVariantType {
  id: string;
  size: string;
  price: number;
  stock: number;
}

interface ProductType {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  basePrice: number;
  category: string;
  region: string;
  productType: string;
  image: string | null;
  variants: ProductVariantType[];
}

// Fallback ürünler - Vercel'de veritabanı yoksa bunlar gösterilir
const FALLBACK_PRODUCTS = [
  { id: 'fallback-1', sku: 'KLASIK_001', name: 'Klasik Baklava', description: 'Gaziantep\'in en meşhur klasik baklavası.', basePrice: 1487.70, category: 'Klasik', region: 'Gaziantep', productType: 'CLASSIC', image: '/images/products/klasik.jpg', variants: [{ id: 'v1', size: '250g', price: 1487.70, stock: 100 }, { id: 'v2', size: '500g', price: 2529.09, stock: 100 }] },
  { id: 'fallback-2', sku: 'KLASIK_002', name: 'Kare Baklava', description: 'Kare şeklinde hazırlanmış, ince fıstıklı baklava.', basePrice: 1487.70, category: 'Klasik', region: 'Gaziantep', productType: 'CLASSIC', image: '/images/products/kare-baklava.jpg', variants: [{ id: 'v3', size: '250g', price: 1487.70, stock: 100 }] },
  { id: 'fallback-3', sku: 'KLASIK_003', name: 'Yaprak Sabiyet', description: 'İnce yapraklar arasında badem ve fıstıkla hazırlanmış baklava.', basePrice: 1487.70, category: 'Klasik', region: 'Gaziantep', productType: 'CLASSIC', image: '/images/products/yaprak-sobiyet.jpg', variants: [] },
  { id: 'fallback-4', sku: 'FISTIK_001', name: 'Antep Özel', description: 'Gaziantep fıstığının en seçkin taneleriyle hazırlanmış özel baklava.', basePrice: 1689.70, category: 'Fıstık', region: 'Gaziantep', productType: 'PISTACHIO', image: '/images/products/antep-ozel.jpg', variants: [] },
  { id: 'fallback-5', sku: 'FISTIK_002', name: 'Cevizli Baklava', description: 'Ceviz içeriği ile zenginleştirilmiş leziz baklava.', basePrice: 1689.70, category: 'Fıstık', region: 'Gaziantep', productType: 'PISTACHIO', image: '/images/products/cevizli.jpg', variants: [] },
  { id: 'fallback-6', sku: 'FISTIK_003', name: 'Dolama', description: 'Özel tarif ile yapılmış dolama baklava.', basePrice: 1689.70, category: 'Fıstık', region: 'Gaziantep', productType: 'PISTACHIO', image: '/images/products/dolama.jpg', variants: [] },
  { id: 'fallback-7', sku: 'CHOCO_001', name: 'Havuç Dilimi', description: 'Havuç şeklinde dilimlenmiş, soslu ve leziz baklava.', basePrice: 1869.70, category: 'Çikolata', region: 'Gaziantep', productType: 'CHOCOLATE', image: '/images/products/havuc-dilimi.jpg', variants: [] },
  { id: 'fallback-8', sku: 'CHOCO_002', name: 'Soğuk Baklava', description: 'Soğuk olarak sunulan, tazeliğini haftalar boyunca koruyan baklava.', basePrice: 1869.70, category: 'Çikolata', region: 'Gaziantep', productType: 'CHOCOLATE', image: '/images/products/soguk-baklava.jpg', variants: [] },
  { id: 'fallback-9', sku: 'SPECIAL_001', name: 'Karışık Baklava', description: 'Tüm çeşitlerimizin bir arada sunulduğu özel karışım baklava.', basePrice: 1987.70, category: 'Özel', region: 'Gaziantep', productType: 'SPECIALTY', image: '/images/products/karisik.jpg', variants: [] },
  { id: 'fallback-10', sku: 'TRAY_001', name: 'Kare Baklava Tepsi', description: 'Misafirlerinizi etkileyecek kare baklava tepsi sunumu.', basePrice: 1200, category: 'Tepsili', region: 'Gaziantep', productType: 'TRAY', image: '/images/products/kare-baklava-tepsi.jpg', variants: [] },
  { id: 'fallback-11', sku: 'TRAY_002', name: 'Karışık Baklava Tepsi', description: 'Tüm baklava çeşitlerinin bir araya getirildiği lüks tepsi sunumu.', basePrice: 1300, category: 'Tepsili', region: 'Gaziantep', productType: 'TRAY', image: '/images/products/karisik-baklava-tepsi.jpg', variants: [] },
  { id: 'fallback-12', sku: 'TRAY_003', name: 'Seni Sahlayan Tepsi', description: 'Özel günleriniz için hazırlanmış seçkin baklava tepsi.', basePrice: 1350, category: 'Tepsili', region: 'Gaziantep', productType: 'TRAY', image: '/images/products/karisik-baklava-tepsi.jpg', variants: [] },
  { id: 'fallback-13', sku: 'TRAY_004', name: 'Yönetici Tepsi', description: 'Kurumsal hediyeler için en özel tepsi sunumu.', basePrice: 1500, category: 'Tepsili', region: 'Gaziantep', productType: 'TRAY', image: '/images/products/kare-baklava-tepsi.jpg', variants: [] },
  { id: 'fallback-14', sku: 'CORP_001', name: 'Kurumsal Klasik Tepsi', description: 'Şirketleriniz için hazırlanmış kurumsal baklava tepsi.', basePrice: 2500, category: 'Kurumsal', region: 'Gaziantep', productType: 'CORPORATE', image: '/images/products/kare-baklava-tepsi.jpg', variants: [] },
  { id: 'fallback-15', sku: 'CORP_002', name: 'Executive Baklava Seti', description: 'İş ortaklarınıza sunabileceğiniz premium baklava seti.', basePrice: 2700, category: 'Kurumsal', region: 'Gaziantep', productType: 'CORPORATE', image: '/images/products/karisik-baklava-tepsi.jpg', variants: [] },
  { id: 'fallback-16', sku: 'CORP_003', name: 'VIP Baklava Koleksiyonu', description: 'VIP müşterileriniz için tasarlanmış özel baklava seçkisi.', basePrice: 3000, category: 'Kurumsal', region: 'Gaziantep', productType: 'CORPORATE', image: '/images/products/kare-baklava-tepsi.jpg', variants: [] },
];

export async function GET() {
  try {
    // Gerçek veritabanından ürünleri çek
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = await (prisma as any).product.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Veritabanında ürün yoksa fallback döndür
    if (!products || products.length === 0) {
      return NextResponse.json({
        success: true,
        products: FALLBACK_PRODUCTS,
      });
    }

    // Gerçek ürünleri format et
    const formattedProducts = products.map((product: ProductType) => ({
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      category: product.category,
      region: product.region,
      productType: product.productType,
      image: product.image || '/images/placeholder.jpg',
      variants: product.variants.map((v: ProductVariantType) => ({
        id: v.id,
        size: v.size,
        price: v.price,
        stock: v.stock,
      })),
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    // Veritabanı hatası durumunda fallback ürünleri döndür
    console.error('Database error, returning fallback products:', error);
    return NextResponse.json({
      success: true,
      products: FALLBACK_PRODUCTS,
    });
  }
}

export async function POST(req: Request) {
  // For testing chatbot SKU validation
  try {
    const body = await req.json();
    const { sku } = body;

    if (!sku) {
      return NextResponse.json({ error: 'sku required' }, { status: 400 });
    }

    // Phase 1: Mock product data (no database yet)
    const mockProduct = {
      id: 'mock-' + sku,
      sku,
      name: 'Mock Product',
      description: 'This is a mock product for Phase 1',
      basePrice: 100.00,
      image: '/images/products/klasik.jpg',
      variants: [],
    };

    return NextResponse.json(mockProduct);
  } catch (error: any) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
