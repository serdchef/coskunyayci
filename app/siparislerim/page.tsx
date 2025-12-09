'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders/my-orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 flex items-center justify-center">
          <p>Yükleniyor...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-teal-900 mb-8">Siparişlerim</h1>

          {orders.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/20">
              <p className="text-gray-600 mb-6">Henüz sipariş vermediniz.</p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Ürünleri Gör
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'DELIVERED'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status === 'PENDING'
                            ? 'Beklemede'
                            : order.status === 'CONFIRMED'
                            ? 'Onaylandı'
                            : order.status === 'SHIPPED'
                            ? 'Gönderildi'
                            : 'Teslim Edildi'}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.paymentStatus === 'PAID'
                            ? 'Ödendi'
                            : 'Ödenmedi'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-teal-600">
                        ₺{order.totalPrice.toFixed(2)}
                      </p>
                      <Link
                        href={`/siparislerim/${order.id}`}
                        className="mt-3 inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
                      >
                        Detayları Gör
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
