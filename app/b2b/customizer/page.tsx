'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CustomDesign {
  productName: string;
  quantity: number;
  packaging: 'premium' | 'standard' | 'corporate';
  customLogo: boolean;
  customText: string;
  colorScheme: 'gold' | 'silver' | 'copper' | 'custom';
  deliveryDate: string;
}

export default function CustomizerPage() {
  const [design, setDesign] = useState<CustomDesign>({
    productName: 'Antep Fıstıklı Baklava',
    quantity: 100,
    packaging: 'premium',
    customLogo: true,
    customText: 'Şirket Adı',
    colorScheme: 'gold',
    deliveryDate: '2025-12-25',
  });

  const [estimatedPrice, setEstimatedPrice] = useState(2500);

  const calculatePrice = (qty: number) => {
    // Kademeli fiyatlandırma
    let basePrice = 25;
    if (qty >= 500) basePrice = 20;
    if (qty >= 1000) basePrice = 18;
    if (qty >= 5000) basePrice = 15;
    
    let total = qty * basePrice;
    if (design.customLogo) total += 500;
    if (design.customText) total += 200;
    if (design.packaging === 'premium') total += qty * 2;
    if (design.packaging === 'corporate') total += qty * 3;
    
    setEstimatedPrice(total);
  };

  const handleQuantityChange = (newQty: number) => {
    setDesign({ ...design, quantity: newQty });
    calculatePrice(newQty);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-12">Özel Baklava Tasarımcısı</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Design Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Selection */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">1. Ürün Seç</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Antep Fıstıklı', 'Sarıyer', 'Çikolatalı', 'Kaymaklı', 'Cevizli', 'Dut Pekmezi'].map((prod) => (
                    <button
                      key={prod}
                      onClick={() => setDesign({ ...design, productName: prod })}
                      className={`p-4 rounded-lg border-2 transition font-medium text-center ${
                        design.productName === prod
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-blue-100 hover:border-white/40'
                      }`}
                    >
                      {prod} Baklava
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">2. Miktar Belirle</h2>
                <div>
                  <label className="block text-blue-100 mb-2 font-semibold">
                    Adet: <span className="text-2xl text-white">{design.quantity}</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="100"
                    value={design.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-blue-200 mt-2">
                    <span>100</span>
                    <span>50.000</span>
                  </div>
                </div>
              </div>

              {/* Packaging */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">3. Paketleme Türü</h2>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Standart Kutı', price: '0₺' },
                    { id: 'premium', label: 'Premium Kutı (Özel Tasarım)', price: '+2₺/adet' },
                    { id: 'corporate', label: 'Kurumsal Lüks Kutı', price: '+3₺/adet' },
                  ].map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        setDesign({ ...design, packaging: pkg.id as any });
                        calculatePrice(design.quantity);
                      }}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        design.packaging === pkg.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">{pkg.label}</span>
                        <span className="text-blue-200">{pkg.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">4. Özelleştirme</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={design.customLogo}
                      onChange={(e) => {
                        setDesign({ ...design, customLogo: e.target.checked });
                        calculatePrice(design.quantity);
                      }}
                      className="w-5 h-5"
                    />
                    <span className="text-white font-semibold">Logo Baskısı <span className="text-blue-200 text-sm">(+500₺)</span></span>
                  </label>
                  <label className="block">
                    <span className="text-white font-semibold mb-2 block">Özel Yazı</span>
                    <input
                      type="text"
                      value={design.customText}
                      onChange={(e) => {
                        setDesign({ ...design, customText: e.target.value });
                        calculatePrice(design.quantity);
                      }}
                      className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-500"
                      placeholder="Şirket adı, slogan, vb."
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Price Sidebar */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 sticky top-24 h-fit">
              <h2 className="text-2xl font-bold text-white mb-6">Tahmini Fiyat</h2>
              
              <div className="bg-black/30 rounded-lg p-6 mb-6">
                <p className="text-blue-100 text-sm mb-2">Toplam Fiyat</p>
                <p className="text-4xl font-bold text-white mb-2">
                  ₺{estimatedPrice.toLocaleString('tr-TR')}
                </p>
                <p className="text-blue-200 text-sm">
                  {design.quantity} adet × ₺{(estimatedPrice / design.quantity).toFixed(2)}/adet
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Ürün:</span>
                  <span className="text-white font-semibold">{design.productName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Adet:</span>
                  <span className="text-white font-semibold">{design.quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Paketleme:</span>
                  <span className="text-white font-semibold">{
                    design.packaging === 'standard' ? 'Standart' :
                    design.packaging === 'premium' ? 'Premium' : 'Kurumsal'
                  }</span>
                </div>
              </div>

              <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg hover:bg-blue-50 transition mb-3">
                Teklife Geç
              </button>
              <button className="w-full border-2 border-white text-white font-bold py-3 rounded-lg hover:bg-white/10 transition">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
