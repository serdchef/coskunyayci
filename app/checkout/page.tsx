'use client';

import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StripePayment from '@/components/StripePayment';
import { 
  COUNTRIES, 
  getCitiesByCountry, 
  getDistrictsByCity 
} from '@/lib/cities';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'shipping' | 'pickup'>('shipping');
  const [selectedCountry, setSelectedCountry] = useState('Türkiye');
  const [selectedCity, setSelectedCity] = useState('Istanbul');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressTitle: 'Ev',
    address: '',
    city: 'Istanbul',
    district: '',
    neighborhood: '',
    postalCode: '',
    doorNumber: '',
    buildingNumber: '',
    invoiceType: 'PERSONAL' as 'PERSONAL' | 'CORPORATE',
    taxNumber: '',
    companyName: '',
    acceptTerms: false,
    acceptPrivacy: false,
    deliveryType: 'COURIER' as 'COURIER' | 'PICKUP',
    notes: '',
  });

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/20">
            <p className="text-gray-600 mb-6">Sepetinizde ürün bulunmamaktadır.</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Ürünleri Gör
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isAddressValid = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      (activeTab === 'pickup' || formData.address) &&
      formData.acceptTerms &&
      formData.acceptPrivacy
    );
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        items: items.map(item => ({
          name: item.name,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        address: {
          street: formData.address,
          city: formData.city,
          district: formData.district,
          zipCode: formData.postalCode,
        },
        totalPrice: finalTotal,
        deliveryType: formData.deliveryType,
        invoice: {
          type: formData.invoiceType,
          taxNumber: formData.taxNumber,
          companyName: formData.companyName,
        },
        notes: formData.notes,
      };

      console.log('📦 Creating order:', orderPayload);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sipariş oluşturulamadı');
      }

      const result = await response.json();
      const orderId = result.orderId;
      
      clearCart();
      alert('✅ Sipariş başarıyla oluşturuldu!');
      router.push(`/checkout/success/${orderId}`);
    } catch (error) {
      console.error('Order creation error:', error);
      alert(error instanceof Error ? error.message : 'Sipariş oluşturulurken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = formData.deliveryType === 'COURIER' ? 50 : 0;
  const finalTotal = total + shippingCost;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-teal-900 mb-8">🛒 Ödeme</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={currentStep === 'address' ? (e) => { e.preventDefault(); if (isAddressValid()) setCurrentStep('payment'); } : handlePayment} className="space-y-6">
                {currentStep === 'address' && (
                  <>
                    <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Teslimat Bilgileri</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Ad Soyad *</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Telefon *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                          </div>
                        </div>

                        {activeTab === 'shipping' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Adres *</label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">Fatura Tipi *</label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="invoiceType"
                                value="PERSONAL"
                                checked={formData.invoiceType === 'PERSONAL'}
                                onChange={handleChange}
                                className="mr-2"
                              />
                              <span>Bireysel</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="invoiceType"
                                value="CORPORATE"
                                checked={formData.invoiceType === 'CORPORATE'}
                                onChange={handleChange}
                                className="mr-2"
                              />
                              <span>Kurumsal</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Vergi Numarası *</label>
                          <input
                            type="text"
                            name="taxNumber"
                            value={formData.taxNumber}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleChange}
                          required
                          className="mt-1 mr-3 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                          <Link href="/terms" target="_blank" className="text-teal-600 hover:underline">Satış Şartlarını</Link> okudum ve kabul ediyorum *
                        </span>
                      </label>
                    </div>

                    <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="acceptPrivacy"
                          checked={formData.acceptPrivacy}
                          onChange={handleChange}
                          required
                          className="mt-1 mr-3 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                          <Link href="/privacy" target="_blank" className="text-teal-600 hover:underline">Gizlilik Politikasını</Link> okudum ve kabul ediyorum *
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!isAddressValid()}
                      className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                    >
                      ➡️ Ödeme Adımına Devam Et
                    </button>
                  </>
                )}

                {currentStep === 'payment' && (
                  <>
                    <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">💳 Güvenli Ödeme</h2>
                      
                      <StripePayment
                        orderId={`ORDER-${Date.now()}`}
                        amount={finalTotal}
                        customerEmail={formData.email}
                        customerName={formData.fullName}
                        onSuccess={() => {
                          clearCart();
                          alert('✅ Ödeme başarılı!');
                          router.push('/checkout/success/stripe');
                        }}
                        onError={(error) => {
                          console.error('Payment error:', error);
                          alert(`❌ Ödeme hatası: ${error}`);
                        }}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        🔒 <strong>Güvenli Ödeme:</strong> Stripe aracılığıyla gerçekleştirilir.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep('address')}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      ← Adrese Geri Dön
                    </button>
                  </>
                )}
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-semibold">₺{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pb-6 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span>₺{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo:</span>
                    <span>₺{shippingCost}</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold text-teal-900">
                  <span>Toplam:</span>
                  <span>₺{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
