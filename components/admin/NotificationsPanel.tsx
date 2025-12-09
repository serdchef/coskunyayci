"use client";

import React, { useState } from 'react';

type NotificationRow = {
  id: string;
  orderId?: string | null;
  type: string;
  to: string;
  body: string;
  status: string;
  messageId?: string | null;
  error?: string | null;
  attempts: number;
  createdAt: string;
  updatedAt: string;
};

export default function NotificationsPanel({ initialData }: { initialData: NotificationRow[] }) {
  const [rows, setRows] = useState<NotificationRow[]>(initialData || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleRetry(id: string) {
    setLoadingId(id);
    try {
      const res = await fetch('/api/admin/notifications/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });

      if (!res.ok) throw new Error('Retry failed');

      // Refresh single row from server
      const updated = await res.json();
      setRows((prev) => prev.map((r) => (r.id === id ? updated.notification : r)));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Retry failed');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded shadow p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="p-2">ID</th>
            <th className="p-2">To</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
            <th className="p-2">Message ID</th>
            <th className="p-2">Attempts</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2 font-mono text-xs">{r.id}</td>
              <td className="p-2">{r.to}</td>
              <td className="p-2">{r.type}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2 font-mono text-xs">{r.messageId ?? '-'}</td>
              <td className="p-2">{r.attempts}</td>
              <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <button
                  disabled={loadingId === r.id}
                  onClick={() => handleRetry(r.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {loadingId === r.id ? 'Retrying…' : 'Retry'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
