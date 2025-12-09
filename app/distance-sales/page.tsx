'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DistanceSalesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
            <Link href="/checkout" className="text-teal-600 hover:text-teal-700 mb-6 inline-block">
              ← Sepete Dön
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Mesafeli Satış Sözleşmesi</h1>
            
            <div className="prose prose-lg text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">MEDİA PLAN TANIŞMALI ÜRÜN VE HİZMET SATIŞINA İLİŞKİN MESAFELI SÖZLEŞME</h2>
                
                <div className="bg-teal-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Bu sözleşme, Koşkunyayı Baklava'nın (Satıcı) müşterileri (Alıcı) ile internet üzerinden 
                    yaptığı mesafeli satış işlemlerinde uygulanır.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Taraflara İlişkin Bilgiler</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Satıcı (İşletmeci) Bilgileri:</h3>
                    <p>
                      İşletme Adı: Koşkunyayı Baklava<br />
                      İnternet Adresi: www.koskunyayibaklava.com<br />
                      E-Posta: info@koskunyayibaklava.com<br />
                      Telefon: +90 (XXX) XXX XXXX
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Alıcı (Tüketici) Bilgileri:</h3>
                    <p>Alıcı, siparişi veren kişi olup, bilgileri sipariş formu aracılığıyla sağlanır.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Sözleşmeyi Oluşturan Unsurlar</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Web sitesindeki ürün ve hizmet duyuruları</li>
                  <li>Alıcının siparişi</li>
                  <li>Satıcının siparişi onayı</li>
                  <li>Bu Mesafeli Satış Sözleşmesi</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Ürün/Hizmetlere İlişkin Bilgiler</h2>
                <p>
                  Sitemizde yer alan ürünlerin özellikleri, fotoğrafları ve fiyatları mümkün olduğunca doğru 
                  gösterilmeye çalışılmıştır. Ürün kullanım kılavuzu ve teknik özellikleri, sipariş sayfasında 
                  belirtilmektedir. Renkler, monitör ayarlarına bağlı olarak farklılık gösterebilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sipariş ve Teslim</h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">Sipariş Süreci:</span> Alıcı, siteimizde ürün seçerek, 
                    kişisel bilgileri girerek ve ödeme yaparak sipariş verir.
                  </p>
                  <p>
                    <span className="font-semibold">Siparişin Onayı:</span> Satıcı, siparişi alındıktan sonra 
                    en kısa sürede e-posta ile onayını gönderir.
                  </p>
                  <p>
                    <span className="font-semibold">Teslim Süresi:</span> Ürün, siparişin onaylandığı tarihten 
                    itibaren 3-5 iş günü içinde kargo şirketine teslim edilir. Tatil ve özel günlerde bu süre 
                    uzayabilir.
                  </p>
                  <p>
                    <span className="font-semibold">Teslimat Adresi:</span> Teslimat adresi, sipariş formunda 
                    belirtilen addres olur. Teslimat sonrası adres değişiklikleri mümkün olmayacaktır.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Ödeme Koşulları</h2>
                <p>
                  Ödeme, siparişin sonunda güvenli ödeme ağ geçidi aracılığıyla yapılır. 
                  Kredi kartı, banka kartı ve diğer elektronik ödeme yöntemleri kabul edilir. 
                  Ödeme, siparişin tamamlanması için gereklidir. Sipariş ödenmeden teslim edilmez.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cayma Hakkı (14 Günlük İade Hakkı)</h2>
                <div className="space-y-3">
                  <p>
                    Alıcı, ürünü aldıktan sonra 14 gün içinde herhangi bir gerekçe göstermeksizin 
                    bu satıştan cayma hakkına sahiptir.
                  </p>
                  <p>
                    <span className="font-semibold">Cayma Şartları:</span>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Ürün, kullanılmamış ve orijinal ambalajında olmalıdır</li>
                    <li>İade talebi, ürün alındıktan sonra 14 gün içinde yapılmalıdır</li>
                    <li>İade için müşteri hizmetleri ile iletişime geçilmeli</li>
                    <li>Kargo maliyeti müşteri tarafından karşılanır</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Hatalı, Hasarlı veya Eksik Ürün</h2>
                <p>
                  Eğer ürün hasarlı, eksik veya yanlış gönderilmişse, alıcı ürünü aldıktan sonra 
                  3 gün içinde müşteri hizmetleri ile iletişime geçmeli. Satıcı, bu durumda 
                  ücretsiz olarak değişim veya iade işlemi yapacaktır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Kişisel Veriler</h2>
                <p>
                  Alıcının kişisel verileri sadece siparişi işlemek ve teslimatını sağlamak için kullanılır. 
                  KVKK kapsamında korunur ve herhangi bir şekilde üçüncü taraflara satılmaz veya paylaşılmaz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Sorumluluklar</h2>
                <p>
                  Satıcı, ürünlerin tam ve zamanında teslimatından sorumludur. Ancak, kargo şirketinin 
                  neden olduğu gecikmeler ve hasarlardan sorumlu değildir. Alıcı, ürünü aldıktan sonra 
                  durumunu kontrol etmeli ve sorunlar varsa derhal bildirilmelidir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Yasal Hükümler</h2>
                <p>
                  Bu sözleşme, Türkiye Cumhuriyeti kanunlarına tabidir. 
                  Anlaşmazlıklar, tüketici mahkemeleri ve hukuk mahkemeleri tarafından çözülür.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. İletişim Bilgileri</h2>
                <p>
                  Herhangi bir soru, şikayeti veya cayma hakkını kullanmak için:<br />
                  <span className="font-semibold">E-Posta:</span> info@koskunyayibaklava.com<br />
                  <span className="font-semibold">Telefon:</span> +90 (XXX) XXX XXXX<br />
                  <span className="font-semibold">Web Sitesi:</span> www.koskunyayibaklava.com
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
