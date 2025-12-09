'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function KVKKPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
            <Link href="/checkout" className="text-teal-600 hover:text-teal-700 mb-6 inline-block">
              ← Sepete Dön
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-8">KVKK Aydınlatma Metni</h1>
            
            <div className="prose prose-lg text-gray-700 space-y-6">
              <div className="bg-teal-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-semibold text-gray-900">
                  Kişisel Verilerin Korunması Kanunu (KVKK) Kapsamında Aydınlatma Metni
                </p>
              </div>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Veri Sorumlusu Kimlik Bilgileri</h2>
                <p>
                  <span className="font-semibold">İşletme Adı:</span> Koşkunyayı Baklava<br />
                  <span className="font-semibold">E-Posta:</span> info@koskunyayibaklava.com<br />
                  <span className="font-semibold">Telefon:</span> +90 (XXX) XXX XXXX<br />
                  <span className="font-semibold">Web Sitesi:</span> www.koskunyayibaklava.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Toplanan Kişisel Veriler</h2>
                <p>Aşağıdaki kişisel verileriniz web sitesi ve siparişiniz sırasında toplanmaktadır:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Ad ve Soyadı</li>
                  <li>E-Posta Adresi</li>
                  <li>Telefon Numarası</li>
                  <li>Teslimat Adresi (Şehir, İlçe, Sokak, Posta Kodu)</li>
                  <li>Ödeme Bilgileri (Son 4 rakam ve kart türü)</li>
                  <li>IP Adresi ve Gezinme Bilgileri</li>
                  <li>Sipariş Tarihi ve İçeriği</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Verilerin İşleme Amacı</h2>
                <p>Kişisel verileriniz, aşağıdaki amaçlarla işlenmektedir:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Siparişinizi almak ve işlemek</li>
                  <li>Ürünleri teslimat etmek</li>
                  <li>Ödeme işlemlerini gerçekleştirmek</li>
                  <li>Müşteri hizmetleri sağlamak</li>
                  <li>Yasal yükümlülükleri yerine getirmek</li>
                  <li>İstatistiksel analiz ve pazarlama (Rıza ile)</li>
                  <li>Dolandırıcılık tespiti ve sistem güvenliği</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Verilerin Yasal Dayanağı</h2>
                <p>
                  Kişisel verileriniz aşağıdaki yasal dayanaklara göre işlenmektedir:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>KVKK 5. Madde - Sözleşmenin yerine getirilmesi</li>
                  <li>KVKK 5. Madde - Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>KVKK 5. Madde - İşletme'nin meşru menfaatleri</li>
                  <li>KVKK 6. Madde - Sizin tarafından verilen rıza</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Verilerin Paylaşılması</h2>
                <p>
                  Kişisel verileriniz, aşağıdaki durumlarda paylaşılabilir:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Kargo şirketleri (teslimat için)</li>
                  <li>Ödeme sağlayıcıları (ödeme işlemi için)</li>
                  <li>Yasal merciler (yasal zorunluluk olması durumunda)</li>
                </ul>
                <p className="mt-4">
                  Verileriniz, kendi rızanız olmadan ticari amaçlar için satılmayacak veya paylaşılmayacaktır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Verilerin Saklanması Süresi</h2>
                <p>
                  Kişisel verileriniz, aşağıdaki durumlara göre saklanmaktadır:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Sözleşmenin yerine getirilmesi ve sonrasında en az 2 yıl</li>
                  <li>Yasal yükümlülükler (Vergi Kanunu vb.) gereği: 5 yıl</li>
                  <li>Müşteri hizmetleri için: 1 yıl</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. KVKK Hakları</h2>
                <p>KVKK Kanunu Ek 4. Madde uyarınca, aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li>Verilerinizin içeriğini öğrenme</li>
                  <li>Verilerin işlenme amacını öğrenme</li>
                  <li>Yanlış veya eksik verileri düzeltme</li>
                  <li>Verilerin silinmesini isteme</li>
                  <li>İşlemeyi durdurma</li>
                  <li>Otomatik karar verme işlemlerine karşı çıkma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Hakları Kullanma Yöntemi</h2>
                <p>
                  KVKK haklarınızı kullanmak için, lütfen aşağıdaki iletişim bilgileri aracılığıyla bizimle iletişime geçiniz:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p>
                    <span className="font-semibold">E-Posta:</span> info@koskunyayibaklava.com<br />
                    <span className="font-semibold">Telefon:</span> +90 (XXX) XXX XXXX<br />
                    <span className="font-semibold">Yazılı Talepte Bulunulacak Adres:</span><br />
                    Koşkunyayı Baklava<br />
                    [Tam Adres Bilgisi]
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Çerezler (Cookies)</h2>
                <p>
                  Web sitelerimiz, kullanıcı deneyimini geliştirmek için çerezleri kullanır. 
                  Çerezler, bilgisayarınızda küçük veri dosyalarıdır. Web sitesini ziyaret ederek, 
                  çerezleri kabul etmiş sayılırsınız. Çerezleri tarayıcı ayarlarından devre dışı bırakabilirsiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Gizlilik Politikası Değişiklikleri</h2>
                <p>
                  Bu aydınlatma metni, zaman zaman güncellenebilir. Değişiklikler, web sitesimizde 
                  yayınlandığı tarihte yürürlüğe girer. Siteyi ziyaret ederek, güncel 
                  aydınlatma metnini kabul etmiş sayılırsınız.
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
