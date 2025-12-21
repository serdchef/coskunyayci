'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/context/CartContext';
import { Heart, Truck, CheckCircle2, Leaf, Loader, ShoppingCart } from 'lucide-react';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  region: string;
  variants: Array<{ id: string; size: string; price: number }>;
  ingredients: string[];
  story: string;
  pairing: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<{ id: string; size: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'ingredients' | 'pairing'>('story');
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    async function loadProduct() {
      try {
        // params.id is now either SKU or UUID
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const dbProduct = await response.json();
        
        setProduct({
          id: dbProduct.id,
          name: dbProduct.name,
          description: dbProduct.description,
          category: dbProduct.category,
          basePrice: dbProduct.basePrice,
          image: dbProduct.image,
          region: 'Gaziantep',
          variants: dbProduct.variants.map((v: any) => ({
            id: v.id,
            size: v.size,
            price: v.price,
          })),
          ingredients: [],
          story: `${dbProduct.name} - Premium Gaziantep baklavası`,
          pairing: 'Turkish Coffee',
        });
        if (dbProduct.variants.length > 0) {
          setSelectedVariant({
            id: dbProduct.variants[0].id,
            size: dbProduct.variants[0].size,
            price: dbProduct.variants[0].price,
          });
        }
        
        // Add to recently viewed
        addProduct({
          id: dbProduct.id,
          sku: dbProduct.sku,
          name: dbProduct.name,
          image: dbProduct.image,
          basePrice: dbProduct.basePrice,
          viewedAt: Date.now(),
        });
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-900 via-slate-900 to-black">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader className="w-12 h-12 text-amber-400 mx-auto animate-spin mb-4" />
          <p className="text-slate-300">Ürün yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-900 via-slate-900 to-black">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold text-amber-400 mb-4">Ürün Bulunamadı</h1>
          <p className="text-slate-300">Aradığınız ürün mevcut değil.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant?.price || product.basePrice,
      quantity: quantity,
      image: product.image,
      imageUrl: product.image,
      variant: selectedVariant?.size,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 via-slate-900 to-black">
      <Header />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">
            {/* LEFT: PRODUCT IMAGE WITH PARALLAX */}
            <motion.div
              className="relative h-[300px] sm:h-[400px] lg:h-[600px]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Luxury Glow Background */}
              <div className="absolute -inset-6 bg-gradient-to-br from-amber-400/30 via-amber-500/20 to-orange-500/10 rounded-3xl blur-3xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl z-10" />
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-full border border-amber-500/20">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* FLOATING BADGES */}
              <motion.div
                className="absolute top-8 right-8 bg-gradient-to-br from-amber-500/90 to-orange-600/90 backdrop-blur px-5 py-3 rounded-full shadow-xl border border-amber-300/40"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-sm font-bold text-white tracking-widest">✨ PREMIUM</span>
              </motion.div>

              {/* Stock Status Badge */}
              <motion.div
                className="absolute bottom-8 left-8 bg-gradient-to-br from-emerald-500/90 to-green-600/90 backdrop-blur px-5 py-3 rounded-full shadow-xl border border-emerald-300/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="text-sm font-bold text-white tracking-widest">🔥 BUGÜN TAZE</span>
              </motion.div>
            </motion.div>

            {/* RIGHT: PRODUCT INFO */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 lg:mt-0"
            >
              <div className="mb-6">
                <span className="inline-block bg-amber-500/20 text-amber-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 border border-amber-500/40">
                  {product.region}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white mb-3 tracking-tight">{product.name}</h1>
                <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 leading-relaxed">{product.description}</p>
              </div>

              {/* RATING & REVIEWS */}
              <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-amber-500/20">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg sm:text-xl text-amber-400">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm sm:text-base text-slate-300">(156 değerlendirme)</span>
              </div>

              {/* PRICE */}
              <div className="mb-6 sm:mb-8">
                <div className="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">
                  ₺{selectedVariant?.price || product.basePrice}
                </div>
                <p className="text-xs sm:text-sm text-slate-400">Seçili paket: {selectedVariant?.size || 'Seçim yapınız'}</p>
              </div>

              {/* VARIANTS */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-white mb-4">
                  📦 Paket Seçin
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <motion.button
                      key={variant.size}
                      onClick={() => setSelectedVariant(variant)}
                      className={`py-3 px-4 rounded-sm font-semibold transition-all border ${
                        selectedVariant?.size === variant.size
                          ? 'border-amber-400 bg-amber-500/20 text-amber-400'
                          : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-amber-500/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-sm">{variant.size}</div>
                      <div className="text-xs mt-1">₺{variant.price}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* QUANTITY & CTA */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-slate-700 rounded-sm bg-slate-800/50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-slate-300 hover:bg-slate-700/50 font-light"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-semibold text-white border-l border-r border-slate-700">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-slate-300 hover:bg-slate-700/50 font-light"
                  >
                    +
                  </button>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 bg-transparent border-2 border-amber-500 text-amber-400 font-bold py-4 rounded-lg hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/50 transition-all text-lg tracking-widest"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🛒 SEPETE EKLE
                </motion.button>

                <motion.button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`px-6 py-4 rounded-sm border transition-all ${
                    isFavorite
                      ? 'border-red-500/40 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-red-500/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={24} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-300'} />
                </motion.button>
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-500/20">
                <div className="flex flex-col items-center gap-2">
                  <Truck className="text-amber-400" size={24} />
                  <span className="text-sm font-semibold text-slate-300">Hızlı Kargo</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="text-amber-400" size={24} />
                  <span className="text-sm font-semibold text-slate-300">Garantili</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Leaf className="text-amber-400" size={24} />
                  <span className="text-sm font-semibold text-slate-300">Doğal Ürün</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs - Unified Color */}
      <section className="bg-slate-900/50 border-y border-amber-500/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-8 mb-12 border-b border-amber-500/20">
              {(['story', 'ingredients', 'pairing'] as const).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-semibold transition-colors text-lg ${
                    activeTab === tab
                      ? 'text-amber-400 border-b-2 border-amber-500'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {tab === 'story' && '📖 Hikaye'}
                  {tab === 'ingredients' && '🥜 İçindekiler'}
                  {tab === 'pairing' && '☕ Eşleştirme'}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'story' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-amber-500/20">
                    <p className="text-slate-300 leading-relaxed text-lg">{product.story}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-lg p-6 border border-amber-500/30 text-center">
                      <p className="text-3xl mb-2">⏰</p>
                      <p className="font-serif font-bold text-white mb-1">Usta İmalı</p>
                      <p className="text-xs text-slate-400">Her katman kol gücüyle açılır</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/10 rounded-lg p-6 border border-emerald-500/30 text-center">
                      <p className="text-3xl mb-2">🌿</p>
                      <p className="font-serif font-bold text-white mb-1">Doğal Tatlandırıcı</p>
                      <p className="text-xs text-slate-400">Yapay bileşen yok, sade şerbet</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-500/20 to-pink-600/10 rounded-lg p-6 border border-rose-500/30 text-center">
                      <p className="text-3xl mb-2">👑</p>
                      <p className="font-serif font-bold text-white mb-1">Premium Kalite</p>
                      <p className="text-xs text-slate-400">4 asırlık Gaziantep geleneği</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ingredients' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Sample ingredients with editorial descriptions */}
                  {[
                    { name: 'Gaziantep\'in Seçilmiş Antep Fıstığı', origin: 'Harran Ovası, Gaziantep', description: '100 yıllık bahçelerden el ile toplanan, en yüksek kaliteli fıstık' },
                    { name: 'Harran Ovası Sert Buğdayı', origin: 'Şanlıurfa, Harran Ovası', description: 'Ender bulunan, yüksek gluten oranı ile esnekliği sağlayan buğday' },
                    { name: 'Organik Ballı Şerbet', origin: 'Anadolu Organik Çiftlikleri', description: 'Arıcılıkla elde edilen doğal çiçek balı, seçilmiş şekeri ve limon suyu' },
                    { name: 'Tarçın & Karanfil Baharat Karışımı', origin: 'Rize Yüksek Dağları', description: 'Geleneksel ölçülerde, dört asırlık reçete ile hazırlanan baharat' },
                  ].map((ingredient, idx) => (
                    <motion.div
                      key={ingredient.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="text-4xl">🌾</div>
                        <div className="flex-1">
                          <p className="font-serif text-lg font-bold text-white mb-1">{ingredient.name}</p>
                          <p className="text-amber-400 text-xs font-semibold tracking-widest mb-3">📍 {ingredient.origin}</p>
                          <p className="text-slate-300 text-sm leading-relaxed">{ingredient.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="bg-gradient-to-br from-emerald-600/20 to-green-700/10 rounded-xl p-6 border border-emerald-500/40 mt-8">
                    <p className="text-sm text-emerald-300 font-semibold tracking-widest mb-2">♻️ DOĞAL & SAĞLIKLI</p>
                    <p className="text-slate-300 leading-relaxed">Tüm malzemeleri organik yöntemlerle, yapay renk ve katkı maddesi olmadan temin etmekteyiz. Coşkun Yaycı Baklava, doğanın saf lezzetini takdim eder.</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pairing' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-amber-600/20 via-orange-500/10 to-transparent rounded-2xl p-10 border border-amber-500/40 shadow-xl">
                    <div className="flex items-start gap-6">
                      <div className="text-6xl">🍵</div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-white font-serif mb-2">Demli Rize Çayı</p>
                        <p className="text-amber-300 font-semibold text-sm tracking-widest mb-4">BAKLAVA SOMMELIASI TARAFISAN ÖNERILIR</p>
                        <p className="text-slate-300 leading-relaxed">Baklavanın şerbetli tatlılığını dengelemek için koyu demlenmiş, kuvvetli bir Rize çayı tercih edin. Çayın biraz acı ve kuvvetli aroması, baklavanın yağlı dokusunu hafifletecek.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent rounded-2xl p-10 border border-blue-500/40 shadow-xl">
                    <div className="flex items-start gap-6">
                      <div className="text-6xl">🥛</div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-white font-serif mb-2">Soğuk Çiğ Süt</p>
                        <p className="text-blue-300 font-semibold text-sm tracking-widest mb-4">KLASİK EŞLEŞTIRME</p>
                        <p className="text-slate-300 leading-relaxed">Baklavayı, soğuk ve saf bir çiğ sütle eşleştirmek, geleneğin en şık halidir. Süt, baklavanın şerbetini yumuşatırken, her lokmanın lezzeti katlanarak artar.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-rose-600/20 via-pink-500/10 to-transparent rounded-2xl p-10 border border-rose-500/40 shadow-xl">
                    <div className="flex items-start gap-6">
                      <div className="text-6xl">☕</div>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-white font-serif mb-2">Türk Kahvesi</p>
                        <p className="text-rose-300 font-semibold text-sm tracking-widest mb-4">SARAY GELENEĞİ</p>
                        <p className="text-slate-300 leading-relaxed">Koyu kavrulmuş, biraz köpüklü bir Türk kahvesi, baklavanın tatlılığını dengelemenin en sofistike yoludur. 17. yüzyıl Osmanlı Sarayının tercih ettiği kombinasyon.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900/50 to-black border-t border-amber-500/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-amber-400 font-semibold tracking-widest text-sm mb-3">YAKLAŞIK ÜRÜNLERİ KEŞFEDİN</p>
              <h2 className="text-4xl font-bold font-serif text-white">Bununla Sevilen Baklavalar</h2>
              <p className="text-slate-400 mt-3">Aynı lezzetler, farklı tadlar – koleksiyonumuzu keşfet</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 'havuc-dilim', name: 'Havuç Dilim Baklava', price: '₺90' },
                { id: 'saray-sarmasi', name: 'Saray Sarması (Midye)', price: '₺110' },
                { id: 'sobiyet', name: 'Şöbiyet', price: '₺95' },
              ].map((related) => (
                <motion.a
                  key={related.id}
                  href={`/products/${related.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/40 transition-all group"
                >
                  <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg h-48 mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-amber-400/20 to-orange-500/10 flex items-center justify-center text-4xl">
                      🥜
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-400 transition-colors mb-2">{related.name}</h3>
                  <p className="text-amber-400 font-bold text-xl">{related.price}</p>
                  <p className="text-xs text-slate-400 mt-3">Detayları görmek için tıkla →</p>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <RecentlyViewedSection />

      <Footer />
    </div>
  );
}
