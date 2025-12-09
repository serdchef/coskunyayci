'use client';

import { useCart } from '@/lib/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { 
  COUNTRIES, 
  getCitiesByCountry, 
  getDistrictsByCity 
} from '@/lib/cities';

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'shipping' | 'pickup'>('shipping');
  const [selectedCountry, setSelectedCountry] = useState('Türkiye');
  const [selectedCity, setSelectedCity] = useState('Istanbul');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
  
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: session?.user?.phone || '',
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

  const [cardData, setCardData] = useState({
    cardName: session?.user?.name || '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (status === 'loading') {
    return <div>Yükleniyor...</div>;
  }

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

  const handleCardChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/\s/g, '');
    
    if (e.target.name === 'cardNumber') {
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    } else if (e.target.name === 'expiry') {
      value = value.replace(/(\d{2})(?=\d)/g, '$1/');
      value = value.substring(0, 5);
    } else if (e.target.name === 'cvc') {
      value = value.substring(0, 3);
    }

    setCardData({
      ...cardData,
      [e.target.name]: value,
    });
  };

  const isAddressValid = () => {
    return (
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.address &&
      (formData.deliveryType === 'PICKUP' || (formData.postalCode && /^\d{5}$/.test(formData.postalCode))) &&
      formData.taxNumber &&
      (formData.invoiceType === 'PERSONAL' || formData.companyName) &&
      formData.acceptTerms &&
      formData.acceptPrivacy
    );
  };

  const isCardValid = () => {
    return (
      cardData.cardName &&
      cardData.cardNumber.replace(/\s/g, '').length === 16 &&
      cardData.expiry.length === 5 &&
      cardData.cvc.length === 3
    );
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order with Stripe payment intent
      const orderRes = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          address: {
            fullAddress: formData.address,
            city: formData.city,
            district: formData.district,
            neighborhood: formData.neighborhood,
            postalCode: formData.postalCode,
            buildingNumber: formData.buildingNumber,
            doorNumber: formData.doorNumber,
          },
          invoice: {
            type: formData.invoiceType,
            taxNumber: formData.taxNumber,
            companyName: formData.companyName,
          },
          delivery: {
            type: formData.deliveryType,
            notes: formData.notes,
          },
          totalPrice: finalTotal,
          cardName: cardData.cardName,
          cardLastFour: cardData.cardNumber.slice(-4),
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Ödeme başlatılamadı');
      }

      // Process payment with Stripe
      const paymentRes = await fetch('/api/checkout/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          amount: finalTotal,
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          expiry: cardData.expiry,
          cvc: cardData.cvc,
          cardName: cardData.cardName,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.error || 'Ödeme başarısız');
      }

      toast.success('✅ Ödeme başarıyla tamamlandı!');
      router.push(`/checkout/success/${orderData.orderId}`);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Ödeme sırasında hata oluştu');
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

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex-1">
              <div className={`flex items-center gap-3 pb-4 ${currentStep === 'address' ? 'border-b-2 border-teal-600' : 'border-b-2 border-gray-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep === 'address' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  1
                </div>
                <span className={`font-semibold ${currentStep === 'address' ? 'text-teal-600' : 'text-gray-500'}`}>Adres</span>
              </div>
            </div>
            <div className="flex-1">
              <div className={`flex items-center gap-3 pb-4 ${currentStep === 'payment' ? 'border-b-2 border-teal-600' : 'border-b-2 border-gray-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep === 'payment' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className={`font-semibold ${currentStep === 'payment' ? 'text-teal-600' : 'text-gray-500'}`}>Ödeme</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={currentStep === 'address' ? (e) => { e.preventDefault(); if (isAddressValid()) setCurrentStep('payment'); } : handlePayment} className="space-y-6">
                {/* STEP 1: ADDRESS */}
                {currentStep === 'address' && (
                  <>
                {/* Teslimat Yöntemi Tabs */}
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-white/20">
                  <div className="grid grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('shipping');
                        setFormData({ ...formData, deliveryType: 'COURIER' });
                      }}
                      className={`py-4 px-6 font-semibold border-b-2 transition ${
                        activeTab === 'shipping'
                          ? 'border-teal-600 text-teal-600 bg-teal-50'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      📦 Adresime Gönder
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('pickup');
                        setFormData({ ...formData, deliveryType: 'PICKUP' });
                      }}
                      className={`py-4 px-6 font-semibold border-b-2 transition ${
                        activeTab === 'pickup'
                          ? 'border-teal-600 text-teal-600 bg-teal-50'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      🏪 Mağazadan Teslim Al
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Personal Info */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Ad Soyad *
                      </label>
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
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email *
                        </label>
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
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Telefon Numarası *
                        </label>
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

                    {/* Shipping Address */}
                    {activeTab === 'shipping' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Adres Başlığı *
                          </label>
                          <select
                            name="addressTitle"
                            value={formData.addressTitle}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                          >
                            <option value="Ev">🏠 Ev</option>
                            <option value="İş">💼 İş</option>
                            <option value="Diğer">📍 Diğer</option>
                          </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Ülke *
                            </label>
                            <select
                              value={selectedCountry}
                              onChange={(e) => {
                                setSelectedCountry(e.target.value);
                                const cities = getCitiesByCountry(e.target.value);
                                setSelectedCity(cities[0] || '');
                                setSelectedDistrict('');
                                setFormData({
                                  ...formData,
                                  city: cities[0] || '',
                                  district: '',
                                  neighborhood: '',
                                });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                              {COUNTRIES.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Şehir *
                            </label>
                            <select
                              value={selectedCity}
                              onChange={(e) => {
                                setSelectedCity(e.target.value);
                                const districts = getDistrictsByCity(e.target.value);
                                setSelectedDistrict(districts[0] || '');
                                setFormData({
                                  ...formData,
                                  city: e.target.value,
                                  district: districts[0] || '',
                                  neighborhood: '',
                                });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                              {getCitiesByCountry(selectedCountry).map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Türkiye için İlçe ve Mahalle Seçimi */}
                        {selectedCountry === 'Türkiye' && (
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                İlçe *
                              </label>
                              <select
                                value={selectedDistrict}
                                onChange={(e) => {
                                  setSelectedDistrict(e.target.value);
                                  setFormData({
                                    ...formData,
                                    district: e.target.value,
                                  });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              >
                                <option value="">İlçe Seçiniz...</option>
                                {getDistrictsByCity(selectedCity).map((district: string) => (
                                  <option key={district} value={district}>
                                    {district}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Mahalle/Semte *
                              </label>
                              <input
                                type="text"
                                name="neighborhood"
                                value={formData.neighborhood}
                                onChange={handleChange}
                                placeholder="Mahalle adı"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Türkiye Dışında Ülkeler için Direkt Adres */}
                        {selectedCountry !== 'Türkiye' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Adres (Sokak, Caddesi, vb.) *
                            </label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              rows={3}
                              placeholder="Detaylı adres yazınız (Sokak adı, kapı numarası, bölge vb.)"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                          </div>
                        )}

                        {/* Türkiye için Detaylı Adres */}
                        {selectedCountry === 'Türkiye' && (
                          <>
                            <div>
                              <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Adres (Sokak, Caddesi, vb.) *
                              </label>
                              <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows={2}
                                placeholder="Sokak adı, apartman numarası vb."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                              />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                  Posta Kodu *
                                </label>
                                <input
                                  type="text"
                                  name="postalCode"
                                  value={formData.postalCode}
                                  onChange={handleChange}
                                  required
                                  placeholder="5 haneli"
                                  maxLength={5}
                                  pattern="^\d{5}$"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                                {formData.postalCode && !/^\d{5}$/.test(formData.postalCode) && (
                                  <p className="text-red-500 text-sm mt-1">⚠️ Posta Kodu 5 haneli olmalı</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                  Bina Numarası
                                </label>
                                <input
                                  type="text"
                                  name="buildingNumber"
                                  value={formData.buildingNumber}
                                  onChange={handleChange}
                                  placeholder="Bina No"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                  İç Kapı Numarası (Daire/Kat)
                                </label>
                                <input
                                  type="text"
                                  name="doorNumber"
                                  value={formData.doorNumber}
                                  onChange={handleChange}
                                  placeholder="Daire/Kat No"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {activeTab === 'pickup' && (
                      <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <p className="text-teal-900 font-semibold mb-2">🏪 Mağazadan Teslim</p>
                        <p className="text-sm text-teal-800">
                          <strong>Adres:</strong> Coşkun Yayçı Baklava Mağazası<br />
                          <strong>Saatler:</strong> Pazartesi - Pazar, 10:00 - 21:00<br />
                          <strong>Ücretsiz Teslimat</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fatura Bilgileri */}
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Fatura Bilgileri</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Fatura Tipi *
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="invoiceType"
                            value="PERSONAL"
                            checked={formData.invoiceType === 'PERSONAL'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span className="text-gray-700">Bireysel</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="invoiceType"
                            value="CORPORATE"
                            checked={formData.invoiceType === 'CORPORATE'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <span className="text-gray-700">Kurumsal</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {formData.invoiceType === 'PERSONAL' ? 'TC Kimlik No' : 'Vergi Numarası'} *
                      </label>
                      <input
                        type="text"
                        name="taxNumber"
                        value={formData.taxNumber}
                        onChange={handleChange}
                        required
                        placeholder={formData.invoiceType === 'PERSONAL' ? '11 haneli' : '10 haneli'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    {formData.invoiceType === 'CORPORATE' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Şirket Adı *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Onaylar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                  <div className="space-y-3">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        required
                        className="mt-1 mr-3 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">
                        <Link href="/terms" target="_blank" className="text-teal-600 hover:underline font-semibold">
                          Satış Şartlarını
                        </Link>
                        {' '}ve{' '}
                        <Link href="/distance-sales" target="_blank" className="text-teal-600 hover:underline font-semibold">
                          Mesafeli Satış Sözleşmesini
                        </Link>
                        {' '}okudum ve kabul ediyorum *
                      </span>
                    </label>
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleChange}
                        required
                        className="mt-1 mr-3 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">
                        <Link href="/kvkk" target="_blank" className="text-teal-600 hover:underline font-semibold">
                          KVKK Aydınlatma Metni
                        </Link>
                        {' '}ve{' '}
                        <Link href="/privacy" target="_blank" className="text-teal-600 hover:underline font-semibold">
                          Gizlilik Politikasını
                        </Link>
                        {' '}okudum ve kabul ediyorum *
                      </span>
                    </label>
                  </div>
                </div>

                {/* Notlar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Özel Talepler</h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Teslimat sırasında göz önüne alınması gereken özel talebiniz varsa yazın..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Submit Button - Address Step */}
                <button
                  type="submit"
                  disabled={!isAddressValid()}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ➡️ Ödeme Bilgilerine Devam Et
                </button>
                  </>
                )}

                {/* STEP 2: PAYMENT */}
                {currentStep === 'payment' && (
                  <>
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">💳 Kart Bilgileri</h2>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('address')}
                      className="text-sm text-teal-600 hover:underline"
                    >
                      ← Geri Dön
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Kart Üzerindeki Ad */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Kart Üzerindeki Ad *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                        placeholder="ADLI SOYADI"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none uppercase"
                      />
                    </div>

                    {/* Kart Numarası */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Kart Numarası *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono text-lg"
                      />
                      {cardData.cardNumber && cardData.cardNumber.replace(/\s/g, '').length !== 16 && (
                        <p className="text-red-500 text-sm mt-1">⚠️ 16 haneli olmalı</p>
                      )}
                    </div>

                    {/* Tarih ve CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Geçerlilik Tarihi *
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          placeholder="AA/YY"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                        {cardData.expiry && cardData.expiry.length !== 5 && (
                          <p className="text-red-500 text-sm mt-1">⚠️ AA/YY formatında</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          CVC *
                        </label>
                        <input
                          type="text"
                          name="cvc"
                          value={cardData.cvc}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength={3}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                        {cardData.cvc && cardData.cvc.length !== 3 && (
                          <p className="text-red-500 text-sm mt-1">⚠️ 3 haneli olmalı</p>
                        )}
                      </div>
                    </div>

                    {/* Uyarı Mesajı */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        🔒 <strong>Güvenli Ödeme:</strong> Tüm kart bilgileriniz şifrelenerek iletilir. Hiçbir şekilde kaydedilmez.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sipariş Özeti - Payment Step */}
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-700">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-semibold">₺{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>Ara Toplam:</span>
                      <span>₺{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Kargo:</span>
                      <span>₺{shippingCost}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-teal-900 pt-2">
                    <span>TOPLAM:</span>
                    <span>₺{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button - Payment Step */}
                <button
                  type="submit"
                  disabled={loading || !isCardValid()}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? '⏳ İşleniyor...' : `✅ ₺${finalTotal.toFixed(2)} Öde`}
                </button>
                  </>
                )}
              </form>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/20 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-700">
                      <span>
                        {item.name} ({item.quantity}x)
                      </span>
                      <span className="font-semibold">₺{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Ara Toplam:</span>
                    <span className="font-semibold">₺{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Kargo:</span>
                    <span className="font-semibold">₺{shippingCost}</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold text-teal-900">
                  <span>Toplam:</span>
                  <span>₺{finalTotal.toFixed(2)}</span>
                </div>

                {currentStep === 'address' && (
                  <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <p className="text-xs text-teal-800 text-center">
                      ✅ Tüm bilgilerinizi doldurduktan sonra ödeme adımına geçebilirsiniz
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
