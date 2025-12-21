'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';

interface ProductDisplay {
  id: string;
  sku: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  image: string;
  variants: Array<{ id: string; size: string; price: number }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API'den ürünleri çek
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Ürünler yüklenemedi');
        }
        const data = await response.json();

        // Ürünleri display formatına dönüştür
        const formattedProducts: ProductDisplay[] = data.products.map((product: any) => ({
          id: product.id,
          sku: product.sku,
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          category: product.category,
          image: product.image,
          variants: product.variants || [],
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = ['Tümü', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts =
    selectedCategory === 'Tümü'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3 font-serif">✨ Ürünlerimiz</h1>
            <p className="text-slate-300 text-lg">
              {products.length} premium baklava çeşidinden sizin favorinizi seçin
            </p>
          </div>

          {/* Category Filter - GHOST STYLE (Luxury) */}
          <div className="mb-12 flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full font-bold text-base transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50 border-2 border-amber-500'
                    : 'bg-transparent text-amber-400 border-2 border-amber-500 hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              <span className="ml-4 text-amber-400 font-semibold">Ürünler yükleniyor...</span>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.sku || product.id}`} className="block group">
                  <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-amber-500/20 overflow-hidden h-full flex flex-col hover:-translate-y-2">
                    {/* Product Image / Icon */}
                    <div className="relative h-48 sm:h-56 lg:h-64 w-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-6xl mb-2">🍰</div>
                          <span className="text-xs text-slate-400 px-2">{product.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 p-6 flex flex-col">
                      <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition font-serif line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price & Variants */}
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-amber-400">
                          ₺{product.basePrice.toFixed(2)}
                        </div>
                        {product.variants.length > 0 && (
                          <div className="flex gap-1 text-xs text-slate-400 flex-wrap">
                            {product.variants.slice(0, 3).map((v) => (
                              <span key={v.id} className="px-2 py-1 bg-slate-700/50 rounded border border-amber-500/10">
                                {v.size}
                              </span>
                            ))}
                            {product.variants.length > 3 && (
                              <span className="px-2 py-1 bg-slate-700/50 rounded border border-amber-500/10">
                                +{product.variants.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Add to Cart Button - GHOST STYLE (Luxury) */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="mt-4 bg-transparent border-2 border-amber-500 text-amber-400 px-4 py-2 rounded-lg hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/50 transition-all duration-300 text-sm font-medium w-full"
                      >
                        Sepete Ekle
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                Ürün bulunamadı. Lütfen daha sonra tekrar deneyiniz.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed Section */}
      <RecentlyViewedSection />

      <Footer />
    </>
  );
}
