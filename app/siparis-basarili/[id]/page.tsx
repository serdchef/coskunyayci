'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SuccessPage() {
  const params = useParams();
  const orderId = params.id as string;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-12 text-center border border-white/20 max-w-md">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-teal-900 mb-2">
            Sipariş Başarılı!
          </h1>
          <p className="text-gray-600 mb-6">
            Siparişiniz başarıyla tamamlanmıştır. Siparişinizi takip etmek için email adresinizi kontrol etmeyi unutmayın.
          </p>

          <div className="bg-teal-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-1">Sipariş Numarası:</p>
            <p className="font-bold text-teal-900 text-lg">{orderId}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/siparislerim"
              className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg transition"
            >
              Siparişlerimi Gör
            </Link>
            <Link
              href="/products"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
