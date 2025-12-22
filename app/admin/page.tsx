'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({ totalUsers: 0, totalOrders: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);

  // Check authorization and fetch stats
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/unauthorized?reason=not-authenticated');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'SUPER_ADMIN' && session?.user?.role !== 'ADMIN') {
      router.push('/auth/unauthorized?reason=insufficient-role&requiredRole=SUPER_ADMIN|ADMIN');
      return;
    }

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-purple-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';
  const userEmail = session?.user?.email || 'Kullanıcı';
  const userName = session?.user?.name || userEmail.split('@')[0];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* 🏛️ SUPER_ADMIN Welcome Section */}
        {isSuperAdmin && (
          <section className="bg-gradient-to-r from-amber-600 via-purple-600 to-purple-700 text-white py-8 mb-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <svg className="w-8 h-8 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Hoş Geldiniz, SUPER_ADMIN</h2>
                  <p className="text-white/90">Sarayın anahtarlarını başarıyla taşıyorsunuz</p>
                  <p className="text-sm text-white/70 mt-2">Giriş: {userEmail}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hero */}
        <section className="bg-gradient-to-r from-primary-800 to-primary-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  Admin Paneli
                </h1>
                <p className="text-xl opacity-90">
                  Sistem yönetimi ve kontrol merkezi
                </p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm text-white/70">Rol:</p>
                <p className="text-2xl font-bold text-amber-300">{session?.user?.role}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Dashboard */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* Stat Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="text-sm text-green-600 font-semibold">+12%</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">127</div>
                <div className="text-sm text-gray-600">Toplam Sipariş</div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-green-600 font-semibold">+8%</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₺42,500</div>
                <div className="text-sm text-gray-600">Toplam Gelir</div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-sm text-green-600 font-semibold">+24</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">1,245</div>
                <div className="text-sm text-gray-600">Toplam Müşteri</div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">8 adet</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
                <div className="text-sm text-gray-600">Aktif Ürünler</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Products Management */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ürün Yönetimi</h3>
                <p className="text-gray-600 mb-4">
                  Ürünleri görüntüle, düzenle, ekle veya sil
                </p>
                <button className="w-full px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium">
                  Ürünleri Yönet
                </button>
              </div>

              {/* Orders Management */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sipariş Yönetimi</h3>
                <p className="text-gray-600 mb-4">
                  Siparişleri takip et ve durumlarını güncelle
                </p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Siparişleri Görüntüle
                </button>
              </div>

              {/* Users Management */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kullanıcı Yönetimi</h3>
                <p className="text-gray-600 mb-4">
                  Müşteri ve admin kullanıcılarını yönet
                </p>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Kullanıcıları Yönet
                </button>
              </div>
            </div>

            {/* Info Notice */}
            <div className="mt-8 bg-gradient-to-r from-gold-100 to-cream-100 border-l-4 border-gold-600 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-gold-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Geliştirme Aşamasında</h4>
                  <p className="text-sm text-gray-700">
                    Bu admin paneli demo amaçlıdır. Tam fonksiyonel yönetim sistemi için veritabanı API'leri ve 
                    kimlik doğrulama entegrasyonu gereklidir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
