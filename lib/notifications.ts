// Lazy initialization for Redis - only connect when needed
let notificationQueue: any = null;

const getQueue = () => {
  if (notificationQueue) return notificationQueue;
  
  // Only initialize if REDIS_URL is available
  if (!process.env.REDIS_URL) {
    return null;
  }
  
  try {
    const { Queue } = require('bullmq');
    const IORedis = require('ioredis');
    const redisUrl = process.env.REDIS_URL;
    const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
    
    notificationQueue = new Queue('notifications', {
      connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    });
    return notificationQueue;
  } catch {
    return null;
  }
};

export type NotificationJobData = {
  notificationId: string;
  orderId?: string;
  type: 'whatsapp' | 'sms' | 'email';
  to: string;
  body: string;
};

export async function enqueueNotification(data: NotificationJobData) {
  const queue = getQueue();
  if (!queue) {
    // Redis not available, log and skip
    console.warn('Redis not available, skipping notification queue');
    return null;
  }
  return queue.add('send', data, {
    delay: 0,
    attempts: 5,
  });
}

export { getQueue as notificationQueue };

export default {
  enqueueNotification,
};
