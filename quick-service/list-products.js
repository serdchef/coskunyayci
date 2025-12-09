const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const prods = await prisma.product.findMany({ take: 50 });
    console.log('COUNT', prods.length);
    console.log(prods.map(p => ({ sku: p.sku, name: p.name })));
  } catch (e) {
    console.error('err', e.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
