'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Harita bileşeni (client-side lazy loading)
const MapComponent = dynamic(() => import('@/components/TrackingMap'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">🗺️ Harita yükleniyor...</div>,
});

interface OrderTracking {
  orderId: string;
  status: 'CONFIRMED' | 'BAKING' | 'READY' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  courierName: string;
  courierPhone: string;
  totalPrice: number;
  createdAt: string;
  estimatedDelivery: string;
  items: Array<{ name: string; quantity: number }>;
  address: string;
  city: string;
  zipCode: string;
  currentLocation: { lat: number; lng: number; address: string };
}

const STATUS_TIMELINE = [
  { key: 'CONFIRMED', label: 'Sipariş Onaylandı', icon: '✅', color: 'teal' },
  { key: 'BAKING', label: 'Fırınlanıyor', icon: '🔥', color: 'orange' },
  { key: 'READY', label: 'Hazır', icon: '✨', color: 'amber' },
  { key: 'IN_TRANSIT', label: 'Yola Çıktı', icon: '🚚', color: 'blue' },
  { key: 'OUT_FOR_DELIVERY', label: 'Kapınıza Geliyor', icon: '📍', color: 'violet' },
  { key: 'DELIVERED', label: 'Teslim Edildi', icon: '🎉', color: 'green' },
];

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching order tracking data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data - gerçek uygulamada API çağrısı yapılacak
      setTracking({
        orderId,
        status: 'IN_TRANSIT',
        courierName: 'Ahmet Yılmaz',
        courierPhone: '+90 555 123 4567',
        totalPrice: 250.00,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString('tr-TR'),
        items: [
          { name: 'Antep Fıstıklı Klasik Baklava', quantity: 2 },
          { name: 'Şerbetli Baklava', quantity: 1 },
        ],
        address: 'Çankırı Caddesi No:15, Daire:4',
        city: 'Gaziantep',
        zipCode: '27000',
        currentLocation: {
          lat: 37.0662,
          lng: 37.3832,
          address: 'Gaziantep Merkez',
        },
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-5xl mb-4">📦</div>
            <p className="text-gray-600 text-lg">Siparişiniz aranıyor...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!tracking) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 flex items-center justify-center">
          <div className="text-center bg-white/80 backdrop-blur-xl rounded-xl p-8">
            <p className="text-red-600 text-lg font-semibold">❌ Sipariş bulunamadı</p>
            <Link href="/products" className="text-teal-600 hover:underline mt-4 inline-block">
              ← Ürünlere dön
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentStatusIndex = STATUS_TIMELINE.findIndex(s => s.key === tracking.status);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">🚚 Sipariş Takibi</h1>
            <p className="text-gray-600">Sipariş No: <span className="font-mono font-bold">{tracking.orderId.slice(0, 8).toUpperCase()}</span></p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Harita */}
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-white/20">
                <MapComponent orderId={orderId} currentLocation={tracking.currentLocation} />
              </div>

              {/* Courier Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-blue-900 mb-4">🚗 Kurye Bilgileri</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Kurye Adı</p>
                    <p className="text-2xl font-bold text-blue-900">{tracking.courierName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">İletişim</p>
                    <a href={`tel:${tracking.courierPhone}`} className="text-2xl font-bold text-blue-600 hover:underline">
                      {tracking.courierPhone}
                    </a>
                  </div>
                  <div className="text-4xl">👨‍💼</div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-8">📋 Durum Takibi</h2>
                <div className="space-y-6">
                  {STATUS_TIMELINE.map((step, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        {/* Timeline dot & line */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                              isCompleted
                                ? `bg-${step.color}-500 text-white scale-110`
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {step.icon}
                          </div>
                          {idx < STATUS_TIMELINE.length - 1 && (
                            <div
                              className={`w-1 h-12 mt-2 ${
                                isCompleted ? `bg-${step.color}-500` : 'bg-gray-300'
                              }`}
                            />
                          )}
                        </div>

                        {/* Step info */}
                        <div className="flex-1 pt-2">
                          <p
                            className={`text-lg font-semibold ${
                              isCompleted ? 'text-gray-900' : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-green-600 font-semibold mt-1">
                              🟢 Şu anda bu aşamada
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Estimated Delivery */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-200">
                <p className="text-sm text-green-700 mb-2">⏰ Tahmini Teslimat</p>
                <p className="text-2xl font-bold text-green-900">{tracking.estimatedDelivery}</p>
              </div>

              {/* Sipariş Özeti */}
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Sipariş Özeti</h3>
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  {tracking.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg text-teal-900">
                  <span>Toplam:</span>
                  <span>₺{tracking.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Teslimat Adresi */}
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📍 Teslimat Adresi</h3>
                <p className="text-sm text-gray-600 mb-2">{tracking.address}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {tracking.city}, {tracking.zipCode}
                </p>
              </div>

              {/* Bildirimler */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                  📬 Bildirimler SMS ve Email ile gönderilecektir
                </p>
              </div>

              {/* Back Button */}
              <Link
                href="/products"
                className="w-full block text-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
              >
                ← Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
