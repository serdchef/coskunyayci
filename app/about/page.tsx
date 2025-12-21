'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { OttomanFloral } from '@/components/OttomanPattern';
import { CornerOrnament } from '@/components/CornerOrnament';
import { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <Header />
      <div className="about-page-wrapper relative min-h-screen overflow-hidden">
        <main className="relative z-10">
          <section className="relative py-16 sm:py-24 md:py-32">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                  <div className="relative order-2 md:order-1">
                    <div className="absolute -inset-4 bg-gradient-to-br from-gold-500/50 to-primary-700/50 rounded-2xl blur-3xl" />
                    <div className="relative bg-white/95 rounded-2xl overflow-hidden shadow-2xl">
                      <img 
                        src="/coskunyayci.png" 
                        alt="Coşkun Yaycı" 
                        className="w-full h-full object-cover"
                        style={{
                          maskImage: 'radial-gradient(ellipse at center, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)',
                          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, black 60%, rgba(0,0,0,0.5) 80%, transparent 100%)'
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 md:p-8">
                        <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: 'Great Vibes, cursive', letterSpacing: '0.05em' }}>Coşkun Yaycı</p>
                        <p className="text-amber-400 text-xs sm:text-sm font-semibold tracking-widest">KURUCU & VİZYONER</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 sm:space-y-8 order-1 md:order-2 text-white">
                    <div>
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-2">Kurucumuzun<br/><span className="text-amber-400">Vizyonu</span></h1>
                      <p className="text-lg sm:text-xl text-amber-300/70 italic font-light">Tatlının En Üst Hali</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-base sm:text-lg leading-relaxed text-slate-200">
                        Coşkun Yaycı Baklava, Türkiye'nin tatlı sektöründe kalite standartlarını belirleyen bir ismin, Coşkun Yaycı'nın en son ve en kişisel <span className="font-serif font-bold text-amber-400">vizyonudur</span>.
                      </p>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-amber-500/20">
                      <p className="text-base sm:text-lg leading-relaxed text-slate-300">
                        Kurucumuz, daha önce Türkiye çapında büyük bir beğeni uyandıran köklü tatlı markaları olan Cumba Künefe ve Künefehan'ı sıfırdan kurarak sektördeki ustalığını kanıtlamıştır. Bu markalarla ulaştığı başarı, onun sadece bir iş insanı değil, aynı zamanda geleneksel tatları modernize eden bir <span className="font-serif font-bold text-amber-400">vizyoner</span> olduğunu göstermiştir.
                      </p>
                      <div className="pt-4 mt-4 border-t border-amber-500/10">
                        <p className="text-2xl sm:text-3xl font-bold text-amber-400" style={{ fontFamily: 'Great Vibes, cursive' }}>
                          Coşkun Yaycı
                        </p>
                      </div>
                    </div>
                    <a href="/products" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-lg transition-all shadow-lg text-sm sm:text-base">Ürünleri İncele</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white">Yeni Bir Odak</h2>
                  <p className="text-xl sm:text-2xl text-amber-400 font-serif italic mt-4">Baklavada Sanat</p>
                </div>
                <div className="space-y-6 sm:space-y-8 text-center md:text-left">
                  <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed">
                    Edinilen bu engin tecrübe ve sektör liderliği birikimi, Coşkun Yaycı'yı, ustalığını tek bir alanda, <span className="font-serif font-bold text-amber-400">baklavada</span>, en üst seviyeye taşımaya yöneltmiştir.
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed">
                    <span className="font-serif font-bold text-white">Coşkun Yaycı Baklava</span>, bu yolculuğun zirve noktasıdır. Amacımız, sadece lezzetli bir tatlı satmak değil; her aşamada <span className="font-serif font-bold text-amber-400">mükemmeliyeti</span> esas alarak, baklavayı gerçek bir sanat eserine dönüştürmektir.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white text-center mb-12 md:mb-16">Kalitemiz <span className="text-amber-400">Mirasımızdır</span></h2>
                <div className="space-y-6 sm:space-y-8 text-center mb-12 md:mb-20">
                  <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed">
                    Geçmişte kurduğumuz her işletmede olduğu gibi, Coşkun Yaycı Baklava'nın da temelinde <span className="font-serif font-bold text-amber-400">tazelik</span>, doğallık ve tavizsiz kalite yatmaktadır. Bu miras, her lokmada hissedilen o eşsiz tadın garantisidir.
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed italic">
                    Sizi, kurucumuzun yeni bir dönemi başlatan bu vizyoner yolculuğuna ve <span className="font-serif font-bold text-amber-400">geleneksel Türk tatlıcılığının zirvesine</span> davet ediyoruz.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                  <div className="text-center">
                    <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 flex justify-center">🌿</div>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mb-4 sm:mb-6">Tazelik</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Her lokmada eşsiz tad. Taze malzemeler, taze tadı.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/60 to-transparent" />
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/60 to-transparent" />
                    <div className="text-center px-4 sm:px-8">
                      <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 flex justify-center">🍃</div>
                      <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mb-4 sm:mb-6">Doğallık</h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">%100 doğal. Katkı maddesi, koruyucu yok.</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 flex justify-center">👑</div>
                    <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mb-4 sm:mb-6">Tavizsiz Kalite</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Tavizsiz kalite. Geçmişimizde kanıtlanmış, geleceğimizde sabit.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 sm:mb-8">Lezzet Yolculuğuna Başlayın</h2>
              <a href="/products" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 transition-all shadow-lg text-sm sm:text-base">Ürünleri İncele</a>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
