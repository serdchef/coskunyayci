'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock blog posts data
const BLOG_POSTS: { [key: string]: any } = {
  'baklava-tarihi': {
    title: 'Baklavanın 500 Yıllık Tarihi',
    author: 'Coşkun Yaycı',
    date: '2025-12-01',
    readTime: '8 min',
    category: 'Tarih',
    image: '📜',
    excerpt: 'Osmanlı İmparatorluğu\'ndan günümüze baklavaların yolculuğu.',
    content: `
# Baklavanın 500 Yıllık Tarihi

Baklava, Ortadoğu ve Balkanların en ikonik tatlısıdır ve kendi hikayesi, coğrafyanın ve zamanın etkisini yansıtan en ilginç gastronomik öykülerden biridir.

## Osmanlı Döneminde Baklava

16. yüzyılda Osmanlı saray mutfağında baklava yapımı, saltanat törenlerinin ve önemli festivallerin vazgeçilmez bir parçası haline gelmiştir. Topkapı Sarayı arşivlerinde bulunan belgeler, baklavaların ne kadar dikkat edilip yapıldığını göstermektedir.

### Saray Reçetesi
Osmanlı döneminde baklava yapımı, çok katmanlı bir işlev ve görev sistemi tarafından yönetiliyordu:
- Yufka uzmanları
- Fıstık ve ceviz usta seçicileri
- Şerbet hazırlaycıları

## 19. Yüzyıla Geçiş

Osmanlı İmparatorluğu zayıfladıkça, baklava yapımının teknikleri giderek daha da gelişti. Gaziantep, Antep Fıstığı ile eşanlamlı hale geldi.

## Modern Çağda Baklava

20. yüzyılda, baklava yapımı artık ailelerden işletmelere dönüştü. Gaziantep'in Baklava yapımı, UNESCO Somut Olmayan Kültürel Miras listesine alındı.

## Coşkun Yaycı'nın Katkısı

Baklava yapımının sanatsal değerini yükseltmeye ve dünya pazarında Türk baklavaları tanıtmaya dediklenmiş bir ustadır Coşkun Yaycı.
    `,
    tags: ['baklava', 'osmanlı', 'tarih', 'kültür'],
    relatedPosts: ['antep-fistigi-ozellikleri', 'baklava-yapilisi-rehberi'],
  },
  'antep-fistigi-ozellikleri': {
    title: 'Antep Fıstığının Eşsiz Özellikleri',
    author: 'Dr. Ayşe Kaya',
    date: '2025-11-25',
    readTime: '6 min',
    category: 'Beslenme',
    image: '🌰',
    excerpt: 'Gaziantep fıstığının neden bu kadar özel olduğunu öğrenin.',
    content: `
# Antep Fıstığının Eşsiz Özellikleri

Gaziantep fıstığı sadece bir lezzet değil, sağlık ve beslenme açısından da mucize bir besindir.

## Kimyasal Bileşim

Antep fıstığında:
- Protein: %20
- Yağ: %50
- Karbonhidrat: %28
- Lif: %10

## Sağlık Faydaları

### Kalp Sağlığı
Antep fıstığında bulunan monoymağa yağlar, LDL kolesterolü düşürmeye yardımcı olur.

### Beyin Fonksiyonları
Potasyon ve antioksidanlar, beyin sağlığını korur ve anamnez kaybını azaltır.

### Kan Şekeri Kontrolü
Düşük glisemik indeksi nedeniyle şeker hastalıkları için güvenli bir seçenektir.

## Gaziantep İklimine Özgülük

Gaziantep'in 1000+ metre yüksekliğindeki bahçelerinde yetiştirilen fıstıklar, daha yüksek mineral ve vitamin içeriğine sahiptir.
    `,
    tags: ['fıstık', 'beslenme', 'sağlık', 'gaziantep'],
    relatedPosts: ['baklava-sagligi', 'baklava-tarihi'],
  },
  'baklava-yapilisi-rehberi': {
    title: 'Evde Baklava Yapmanın Sırları',
    author: 'Coşkun Yaycı',
    date: '2025-11-20',
    readTime: '12 min',
    category: 'Tarif',
    image: '👨‍🍳',
    excerpt: 'Coşkun Yaycı\'nın kuşak geçen tarif ve ipuçlarıyla evde profesyonel baklava nasıl yapılır?',
    content: `
# Evde Baklava Yapmanın Sırları

30 yıllık deneyimle, evde profesyonel kalitede baklava yapmanın sırlarını sizinle paylaşmak istiyorum.

## Malzemeler

- 500g yufka
- 300g Antep fıstığı (ince kıymılı)
- 200g tereyağı (eritilmiş)
- 200g şeker
- 1 litre su
- 1 limon

## Adım 1: Şerbet Hazırlığı

Şerbet, baştan sonraya kadar devamlı sıcak tutulmalıdır. Çünkü sıcak şerbet daha iyi penetrasyon sağlar.

\`\`\`
Su + Şeker + Limon Suyu
Koyulunca kaynama: 30 dakika
Soğutma: Yok, hep sıcak kalsın
\`\`\`

## Adım 2: Yufka Döşeme

**En önemli kısım budur.** Yufkalar:
1. Düzgün döşenmeli
2. Sırasında tereyağlanmalı
3. Hava kabarcığı bırakılmamalı

## Adım 3: Baklava Kesme

Baklava şekilleri:
- **Kare**: Klasik, evde en kolay
- **Burma**: Profesyonel, zor
- **Çubuk**: Kurumsal, standart

## Pişirme Sıcaklığı

\`\`\`
180°C - 200°C arası
Süre: 30-40 dakika
Altı: Açık, üstü: Kapalı
\`\`\`

## Şerbet Ekme Zamanı

**BU ÇOK ÖNEMLİ:**
- Baklava fırından çıkar çıkmaz sıcak şerbet ekmeyin
- 5-10 dakika soğumasını bekleyin
- Sonra sıcak şerbeti dökün

Eğer sıcak şerbeti sıcak baklavaya eklerseniz, baklava çok yumuşak ve ıslak olur.
    `,
    tags: ['tarif', 'diy', 'pişirme', 'teknik'],
    relatedPosts: ['dunya-baklava-cesitleri', 'baklava-tarihi'],
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS[params.slug];

  if (!post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Yazı Bulunamadı</h1>
            <p className="text-slate-600 mb-8">Aradığınız blog yazısı mevcut değil.</p>
            <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-bold">
              ← Blog'a Dön
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {/* Hero */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-6">
              <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-semibold">
                ← Blog'a Dön
              </Link>
            </div>
            <div className="text-6xl mb-6">{post.image}</div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">{post.title}</h1>
            <p className="text-xl text-slate-600 mb-6">{post.excerpt}</p>
            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <span>✍️ {post.author}</span>
              <span>📅 {post.date}</span>
              <span>⏱️ {post.readTime}</span>
              <span className="text-blue-600 font-semibold">📂 {post.category}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-slate-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">İlgili Yazılar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.relatedPosts.map((slug: string) => {
                  const relatedPost = BLOG_POSTS[slug];
                  return (
                    <Link
                      key={slug}
                      href={`/blog/${slug}`}
                      className="group bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-blue-400"
                    >
                      <div className="text-3xl mb-3">{relatedPost.image}</div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                        {relatedPost.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-3">{relatedPost.excerpt}</p>
                      <span className="text-xs text-blue-600 font-semibold">{relatedPost.readTime}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-slate-900 rounded-xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Bu Baklavalar Hakkında Daha Fazla Bilgi Almak İster misiniz?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Coşkun Yaycı Baklava'nın Premium koleksiyonunu keşfedin ve direkt fabrikadan sipariş verin.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
