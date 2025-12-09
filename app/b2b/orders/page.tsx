'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  date: string;
  product: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered';
  deliveryDate?: string;
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    { id: 'ORD-001', date: '2025-11-15', product: 'Antep Fıstıklı Baklava (Premium)', quantity: 1000, totalPrice: 18000, status: 'delivered', deliveryDate: '2025-11-20' },
    { id: 'ORD-002', date: '2025-11-20', product: 'Çikolatalı Baklava (Kurumsal)', quantity: 500, totalPrice: 12500, status: 'shipped', deliveryDate: '2025-12-08' },
    { id: 'ORD-003', date: '2025-12-01', product: 'Özel Karışık Baklava (Premium)', quantity: 2000, totalPrice: 35000, status: 'production' },
    { id: 'ORD-004', date: '2025-12-05', product: 'Kaymaklı Baklava (Standart)', quantity: 250, totalPrice: 5000, status: 'confirmed' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50';
      case 'confirmed': return 'bg-blue-500/20 text-blue-200 border-blue-500/50';
      case 'production': return 'bg-purple-500/20 text-purple-200 border-purple-500/50';
      case 'shipped': return 'bg-orange-500/20 text-orange-200 border-orange-500/50';
      case 'delivered': return 'bg-green-500/20 text-green-200 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-500/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'confirmed': return 'Onaylandı';
      case 'production': return 'Üretimde';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      default: return status;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Sipariş Geçmişi</h1>
            <p className="text-blue-100">Tüm kurumsal siparişlerinizi takip edin ve detaylı raporlar alın.</p>
          </div>

          {/* Filter Buttons */}
          <div className="mb-8 flex flex-wrap gap-3">
            {['all', 'pending', 'confirmed', 'production', 'shipped', 'delivered'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 rounded-lg border-2 border-white/20 text-blue-100 hover:border-blue-500 hover:bg-blue-500/20 transition font-semibold"
              >
                {filter === 'all' ? 'Tümü' :
                 filter === 'pending' ? 'Beklemede' :
                 filter === 'confirmed' ? 'Onaylandı' :
                 filter === 'production' ? 'Üretimde' :
                 filter === 'shipped' ? 'Kargoda' : 'Teslim Edildi'}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-100">Sipariş No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-100">Tarih</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-100">Ürün</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-100">Adet</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-100">Toplam</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-100">Durum</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-100">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white font-semibold">{order.id}</td>
                      <td className="px-6 py-4 text-blue-100">{order.date}</td>
                      <td className="px-6 py-4 text-blue-100">{order.product}</td>
                      <td className="px-6 py-4 text-white font-semibold">{order.quantity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-white font-semibold">₺{order.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-400 hover:text-blue-300 underline text-sm font-semibold">
                          Detay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-blue-200 text-sm font-semibold mb-2">Toplam Siparişler</p>
              <p className="text-3xl font-bold text-white">{orders.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-blue-200 text-sm font-semibold mb-2">Toplam Harcama</p>
              <p className="text-3xl font-bold text-white">₺{orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-blue-200 text-sm font-semibold mb-2">Ortalama Sipariş</p>
              <p className="text-3xl font-bold text-white">₺{Math.round(orders.reduce((sum, o) => sum + o.totalPrice, 0) / orders.length).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-blue-200 text-sm font-semibold mb-2">Toplam Adet</p>
              <p className="text-3xl font-bold text-white">{orders.reduce((sum, o) => sum + o.quantity, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
