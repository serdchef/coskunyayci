'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ChatbotWidget from '@/components/ChatbotWidget';
import { OttomanFloral } from '@/components/OttomanPattern';
import { CornerOrnament } from '@/components/CornerOrnament';

// 15 adet baklava ürünü
const FALLBACK_PRODUCTS = [
  { id: '1', sku: 'FISTIK-KLASIK-1KG', name: 'Klasik Fıstıklı Baklava', description: 'Gaziantep fıstığı ile hazırlanan geleneksel baklava', priceCents: 85000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-1.jpg', isFeatured: true, isActive: true, sortOrder: 1 },
  { id: '2', sku: 'FISTIK-HAVUC-1KG', name: 'Havuç Dilim Baklava', description: 'İnce kesim havuç dilim baklava', priceCents: 90000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-2.jpg', isFeatured: true, isActive: true, sortOrder: 2 },
  { id: '3', sku: 'FISTIK-KARE-1KG', name: 'Kare Baklava', description: 'Özel kesim kare baklava', priceCents: 85000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-3.jpg', isFeatured: false, isActive: true, sortOrder: 3 },
  { id: '4', sku: 'CEVIZ-KLASIK-1KG', name: 'Cevizli Baklava', description: 'Taze ceviz ile hazırlanan baklava', priceCents: 65000, weightGr: 1000, category: 'Cevizli Baklavalar', imageUrl: '/images/baklava-4.jpg', isFeatured: true, isActive: true, sortOrder: 4 },
  { id: '5', sku: 'CEVIZ-BURMA-1KG', name: 'Burma Cevizli', description: 'El açması burma cevizli baklava', priceCents: 70000, weightGr: 1000, category: 'Cevizli Baklavalar', imageUrl: '/images/baklava-5.jpg', isFeatured: false, isActive: true, sortOrder: 5 },
  { id: '6', sku: 'FISTIK-DOLAMA-1KG', name: 'Dolama Baklava', description: 'Rulo şeklinde dolama baklava', priceCents: 95000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-6.jpg', isFeatured: true, isActive: true, sortOrder: 6 },
  { id: '7', sku: 'FISTIK-SARI-1KG', name: 'Sarı Burma', description: 'Altın renkli sarı burma baklava', priceCents: 92000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-7.jpg', isFeatured: false, isActive: true, sortOrder: 7 },
  { id: '8', sku: 'OZEL-KARISIK-1KG', name: 'Karışık Baklava', description: 'Fıstık ve ceviz karışık seçim', priceCents: 80000, weightGr: 1000, category: 'Özel Seri', imageUrl: '/images/baklava-8.jpg', isFeatured: true, isActive: true, sortOrder: 8 },
  { id: '9', sku: 'FISTIK-MIDYE-1KG', name: 'Midye Baklava', description: 'Midye şeklinde özel baklava', priceCents: 98000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-9.jpg', isFeatured: false, isActive: true, sortOrder: 9 },
  { id: '10', sku: 'FISTIK-BÜLBÜL-1KG', name: 'Bülbül Yuvası', description: 'Geleneksel bülbül yuvası tatlısı', priceCents: 88000, weightGr: 1000, category: 'Fıstıklı Baklavalar', imageUrl: '/images/baklava-10.jpg', isFeatured: true, isActive: true, sortOrder: 10 },
  { id: '11', sku: 'SÜTLÜ-NURIYE-1KG', name: 'Sütlü Nuriye', description: 'Hafif sütlü tatlı seçenek', priceCents: 75000, weightGr: 1000, category: 'Sütlü Tatlılar', imageUrl: '/images/baklava-11.jpg', isFeatured: false, isActive: true, sortOrder: 11 },
  { id: '12', sku: 'KADAYIF-FISTIK-1KG', name: 'Kadayıf Dolması', description: 'Fıstıklı kadayıf dolması', priceCents: 82000, weightGr: 1000, category: 'Kadayıf', imageUrl: '/images/baklava-12.jpg', isFeatured: true, isActive: true, sortOrder: 12 },
  { id: '13', sku: 'FISTIK-PALACE-1KG', name: 'Palace Baklava', description: 'Premium özel seri baklava', priceCents: 120000, weightGr: 1000, category: 'Özel Seri', imageUrl: '/images/baklava-13.jpg', isFeatured: true, isActive: true, sortOrder: 13 },
  { id: '14', sku: 'CEVIZ-SARMA-1KG', name: 'Cevizli Sarma', description: 'El sarması cevizli rulo', priceCents: 68000, weightGr: 1000, category: 'Cevizli Baklavalar', imageUrl: '/images/baklava-14.jpg', isFeatured: false, isActive: true, sortOrder: 14 },
  { id: '15', sku: 'ANTEP-SPECIAL-1KG', name: 'Antep Special', description: 'Özel Antep fıstığı koleksiyonu', priceCents: 110000, weightGr: 1000, category: 'Özel Seri', imageUrl: '/images/baklava-15.jpg', isFeatured: true, isActive: true, sortOrder: 15 },
];

export default function HomePage() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { prisma } = await import('@/lib/db');
        const data = await prisma.product.findMany({
          where: { isActive: true },
          orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
        });
        if (data && data.length > 0) setProducts(data as any);
      } catch (error) {
        console.log('Using fallback products');
      }
    };
    loadProducts();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-primary-900">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-20 md:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="fixed inset-0 pointer-events-none">
            <OttomanFloral />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
            <CornerOrnament position="top-left" />
            <CornerOrnament position="top-right" />
            <CornerOrnament position="bottom-left" />
            <CornerOrnament position="bottom-right" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wide">
              COŞKUN YAYCI
            </h1>
            <p className="text-gold-400 text-2xl md:text-3xl tracking-[0.3em] mb-6">B A K L A V A</p>
            <p className="text-cream-300 text-lg md:text-xl mb-4 italic">
              "Geleneksel el sanatı ile modern zarafeti buluşturan"
            </p>
            <p className="text-cream-400/80 max-w-2xl mx-auto mb-10 text-sm md:text-base">
              Gaziantep'in köklü tatlı kültüründen ilham alan baklavaları, %100 Antep fıstığı ile
              hazırlanan baklavalarımızın tadını görkemizde de yaşatır.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="inline-flex items-center justify-center px-8 py-4 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl">
                Koleksiyonu Keşfedin
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 border-2 border-cream-300 text-cream-300 hover:bg-cream-300 hover:text-primary-900 font-semibold rounded-lg transition-all">
                Hikayemiz
              </Link>
            </div>
          </div>
          
          {/* Decorative Line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        </section>

        {/* Zarafet ve Kalite Section */}
        <section className="bg-cream-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-4">Zarafet ve Kalite</h2>
              <p className="text-gold-600 italic text-lg">El emeği, göz nuru lezzetler</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Kalite Garantisi */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary-900 mb-3">Kalite Garantisi</h3>
                <p className="text-gray-600 text-sm">%100 doğal malzeme, katkısız üretim</p>
              </div>
              
              {/* Hızlı Teslimat */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary-900 mb-3">Hızlı Teslimat</h3>
                <p className="text-gray-600 text-sm">Aynı gün teslimat seçeneği</p>
              </div>
              
              {/* Güvenli Ödeme */}
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary-900 mb-3">Güvenli Ödeme</h3>
                <p className="text-gray-600 text-sm">SSL sertifikalı güvenli alışveriş</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-primary-900 py-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
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
            <div className="flex items-center justify-center mb-12">
              <div className="h-px w-24 bg-gold-500/30" />
              <div className="mx-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-gold-500" />
                <div className="w-2 h-2 rounded-full bg-gold-500/60" />
                <div className="w-2 h-2 rounded-full bg-gold-500/30" />
              </div>
              <div className="h-px w-24 bg-gold-500/30" />
            </div>
            
            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* View All Button */}
            <div className="text-center mt-12">
              <Link href="/products" className="inline-flex items-center px-8 py-4 border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white font-semibold rounded-lg transition-all">
                Tüm Ürünleri Görüntüle
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Chatbot CTA Section */}
        <section className="bg-primary-800 py-20">
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
