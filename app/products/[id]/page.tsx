'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';
import { Heart, Truck, Shield, Leaf } from 'lucide-react';
import CinematicScroll from '@/components/CinematicScroll';
import SommelierChat from '@/components/SommelierChat';
import BoxBuilder from '@/components/BoxBuilder';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image: string;
  region: string;
  variants: Array<{ size: string; price: number }>;
  ingredients: string[];
  story: string;
  pairing: string;
}

const MOCK_PRODUCTS: Record<string, Product> = {
  'antep-pistachio': {
    id: 'antep-pistachio',
    name: 'Antep Fıstıklı Baklava',
    description: 'Gaziantep\'in efsanevi Antep fıstığı ile hazırlanan, katmanları çıtır çıtır baklava',
    category: 'PISTACHIO',
    basePrice: 45,
    image: '/images/baklava-pistachio.jpg',
    region: 'Gaziantep',
    variants: [
      { size: '250g', price: 45 },
      { size: '500g', price: 85 },
      { size: '1kg', price: 160 },
    ],
    ingredients: ['Antep Fıstığı', 'Açı Badem', 'Tereyağı', 'Şerbet', 'Su', 'Şeker', 'Tarçın'],
    story: 'Gaziantep\'in 2000 yıllık baklava geleneklerinde en önemli yeri olan Antep fıstıklı baklava, her katmanında bir hikaye taşır. Seçilmiş Antep fıstıkları, geleneksel yöntemler ile saatler süren işleme sonrası, usta ellerin tecrübesinin ürünü olarak hazırlanır.',
    pairing: 'Turkish Coffee (Türk Kahvesi) & Pistachio Flavored Mint Tea',
  },
  'chocolate-walnut': {
    id: 'chocolate-walnut',
    name: 'Çikolatalı Ceviz Baklava',
    description: 'Modern tadın geleneksel dokunuşu - cevizli baklava ile belçika çikolatası',
    category: 'CHOCOLATE',
    basePrice: 52,
    image: '/images/baklava-chocolate.jpg',
    region: 'Gaziantep',
    variants: [
      { size: '250g', price: 52 },
      { size: '500g', price: 98 },
      { size: '1kg', price: 185 },
    ],
    ingredients: ['Ceviz', 'Belçika Çikolatası', 'Kakao', 'Tereyağı', 'Şerbet', 'Vanilya'],
    story: 'Geleneksel Gaziantep baklavası ile modern çikolata sanatının buluşması. Her parça, usta konfeksiyonerlerin yaratıcılığını ve inovasyon tutkunuğunu yansıtır.',
    pairing: 'Turkish Coffee with Cinnamon & Dark Chocolate Flavored Tea',
  },
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS[params.id];
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'story' | 'ingredients' | 'pairing'>('story');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBoxBuilder, setShowBoxBuilder] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600">Aradığınız ürün mevcut değil.</p>
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
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50">
      <Header />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: PRODUCT IMAGE WITH PARALLAX */}
            <motion.div
              className="relative aspect-square"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-gold-500/20 rounded-2xl blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* FLOATING BADGES */}
              <motion.div
                className="absolute top-8 right-8 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-sm font-semibold text-gold-500">🌟 Premium</span>
              </motion.div>
            </motion.div>

            {/* RIGHT: PRODUCT INFO */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-6">
                <span className="inline-block bg-gold-100 text-gold-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {product.region}
                </span>
                <h1 className="text-5xl font-bold font-serif text-primary-900 mb-3 tracking-tight">{product.name}</h1>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              </div>

              {/* RATING & REVIEWS */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl text-gold-400">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">(156 değerlendirme)</span>
              </div>

              {/* PRICE */}
              <div className="mb-8">
                <div className="text-5xl font-bold text-primary-900 mb-2">
                  ₺{selectedVariant?.price || product.basePrice}
                </div>
                <p className="text-gray-500">Seçili paket: {selectedVariant?.size || 'Seçim yapınız'}</p>
              </div>

              {/* VARIANTS */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-primary-900 mb-4">
                  📦 Paket Seçin
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <motion.button
                      key={variant.size}
                      onClick={() => setSelectedVariant(variant)}
                      className={`py-3 px-4 rounded-sm font-semibold transition-all border ${
                        selectedVariant?.size === variant.size
                          ? 'border-gold-400 bg-gold-50/50 text-gold-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gold-300'
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
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 font-light"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-semibold text-primary-900 border-l border-r border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 font-light"
                  >
                    +
                  </button>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-white font-bold py-4 rounded-sm hover:shadow-lg hover:shadow-gold-500/40 transition-shadow text-lg border border-gold-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🛒 Sepete Ekle
                </motion.button>

                <motion.button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`px-6 py-4 rounded-sm border transition-all ${
                    isFavorite
                      ? 'border-red-400 bg-red-50/50'
                      : 'border-gray-300 bg-white hover:border-red-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart size={24} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                </motion.button>
              </div>

              {/* TRUST BADGES */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center gap-2">
                  <Truck className="text-gold-500" size={24} />
                  <span className="text-sm font-semibold text-gray-700">Hızlı Kargo</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Shield className="text-gold-500" size={24} />
                  <span className="text-sm font-semibold text-gray-700">Garantili</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Leaf className="text-gold-500" size={24} />
                  <span className="text-sm font-semibold text-gray-700">Doğal Ürün</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* CENTER: CINEMATIC SCROLL + TABS */}
          <div className="lg:col-span-2 space-y-12">
            {/* CINEMATIC SCROLL SECTION */}
            <CinematicScroll />

            {/* INFO TABS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="flex border-b border-gray-200">
                {(['story', 'ingredients', 'pairing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 font-semibold transition-all border-b-2 ${
                      activeTab === tab
                        ? 'border-gold-400 text-gold-700 bg-gold-50/30'
                        : 'border-gray-200 text-gray-600 hover:text-primary-900'
                    }`}
                  >
                    {tab === 'story' && '📖 Hikaye'}
                    {tab === 'ingredients' && '🥜 İçindekiler'}
                    {tab === 'pairing' && '☕ Eşleştirme'}
                  </button>
                ))}
              </div>

              <div className="p-8 md:p-12">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'story' && (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed text-lg">{product.story}</p>
                    </div>
                  )}

                  {activeTab === 'ingredients' && (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {product.ingredients.map((ingredient, idx) => (
                          <motion.div
                            key={ingredient}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gradient-to-br from-gold-100 to-cream-100 rounded-lg p-4 text-center"
                          >
                            <p className="font-semibold text-primary-900">{ingredient}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'pairing' && (
                    <div className="bg-gradient-to-r from-gold-50 to-cream-50 rounded-lg p-8 border border-gold-200">
                      <p className="text-xl font-semibold text-primary-900 mb-4">💎 Mükemmel Eşleştirme</p>
                      <p className="text-gray-700 leading-relaxed">{product.pairing}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* SIDEBAR: SOMMELIER + BOX BUILDER */}
          <div className="lg:col-span-1 space-y-6 h-fit sticky top-32">
            {/* SOMMELIER CHAT */}
            <SommelierChat product={product} />

            {/* BOX BUILDER CTA */}
            {!showBoxBuilder && (
              <motion.button
                onClick={() => setShowBoxBuilder(true)}
                className="w-full bg-gradient-to-r from-primary-900 to-primary-800 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🎁 Kendi Kutunu Oluştur
              </motion.button>
            )}

            {/* BOX BUILDER */}
            {showBoxBuilder && <BoxBuilder />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
