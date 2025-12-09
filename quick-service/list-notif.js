const { PrismaClient } = require('@prisma/client');
(async () => {
  const prisma = new PrismaClient();
  try {
    const notif = await prisma.notification.findFirst({ orderBy: { createdAt: 'desc' } });
    console.log(notif);
  } catch (e) {
    console.error('err', e.message || e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
