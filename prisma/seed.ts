import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Type assertion helper for dynamic Prisma operations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

async function main() {
  console.log('🌟 Starting comprehensive seed...');

  // Delete existing data in correct order (respecting foreign keys)
  try {
    await db.orderItem.deleteMany({});
    await db.order.deleteMany({});
    await db.productVariant.deleteMany({});
    await db.product.deleteMany({});
    await db.address.deleteMany({});
    await db.user.deleteMany({});
    console.log('✓ Cleared existing data');
  } catch (error) {
    console.error('Error clearing data:', error);
  }

  // Hash password for test credentials
  const hashedPassword = await bcrypt.hash('test123', 10);

  // Create test user
  const user1 = await db.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  // Create SUPER_ADMIN user (Sarayın Muhafızı - The Palace Guard)
  const adminUser = await db.user.create({
    data: {
      email: 'serdchef@gmail.com',
      name: '👑 Saray Muhafızı (Admin)',
      password: hashedPassword,
    },
  });

  // Create addresses
  const address1 = await db.address.create({
    data: {
      userId: user1.id,
      street: 'Atatürk Caddesi No:123',
      city: 'İstanbul',
      district: 'Kadıköy',
      zipCode: '34700',
    },
  });

  // ============ CREATE PRODUCTS ============
  const products = [
    // Klasik Baklava
    { sku: 'KLASIK_001', name: 'Klasik Baklava', description: 'Gaziantep\'in en meşhur klasik baklavası. Ceviz ve fıstık karışımı ile hazırlanmıştır.', productType: 'CLASSIC', category: 'Klasik', region: 'Gaziantep', basePrice: 1487.70, image: '/images/products/klasik.jpg' },
    { sku: 'KLASIK_002', name: 'Kare Baklava', description: 'Kare şeklinde hazırlanmış, ince fıstıklı baklava.', productType: 'CLASSIC', category: 'Klasik', region: 'Gaziantep', basePrice: 1487.70, image: '/images/products/kare-baklava.jpg' },
    { sku: 'KLASIK_003', name: 'Yaprak Sabiyet', description: 'İnce yapraklar arasında badem ve fıstıkla hazırlanmış baklava.', productType: 'CLASSIC', category: 'Klasik', region: 'Gaziantep', basePrice: 1487.70, image: '/images/products/yaprak-sobiyet.jpg' },
    
    // Fıstık Baklavası
    { sku: 'FISTIK_001', name: 'Antep Özel', description: 'Gaziantep fıstığının en seçkin taneleriyle hazırlanmış özel baklava.', productType: 'PISTACHIO', category: 'Fıstık', region: 'Gaziantep', basePrice: 1689.70, image: '/images/products/antep-ozel.jpg' },
    { sku: 'FISTIK_002', name: 'Cevizli Baklava', description: 'Ceviz içeriği ile zenginleştirilmiş leziz baklava.', productType: 'PISTACHIO', category: 'Fıstık', region: 'Gaziantep', basePrice: 1689.70, image: '/images/products/cevizli.jpg' },
    { sku: 'FISTIK_003', name: 'Dolama', description: 'Özel tarif ile yapılmış dolama baklava. Geleneksel tatlarınızı devam ettirin.', productType: 'PISTACHIO', category: 'Fıstık', region: 'Gaziantep', basePrice: 1689.70, image: '/images/products/dolama.jpg' },
    
    // Çikolatalı
    { sku: 'CHOCO_001', name: 'Havuç Dilimi', description: 'Havuç şeklinde dilimlenmiş, soslu ve leziz baklava.', productType: 'CHOCOLATE', category: 'Çikolata', region: 'Gaziantep', basePrice: 1869.70, image: '/images/products/havuc-dilimi.jpg' },
    { sku: 'CHOCO_002', name: 'Soğuk Baklava', description: 'Soğuk olarak sunulan, tazeliğini haftalar boyunca koruyan baklava.', productType: 'CHOCOLATE', category: 'Çikolata', region: 'Gaziantep', basePrice: 1869.70, image: '/images/products/soguk-baklava.jpg' },
    
    // Özel
    { sku: 'SPECIAL_001', name: 'Karışık Baklava', description: 'Tüm çeşitlerimizin bir arada sunulduğu özel karışım baklava.', productType: 'SPECIALTY', category: 'Özel', region: 'Gaziantep', basePrice: 1987.70, image: '/images/products/karisik.jpg' },
    
    // Tepsili Ürünler
    { sku: 'TRAY_001', name: 'Kare Baklava Tepsi', description: 'Misafirlerinizi etkileyecek kare baklava tepsi sunumu.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1200, image: '/images/products/kare-baklava-tepsi.jpg' },
    { sku: 'TRAY_002', name: 'Karışık Baklava Tepsi', description: 'Tüm baklava çeşitlerinin bir araya getirildiği lüks tepsi sunumu.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1300, image: '/images/products/karisik-baklava-tepsi.jpg' },
    { sku: 'TRAY_003', name: 'Seni Sahlayan Tepsi', description: 'Özel günleriniz için hazırlanmış, seçkin baklava çeşitlerinin yer aldığı tepsi.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1350, image: '/images/products/karisik-baklava-tepsi.jpg' },
    { sku: 'TRAY_004', name: 'Yönetici Tepsi', description: 'Kurumsal hediyeler için en özel tepsi sunumu.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1500, image: '/images/products/kare-baklava-tepsi.jpg' },
    
    // Kurumsal Setler
    { sku: 'CORP_001', name: 'Kurumsal Klasik Tepsi', description: 'Şirketleriniz için hazırlanmış, kurumsal imajı yansıtan baklava tepsi.', productType: 'CORPORATE', category: 'Kurumsal', region: 'Gaziantep', basePrice: 2500, image: '/images/products/kare-baklava-tepsi.jpg' },
    { sku: 'CORP_002', name: 'Executive Baklava Seti', description: 'İş hayatında başarı için iş ortaklarınıza sunabileceğiniz premium baklava seti.', productType: 'CORPORATE', category: 'Kurumsal', region: 'Gaziantep', basePrice: 2700, image: '/images/products/karisik-baklava-tepsi.jpg' },
    { sku: 'CORP_003', name: 'VIP Baklava Koleksiyonu', description: 'VIP müşterileriniz için tasarlanmış, dünyanın en iyi baklava seçkisi.', productType: 'CORPORATE', category: 'Kurumsal', region: 'Gaziantep', basePrice: 3000, image: '/images/products/kare-baklava-tepsi.jpg' },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await db.product.create({ data: productData });
    createdProducts.push(product);
    
    const variants = [
      { size: '250g', priceMultiplier: 1 },
      { size: '500g', priceMultiplier: 1.7 },
      { size: '1kg', priceMultiplier: 2.8 },
      { size: 'Corporate', priceMultiplier: 4.5 },
    ];
    
    for (const variant of variants) {
      await db.productVariant.create({
        data: {
          productId: product.id,
          size: variant.size,
          price: parseFloat((productData.basePrice * variant.priceMultiplier).toFixed(2)),
          stock: 100,
        },
      });
    }
  }

  // Create sample orders
  const order1 = await db.order.create({
    data: {
      userId: user1.id,
      addressId: address1.id,
      totalPrice: 150.00,
      status: 'CONFIRMED',
      items: {
        create: [
          {
            productName: 'Mekik Baklava',
            quantity: 2,
            price: 75.00,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed!');
  console.log('');
  console.log('👑 Admin Credentials (Sarayın Muhafızı - The Palace Guard):');
  console.log('   Email: serdchef@gmail.com');
  console.log('   Password: test123');
  console.log('');
  console.log('👤 Customer Credentials (Test):');
  console.log('   Email: test@example.com');
  console.log('   Password: test123');
  console.log('');
  console.log('📦 Database Contents:');
  console.log(`   ✓ ${createdProducts.length} Products created`);
  console.log(`   ✓ ${createdProducts.length * 4} Product variants created`);
  console.log(`   ✓ 1 Sample order created`);
  console.log(`   ✓ 2 Users created (Admin + Test)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
