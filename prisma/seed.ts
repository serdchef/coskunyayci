import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Delete existing data in correct order (respecting foreign keys)
  try {
    await prisma.notification.deleteMany({});
    await prisma.courierLocation.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.b2BProfile.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✓ Cleared existing data');
  } catch (error) {
    console.error('Error clearing data:', error);
  }

  // Create products
  const products = [
    // BAKLAVALAR KATEGORİSİ (9 ürün)
    {
      sku: 'MEK_001',
      name: 'Mekik Baklava',
      description: 'Gaziantep\'in en klasik baklava çeşidi. İnce yapılı ve lezzetli Mekik Baklava.',
      productType: 'CLASSIC',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '827.45',
      image: '/images/products/klasik.jpg',
    },
    {
      sku: 'KARE_001',
      name: 'Kare Baklava',
      description: 'Kare şeklinde kesilen, eşit ölçülü premium baklava. Her parça eşit ve mükemmel.',
      productType: 'CLASSIC',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '869.70',
      image: '/images/products/kare-baklava.jpg',
    },
    {
      sku: 'HAVUC_001',
      name: 'Havuç Dilimi',
      description: 'Parlak ve göz kamaştırıcı baklava. Sunumda şaşırtıcı, lezzette mükemmel.',
      productType: 'CLASSIC',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '869.70',
      image: '/images/products/havuc-dilimi.jpg',
    },
    {
      sku: 'SOBIYET_001',
      name: 'Şöbiyet',
      description: 'Kaymak ve Antep fıstığı ile zenginleştirilmiş lüks baklava çeşidi. Premium tadı ile özel.',
      productType: 'SPECIALTY',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '1262.95',
      image: '/images/products/cevizli.jpg',
    },
    {
      sku: 'MIDYE_001',
      name: 'Midye',
      description: 'Deniz kabuğu şeklinde yapılan zarif baklava. Görünüşü kadar lezzeti de özel.',
      productType: 'SPECIALTY',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '1168.70',
      image: '/images/products/karisik.jpg',
    },
    {
      sku: 'ANTEP_OZEL_001',
      name: 'Antep Özel',
      description: 'Antep fıstığının en seçkin çeşidi ile yapılan özel baklava. Usta yapımı.',
      productType: 'SPECIALTY',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '1194.70',
      image: '/images/products/antep-ozel.jpg',
    },
    {
      sku: 'DOLAMA_001',
      name: 'Dolama',
      description: 'Yufka katmanlarına sarılı, rulo şeklinde hazırlanan baklava. Geleneksel lezzet.',
      productType: 'SPECIALTY',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '1714.70',
      image: '/images/products/dolama.jpg',
    },
    {
      sku: 'YAPRAK_SOBIYET_001',
      name: 'Yaprak Şöbiyet',
      description: 'Ince yaprak yufka ile yapılan kaymakl baklava. Zarif ve lezzetli kombinasyon.',
      productType: 'SPECIALTY',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '1974.70',
      image: '/images/products/yaprak-sobiyet.jpg',
    },
    {
      sku: 'SOGUK_BAKLAVA_001',
      name: 'Soğuk Baklava',
      description: 'Buzdolabından çıkartılmış soğuk şerbetli baklava. Sıcak günlerde ideal tercih.',
      productType: 'CLASSIC',
      category: 'Baklavalar',
      region: 'Gaziantep',
      basePrice: '804.70',
      image: '/images/products/soguk-baklava.jpg',
    },
    
    // TEPSİ BAKLAVALAR KATEGORİSİ (10 ürün - 9 tepsi versiyonu + 1 karışık)
    {
      sku: 'KARE_TEPSI_001',
      name: 'Kare Baklava Tepsi',
      description: 'Kare baklavamızın tepsi sunumu. Kurumsal hediyeler için idealidir.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '1320',
      image: '/images/products/kare-baklava-tepsi.jpg',
    },
    {
      sku: 'KARISIK_TEPSI_001',
      name: 'Karışık Baklava Tepsi',
      description: 'Tüm özel baklavalarımızın seçkin bir koleksiyonu. Çeşitli tatlar tek tepside.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '2500',
      image: '/images/products/karisik-baklava-tepsi.jpg',
    },
    {
      sku: 'MEK_TEPSI_001',
      name: 'Mekik Baklava Tepsi',
      description: 'Mekik baklavamızın özel tepsi versiyonu. Sunumu maksimum etki için düzenlenmiş.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '1250',
      image: '/images/products/mekik-baklava-tepsi.jpg',
    },
    {
      sku: 'HAVUC_TEPSI_001',
      name: 'Havuç Dilimi Tepsi',
      description: 'Havuç dilimi baklavamızın göz alıcı tepsi apresentasyonu.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '1320',
      image: '/images/products/havuc-dilimi-tepsi.jpg',
    },
    {
      sku: 'SOBIYET_TEPSI_001',
      name: 'Şöbiyet Tepsi',
      description: 'Şöbiyetimizin premium tepsi sunumu. Lüks hediye seçeneği.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '1915',
      image: '/images/products/sobiyet-baklava-tepsi.jpg',
    },
    {
      sku: 'MIDYE_TEPSI_001',
      name: 'Midye Tepsi',
      description: 'Midye baklavamızın zarif tepsi sunumu. Özel anlara uygun.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '1775',
      image: '/images/products/midye-baklava-tepsi.jpg',
    },
    {
      sku: 'ANTEP_OZEL_TEPSI_001',
      name: 'Antep Özel Tepsi',
      description: 'Antep özel baklavamızın prestijli tepsi sunumu.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '1815',
      image: '/images/products/antep-ozel-baklava-tepsi.jpg',
    },
    {
      sku: 'DOLAMA_TEPSI_001',
      name: 'Dolama Tepsi',
      description: 'Dolamanın geleneksel tepsi sunumu. Otantiklik ve lezzet birleşimi.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '2600',
      image: '/images/products/dolama-baklava-tepsi.jpg',
    },
    {
      sku: 'YAPRAK_SOBIYET_TEPSI_001',
      name: 'Yaprak Şöbiyet Tepsi',
      description: 'Yaprak şöbiyetin eksklusif tepsi prezentasyonu. En üst seviye seçim.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '3000',
      image: '/images/products/yaprak-sobiyet-baklava-tepsi.jpg',
    },
    {
      sku: 'SOGUK_TEPSI_001',
      name: 'Soğuk Baklava Tepsi',
      description: 'Soğuk baklavamızın rahatlatıcı tepsi sunumu.',
      productType: 'TRAY',
      category: 'Tepsi Baklavalar',
      region: 'Gaziantep',
      basePrice: '1220',
      image: '/images/products/soguk-baklava-tepsi.jpg',
    },
  ];

  // Create products with variants
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        sku: productData.sku,
        name: productData.name,
        description: productData.description,
        productType: productData.productType,
        category: productData.category,
        region: productData.region,
        basePrice: parseFloat(productData.basePrice),
        image: productData.image,
      },
    });

    // Create variants for each product
    const variants = [
      { size: '250g', priceMultiplier: 1 },
      { size: '500g', priceMultiplier: 1.7 },
      { size: '1kg', priceMultiplier: 2.8 },
      { size: 'Corporate', priceMultiplier: 4.5 },
    ];

    for (const variant of variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          size: variant.size,
          price: parseFloat(
            (parseFloat(productData.basePrice) * variant.priceMultiplier).toFixed(2)
          ),
          stock: 100,
        },
      });
    }
  }

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashed_password_here',
      name: 'Test User',
      phone: '+905551234567',
      role: 'USER',
    },
  });

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@coskunyaycibaklava.com',
      password: 'hashed_admin_password',
      name: 'Admin User',
      phone: '+905551234568',
      role: 'ADMIN',
    },
  });

  // Create B2B user with profile
  const b2bUser = await prisma.user.create({
    data: {
      email: 'ceo@holding.com',
      password: 'hashed_b2b_password',
      name: 'CEO Ahmet',
      phone: '+905551234569',
      role: 'B2B_USER',
      b2bProfile: {
        create: {
          companyName: 'Premium İşletmeler Holding A.Ş.',
          taxId: '1234567890',
          department: 'Satınalma',
          authorizedName: 'Ahmet Yılmaz',
          industry: 'HOTEL',
          companySize: 'LARGE',
          address: 'Beşiktaş, İstanbul',
          creditLimit: 50000,
          discountRate: 0.15,
          approved: true,
        },
      },
    },
  });

  console.log('✅ Seed completed!');
  console.log('📦 Created 19 products: 9 Baklavalar + 10 Tepsi Baklavalar');
  console.log('👤 Created test user:', user.email);
  console.log('🔐 Created admin user:', admin.email);
  console.log('🏢 Created B2B user:', b2bUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });