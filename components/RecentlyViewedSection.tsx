'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';

export default function RecentlyViewedSection() {
  const { recentlyViewed, isLoaded } = useRecentlyViewed();

  // Don't render if not loaded or empty
  if (!isLoaded || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-primary-900 to-primary-800 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gold-500/20 text-gold-400 rounded-full text-sm font-medium mb-4">
            ✦ DEVAM ET ✦
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
            Son Ziyaret Edilen Ürünler
          </h2>
          <p className="text-cream-300">Senin seçtiğin lezzetleri yeniden keşfet</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentlyViewed.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/products/${product.sku}`} className="group block">
                <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-primary-800 h-full">
                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-green-700 to-primary-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🥮</span>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 z-10">
                    <button className="w-full bg-gold-500 hover:bg-gold-600 text-primary-900 font-bold py-2 rounded-lg transition-all text-sm">
                      Sepete Ekle
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gold-400 font-bold text-sm">
                      ₺{product.basePrice}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
