'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  userId?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items?: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, revenue: 0 });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders?limit=50');
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.orders || []);
        
        // Calculate stats
        const total = data.orders.length;
        const confirmed = data.orders.filter((o: any) => o.status === 'CONFIRMED').length;
        const revenue = data.orders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
        
        setStats({ total, confirmed, revenue });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header with User Info */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">🏛️ Admin Dashboard</h1>
              <p className="text-teal-200">Zümrüt Temeller - Sipariş Yönetim Merkezi</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 text-right">
              <p className="text-teal-200 text-sm">Giriş yapan kullanıcı</p>
              <p className="text-white font-semibold">{session?.user?.email}</p>
              <p className="text-xs text-emerald-400 mt-1">👤 {session?.user?.role || 'ADMIN'}</p>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: '/admin/login' })}
                className="mt-3 w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 text-xs rounded font-semibold transition"
              >
                🚪 Çıkış Yap
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="text-teal-200 text-sm font-semibold">Toplam Siparişler</div>
              <div className="text-4xl font-bold text-white mt-2">{stats.total}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="text-teal-200 text-sm font-semibold">Onaylanan</div>
              <div className="text-4xl font-bold text-emerald-400 mt-2">{stats.confirmed}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="text-teal-200 text-sm font-semibold">Toplam Gelir</div>
              <div className="text-4xl font-bold text-yellow-400 mt-2">₺{stats.revenue.toFixed(2)}</div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-white">
                  <p>Yükleniyor...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-teal-200">
                  <p>Henüz sipariş bulunamadı.</p>
                </div>
              ) : (
                <table className="w-full text-left text-white">
                  <thead className="border-b border-white/20 bg-white/5">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Sipariş ID</th>
                      <th className="px-6 py-3 font-semibold">Müşteri</th>
                      <th className="px-6 py-3 font-semibold">Tutar</th>
                      <th className="px-6 py-3 font-semibold">Durum</th>
                      <th className="px-6 py-3 font-semibold">Tarih</th>
                      <th className="px-6 py-3 font-semibold">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4 font-mono text-xs text-teal-300">{order.id.slice(0, 12)}...</td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold">{order.user?.name || 'Unknown'}</div>
                            <div className="text-xs text-teal-300">{order.user?.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-yellow-400">₺{order.totalPrice?.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300' :
                            order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            defaultValue={order.status}
                            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white hover:bg-white/20 transition"
                          >
                            <option value="PENDING">Bekleme</option>
                            <option value="CONFIRMED">Onaylı</option>
                            <option value="SHIPPED">Gönderilen</option>
                            <option value="DELIVERED">Teslim Edilen</option>
                            <option value="CANCELLED">İptal</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Order Details Modal would go here */}
        </div>
      </div>
      <Footer />
    </>
  );
}
