'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
            <Link href="/checkout" className="text-teal-600 hover:text-teal-700 mb-6 inline-block">
              ← Sepete Dön
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Satış Şartları</h1>
            
            <div className="prose prose-lg text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Hükümler</h2>
                <p>
                  Bu satış şartları, Koşkunyayı Baklava sitesi üzerinden yapılan tüm alışverişler için geçerlidir. 
                  Siteyi ziyaret ederek veya herhangi bir ürün satın alarak, bu şartları kabul etmiş sayılırsınız.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Ürün Bilgileri ve Fiyatlandırma</h2>
                <p>
                  Sitemizde gösterilen ürün resimleri ve açıklamaları, mümkün olduğunca doğru olmaya çalışsa da, 
                  monitör ayarları ve diğer faktörler nedeniyle farklılık gösterebilir. Fiyatlar önceden haber 
                  verilmeksizin değiştirilebilir. En güncel fiyatlar sipariş sırasında gösterilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sipariş Verme ve Onaylama</h2>
                <p>
                  Sipariş vermek için sisteme kaydolmanız gerekmektedir. Tüm sipariş bilgileri doğru olmalıdır. 
                  Ödeme sonrası, sipariş bilgilerinizi içeren bir onay e-postası alacaksınız. Bu e-posta, 
                  siparişinizin başarıyla alındığını doğrular.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ödeme Yöntemleri</h2>
                <p>
                  Güvenli ödeme ağ geçitimiz aracılığıyla kredi kartı, banka kartı ve diğer elektronik ödeme 
                  yöntemleriyle ödeme yapabilirsiniz. Tüm ödeme işlemleri şifreli ve güvenlidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Kargo ve Teslimat</h2>
                <p>
                  Siparişler, sipariş onaylandıktan sonra en kısa sürede kargo şirketine teslim edilir. 
                  Tahmini teslimat süresi 3-5 iş günüdür. Teslimat adresi, kayıt sırasında belirtilen adres 
                  olacaktır. Adres değişikliği siparişten sonra mümkün olmayabilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. İptal ve İade</h2>
                <p>
                  Siparişinizi kargo şirketine teslim edilmeden önce iptal edebilirsiniz. 
                  Ürün, hasarlı, eksik veya yanlış gönderilmişse, 14 gün içinde iade talebinde bulunabilirsiniz. 
                  İade işlemleri, kargo maliyetleri müşteri tarafından karşılanmak üzere gerçekleştirilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Gizlilik ve Güvenlik</h2>
                <p>
                  Kişisel bilgileriniz, sadece siparişinizi işlemek için kullanılır. 
                  Herhangi bir şekilde üçüncü taraflara satılmaz veya paylaşılmaz. 
                  Detaylı bilgi için Gizlilik Politikamızı okuyunuz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sorumluluk Reddi</h2>
                <p>
                  Siteimiz, "olduğu gibi" sunulmaktadır. Ürün kalitesi hakkında garantiler tamamen ürün 
                  ile sınırlıdır. İnternet bağlantı sorunları veya sistem hataları nedeniyle oluşan zararlardan 
                  sorumlu değiliz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Yasal Yargı</h2>
                <p>
                  Bu şartlar, Türkiye Cumhuriyeti kanunlarına tabidir. Anlaşmazlıklar, 
                  İstanbul Mahkemeleri'nde çözülür.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. İletişim</h2>
                <p>
                  Herhangi bir soru veya şikayetiniz için bizimle iletişime geçebilirsiniz:
                  <br />
                  E-posta: info@koskunyayibaklava.com
                  <br />
                  Telefon: +90 (XXX) XXX XXXX
                </p>
              </section>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">Son güncelleme: Aralık 2025</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
