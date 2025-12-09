import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

export const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 1000,
  },
});

export type NotificationJobData = {
  notificationId: string;
  orderId?: string;
  type: 'whatsapp' | 'sms' | 'email';
  to: string;
  body: string;
};

export async function enqueueNotification(data: NotificationJobData) {
  return notificationQueue.add('send', data, {
    delay: 0,
    attempts: 5,
  });
}

export default {
  enqueueNotification,
};
