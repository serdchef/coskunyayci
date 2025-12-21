'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function KurumsalKayitPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    department: '',
    authorizedName: '',
    email: '',
    phone: '',
    companySize: 'SMALL',
    industry: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock registration
      console.log('B2B Registration:', formData);
      toast.success('✅ Kurumsal kayıt başarılı! Panele yönlendiriliyorsunuz...');
      
      // Simulate delay and redirect
      setTimeout(() => {
        window.location.href = '/kurumsal/dashboard';
      }, 2000);
    } catch (error) {
      toast.error('Kayıt sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gold-400 mb-8 font-serif">
                Kurumsal Üyeliğe Hoş Geldiniz
              </h1>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-3xl">💎</div>
                  <div>
                    <h3 className="text-xl font-bold text-gold-300 mb-2">Özel İndirimler</h3>
                    <p className="text-emerald-200">Toplu siparişlerde %15-30 indirim</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl">🚚</div>
                  <div>
                    <h3 className="text-xl font-bold text-gold-300 mb-2">Ücretsiz Teslimat</h3>
                    <p className="text-emerald-200">500 TL üzeri siparişlerde kargo bedava</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl">📋</div>
                  <div>
                    <h3 className="text-xl font-bold text-gold-300 mb-2">Dijital Yönetim</h3>
                    <p className="text-emerald-200">Sipariş takibi, fatura indirme, entegre yönetim</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h3 className="text-xl font-bold text-gold-300 mb-2">Özel Danışman</h3>
                    <p className="text-emerald-200">Kurumsal anlaşmalar ve özel talepler için</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-3xl">💳</div>
                  <div>
                    <h3 className="text-xl font-bold text-gold-300 mb-2">Kredi Limiti</h3>
                    <p className="text-emerald-200">30 günü hatta 60 günü bulabilecek ödeme koşulları</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gold-600/10 border border-gold-600/30 rounded-lg">
                <p className="text-gold-300 font-semibold">
                  💼 Sorularınız için: <br />
                  <span className="text-white">kurumsal@coskunyaycibaklava.com</span>
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl rounded-2xl p-8 border border-gold-600/30">
              <h2 className="text-3xl font-bold text-gold-400 mb-8 font-serif">Kayıt Ol</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Şirket Adı *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    placeholder="Acme Corporation"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  />
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Vergi Numarası *
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    required
                    placeholder="10 haneli"
                    maxLength={10}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Sektör *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  >
                    <option value="">Sektör Seçin</option>
                    <option value="HOTEL">Otel & Turizm</option>
                    <option value="CATERING">Catering & Restoran</option>
                    <option value="CORPORATE">Kurumsal Hediye</option>
                    <option value="RETAIL">Perakende</option>
                    <option value="EVENT">Etkinlik Planlama</option>
                    <option value="OTHER">Diğer</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Departman *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    placeholder="Satınalma, Muhasebe, vb."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  />
                </div>

                {/* Authorized Person */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Yetkili Kişi Adı *
                  </label>
                  <input
                    type="text"
                    name="authorizedName"
                    value={formData.authorizedName}
                    onChange={handleChange}
                    required
                    placeholder="Ad Soyad"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="kurumsal@acme.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+90 212 XXX XXXX"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Şirket Adresi
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Sokak, Bina No, Şehir"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  />
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-semibold text-gold-300 mb-2">
                    Şirket Büyüklüğü
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
                  >
                    <option value="SMALL">1-50 Çalışan</option>
                    <option value="MEDIUM">51-250 Çalışan</option>
                    <option value="LARGE">250+ Çalışan</option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-900 font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ İşleniyor...' : '✅ Kurumsal Üye Ol'}
                </button>

                {/* Already have account */}
                <p className="text-center text-emerald-300 text-sm">
                  Zaten kurumsal hesabınız var mı?{' '}
                  <Link href="/kurumsal/dashboard" className="text-gold-400 hover:text-gold-300 font-semibold">
                    Panel'e Giriş Yap
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
