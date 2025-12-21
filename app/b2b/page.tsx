'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PenTool, PackageOpen, Truck, BadgePercent, LineChart, Users } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950" style={{ backgroundColor: '#022c22' }}>
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 py-24" style={{ backgroundColor: '#022c22' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">Kurumsal Çözümler</h1>
            <p className="text-xl text-amber-300/70 mb-8 max-w-2xl">
              Coşkun Yaycı Baklava B2B Platform - İşletmeleriniz için özel fiyatlandırma, tasarım ve lojistik çözümleri
            </p>
            <div className="flex gap-4">
              <Link
                href="/b2b/orders"
                className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg transition"
              >
                Sipariş Geçmişim
              </Link>
              <Link
                href="/b2b/customizer"
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition"
              >
                Özel Tasarım Oluştur
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all">
              <p className="text-amber-400/70 text-sm font-semibold mb-2">Toplam Siparişler</p>
              <p className="text-4xl font-bold text-amber-400">{stats.totalOrders}</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all">
              <p className="text-amber-400/70 text-sm font-semibold mb-2">Toplam Harcama</p>
              <p className="text-4xl font-bold text-amber-400">₺{(stats.totalValue / 1000).toFixed(0)}k</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all">
              <p className="text-amber-400/70 text-sm font-semibold mb-2">Bekleme Halindeki Siparişler</p>
              <p className="text-4xl font-bold text-amber-400">{stats.pendingOrders}</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all">
              <p className="text-amber-400/70 text-sm font-semibold mb-2">Aylık Bütçe</p>
              <p className="text-4xl font-bold text-amber-400">₺{(stats.monthlyBudget / 1000).toFixed(0)}k</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-amber-500/10">
              <PenTool size={36} className="text-amber-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-bold text-white mb-3">Özel Tasarım</h3>
              <p className="text-slate-300">Şirketinizin logosunu, rengini ve mesajını baklava paketlerine koyun.</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-amber-500/10">
              <PackageOpen size={36} className="text-amber-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-bold text-white mb-3">Toplu Sipariş</h3>
              <p className="text-slate-300">100'den 100.000 adet kadar sipariş verin, özel fiyatlandırma alın.</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-amber-500/10">
              <Truck size={36} className="text-amber-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-bold text-white mb-3">Lojistik Desteği</h3>
              <p className="text-slate-300">Türkiye'nin her yerine hızlı ve güvenli teslimat garantisi.</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-amber-500/10">
              <BadgePercent size={36} className="text-amber-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-bold text-white mb-3">Özel Fiyatlandırma</h3>
              <p className="text-slate-300">Sipariş miktarına göre kademeli indirimler ve ödeme planları.</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-amber-500/10">
              <LineChart size={36} className="text-amber-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-bold text-white mb-3">Analitikler</h3>
              <p className="text-slate-300">Sipariş takibi, harcama raporları ve tahmin araçları.</p>
            </div>
            <div className="bg-emerald-900/50 backdrop-blur-sm rounded-xl p-8 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-amber-500/10">
              <Users size={32} className="text-amber-400 mb-4" strokeWidth={1} />
              <h3 className="text-xl font-serif font-bold text-white mb-3">Özel Temsilci</h3>
              <p className="text-slate-300">Her kurumsal müşteri için özel temsilci ve 24/7 destek.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 rounded-lg p-12 text-center border border-amber-400/40 shadow-2xl shadow-amber-900/30">
            <h2 className="text-4xl font-serif font-bold text-white mb-4">Fiyat Teklifi Alın</h2>
            <p className="text-amber-50 mb-8 max-w-2xl mx-auto">
              Özel gereksinimleriniz için detaylı bir fiyat teklifi hazırlamak üzere size en kısa sürede ulaşacağız.
            </p>
            <button className="px-8 py-3 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20">
              Teklif Talep Et
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
