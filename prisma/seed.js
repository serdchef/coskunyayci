const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  const products = [
    { sku: 'KLASIK_001', name: 'Antep Fıstıklı Klasik Baklava', description: 'Gaziantep\'in en ünlü fıstıklı baklavası.', productType: 'CLASSIC', category: 'Klasik', region: 'Gaziantep', basePrice: 350, image: '/products/klasik.jpg' },
    { sku: 'KLASIK_002', name: 'Sarıyer Baklava', description: 'İstanbul Sarıyer\'in meşhur baklavası.', productType: 'CLASSIC', category: 'Klasik', region: 'İstanbul', basePrice: 380, image: '/products/sarıyer.jpg' },
    { sku: 'KLASIK_003', name: 'Bursa Baklava', description: 'Bursa\'nın kültürel mirasını yaşatan baklava.', productType: 'CLASSIC', category: 'Klasik', region: 'Bursa', basePrice: 360, image: '/products/bursa.jpg' },
    { sku: 'FISTIK_001', name: 'Premium Antep Fıstıklı', description: 'Seçilmiş Antep fıstığı ile premium baklava.', productType: 'PISTACHIO', category: 'Antep Fıstıklı', region: 'Gaziantep', basePrice: 420, image: '/products/premium-fistik.jpg' },
    { sku: 'FISTIK_002', name: 'Mahalli Antep Fıstığı', description: 'Antep fıstığı ile yapılan eşsiz baklava.', productType: 'PISTACHIO', category: 'Antep Fıstıklı', region: 'Gaziantep', basePrice: 390, image: '/products/mahalli-fistik.jpg' },
    { sku: 'CHOCO_001', name: 'Belçika Çikolatalı Baklava', description: 'Belçika çikolatası ile modern baklava.', productType: 'CHOCOLATE', category: 'Çikolatalı', region: 'İstanbul', basePrice: 450, image: '/products/choco-belcika.jpg' },
    { sku: 'CHOCO_002', name: 'Siyah Çikolatalı Baklava', description: 'Yüksek kakao çikolatası ile sofistike baklava.', productType: 'CHOCOLATE', category: 'Çikolatalı', region: 'İstanbul', basePrice: 460, image: '/products/choco-siyah.jpg' },
    { sku: 'SERBETLI_001', name: 'Şerbetli Baklava Ekstra', description: 'Ekstra şerbetli baklava.', productType: 'SYRUP', category: 'Şerbetli', region: 'Gaziantep', basePrice: 340, image: '/products/serbetli.jpg' },
    { sku: 'SERBETLI_002', name: 'Hafif Şerbetli Baklava', description: 'Az şerbeti ile hafif baklava.', productType: 'SYRUP', category: 'Şerbetli', region: 'İstanbul', basePrice: 345, image: '/products/hafif-serbetli.jpg' },
    { sku: 'SPECIAL_001', name: 'Kaymaklı Baklava', description: 'Clotted cream ile lüks baklava.', productType: 'SPECIALTY', category: 'Özel', region: 'İstanbul', basePrice: 520, image: '/products/kaymakli.jpg' },
    { sku: 'SPECIAL_002', name: 'Cevizli Baklava', description: 'Şam cevizi ile zarif baklava.', productType: 'SPECIALTY', category: 'Özel', region: 'Gaziantep', basePrice: 400, image: '/products/cevizli.jpg' },
    { sku: 'SPECIAL_003', name: 'Dut Pekmezi Baklava', description: 'Dut pekmezi ile sağlıklı baklava.', productType: 'SPECIALTY', category: 'Özel', region: 'İzmir', basePrice: 480, image: '/products/dut-pekmezi.jpg' },
    { sku: 'CORP_001', name: 'Kurumsal Prestij Seti', description: 'Premium kurumsal baklava seti.', productType: 'CORPORATE', category: 'Kurumsal', region: 'İstanbul', basePrice: 1200, image: '/products/corp-prestige.jpg' },
    { sku: 'CORP_002', name: 'Lüks İş Seti', description: 'Eksklusif lüks baklava seti.', productType: 'CORPORATE', category: 'Kurumsal', region: 'İstanbul', basePrice: 2500, image: '/products/corp-luxury.jpg' },
    { sku: 'CORP_003', name: 'Kurumsal Vip Koleksiyonu', description: 'VIP kurumsal hediye seti.', productType: 'CORPORATE', category: 'Kurumsal', region: 'İstanbul', basePrice: 3500, image: '/products/corp-vip.jpg' },
  ];

  for (const productData of products) {
    const product = await prisma.product.create({ data: productData });
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
          price: parseFloat((productData.basePrice * variant.priceMultiplier).toFixed(2)),
          stock: 100,
        },
      });
    }
  }

  const user = await prisma.user.create({
    data: { email: 'test@example.com', password: 'hashed_password_here', name: 'Test User', phone: '+905551234567' }
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
    await prisma.$disconnect();
  });
