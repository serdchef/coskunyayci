'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function KurumsalDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Lütfen giriş yapınız');
      router.push('/kurumsal/kayit');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold-400 font-semibold">Paneliz yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Mock data
  const stats = {
    totalOrders: 24,
    nextDelivery: '15 Ocak 2025',
    discountRate: 15,
    creditLimit: 50000,
  };

  const recentOrders = [
    {
      id: '001',
      date: '2025-01-08',
      products: 'Baklava Karışık Kutu x50',
      amount: 12500,
      status: 'Teslim Edildi',
    },
    {
      id: '002',
      date: '2025-01-05',
      products: 'Premium Pistachio x100',
      amount: 28000,
      status: 'Kargo da',
    },
    {
      id: '003',
      date: '2024-12-28',
      products: 'Çeşitli Baklava x75 + Lokum x50',
      amount: 18500,
      status: 'Teslim Edildi',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gold-400 font-serif mb-2">
            Hoş Geldiniz, {session?.user?.name || 'Misafir'}!
          </h1>
          <p className="text-emerald-200 text-lg">
            Kurumsal panelinden siparişlerinizi yönetin ve özel fiyatlardan yararlanın.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Total Orders */}
          <div className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl rounded-xl p-6 border border-gold-600/30 hover:border-gold-600/60 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📦</div>
              <span className="text-xs bg-gold-600/20 text-gold-300 px-3 py-1 rounded-full font-semibold">
                Toplam
              </span>
            </div>
            <p className="text-emerald-200 text-sm mb-2">Toplam Siparişler</p>
            <h3 className="text-4xl font-bold text-gold-400">{stats.totalOrders}</h3>
            <p className="text-emerald-300 text-xs mt-3">Son 12 ayda</p>
          </div>

          {/* Next Delivery */}
          <div className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl rounded-xl p-6 border border-gold-600/30 hover:border-gold-600/60 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🚚</div>
              <span className="text-xs bg-gold-600/20 text-gold-300 px-3 py-1 rounded-full font-semibold">
                Yakında
              </span>
            </div>
            <p className="text-emerald-200 text-sm mb-2">Sonraki Teslimat</p>
            <h3 className="text-xl font-bold text-gold-400">{stats.nextDelivery}</h3>
            <p className="text-emerald-300 text-xs mt-3">Sipariş #002 - Kargo da</p>
          </div>

          {/* Discount Rate */}
          <div className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl rounded-xl p-6 border border-gold-600/30 hover:border-gold-600/60 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💎</div>
              <span className="text-xs bg-gold-600/20 text-gold-300 px-3 py-1 rounded-full font-semibold">
                İndirim
              </span>
            </div>
            <p className="text-emerald-200 text-sm mb-2">Kurumsal İndirim</p>
            <h3 className="text-4xl font-bold text-gold-400">{stats.discountRate}%</h3>
            <p className="text-emerald-300 text-xs mt-3">Tüm ürünlere uygulanır</p>
          </div>

          {/* Credit Limit */}
          <div className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl rounded-xl p-6 border border-gold-600/30 hover:border-gold-600/60 transition">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">💳</div>
              <span className="text-xs bg-gold-600/20 text-gold-300 px-3 py-1 rounded-full font-semibold">
                Limit
              </span>
            </div>
            <p className="text-emerald-200 text-sm mb-2">Kredi Limiti</p>
            <h3 className="text-2xl font-bold text-gold-400">{(stats.creditLimit / 1000).toFixed(0)}K</h3>
            <p className="text-emerald-300 text-xs mt-3">TL - 30 günü vade</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/kurumsal/siparis"
            className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-900 font-bold rounded-xl p-6 transition transform hover:scale-105 text-center"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-bold">Toplu Sipariş Oluştur</h3>
            <p className="text-sm font-semibold mt-2">Yeni sipariş ekleyin</p>
          </Link>

          <button
            onClick={() => toast.info('📄 Faturalar sekmesi yakında aktif olacaktır')}
            className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl border border-gold-600/30 hover:border-gold-600/60 rounded-xl p-6 transition text-center"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-gold-400">Faturalarımı İndir</h3>
            <p className="text-sm text-emerald-300 mt-2">PDF veya Excel olarak</p>
          </button>

          <button
            onClick={() => toast.info('☎️ Danışman tarafından 1 saate cevap verilecektir')}
            className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl border border-gold-600/30 hover:border-gold-600/60 rounded-xl p-6 transition text-center"
          >
            <div className="text-3xl mb-3">💼</div>
            <h3 className="text-lg font-bold text-gold-400">Özel Danışman İste</h3>
            <p className="text-sm text-emerald-300 mt-2">Kurumsal desteği ara</p>
          </button>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl rounded-xl border border-gold-600/30 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gold-600/20">
            <h2 className="text-2xl font-bold text-gold-400 font-serif">Son Siparişler</h2>
            <Link
              href="/kurumsal/siparisler"
              className="text-gold-400 hover:text-gold-300 font-semibold text-sm"
            >
              Tüm Siparişler →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-600/20">
                  <th className="text-left py-3 text-gold-300 font-semibold px-2">Sipariş No</th>
                  <th className="text-left py-3 text-gold-300 font-semibold px-2">Tarih</th>
                  <th className="text-left py-3 text-gold-300 font-semibold px-2">Ürün Bilgisi</th>
                  <th className="text-right py-3 text-gold-300 font-semibold px-2">Tutar</th>
                  <th className="text-center py-3 text-gold-300 font-semibold px-2">Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gold-600/10 hover:bg-gold-600/5 transition"
                  >
                    <td className="py-4 px-2 text-gold-400 font-semibold">#{order.id}</td>
                    <td className="py-4 px-2 text-emerald-300">
                      {new Date(order.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-4 px-2 text-white max-w-xs">{order.products}</td>
                    <td className="py-4 px-2 text-right text-gold-400 font-bold">
                      {(order.amount / 1000).toFixed(1)}K₺
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Teslim Edildi'
                            ? 'bg-emerald-600/30 text-emerald-300'
                            : 'bg-gold-600/30 text-gold-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/20 backdrop-blur-xl rounded-xl p-6 border border-emerald-600/30">
            <h3 className="text-lg font-bold text-emerald-300 mb-3">💬 Hemen İletişim Kurun</h3>
            <p className="text-emerald-200 text-sm mb-4">
              Kurumsal desteğimiz size 1 saat içinde cevap vermeyi hedeflemektedir.
            </p>
            <button
              onClick={() => toast.success('📧 Destek ekibine mesaj gönderildi!')}
              className="w-full px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-semibold rounded-lg transition text-sm"
            >
              Destek Talep Et
            </button>
          </div>

          <div className="bg-gradient-to-br from-gold-600/10 to-gold-900/20 backdrop-blur-xl rounded-xl p-6 border border-gold-600/30">
            <h3 className="text-lg font-bold text-gold-300 mb-3">🎁 Özel Kampanyalar</h3>
            <p className="text-gold-200 text-sm mb-4">
              500+ lira siparişte ekstra %5 indirim. Yıl boyunca geçerli!
            </p>
            <button
              onClick={() => toast.info('🎯 Kampanya detaylarını görmek için danışmanı arayınız')}
              className="w-full px-4 py-2 bg-gold-600/30 hover:bg-gold-600/50 text-gold-300 font-semibold rounded-lg transition text-sm"
            >
              Detayları Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
