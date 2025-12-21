'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ChatbotWidget from '@/components/ChatbotWidget';
import CinematicScroll from '@/components/CinematicScroll';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';

// 15 adet baklava ürünü
const FALLBACK_PRODUCTS = [
  { id: 'antep-pistachio', sku: 'FISTIK-KLASIK-1KG', name: 'Signature Antep Fıstıklı', description: 'Gaziantep\'in en seçkin Antep fıstığı ile hazırlanan premium baklava', priceCents: 85000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-1.jpg', isFeatured: true, isActive: true, sortOrder: 1 },
  { id: 'havuc-dilim', sku: 'FISTIK-HAVUC-1KG', name: 'Havuç Dilim Baklava', description: 'Parlak ıslak baklava çeşidi, lezzet ve sunumda şaşırtıcı', priceCents: 90000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-2.jpg', isFeatured: true, isActive: true, sortOrder: 2 },
  { id: 'saray-sarmasi', sku: 'FISTIK-KARE-1KG', name: 'Saray Sarması (Midye)', description: 'Saray mutfağının en zarif yapısı, mussel şeklinde', priceCents: 110000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-3.jpg', isFeatured: false, isActive: true, sortOrder: 3 },
  { id: 'klasik-cevizli', sku: 'CEVIZ-KLASIK-1KG', name: 'Klasik Cevizli', description: 'Geleneksel ceviz dolgusu ile yapılmış usta işi baklava', priceCents: 65000, weightGr: 1000, category: 'Cevizli Baklavalar', imageUrl: '/images/baklava-4.jpg', isFeatured: true, isActive: true, sortOrder: 4 },
  { id: 'kuru-baklava', sku: 'CEVIZ-BURMA-1KG', name: 'Kuru Baklava', description: 'Diyetisyenlerin favorisi, az şekerli ve çıtır yapısı', priceCents: 88000, weightGr: 1000, category: 'Cevizli Baklavalar', imageUrl: '/images/baklava-5.jpg', isFeatured: false, isActive: true, sortOrder: 5 },
  { id: 'sutlu-nuriye', sku: 'FISTIK-DOLAMA-1KG', name: 'Sütlü Nuriye', description: 'Şerbet yerine sütlü şurup ile yapılan hafif ve lezzetli', priceCents: 70000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-6.jpg', isFeatured: true, isActive: true, sortOrder: 6 },
  { id: 'sobiyet', sku: 'FISTIK-SARI-1KG', name: 'Şöbiyet', description: 'Kaymak ve antep fıstığı ile zenginleştirilmiş lüks çeşit', priceCents: 95000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-7.jpg', isFeatured: false, isActive: true, sortOrder: 7 },
  { id: 'chocolate-walnut', sku: 'OZEL-KARISIK-1KG', name: 'Çikolatalı Ceviz', description: 'Modern tadın geleneksel dokunuşu - belçika çikolatası', priceCents: 100000, weightGr: 1000, category: 'Özel Seri', imageUrl: '/images/baklava-8.jpg', isFeatured: true, isActive: true, sortOrder: 8 },
  { id: 'glutensiz-fistagli', sku: 'FISTIK-MIDYE-1KG', name: 'Glutensiz Fıstıklı', description: 'Sağlık bilinçli müşteriler için özel glutensiz formül', priceCents: 120000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-9.jpg', isFeatured: false, isActive: true, sortOrder: 9 },
  { id: 'badem-sarisi', sku: 'FISTIK-BÜLBÜL-1KG', name: 'Badem Sarısı', description: 'Zarif badem dolgusu ile hafif ve yüksek kaliteli', priceCents: 75000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-10.jpg', isFeatured: true, isActive: true, sortOrder: 10 },
  { id: 'premium-mix', sku: 'SÜTLÜ-NURIYE-1KG', name: 'Premium Karışık', description: 'En seçkin çeşitlerin özel koleksiyonu', priceCents: 105000, weightGr: 1000, category: 'Özel Seri', imageUrl: '/images/baklava-11.jpg', isFeatured: false, isActive: true, sortOrder: 11 },
  { id: 'kaday-fistik', sku: 'KADAYIF-FISTIK-1KG', name: 'Kadayıf Fıstıklı', description: 'Çıtır kadayıf ve fıstığın mükemmel kombinasyonu', priceCents: 82000, weightGr: 1000, category: 'Kadayıf', imageUrl: '/images/baklava-12.jpg', isFeatured: true, isActive: true, sortOrder: 12 },
  { id: 'palace-special', sku: 'FISTIK-PALACE-1KG', name: 'Palace Special', description: 'Premium özel seri baklava', priceCents: 120000, weightGr: 1000, category: 'Özel Seri', imageUrl: '/images/baklava-13.jpg', isFeatured: true, isActive: true, sortOrder: 13 },
  { id: 'ceviz-sarma', sku: 'CEVIZ-SARMA-1KG', name: 'Cevizli Sarma', description: 'El sarması cevizli rulo', priceCents: 68000, weightGr: 1000, category: 'Cevizli Baklavalar', imageUrl: '/images/baklava-14.jpg', isFeatured: false, isActive: true, sortOrder: 14 },
  { id: 'antep-special', sku: 'ANTEP-SPECIAL-1KG', name: 'Antep Special', description: 'Özel Antep fıstığı koleksiyonu', priceCents: 110000, weightGr: 1000, category: 'Özel Seri', imageUrl: '/images/baklava-15.jpg', isFeatured: true, isActive: true, sortOrder: 15 },
];

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };
    loadProducts();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Split Layout Container */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center py-16 md:py-32 min-h-[600px] md:min-h-[700px]">
              
              {/* LEFT: Text Content */}
              <div className="flex flex-col justify-center order-2 md:order-1">
                <motion.h1 
                  className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 tracking-wide leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  COŞKUN
                </motion.h1>
                <motion.h1 
                  className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-wide leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                >
                  YAYCI
                </motion.h1>
                
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                >
                  <p className="text-amber-400 text-2xl sm:text-3xl md:text-4xl font-script tracking-widest italic mb-2">
                    Baklava
                  </p>
                  <p className="text-amber-300/70 text-xs sm:text-sm md:text-base italic tracking-[0.2em]">
                    GELENEKSELDEĞERİNDİR
                  </p>
                </motion.div>
                
                <motion.p 
                  className="text-slate-200 text-lg md:text-xl mb-6 max-w-md leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
                >
                  Gaziantep'in köklü tatlı kültüründen ilham alan, %100 Antep fıstığı ile hazırlanan baklavalarımız. Geleneksel el sanatı ile modern zarafeti birleştiriyor.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/products" 
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm sm:text-base rounded-lg transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/30 relative overflow-hidden group"
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      <span className="relative flex items-center">
                        Koleksiyonu Keşfedin
                        <svg className="ml-2 w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/about" 
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-4 border-2 border-amber-500/40 text-amber-300 hover:bg-slate-800/50 hover:border-amber-500/60 font-semibold text-sm sm:text-base rounded-lg transition-all"
                    >
                      Hikayemiz
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* RIGHT: Hero Video - Responsive for Mobile & Desktop */}
              <div className="relative h-full flex items-center justify-center order-1 md:order-2 mb-8 md:mb-0">
                <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
                  {/* Video Container - Full Opacity */}
                  <div className="relative w-full h-full overflow-hidden rounded-2xl">
                    <video
                      src="/video.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl border border-amber-500/20 shadow-2xl shadow-amber-500/10 pointer-events-none" />
                    
                    {/* Shine Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-transparent to-amber-200/5 pointer-events-none" />
                  </div>
                  
                  {/* Floating Animation + Glow Circle */}
                  <div 
                    className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-300/10 blur-3xl pointer-events-none"
                    style={{
                      animation: 'float 6s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className="text-amber-400 text-2xl"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ↓
            </motion.div>
            <motion.p
              className="text-amber-400 text-xs font-semibold tracking-widest mt-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              KAYDIRIN
            </motion.p>
          </motion.div>
          
          {/* Float Animation */}
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </section>

        {/* Zarafet ve Kalite Section */}
        <section className="w-full relative">
          <div className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-amber-400 mb-4">Zarafet ve Kalite</h2>
                <p className="text-amber-300/70 italic text-lg">El emeği, göz nuru lezzetler</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {/* Kalite Garantisi - Unboxed */}
                <div className="text-center">
                  <div className="mx-auto mb-8 flex items-center justify-center">
                    <svg className="w-12 h-12 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-amber-400 mb-3">Kalite Garantisi</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">%100 doğal malzeme, katkısız üretim</p>
                </div>
                
                {/* Hızlı Teslimat - Unboxed */}
                <div className="text-center">
                  <div className="mx-auto mb-8 flex items-center justify-center">
                    <svg className="w-12 h-12 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-amber-400 mb-3">Hızlı Teslimat</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">Aynı gün teslimat seçeneği</p>
                </div>
                
                {/* Güvenli Ödeme - Unboxed */}
                <div className="text-center">
                  <div className="mx-auto mb-8 flex items-center justify-center">
                    <svg className="w-12 h-12 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-amber-400 mb-3">Güvenli Ödeme</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">SSL sertifikalı güvenli alışveriş</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4">
                ✦ KOLEKSİYONUMUZ ✦
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                El Yapımı Baklava Kutuları
              </h2>
              <p className="text-cream-300 max-w-2xl mx-auto">
                Geleneksel <span className="text-gold-400">Türk motiflerinden</span> ilham alan özel tasarım kutularımızda,
                <br />lezzet ve estetik bir arada
              </p>
            </div>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center mb-16">
              <div className="h-px w-24 bg-gold-500/30" />
              <div className="mx-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-500" />
                <div className="w-2 h-2 rounded-full bg-gold-500/60" />
                <div className="w-2 h-2 rounded-full bg-gold-500/30" />
              </div>
              <div className="h-px w-24 bg-gold-500/30" />
            </div>
            
            {/* Dynamic Bento Grid - Masonry Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
              {/* HERO: Signature Pistachio - Large Vertical Card (Featured) */}
              {products[0] && (
                <Link href={`/products/${products[0].sku || products[0].id}`} className="md:col-span-1 lg:col-span-2 lg:row-span-2 group cursor-pointer block">
                  <div className="relative h-full min-h-96 md:min-h-[600px] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                      {products[0].image ? (
                        <img
                          src={products[0].image}
                          alt={products[0].name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-800 to-primary-900" />
                      )}
                    </div>
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-5" />
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/30 via-transparent to-primary-900/40 group-hover:from-gold-500/50 transition-all duration-300 z-10" />
                    
                    {/* Content - Bottom Aligned */}
                    <div className="relative h-full flex flex-col justify-end p-8 z-20">
                      <span className="inline-block px-4 py-1 bg-gold-500 text-primary-900 rounded-full text-xs font-bold mb-4 w-fit">
                        ⭐ SIGNATURE SERIES
                      </span>
                      <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3 drop-shadow-lg">{products[0].name}</h3>
                      <p className="text-gold-300 text-lg mb-4 drop-shadow-md">Antep Fıstığı Özel Seçim</p>
                      <p className="text-cream-100 text-sm max-w-sm mb-6 leading-relaxed drop-shadow-md">{products[0].description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-gold-400 drop-shadow-lg">
                          ₺{products[0].basePrice || (products[0].priceCents / 100).toFixed(0)}
                        </span>
                        <button className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-primary-900 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl">
                          Sepete Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              
              {/* Regular Products Grid - Right Side */}
              {products.slice(1, 7).map((product, idx) => (
                <Link key={product.id} href={`/products/${product.sku || product.id}`} className="group cursor-pointer block">
                  <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <div className="p-4 md:p-5 flex flex-col h-full">
                      <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-green-700 to-primary-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">{idx % 2 === 0 ? '🥜' : '🍰'}</span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1 line-clamp-2">{product.name}</h4>
                      <p className="text-cream-300 text-xs mb-3 line-clamp-2">{product.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gold-500/20">
                        <span className="text-gold-400 font-bold">₺{product.basePrice || (product.priceCents / 100).toFixed(0)}</span>
                        <div className="px-3 py-1 bg-gold-500 text-primary-900 text-xs font-semibold rounded group-hover:bg-gold-600 transition-colors">
                          Sepete Ekle
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Category Banner - Wide Tray Section - Hero Card */}
            {products.find(p => p.sku === 'KARISIK_TEPSI_001') && (
              <Link href={`/products/${products.find(p => p.sku === 'KARISIK_TEPSI_001')?.sku}`} className="mt-16 relative rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all group cursor-pointer block">
                <div className="relative h-96 md:h-[500px] w-full">
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    {products.find(p => p.sku === 'KARISIK_TEPSI_001')?.image ? (
                      <img
                        src={products.find(p => p.sku === 'KARISIK_TEPSI_001')?.image}
                        alt="Karışık Baklava Tepsi"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary-700 to-primary-900" />
                    )}
                  </div>
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/40 via-transparent to-primary-900/30 group-hover:from-gold-500/60 transition-all duration-300 z-10" />
                  
                  {/* Content - Left Side */}
                  <div className="relative h-full flex flex-col justify-center p-12 z-20 max-w-lg">
                    <span className="inline-block px-4 py-2 bg-gold-500 text-primary-900 rounded-full text-sm font-bold mb-4 w-fit">
                      ✦ KOLEKSİYON AYDINLATMASI ✦
                    </span>
                    <h3 className="text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">Tepsi Baklavalar</h3>
                    <p className="text-cream-100 mb-8 text-lg leading-relaxed drop-shadow-md">
                      Özel davetler ve kutlamalar için şık sunumlar. Her tepsi, geleneksel reçete ile hazırlanmış en seçkin baklavalarımızdan oluşturulmuştur.
                    </p>
                    <div className="flex items-center gap-4 w-fit">
                      <span className="text-4xl font-bold text-gold-400 drop-shadow-lg">
                        ₺{products.find(p => p.sku === 'KARISIK_TEPSI_001')?.basePrice || 'TL'}
                      </span>
                      <button className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-primary-900 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl">
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Bottom Products Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(7, 15).map((product, idx) => (
                <Link key={product.id} href={`/products/${product.sku || product.id}`} className="group cursor-pointer block">
                  <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    <div className="p-4 md:p-5 flex flex-col h-full">
                      <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-green-700 to-primary-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">{idx % 3 === 0 ? '🌰' : idx % 3 === 1 ? '🍮' : '💚'}</span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1 line-clamp-2">{product.name}</h4>
                      <p className="text-cream-300 text-xs mb-3 line-clamp-2">{product.description}</p>
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gold-500/20">
                        <span className="text-gold-400 font-bold">₺{product.basePrice || (product.priceCents / 100).toFixed(0)}</span>
                        <div className="px-3 py-1 bg-gold-500 text-primary-900 text-xs font-semibold rounded group-hover:bg-gold-600 transition-colors">
                          Sepete Ekle
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-16">
              <Link href="/products" className="inline-flex items-center px-8 py-4 border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white font-semibold rounded-lg transition-all">
                Tüm Ürünleri Görüntüle
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Cinematic Scroll Section */}
            <div className="mt-24 pt-16 border-t border-gold-500/30">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4">
                  ✦ BAKLAVA SANATı ✦
                </span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                  Katmanların Sırrı
                </h2>
                <p className="text-cream-300 max-w-2xl mx-auto">
                  Her katman, her damla şerbet - baklava sanatının mükemmelliğini keşfet
                </p>
              </div>
              <CinematicScroll />
            </div>
          </div>
        </section>

        {/* Recently Viewed Section */}
        <RecentlyViewedSection />

        {/* Chatbot CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4">
              ✦ AKILLI SİPARİŞ ✦
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Chatbot ile Hızlı Sipariş
            </h2>
            <p className="text-cream-300 max-w-xl mx-auto mb-8">
              Yapay zeka asistanımız ile <span className="text-gold-400">doğal dilde</span> sipariş verin
            </p>
            <button 
              onClick={() => {
                const chatButton = document.querySelector('[data-chatbot-toggle]') as HTMLButtonElement;
                if (chatButton) chatButton.click();
              }}
              className="inline-flex items-center px-8 py-4 bg-primary-700 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all border border-primary-600"
            >
              <span className="mr-2">💬</span>
              Sağ alt köşedeki chatbot ikonuna tıklayın
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}
