'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { getProductsForB2C } from '@/lib/db';

interface Product {
  id: string;
  name: string;
  basePrice: number;
}

interface OrderItem extends Product {
  quantity: number;
  total: number;
}

export default function KurumsalTopluSiparisPage() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ürünleri veritabanından yükle
  useEffect(() => {
    async function loadProducts() {
      try {
        const products = await getProductsForB2C();
        const formattedProducts = products.map((p: any) => ({
          id: p.id,
          name: p.name,
          basePrice: p.basePrice,
        }));
        setDbProducts(formattedProducts);

        // OrderItems'ı ürünlerle doldur
        const initialItems = formattedProducts.map((p: Product) => ({
          ...p,
          quantity: 0,
          total: 0,
        }));
        setOrderItems(initialItems);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Ürünler yüklenemedi');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const updateQuantity = (id: string, quantity: number) => {
    setOrderItems(
      orderItems.map((item) => ({
        ...item,
        quantity: Math.max(0, quantity),
        total: Math.max(0, quantity) * item.basePrice,
      }))
    );
  };

  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);
  const discountedTotal = totalAmount * 0.85; // 15% discount
  const savings = totalAmount - discountedTotal;

  const needsQuote = totalQuantity > 100;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalQuantity === 0) {
      toast.error('Lütfen en az 1 ürün seçiniz');
      return;
    }

    setSubmitting(true);

    try {
      // Mock order submission
      const orderData = {
        items: orderItems.filter((item) => item.quantity > 0),
        totalQuantity,
        totalAmount,
        discountedTotal,
        savings,
        notes,
        timestamp: new Date().toISOString(),
      };

      console.log('B2B Order Submitted:', orderData);

      if (needsQuote) {
        toast.success('✅ Teklifini istediğiniz için teşekkürler! 24 saate cevap verilecektir.');
      } else {
        toast.success('✅ Siparişiniz başarıyla alındı!');
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setOrderItems(
          orderItems.map((item) => ({
            ...item,
            quantity: 0,
            total: 0,
          }))
        );
        setNotes('');
      }, 2000);
    } catch (error) {
      toast.error('Sipariş gönderimi başarısız oldu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold-400 font-serif mb-2">Toplu Sipariş</h1>
          <p className="text-emerald-200">
            Kurumsal müşteriler için özel fiyatlandırma ve toplu sipariş yönetimi
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mr-4"></div>
            <p className="text-gold-400 font-semibold">Ürünler yükleniyor...</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-gold-600/10 to-gold-900/20 border border-gold-600/30 rounded-xl p-4 mb-8">
              <p className="text-gold-300 font-semibold mb-2">💎 Kurumsal Avantajlar:</p>
              <p className="text-gold-200 text-sm">
                Tüm ürünlerde %15 indirim • 500+ TL siparişlerde ekstra %5 indirim • 30 gün ödeme süresi
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-3 gap-8">
              {/* Products Grid */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gold-400 font-serif mb-6">
                  Ürünler ({dbProducts.length})
                </h2>

                {dbProducts.length > 0 ? (
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-br from-slate-900/50 to-emerald-900/20 backdrop-blur-xl rounded-lg border border-gold-600/20 p-4 hover:border-gold-600/40 transition"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div>
                            <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                            <p className="text-gold-400 font-bold text-sm">
                              ₺{item.basePrice.toFixed(2)} x adet
                            </p>
                          </div>

                          <div className="flex items-center gap-3 justify-end">
                            {/* Quantity Input */}
                            <div className="flex items-center bg-slate-800/50 border border-gold-600/20 rounded-lg">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-2 text-gold-400 hover:bg-gold-600/20 transition"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(item.id, parseInt(e.target.value) || 0)
                                }
                                className="w-16 text-center bg-transparent border-0 text-white outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-2 text-gold-400 hover:bg-gold-600/20 transition"
                              >
                                +
                              </button>
                            </div>

                            {/* Total Price */}
                            {item.quantity > 0 && (
                              <div className="text-right min-w-20">
                                <p className="text-emerald-300 text-xs">Toplam</p>
                                <p className="text-gold-400 font-bold">₺{item.total.toFixed(2)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-emerald-300">Ürün bulunamadı</p>
                  </div>
                )}

            {/* Notes Section */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gold-400 mb-3">Özel Notlar (İsteğe Bağlı)</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Teslimat tarihi, özel paketleme, vb. istek ve notlarınızı yazınız..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-800/50 border border-gold-600/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-600/60 focus:ring-1 focus:ring-gold-600/30 outline-none transition"
              />
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900/60 to-emerald-900/30 backdrop-blur-xl rounded-xl border border-gold-600/40 p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gold-400 font-serif mb-6 pb-6 border-b border-gold-600/20">
                Sipariş Özeti
              </h3>

              {/* Quantity Stats */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gold-600/20">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300">Toplam Adet:</span>
                  <span className="text-gold-400 font-bold text-lg">{totalQuantity}</span>
                </div>
                {totalQuantity > 100 && (
                  <div className="flex items-start gap-2 p-3 bg-gold-600/10 rounded-lg">
                    <span className="text-lg">⭐</span>
                    <p className="text-gold-300 text-xs font-semibold">
                      100+ adet: Özel teklif için başvurunuz oluşturulacak
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-6 border-b border-gold-600/20">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-200">Ara Toplam:</span>
                  <span className="text-white font-semibold">₺{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300 font-semibold">İndirim (-15%):</span>
                  <span className="text-emerald-400 font-bold">-₺{savings.toFixed(2)}</span>
                </div>
                {totalQuantity > 0 && totalAmount >= 500 && (
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-300 font-semibold">Ek İndirim (-5%):</span>
                    <span className="text-emerald-400 font-bold">-₺{(totalAmount * 0.05).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Final Total */}
              <div className="bg-gradient-to-r from-gold-600/20 to-emerald-600/10 rounded-lg p-4 mb-6">
                <p className="text-emerald-200 text-xs mb-1">Ödenecek Toplam</p>
                <p className="text-3xl font-bold text-gold-400">₺{discountedTotal.toFixed(2)}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {needsQuote ? (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-900 font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {submitting ? '⏳ Gönderiliyor...' : '📋 Teklif Talep Et'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || totalQuantity === 0}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-900 font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {submitting ? '⏳ Gönderiliyor...' : '✅ Siparişi Onayla'}
                  </button>
                )}

                <Link
                  href="/kurumsal/dashboard"
                  className="block text-center px-4 py-2 border border-gold-600/30 text-gold-400 hover:bg-gold-600/10 font-semibold rounded-lg transition"
                >
                  ← Panele Dön
                </Link>
              </div>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gold-600/20 space-y-2">
                <p className="text-emerald-300 text-xs font-semibold">📞 Desteğe İhtiyacınız mı?</p>
                <p className="text-emerald-200 text-xs">
                  kurumsal@coskunyaycibaklava.com veya +90 212 XXX XXXX
                </p>
              </div>
            </div>
          </div>
        </form>
          </>
        )}

        {/* Guarantees */}
        {!loading && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/20 backdrop-blur-xl rounded-lg p-6 border border-emerald-600/30 text-center">
              <div className="text-3xl mb-3">✅</div>
              <h4 className="font-bold text-emerald-300 mb-2">Hızlı Onay</h4>
              <p className="text-emerald-200 text-sm">Siparişleriniz 1 saat içinde onaylanır</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/20 backdrop-blur-xl rounded-lg p-6 border border-emerald-600/30 text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h4 className="font-bold text-emerald-300 mb-2">Güvenli Teslimat</h4>
              <p className="text-emerald-200 text-sm">Tüm siparişlerde takip ve sigortacılık</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/20 backdrop-blur-xl rounded-lg p-6 border border-emerald-600/30 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-bold text-emerald-300 mb-2">Kalite Garantisi</h4>
              <p className="text-emerald-200 text-sm">Tatlılar özel ambalajda taze ulaşır</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
