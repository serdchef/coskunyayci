'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CheckoutSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching order data
    const timer = setTimeout(() => {
      setOrderData({
        orderId: params.orderId,
        status: 'CONFIRMED',
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        trackingLink: `/tracking/${params.orderId}`,
      });
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [params.orderId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Siparişiniz işleniyor...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100">
        <div className="max-w-2xl mx-auto px-4 py-20">
          {/* Success Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12 border border-white/20 text-center">
            {/* Success Icon */}
            <div className="text-6xl mb-6 animate-bounce">✅</div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-teal-900 mb-2">
              Ödemeniz Başarılı!
            </h1>
            <p className="text-gray-600 mb-8">
              Siparişiniz alındı ve işleme alındı. Kısa süre içinde onay e-postası alacaksınız.
            </p>

            {/* Order Details */}
            <div className="bg-teal-50 rounded-lg p-6 mb-8 border border-teal-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sipariş Numarası</p>
                  <p className="text-xl font-bold text-teal-900 font-mono break-all">
                    {orderData?.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tahmini Teslimat</p>
                  <p className="text-xl font-bold text-teal-900">
                    {orderData?.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-8">
              <div className="space-y-4">
                {[
                  { icon: '✅', text: 'Ödeme Alındı', status: 'completed' },
                  { icon: '⏳', text: 'Paketleme', status: 'pending' },
                  { icon: '📦', text: 'Gönderim', status: 'pending' },
                  { icon: '🚚', text: 'Teslimat', status: 'pending' },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`text-2xl w-8 ${step.status === 'completed' ? 'opacity-100' : 'opacity-50'}`}>
                      {step.icon}
                    </div>
                    <span
                      className={`font-semibold ${
                        step.status === 'completed' ? 'text-teal-900' : 'text-gray-500'
                      }`}
                    >
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-200">
              <p className="text-sm text-blue-900">
                📧 Onay e-postası <strong>{(typeof window !== 'undefined' && localStorage.getItem('userEmail')) || 'sizin@email.com'}</strong> adresine gönderildi.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/tracking/${orderData.orderId}`}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                🚚 Sipariş Takibi (Live)
              </Link>
              <Link
                href="/products"
                className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
              >
                🛍️ Alışverişe Devam Et
              </Link>
              <button
                onClick={() => {
                  // Copy order ID to clipboard
                  navigator.clipboard.writeText(orderData?.orderId);
                  alert('Sipariş numarası kopyalandı!');
                }}
                className="px-8 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                📋 Siparişi Kopyala
              </button>
            </div>

            {/* Help */}
            <div className="mt-10 pt-10 border-t border-gray-200">
              <p className="text-gray-600 text-sm mb-4">Sorularınız mı var?</p>
              <Link
                href="/contact"
                className="text-teal-600 hover:underline font-semibold"
              >
                Bize Ulaşın →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
