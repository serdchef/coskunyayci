'use client';

import { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  category: string;
  variants: Array<{
    id: string;
    size: string;
    price: number;
    weight: string;
  }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Product['variants'][0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Kategorileri çıkart
  const categories = ['Tümü', ...Array.from(new Set(products.map((p: any) => p.category)))];
  const filteredProducts = selectedCategory === 'Tümü'
    ? products
    : products.filter((p: any) => p.category === selectedCategory);

  // Mock data - normally fetched from API
  if (products.length === 0) {
    setProducts([
      {
        id: 'antep-pistachio',
        sku: 'AP-001',
        name: 'Antep Fıstıklı Baklava',
        description: 'Gaziantep\'in efsanevi Antep fıstığı ile hazırlanan baklava',
        imageUrl: '/images/baklava-pistachio.jpg',
        basePrice: 45,
        category: 'PISTACHIO',
        variants: [
          { id: '1', size: '250g', price: 45, weight: '250g' },
          { id: '2', size: '500g', price: 85, weight: '500g' },
        ],
      },
    ]);
  }

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedVariant) return;

    addToCart({
      id: selectedProduct.id,
      name: `${selectedProduct.name} (${selectedVariant.size})`,
      price: selectedVariant.price,
      quantity,
      image: selectedProduct.imageUrl,
      variant: selectedVariant.size,
    });

    setSelectedProduct(null);
    setQuantity(1);
  };


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-teal-900">
              Ürünlerimiz
            </h1>
            <Link
              href="/sepetim"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Sepetim
            </Link>
          </div>
        </div>

        {/* Products Grid & Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-teal-900 mb-4">Kategoriler</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white shadow-lg'
                        : 'bg-gray-100 text-teal-900 hover:bg-teal-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  Toplam: {filteredProducts.length} ürün
                </p>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group text-left"
                >
                  <div className="relative h-56 w-full rounded-xl overflow-hidden mb-4 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-gray-200 to-gray-300">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">Resim</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-teal-600 font-bold uppercase tracking-widest">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-semibold text-teal-900 group-hover:text-teal-700 transition line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-2xl font-bold text-teal-600">₺{product.basePrice}</span>
                      <span className="text-xs text-gray-500">base price</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/20 p-8 max-h-[90vh] overflow-y-auto">
              <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold text-teal-900 mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

              {/* Variant Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Boy Seçin
                </label>
                <div className="space-y-2">
                  {selectedProduct.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full p-3 rounded-lg border-2 transition text-left ${
                        selectedVariant?.id === variant.id
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-300 bg-white hover:border-teal-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          {variant.size}
                        </span>
                        <span className="font-bold text-teal-600">
                          ₺{variant.price}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{variant.weight}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adet
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold text-gray-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg transition"
                >
                  Sepete Ekle
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
