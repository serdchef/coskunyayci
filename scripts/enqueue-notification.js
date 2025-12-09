const { PrismaClient } = require('@prisma/client');
const nq = require('../lib/notifications');

(async function main(){
  const prisma = new PrismaClient();
  try {
    const notif = await prisma.notification.create({
      data: {
        type: 'whatsapp',
        to: '+905387368371',
        body: 'Smoke test notification from enqueue-notification.js'
      }
    });

    console.log('CREATED_NOTIFICATION_ID:' + notif.id);

    await nq.enqueueNotification({
      notificationId: notif.id,
      type: 'whatsapp',
      to: notif.to,
      body: notif.body,
    });

    console.log('ENQUEUED');
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
