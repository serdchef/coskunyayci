import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

async function main() {
  console.log('🏛️ PHASE 1: Starting PostgreSQL seed with SUPER_ADMIN setup...\n');

  const superAdminPassword = await bcrypt.hash('TempPassword123!', 10);
  const testPassword = await bcrypt.hash('test123', 10);

  // SUPER_ADMIN USER
  const superAdmin = await db.user.upsert({
    where: { email: 'serdraal@gmail.com' },
    update: {
      role: 'SUPER_ADMIN',
      name: '👑 Sarayın Muhafızı (Admin)',
    },
    create: {
      email: 'serdraal@gmail.com',
      name: '👑 Sarayın Muhafızı (Admin)',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ SUPER_ADMIN User Created/Updated:');
  console.log(`   Email: ${superAdmin.email}`);
  console.log(`   Role: ${superAdmin.role}\n`);

  // TEST USER
  const testUser = await db.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test Customer',
      password: testPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Test User Created:');
  console.log(`   Email: ${testUser.email}\n`);

  // ADDRESS
  const address = await db.address.create({
    data: {
      userId: testUser.id,
      street: 'Atatürk Caddesi No:123',
      city: 'İstanbul',
      district: 'Kadıköy',
      zipCode: '34700',
    },
  });

  // 16 PRODUCTS
  const products = [
    { sku: 'KLASIK_001', name: 'Klasik Baklava', description: 'Gaziantep\'in en meşhur klasik baklavası.', productType: 'CLASSIC', category: 'Klasik', region: 'Gaziantep', basePrice: 1487.7, image: '/images/products/klasik.jpg' },
    { sku: 'KARE_001', name: 'Kare Baklava', description: 'Kare şeklinde hazırlanmış, ince fıstıklı baklava.', productType: 'CLASSIC', category: 'Klasik', region: 'Gaziantep', basePrice: 1487.7, image: '/images/products/kare-baklava.jpg' },
    { sku: 'YAPRAK_001', name: 'Yaprak Sabiyet', description: 'İnce yapraklar arasında badem ve fıstıkla hazırlanmış baklava.', productType: 'CLASSIC', category: 'Klasik', region: 'Gaziantep', basePrice: 1487.7, image: '/images/products/yaprak-sobiyet.jpg' },
    { sku: 'FISTIK_001', name: 'Antep Özel', description: 'Gaziantep fıstığının en seçkin taneleriyle hazırlanmış özel baklava.', productType: 'PISTACHIO', category: 'Fıstık', region: 'Gaziantep', basePrice: 1689.7, image: '/images/products/antep-ozel.jpg' },
    { sku: 'FISTIK_002', name: 'Cevizli Baklava', description: 'Ceviz içeriği ile zenginleştirilmiş leziz baklava.', productType: 'PISTACHIO', category: 'Fıstık', region: 'Gaziantep', basePrice: 1689.7, image: '/images/products/cevizli.jpg' },
    { sku: 'FISTIK_003', name: 'Dolama', description: 'Özel tarif ile yapılmış dolama baklava.', productType: 'PISTACHIO', category: 'Fıstık', region: 'Gaziantep', basePrice: 1689.7, image: '/images/products/dolama.jpg' },
    { sku: 'CHOCO_001', name: 'Havuç Dilimi', description: 'Havuç şeklinde dilimlenmiş, soslu ve leziz baklava.', productType: 'CHOCOLATE', category: 'Çikolata', region: 'Gaziantep', basePrice: 1869.7, image: '/images/products/havuc-dilimi.jpg' },
    { sku: 'CHOCO_002', name: 'Soğuk Baklava', description: 'Soğuk olarak sunulan, tazeliğini haftalar boyunca koruyan baklava.', productType: 'CHOCOLATE', category: 'Çikolata', region: 'Gaziantep', basePrice: 1869.7, image: '/images/products/soguk-baklava.jpg' },
    { sku: 'SPECIAL_001', name: 'Karışık Baklava', description: 'Tüm çeşitlerimizin bir arada sunulduğu özel karışım baklava.', productType: 'SPECIALTY', category: 'Özel', region: 'Gaziantep', basePrice: 1987.7, image: '/images/products/karisik.jpg' },
    { sku: 'TRAY_001', name: 'Kare Baklava Tepsi', description: 'Misafirlerinizi etkileyecek kare baklava tepsi sunumu.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1200, image: '/images/products/kare-baklava-tepsi.jpg' },
    { sku: 'TRAY_002', name: 'Karışık Baklava Tepsi', description: 'Tüm baklava çeşitlerinin bir araya getirildiği lüks tepsi sunumu.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1300, image: '/images/products/karisik-baklava-tepsi.jpg' },
    { sku: 'TRAY_003', name: 'Seni Sahlayan Tepsi', description: 'Özel günleriniz için hazırlanmış, seçkin baklava çeşitlerinin yer aldığı tepsi.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1350, image: '/images/products/karisik-baklava-tepsi.jpg' },
    { sku: 'TRAY_004', name: 'Yönetici Tepsi', description: 'Kurumsal hediyeler için en özel tepsi sunumu.', productType: 'TRAY', category: 'Tepsili', region: 'Gaziantep', basePrice: 1500, image: '/images/products/kare-baklava-tepsi.jpg' },
    { sku: 'CORP_001', name: 'Kurumsal Klasik Tepsi', description: 'Şirketleriniz için hazırlanmış, kurumsal imajı yansıtan baklava tepsi.', productType: 'CORPORATE', category: 'Kurumsal', region: 'Gaziantep', basePrice: 2500, image: '/images/products/kare-baklava-tepsi.jpg' },
    { sku: 'CORP_002', name: 'Executive Baklava Seti', description: 'İş hayatında başarı için iş ortaklarınıza sunabileceğiniz premium baklava seti.', productType: 'CORPORATE', category: 'Kurumsal', region: 'Gaziantep', basePrice: 2700, image: '/images/products/karisik-baklava-tepsi.jpg' },
    { sku: 'CORP_003', name: 'VIP Baklava Koleksiyonu', description: 'VIP müşterileriniz için tasarlanmış, dünyanın en iyi baklava seçkisi.', productType: 'CORPORATE', category: 'Kurumsal', region: 'Gaziantep', basePrice: 3000, image: '/images/products/kare-baklava-tepsi.jpg' },
  ];

  let productCount = 0;
  let variantCount = 0;

  for (const productData of products) {
    const product = await db.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
    productCount++;

    const variants = [
      { size: '250g', multiplier: 1 },
      { size: '500g', multiplier: 1.7 },
      { size: '1kg', multiplier: 2.8 },
      { size: 'Corporate', multiplier: 4.5 },
    ];

    for (const variantSpec of variants) {
      const variantPrice = parseFloat(
        (productData.basePrice * variantSpec.multiplier).toFixed(2)
      );

      await db.productVariant.upsert({
        where: {
          productId_size: {
            productId: product.id,
            size: variantSpec.size,
          },
        },
        update: { price: variantPrice },
        create: {
          productId: product.id,
          size: variantSpec.size,
          price: variantPrice,
          stock: 100,
        },
      });
      variantCount++;
    }
  }

  console.log(`✅ Products Created: ${productCount}`);
  console.log(`✅ Product Variants Created: ${variantCount}\n`);

  console.log('🎉 Seed Complete!\n');
  console.log('📊 Database Summary:');
  console.log(`   ✅ SUPER_ADMIN: 1 (serdraal@gmail.com)`);
  console.log(`   ✅ Test User: 1 (test@example.com)`);
  console.log(`   ✅ Products: ${productCount}`);
  console.log(`   ✅ Variants: ${variantCount}`);
  console.log('\n🔐 Credentials:');
  console.log('   Admin: serdraal@gmail.com / TempPassword123!');
  console.log('   Test: test@example.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
