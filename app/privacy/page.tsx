'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cream to-gold-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
            <Link href="/checkout" className="text-teal-600 hover:text-teal-700 mb-6 inline-block">
              ← Sepete Dön
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Gizlilik Politikası</h1>
            
            <div className="prose prose-lg text-gray-700 space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
                <p>
                  Koşkunyayı Baklava olarak, müşterilerimizin gizliliğini ve kişisel verilerinin korunmasını 
                  çok ciddi almaktayız. Bu Gizlilik Politikası, web sitesi (www.koskunyayibaklava.com) ve 
                  mobil uygulamasını kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını 
                  ve korunduğunu açıklar.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Topladığımız Bilgiler</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">a) Sizin Tarafından Sağlanan Bilgiler:</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Üyelik formu (ad, e-posta, şifre)</li>
                      <li>Sipariş formu (adres, telefon)</li>
                      <li>İletişim formları (isim, e-posta, mesaj)</li>
                      <li>Ödeme bilgileri (kredi kartı son 4 rakamı)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">b) Otomatik Olarak Toplanan Bilgiler:</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>IP Adresi ve cihaz bilgileri</li>
                      <li>Tarayıcı türü ve işletim sistemi</li>
                      <li>Ziyaret ettiğiniz sayfalar</li>
                      <li>Tıkladığınız linkler</li>
                      <li>Harcanan süre</li>
                      <li>Çerezler ve tarama geçmişi</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bilgilerin Kullanım Amaçları</h2>
                <p>Kişisel verilerinizi aşağıdaki amaçlarla kullanmaktayız:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Siparişlerinizi işlemek ve teslimat sağlamak</li>
                  <li>Müşteri desteği ve hizmetlerini sunmak</li>
                  <li>Yasal ve düzenleyici yükümlülükleri yerine getirmek</li>
                  <li>Ürün ve hizmetlerimizi geliştirmek</li>
                  <li>Dolandırıcılık tespiti ve sistem güvenliği</li>
                  <li>Pazarlama ve promosyon (rıza ile)</li>
                  <li>İstatistiksel analiz ve raporlama</li>
                  <li>İletişim kurma (güncellemeler, faturalar)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bilgilerin Paylaşılması</h2>
                <p>
                  Kişisel verileriniz aşağıdaki taraflarla paylaşılabilir:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li><span className="font-semibold">Kargo Şirketleri:</span> Teslimat için adres bilgisi</li>
                  <li><span className="font-semibold">Ödeme Sağlayıcıları:</span> Ödeme işlemi için gerekli bilgi</li>
                  <li><span className="font-semibold">Yasal Merciler:</span> Yasal zorunluluk halinde</li>
                  <li><span className="font-semibold">Hizmet Sağlayıcılar:</span> Hosting, e-posta, analitik</li>
                </ul>
                <p className="mt-4">
                  <span className="font-semibold">Satış Yasağı:</span> Kişisel verileriniz, 
                  rıza olmaksızın ticari amaçlarla üçüncü taraflara satılmaz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Güvenlik Önlemleri</h2>
                <p>
                  Kişisel verilerinizin güvenliğini sağlamak için:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>SSL/TLS şifrelemesi kullanıyoruz</li>
                  <li>Firewalls ve antivirus sistemleri aktiftir</li>
                  <li>Verilere erişim, sadece yetkili kişilere sınırlıdır</li>
                  <li>Düzenli güvenlik denetimleri yapılır</li>
                  <li>Kredi kartı bilgileri, PCI DSS standartlarına göre korunur</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Çerezler (Cookies)</h2>
                <p>
                  Web sitelerimiz, aşağıdaki çerezleri kullanır:
                </p>
                <div className="space-y-3 mt-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Gerekli Çerezler:</h3>
                    <p className="ml-4">Site işlevselliği için gerekli (oturum, güvenlik)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analitik Çerezler:</h3>
                    <p className="ml-4">Ziyaretçi davranışını anlamak için (Google Analytics)</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pazarlama Çerezleri:</h3>
                    <p className="ml-4">Tercihlerinize göre reklamlar göstermek için</p>
                  </div>
                </div>
                <p className="mt-4">
                  Çerezleri tarayıcı ayarlarından kontrol edebilirsiniz. 
                  Ancak, gerekli çerezleri devre dışı bırakmak, bazı sitelerimiz özelliklerini etkileyebilir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sizin Hakları</h2>
                <p>KVKK Kanunu uyarınca, aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>Verileriniz hakkında bilgi talep etme</li>
                  <li>Yanlış veya eksik verileri düzeltme</li>
                  <li>Verilerin silinmesini isteme</li>
                  <li>Verilerin işlenmesini sınırlama</li>
                  <li>Verilerin taşınabilirliğini isteme</li>
                  <li>Otomatik karar verme işlemlerine karşı çıkma</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Haklarınızı Kullanma</h2>
                <p>
                  Haklarınızı kullanmak veya sorularınız için, lütfen bizimle iletişime geçiniz:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p>
                    <span className="font-semibold">E-Posta:</span> info@koskunyayibaklava.com<br />
                    <span className="font-semibold">Telefon:</span> +90 (XXX) XXX XXXX<br />
                    <span className="font-semibold">Web Sitesi:</span> www.koskunyayibaklava.com
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Üçüncü Taraf Bağlantıları</h2>
                <p>
                  Web sitelerimiz, üçüncü taraf web sitelerine bağlantılar içerebilir. 
                  Bu siteler, kendi gizlilik politikalarına tabidir. 
                  Bağlantılı web siteler, bizim sorumluluğumuzda değildir.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Politika Değişiklikleri</h2>
                <p>
                  Bu Gizlilik Politikası, zaman zaman güncellenebilir. 
                  Önemli değişiklikler, web sitesimizde veya e-posta yoluyla duyurulur. 
                  Devam eden kullanım, yeni şartları kabul etmiş sayılır.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Birleşme ve Satın Alma</h2>
                <p>
                  Birleşme, satın alma veya varlık satışı durumunda, 
                  kişisel verileriniz, devralan kuruluşa aktarılabilir. 
                  Öncesinde bilgilendirileceksiniz.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. İletişim</h2>
                <p>
                  Bu Gizlilik Politikası hakkında sorularınız varsa, lütfen bize yazın:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p>
                    Koşkunyayı Baklava<br />
                    E-Posta: info@koskunyayibaklava.com<br />
                    Telefon: +90 (XXX) XXX XXXX<br />
                    www.koskunyayibaklava.com
                  </p>
                </div>
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
