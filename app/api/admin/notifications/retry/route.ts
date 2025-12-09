import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { enqueueNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId required' }, { status: 400 });
    }

    // Find notification
    const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif) return NextResponse.json({ error: 'not found' }, { status: 404 });

    // Update status to PENDING and reset attempts
    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'PENDING', attempts: 0, error: null },
    });

    // Enqueue job
    await enqueueNotification({ notificationId: updated.id, type: updated.type as any, to: updated.to, body: updated.body });

    return NextResponse.json({ success: true, notification: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
