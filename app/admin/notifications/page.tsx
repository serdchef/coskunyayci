import { prisma } from '@/lib/db';
import NotificationsPanel from '@/components/admin/NotificationsPanel';

export const revalidate = 0;

export default async function NotificationsPage() {
  // Fetch recent notifications server-side for fast initial render
  const notificationsRaw = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const notifications = notificationsRaw.map((n: any) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
    lastAttemptAt: n.lastAttemptAt ? n.lastAttemptAt.toISOString() : null,
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Bildirimler (Admin)</h1>
      {/* Client component handles actions like retry */}
      <NotificationsPanel initialData={notifications} />
    </div>
  );
}
