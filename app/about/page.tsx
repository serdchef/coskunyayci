'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { OttomanFloral } from '@/components/OttomanPattern';
import { CornerOrnament } from '@/components/CornerOrnament';

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <OttomanFloral />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-left" />
          <CornerOrnament position="bottom-right" />
        </div>
        <main className="relative z-10">
          <section className="relative py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="relative order-2 md:order-1">
                    <div className="absolute -inset-4 bg-gradient-to-br from-gold-500/50 to-primary-700/50 rounded-2xl blur-3xl" />
                    <div className="relative bg-white/95 rounded-2xl overflow-hidden shadow-2xl">
                      <img src="/coskunyayci.png" alt="Coşkun Yaycı" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                        <p className="text-white text-2xl font-bold">Coşkun Yaycı</p>
                        <p className="text-gold-300 font-semibold">Kurucu & Vizyoner</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 order-1 md:order-2 text-white">
                    <div>
                      <h1 className="text-5xl md:text-6xl font-bold mb-2">Kurucumuzun<br/><span className="text-gold-300">Vizyonu</span></h1>
                      <p className="text-2xl text-gold-200 italic font-light">Tatlının En Üst Hali</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur p-6 rounded-xl border border-white/20">
                      <p className="text-base leading-relaxed"><span className="font-semibold text-gold-300">Coşun Yaycı Baklava</span>, Türkiye'nin tatlı sektöründeki kalite standartlarını belirleyen bir ismin, <span className="font-semibold text-gold-300">Coşkun Yaycı</span>'nın en son ve en kişisel vizyonudur.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-gold-500/30">
                      <p className="text-base leading-relaxed text-cream-100">Kurucumuz, daha önce Türkiye çapında büyük bir beğeni ve etki uyandıran, köklü tatlı markaları olan <span className="font-semibold text-gold-300">Cumba Künefe</span> ve <span className="font-semibold text-gold-300">Künefehan</span>'ı sıfırdan kurarak sektördeki ustalığını kanıtlamıştır. Bu markalarla ulaştığı başarı, onun sadece bir iş insanı değil, aynı zamanda geleneksel tatları modernize eden bir vizyoner olduğunu göstermiştir.</p>
                    </div>
                    <a href="/products" className="inline-block px-8 py-3 bg-gold-500 hover:bg-gold-600 text-primary-900 font-bold rounded-lg transition">Ürünleri İncele</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-20 bg-white/5 border-t border-gold-500/20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">Yeni Bir Odak</h2>
                  <p className="text-3xl text-gold-300 font-semibold italic mt-2">Baklavada Sanat</p>
                </div>
                <div className="bg-white/10 backdrop-blur p-12 rounded-2xl border border-gold-500/30 space-y-6">
                  <p className="text-lg text-cream-200 leading-relaxed">Edinilen bu engin tecrübe ve sektör liderliği birikimi, <span className="font-semibold text-gold-300">Coşkun Yaycı</span>'yı, ustalığını tek bir alanda, <span className="font-semibold text-gold-300">baklavada</span>, en üst seviyeye taşımaya yöneltmiştir.</p>
                  <p className="text-lg text-cream-200 leading-relaxed"><span className="font-bold text-gold-300">Coşun Yaycı Baklava</span>, bu yolculuğun zirve noktasıdır. Amacımız, sadece lezzetli bir tatlı satmak değil; kullanılan <span className="text-gold-300">tereyağından fıstığın cinsine</span> kadar her aşamada <span className="font-bold text-gold-300">mükemmeliyeti esas alarak</span>, baklavayı gerçek bir <span className="text-gold-300">sanat eserine</span> dönüştürmektir.</p>
                </div>
              </div>
            </div>
          </section>
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-5xl font-bold text-white text-center mb-12">Kalitemiz <span className="text-gold-300">Mirasımızdır</span></h2>
                <div className="bg-white/10 backdrop-blur p-12 rounded-2xl border border-gold-500/30 mb-16 space-y-6">
                  <p className="text-lg text-cream-200 leading-relaxed">Geçmişte kurduğumuz her işletmede olduğu gibi, <span className="font-bold text-gold-300">Coşun Yaycı Baklava</span>'nın da temelinde <span className="font-semibold text-gold-300">tazelik, doğallık ve tavizsiz kalite</span> yatmaktadır. Bu miras, her lokmada hissedilen o eşsiz tadın garantisidir.</p>
                  <p className="text-lg text-cream-200 leading-relaxed italic">Sizi, kurucumuzun yeni bir dönemi başlatan bu vizyoner yolculuğuna ve <span className="font-bold text-gold-300">geleneksel Türk tatlıcılığının zirvesine</span> davet ediyoruz.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-gold-500/30">
                    <div className="text-5xl mb-4">🌿</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Tazelik</h3>
                    <p className="text-cream-200">Her lokmada eşsiz tad. Taze malzemeler, taze tadı.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-gold-500/30">
                    <div className="text-5xl mb-4">🍃</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Doğallık</h3>
                    <p className="text-cream-200">%100 doğal. Katkı maddesi, koruyucu yok.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-gold-500/30">
                    <div className="text-5xl mb-4">👑</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Tavizsiz Kalite</h3>
                    <p className="text-cream-200">Tavizsiz kalite. Geçmişimizde kanıtlanmış, geleceğimizde sabit.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-600">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-5xl font-bold text-white mb-6">Lezzet Yolculuğuna Başlayın</h2>
              <a href="/products" className="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-lg hover:bg-cream-50">Ürünleri İncele</a>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
