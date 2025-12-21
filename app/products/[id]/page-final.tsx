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
  }, [params.id, addProduct]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader className="w-12 h-12 text-primary-700 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
        <Footer />
      </div>
    );
  }

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

  // Format price without decimals
  const formatPrice = (price: number) => {
    return `₺${Math.round(price).toLocaleString('tr-TR')}`;
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      {/* HERO: Image Gallery + Sticky Sidebar Layout */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* LEFT: Large Product Image */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gold-100 to-cream-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🥮</div>
                )}
                
                {/* Floating Badge */}
                <motion.div
                  className="absolute top-8 right-8 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-sm font-semibold text-amber-600">⭐ Premium</span>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT: Sticky Product Info */}
            <motion.div
              className="lg:col-span-1 lg:sticky lg:top-32 h-fit"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gold-200/50">
                
                {/* Category & Region */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">
                    {product.region}
                  </span>
                  <span className="text-sm text-gray-500">{product.category}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-serif font-bold text-primary-900 mb-3 leading-tight">
                  {product.name}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-8 pb-8 border-b border-gold-200">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl text-amber-400">★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(156 değerlendirme)</span>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 mb-2">Fiyat</p>
                  <p className="text-5xl font-bold text-primary-900">
                    {formatPrice(selectedVariant?.price || product.basePrice)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Seçili paket: {selectedVariant?.size || '250g'}
                  </p>
                </div>

                {/* Variants */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-primary-900 mb-3">
                    Paket Seçin
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.map((variant) => (
                      <motion.button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 text-sm ${
                          selectedVariant?.id === variant.id
                            ? 'border-amber-500 bg-amber-50 text-primary-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {variant.size}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-primary-900 mb-3">
                    Miktar
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart size={20} />
                    Sepete Ekle
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:border-amber-600 hover:text-amber-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart size={20} className="inline mr-2" fill={isFavorite ? 'currentColor' : 'none'} />
                    {isFavorite ? 'Favorilerde' : 'Favoriye Ekle'}
                  </motion.button>
                </div>

                {/* Trust Signals */}
                <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Truck size={18} className="text-amber-600" />
                    <span><strong>Hızlı Teslimat:</strong> 1-2 iş günü</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={18} className="text-green-600" />
                    <span><strong>Garantili:</strong> %100 Doğal Malzeme</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Leaf size={18} className="text-emerald-600" />
                    <span><strong>Sağlık:</strong> Katkısız, Günlük Yapılır</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs - Unified Color */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-8 mb-12 border-b border-gold-200">
              {(['story', 'ingredients', 'pairing'] as const).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-semibold transition-colors text-lg ${
                    activeTab === tab
                      ? 'text-primary-900 border-b-2 border-amber-600'
                      : 'text-gray-500 hover:text-gray-700'
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
                        className="bg-gradient-to-br from-amber-50 to-cream-100 rounded-lg p-4 text-center border border-gold-200/50"
                      >
                        <p className="font-semibold text-primary-900">{ingredient}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pairing' && (
                <div className="bg-gradient-to-r from-amber-50 to-cream-50 rounded-lg p-8 border border-gold-200">
                  <p className="text-xl font-semibold text-primary-900 mb-4">💎 Mükemmel Eşleştirme</p>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.pairing}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <RecentlyViewedSection />

      <Footer />
    </div>
  );
}
