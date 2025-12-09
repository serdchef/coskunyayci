/**
 * POST /api/videos
 * Video üretim job oluşturma
 * Admin only
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateVideo, VideoJobParams } from '@/lib/videoStudio';
import { VideoProvider, VideoJobStatus } from '@/types';
// Lazy-load logger inside handlers to avoid pulling pino/thread-stream into Next
// server bundles at module initialization.
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // TODO: Auth check - admin only

    const body = await request.json();
    const { templateId, productIds, duration, language, theme, campaignId } = body;

    // Validation
    if (!templateId || !productIds || !duration) {
      return NextResponse.json(
        { error: 'templateId, productIds ve duration gerekli' },
        { status: 400 }
      );
    }

    // Job ID oluştur
    const jobId = `video-${nanoid()}`;

    // VideoJob kaydı oluştur
    const videoJob = await prisma.videoJob.create({
      data: {
        jobId,
        templateId,
        templateName: templateId,
        params: {
          productIds,
          duration,
          language: language || 'tr',
          theme,
          campaignId,
        },
        status: VideoJobStatus.PENDING,
        provider: VideoProvider.AZURE,
      },
    });

  const { default: logger } = await import('@/lib/logger');
  logger.info({ jobId, videoJobId: videoJob.id }, 'Video job created');

    // Async video generation başlat (background)
    // Production'da queue'ya eklenecek (BullMQ, SQS, vb.)
    processVideoJob(videoJob.id, {
      templateId,
      productIds,
      duration,
      language: language || 'tr',
      theme,
      campaignId,
    }).catch((error) => {
      (async () => {
        const { default: logger } = await import('@/lib/logger');
        logger.error({ error, jobId }, 'Video processing error');
      })();
    });

    return NextResponse.json({
      success: true,
      jobId: videoJob.jobId,
      videoJobId: videoJob.id,
      status: videoJob.status,
    }, { status: 201 });

  } catch (error) {
    const { default: logger } = await import('@/lib/logger');
    logger.error({ error }, 'Create video job error');
    return NextResponse.json(
      { error: 'Video job oluşturulamadı' },
      { status: 500 }
    );
  }
}

// Background video processing
async function processVideoJob(videoJobId: string, params: VideoJobParams) {
  try {
    await prisma.videoJob.update({
      where: { id: videoJobId },
      data: { status: VideoJobStatus.PROCESSING },
    });

    const result = await generateVideo(params);

    if (result.success) {
      await prisma.videoJob.update({
        where: { id: videoJobId },
        data: {
          status: VideoJobStatus.COMPLETED,
          resultUrl: result.videoUrl,
          thumbnailUrl: result.thumbnailUrl,
          duration: result.duration,
          fileSize: result.fileSize,
          completedAt: new Date(),
        },
      });
    } else {
      await prisma.videoJob.update({
        where: { id: videoJobId },
        data: {
          status: VideoJobStatus.FAILED,
          errorMessage: result.error,
        },
      });
    }
  } catch (error: any) {
  const { default: logger } = await import('@/lib/logger');
  logger.error({ error, videoJobId }, 'Video job processing failed');
    await prisma.videoJob.update({
      where: { id: videoJobId },
      data: {
        status: VideoJobStatus.FAILED,
        errorMessage: error.message,
      },
    });
  }
}
