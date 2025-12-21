'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const AdminMap = dynamic(() => import('@/components/AdminMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
      🗺️ Harita yükleniyor...
    </div>
  ),
}) as any;

interface CourierDelivery {
  id: string;
  courierName: string;
  orderId: string;
  customerName: string;
  address: string;
  status: string;
  lat: number;
  lng: number;
  completedDeliveries: number;
}

const MOCK_DELIVERIES: CourierDelivery[] = [
  {
    id: '1',
    courierName: 'Ahmet Yılmaz',
    orderId: 'ORD-001',
    customerName: 'Fatih Tekin',
    address: 'Çankırı Caddesi, Gaziantep',
    status: 'IN_TRANSIT',
    lat: 37.0662,
    lng: 37.3832,
    completedDeliveries: 8,
  },
  {
    id: '2',
    courierName: 'Mehmet Kaya',
    orderId: 'ORD-002',
    customerName: 'Ayşe Demir',
    address: 'Saraçhane, İstanbul',
    status: 'OUT_FOR_DELIVERY',
    lat: 41.0082,
    lng: 28.9784,
    completedDeliveries: 5,
  },
  {
    id: '3',
    courierName: 'Şirin Arslan',
    orderId: 'ORD-003',
    customerName: 'Levent Özkan',
    address: 'Alsancak, İzmir',
    status: 'DELIVERED',
    lat: 38.4161,
    lng: 27.1445,
    completedDeliveries: 12,
  },
];

const STATUS_CONFIG = {
  CONFIRMED: { label: 'Onaylandı', color: 'blue', icon: '✅' },
  BAKING: { label: 'Fırınlanıyor', color: 'orange', icon: '🔥' },
  READY: { label: 'Hazır', color: 'amber', icon: '✨' },
  IN_TRANSIT: { label: 'Yolda', color: 'emerald', icon: '🚚' },
  OUT_FOR_DELIVERY: { label: 'Teslimat Aşaması', color: 'teal', icon: '📍' },
  DELIVERED: { label: 'Teslim Edildi', color: 'green', icon: '🎉' },
};

export default function AdminDashboard() {
  const [deliveries, setDeliveries] = useState<CourierDelivery[]>(MOCK_DELIVERIES);
  const [selectedDelivery, setSelectedDelivery] = useState<CourierDelivery | null>(null);

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveries((prev) =>
        prev.map((delivery) => ({
          ...delivery,
          lat: delivery.lat + (Math.random() - 0.5) * 0.01,
          lng: delivery.lng + (Math.random() - 0.5) * 0.01,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeDeliveries = deliveries.filter((d) => d.status !== 'DELIVERED');
  const totalDeliveries = deliveries.length;
  const completedToday = deliveries.filter((d) => d.status === 'DELIVERED').length;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🎛️ Lojistik Kontrol Merkezi</h1>
            <p className="text-slate-400">Tüm teslimatları gerçek zamanlı izleyin</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Aktif Teslimatlar</p>
              <p className="text-3xl font-bold">{activeDeliveries.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Bugün Teslim</p>
              <p className="text-3xl font-bold">{completedToday}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Toplam Kuryeler</p>
              <p className="text-3xl font-bold">{new Set(deliveries.map((d) => d.courierName)).size}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90">Toplam Siparış</p>
              <p className="text-3xl font-bold">{totalDeliveries}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Harita */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-white/10">
              <AdminMap deliveries={deliveries} selectedDelivery={selectedDelivery} />
            </div>

            {/* Deliveries List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">📋 Aktif Teslimatlar</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {deliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    onClick={() => setSelectedDelivery(delivery)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedDelivery?.id === delivery.id
                        ? 'bg-blue-500/20 border border-blue-400'
                        : 'bg-white/10 border border-white/20 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-white">{delivery.courierName}</p>
                        <p className="text-sm text-slate-400">{delivery.orderId}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${
                          STATUS_CONFIG[delivery.status as keyof typeof STATUS_CONFIG]?.color
                        }-500`}
                      >
                        {STATUS_CONFIG[delivery.status as keyof typeof STATUS_CONFIG]?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{delivery.address}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">👤 {delivery.customerName}</span>
                      <span className="text-green-400">✓ {delivery.completedDeliveries}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          {selectedDelivery && (
            <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Seçilen Teslimat: {selectedDelivery.orderId}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                  📞 Kurye ile İletişim
                </button>
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                  🗺️ Rota Optimize Et
                </button>
                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                  ✅ Teslim Olarak İşaretle
                </button>
              </div>
            </div>
          )}

          {/* Back to Main */}
          <div className="mt-8 text-center">
            <Link
              href="/b2b"
              className="text-slate-400 hover:text-white transition"
            >
              ← İşletme Paneline Dön
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
