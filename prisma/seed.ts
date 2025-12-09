import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create products
  const products = [
    // Klasik Baklava (3)
    {
      sku: 'KLASIK_001',
      name: 'Antep Fıstıklı Klasik Baklava',
      description: 'Gaziantep\'in en ünlü fıstıklı baklavası. Katmanları arasında en kaliteli Antep fıstığı, hafif şerbeti ile yapılmıştır.',
      productType: 'CLASSIC',
      category: 'Klasik Baklava',
      region: 'Gaziantep',
      basePrice: '350',
      image: '/products/klasik-fistik.jpg',
    },
    {
      sku: 'KLASIK_002',
      name: 'Sarıyer Baklava',
      description: 'İstanbul Sarıyer\'in meşhur sarı renkli baklavası. Yoğun şerbeti ve ince yapısı ile efsanevi lezzeti.',
      productType: 'CLASSIC',
      category: 'Klasik Baklava',
      region: 'İstanbul',
      basePrice: '380',
      image: '/products/sarıyer.jpg',
    },
    {
      sku: 'KLASIK_003',
      name: 'Bursa Baklava',
      description: 'Bursa\'nın kültürel mirasını yaşatan orijinal baklava. Yeşil ceviz ve pistachiosu ile benzersiz tadı.',
      productType: 'CLASSIC',
      category: 'Klasik Baklava',
      region: 'Bursa',
      basePrice: '360',
      image: '/products/bursa.jpg',
    },
    // Antep Fıstıklı (2)
    {
      sku: 'FISTIK_001',
      name: 'Premium Antep Fıstıklı',
      description: 'Seçilmiş Antep fıstığı ile hazırlanan premium baklava. Tatlı ile mükemmel uyum.',
      productType: 'PISTACHIO',
      category: 'Antep Fıstıklı',
      region: 'Gaziantep',
      basePrice: '420',
      image: '/products/premium-fistik.jpg',
    },
    {
      sku: 'FISTIK_002',
      name: 'Mahalli Antep Fıstığı Baklava',
      description: 'Antep fıstığı ile yapılan, şerbetçi aşkı ile eşsiz olan baklava.',
      productType: 'PISTACHIO',
      category: 'Antep Fıstıklı',
      region: 'Gaziantep',
      basePrice: '390',
      image: '/products/mahalli-fistik.jpg',
    },
    // Çikolatalı (2)
    {
      sku: 'CHOCO_001',
      name: 'Belçika Çikolatalı Baklava',
      description: 'Belçika\'dan özel ithal çikolata ile yapılan modern baklava. Çikolata severler için mükemmel.',
      productType: 'CHOCOLATE',
      category: 'Çikolatalı',
      region: 'İstanbul',
      basePrice: '450',
      image: '/products/choco-belcika.jpg',
    },
    {
      sku: 'CHOCO_002',
      name: 'Siyah Çikolatalı Baklava',
      description: 'Yüksek kakao içerikli siyah çikolata ile yapılan sofistike baklava.',
      productType: 'CHOCOLATE',
      category: 'Çikolatalı',
      region: 'İstanbul',
      basePrice: '460',
      image: '/products/choco-siyah.jpg',
    },
    // Şerbetli Spesyal (2)
    {
      sku: 'SERBETLI_001',
      name: 'Şerbetli Baklava (Ekstra Tatlı)',
      description: 'Ekstra şerbetli, tatlı severler için özel yapılmış baklava. Çay ile eşsiz kombinasyon.',
      productType: 'SYRUP',
      category: 'Şerbetli Spesyal',
      region: 'Gaziantep',
      basePrice: '340',
      image: '/products/serbetli.jpg',
    },
    {
      sku: 'SERBETLI_002',
      name: 'Hafif Şerbetli Baklava',
      description: 'Az şerbeti ile yapılan, daha hafif ve zarif baklava. Sağlık bilincli tüketiciler için.',
      productType: 'SYRUP',
      category: 'Şerbetli Spesyal',
      region: 'İstanbul',
      basePrice: '345',
      image: '/products/hafif-serbetli.jpg',
    },
    // Özel Baklava (3)
    {
      sku: 'SPECIAL_001',
      name: 'Kaymaklı Baklava',
      description: 'Clotted cream ile yapılan lüks baklava. İngiliz geleneksel tatlısı ile Türk baklavası buluşması.',
      productType: 'SPECIALTY',
      category: 'Özel Baklava',
      region: 'İstanbul',
      basePrice: '520',
      image: '/products/kaymakli.jpg',
    },
    {
      sku: 'SPECIAL_002',
      name: 'Cevizli Baklava',
      description: 'Şam cevizi ile yapılan sade ama zarif baklava. Fıstığa alternatif olarak tercih edilir.',
      productType: 'SPECIALTY',
      category: 'Özel Baklava',
      region: 'Gaziantep',
      basePrice: '400',
      image: '/products/cevizli.jpg',
    },
    {
      sku: 'SPECIAL_003',
      name: 'Dut Pekmezi Baklava',
      description: 'Dut pekmezi ile tatlandırılan, sağlıklı ve doğal baklava. Geleneksel Anadolu lezzetleri.',
      productType: 'SPECIALTY',
      category: 'Özel Baklava',
      region: 'İzmir',
      basePrice: '480',
      image: '/products/dut-pekmezi.jpg',
    },
    // Kurumsal Hediye (3)
    {
      sku: 'CORP_001',
      name: 'Kurumsal Prestij Seti',
      description: 'Şirketinizin değerini yansıtan premium kurumsal baklava seti. Müşteri ve ortaklar için ideal hediye.',
      productType: 'CORPORATE',
      category: 'Kurumsal Hediye',
      region: 'İstanbul',
      basePrice: '1200',
      image: '/products/corp-prestige.jpg',
    },
    {
      sku: 'CORP_002',
      name: 'Lüks İş Seti',
      description: 'Yönetici ve iş ortakları için hazırlanan eksklusif lüks baklava seti. Kişisel branding imkanı.',
      productType: 'CORPORATE',
      category: 'Kurumsal Hediye',
      region: 'İstanbul',
      basePrice: '2500',
      image: '/products/corp-luxury.jpg',
    },
    {
      sku: 'CORP_003',
      name: 'Kurumsal Vip Koleksiyonu',
      description: 'Tüm spesyal baklavalardan oluşan VIP kurumsal hediye. Sadece özel müşteriler için.',
      productType: 'CORPORATE',
      category: 'Kurumsal Hediye',
      region: 'İstanbul',
      basePrice: '3500',
      image: '/products/corp-vip.jpg',
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
    },
  });

  console.log(' Seed completed!');
  console.log(' Created 15 products with variants');
  console.log(' Created test user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\();
  });