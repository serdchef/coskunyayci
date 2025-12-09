'use client';

import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-teal-900 mb-8">Alışveriş Sepetim</h1>

          {items.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/20">
              <p className="text-gray-600 mb-6">Sepetinizde ürün bulunmamaktadır.</p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
              >
                Ürünleri Gör
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20 flex gap-4"
                  >
                    {item.imageUrl && (
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-600">
                          {typeof item.variant === 'string' 
                            ? item.variant 
                            : `${item.variant.size}${item.variant.weight ? ` (${item.variant.weight})` : ''}`}
                        </p>
                      )}
                      <p className="text-teal-600 font-bold mt-2">₺{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition text-sm font-medium"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Özet</h2>
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>Ara Toplam:</span>
                      <span className="font-semibold">₺{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Kargo:</span>
                      <span className="font-semibold">Checkout'ta hesaplanacak</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-teal-900 mb-6">
                    <span>Toplam:</span>
                    <span>₺{total.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg text-center transition"
                  >
                    Checkout'a Git
                  </Link>
                  <Link
                    href="/products"
                    className="block w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg text-center transition"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
