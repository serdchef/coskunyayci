/**
 * Video Job Worker
 * Background işler için queue processor
 * BullMQ + Redis kullanır
 */

import { Queue, Worker, Job } from 'bullmq';
import { prisma } from '../lib/db';
import { generateVideo, VideoJobParams } from '../lib/videoStudio';
import logger from '../lib/logger';

// Type definitions for string-based enums
type VideoJobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
type VideoProvider = 'RUNWAY' | 'SYNTHESIA' | 'STABLE_VIDEO' | 'INTERNAL';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// ============================================================================
// VIDEO QUEUE
// ============================================================================

const videoQueue = new Queue('video-jobs', {
  connection: {
    host: new URL(REDIS_URL).hostname,
    port: parseInt(new URL(REDIS_URL).port) || 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 7 * 24 * 3600, // 7 gün
      count: 1000,
    },
    removeOnFail: {
      age: 30 * 24 * 3600, // 30 gün
    },
  },
});

// ============================================================================
// JOB PROCESSING
// ============================================================================

const videoWorker = new Worker(
  'video-jobs',
  async (job: Job<VideoJobParams & { videoJobId: string }>) => {
    const { videoJobId, ...params } = job.data;

    logger.info({ jobId: job.id, videoJobId }, 'Processing video job');

    try {
      // Database'de status güncelle
      await prisma.videoJob.update({
        where: { id: videoJobId },
        data: { status: 'PROCESSING' },
      });

      // Progress tracking
      job.updateProgress(10);

      // Video üret
      const result = await generateVideo(params, 'INTERNAL' as any);

      job.updateProgress(90);

      // Sonucu kaydet
      if (result.success) {
        await prisma.videoJob.update({
          where: { id: videoJobId },
          data: {
            status: 'COMPLETED',
            resultUrl: result.videoUrl,
            thumbnailUrl: result.thumbnailUrl,
            duration: result.duration,
            fileSize: result.fileSize,
            completedAt: new Date(),
          },
        });

        logger.info({ videoJobId, videoUrl: result.videoUrl }, 'Video job completed');
      } else {
        throw new Error(result.error || 'Video generation failed');
      }

      job.updateProgress(100);

      return { success: true, videoUrl: result.videoUrl };

    } catch (error: any) {
      logger.error({ error, videoJobId }, 'Video job failed');

      // Retry count'u kontrol et
      const currentJob = await prisma.videoJob.findUnique({
        where: { id: videoJobId },
      });

      const retryCount = (currentJob?.retryCount || 0) + 1;

      if (retryCount >= 3) {
        // Max retry'a ulaşıldı, job'u fail olarak işaretle
        await prisma.videoJob.update({
          where: { id: videoJobId },
          data: {
            status: 'FAILED',
            errorMessage: error.message,
            retryCount,
          },
        });
      } else {
        // Retry için güncelle
        await prisma.videoJob.update({
          where: { id: videoJobId },
          data: {
            retryCount,
            errorMessage: error.message,
          },
        });
      }

      throw error;
    }
  },
  {
    connection: {
      host: new URL(REDIS_URL).hostname,
      port: parseInt(new URL(REDIS_URL).port) || 6379,
    },
    concurrency: 2, // Aynı anda 2 video işlenebilir
    limiter: {
      max: 10, // Dakikada max 10 job
      duration: 60000,
    },
  }
);

// ============================================================================
// EVENT LISTENERS
// ============================================================================

videoWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Job completed successfully');
});

videoWorker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Job failed');
});

videoWorker.on('error', (error) => {
  logger.error({ error }, 'Worker error');
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export async function enqueueVideoJob(
  videoJobId: string,
  params: VideoJobParams
): Promise<string> {
  const job = await videoQueue.add(
    'generate-video',
    { videoJobId, ...params },
    {
      jobId: videoJobId,
    }
  );

  logger.info({ jobId: job.id, videoJobId }, 'Video job enqueued');

  return job.id!;
}

export async function getJobStatus(jobId: string) {
  const job = await videoQueue.getJob(jobId);
  
  if (!job) {
    return null;
  }

  return {
    id: job.id,
    state: await job.getState(),
    progress: job.progress,
    returnvalue: job.returnvalue,
    failedReason: job.failedReason,
  };
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker...');
  await videoWorker.close();
  await videoQueue.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing worker...');
  await videoWorker.close();
  await videoQueue.close();
  await prisma.$disconnect();
  process.exit(0);
});

// ============================================================================
// START WORKER
// ============================================================================

logger.info('Video worker started, listening for jobs...');

export { videoQueue, videoWorker };
