'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function B2BPage() {
  const [stats] = useState({
    totalOrders: 24,
    totalValue: 125400,
    pendingOrders: 3,
    monthlyBudget: 50000,
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold font-serif text-white mb-6 tracking-tight">Kurumsal Çözümler</h1>
            <p className="text-xl text-gold-200 mb-8 max-w-2xl">
              Coşkun Yaycı Baklava B2B Platform - İşletmeleriniz için özel fiyatlandırma, tasarım ve lojistik çözümleri
            </p>
            <div className="flex gap-4">
              <Link
                href="/b2b/orders"
                className="px-8 py-3 bg-primary-700 hover:bg-primary-600 text-white font-bold rounded-lg transition"
              >
                Sipariş Geçmişim
              </Link>
              <Link
                href="/b2b/customizer"
                className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-lg transition"
              >
                Özel Tasarım Oluştur
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-gold-200 text-sm font-semibold mb-2">Toplam Siparişler</p>
              <p className="text-4xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-gold-200 text-sm font-semibold mb-2">Toplam Harcama</p>
              <p className="text-4xl font-bold text-white">₺{(stats.totalValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-gold-200 text-sm font-semibold mb-2">Bekleme Halindeki Siparişler</p>
              <p className="text-4xl font-bold text-gold-400">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <p className="text-gold-200 text-sm font-semibold mb-2">Aylık Bütçe</p>
              <p className="text-4xl font-bold text-gold-300">₺{(stats.monthlyBudget / 1000).toFixed(0)}k</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gold-500/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-3">Özel Tasarım</h3>
              <p className="text-gold-100">Şirketinizin logosunu, rengini ve mesajını baklava paketlerine koyun.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gold-500/10">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-white mb-3">Toplu Sipariş</h3>
              <p className="text-gold-100">100'den 100.000 adet kadar sipariş verin, özel fiyatlandırma alın.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gold-500/10">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-white mb-3">Lojistik Desteği</h3>
              <p className="text-gold-100">Türkiye'nin her yerine hızlı ve güvenli teslimat garantisi.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gold-500/10">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-3">Özel Fiyatlandırma</h3>
              <p className="text-gold-100">Sipariş miktarına göre kademeli indirimler ve ödeme planları.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gold-500/10">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Analitikler</h3>
              <p className="text-gold-100">Sipariş takibi, harcama raporları ve tahmin araçları.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 hover:border-gold-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-gold-500/10">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-3">Özel Temsilci</h3>
              <p className="text-gold-100">Her kurumsal müşteri için özel temsilci ve 24/7 destek.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-primary-700 to-gold-500 rounded-sm p-12 text-center border border-gold-400/30">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Fiyat Teklifi Alın</h2>
            <p className="text-gold-100 mb-8 max-w-2xl mx-auto">
              Özel gereksinimleriniz için detaylı bir fiyat teklifi hazırlamak üzere size en kısa sürede ulaşacağız.
            </p>
            <button className="px-8 py-3 bg-white text-primary-700 font-bold rounded-sm hover:bg-gold-50 transition-all duration-300 hover:shadow-lg">
              Teklif Talep Et
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
