// Script disabled - Prisma client not available in stub mode
export {};

(async function main(){
  try {
    const rows = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    console.dir(rows, { depth: null, colors: false });
  } catch (e) {
    console.error('ERROR', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
