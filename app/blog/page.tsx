'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  image: string;
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'baklava-tarihi',
    title: 'Baklavanın 500 Yıllık Tarihi',
    excerpt: 'Osmanlı İmparatorluğu\'ndan günümüze baklavaların yolculuğu. Nasıl başladı ve nasıl evrilerek günümüze ulaştı?',
    category: 'Tarih',
    author: 'Coşkun Yaycı',
    date: '2025-12-01',
    readTime: '8 min',
    featured: true,
    image: '/images/blog-history.jpg',
    tags: ['baklava', 'osmanlı', 'tarih', 'kültür'],
  },
  {
    id: '2',
    slug: 'antep-fistigi-ozellikleri',
    title: 'Antep Fıstığının Eşsiz Özellikleri',
    excerpt: 'Gaziantep fıstığının neden bu kadar özel olduğunu, bileşimini ve sağlık faydalarını öğrenin.',
    category: 'Beslenme',
    author: 'Dr. Ayşe Kaya',
    date: '2025-11-25',
    readTime: '6 min',
    featured: true,
    image: '/images/blog-pistachio.jpg',
    tags: ['fıstık', 'beslenme', 'sağlık', 'gaziantep'],
  },
  {
    id: '3',
    slug: 'baklava-yapilisi-rehberi',
    title: 'Evde Baklava Yapmanın Sırları',
    excerpt: 'Coşkun Yaycı\'nın kuşak geçen tarif ve ipuçlarıyla evde profesyonel baklava nasıl yapılır?',
    category: 'Tarif',
    author: 'Coşkun Yaycı',
    date: '2025-11-20',
    readTime: '12 min',
    featured: true,
    image: '/images/blog-recipe.jpg',
    tags: ['tarif', 'diy', 'pişirme', 'teknik'],
  },
  {
    id: '4',
    slug: 'dunya-baklava-cesitleri',
    title: 'Dünyada Baklava Nasıl Yapılıyor?',
    excerpt: 'Türkiye, Arap, Balkan ve Yunan baklavaları arasındaki farkları keşfedin.',
    category: 'Kültür',
    author: 'Mehmet Demir',
    date: '2025-11-15',
    readTime: '7 min',
    featured: false,
    image: '/images/blog-world.jpg',
    tags: ['baklava', 'kültür', 'dünya', 'coğrafya'],
  },
  {
    id: '5',
    slug: 'baklava-cay-eslemesi',
    title: 'Baklava Hangi Çayla Eşleşir?',
    excerpt: 'Farklı baklava çeşitleri için ideal çay kombinasyonları ve lezzet uyumları.',
    category: 'Aşçılık',
    author: 'İbrahim Şef',
    date: '2025-11-10',
    readTime: '5 min',
    featured: false,
    image: '/images/blog-pairing.jpg',
    tags: ['çay', 'esleme', 'lezzet', 'kombinasyon'],
  },
  {
    id: '6',
    slug: 'baklava-sagligi',
    title: 'Baklava Tüketiminin Sağlık Açısından Değeri',
    excerpt: 'Moderatör tüketimle baklavadan nasıl en iyi fayda sağlanır? Beslenme uzmanının tavsiyesi.',
    category: 'Beslenme',
    author: 'Dr. Zeynep Arslan',
    date: '2025-11-05',
    readTime: '6 min',
    featured: false,
    image: '/images/blog-health.jpg',
    tags: ['sağlık', 'beslenme', 'yaşam'],
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Tümü', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchCategory = selectedCategory === 'Tümü' || post.category === selectedCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const featuredPosts = filteredPosts.filter((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-slate-900 to-black" style={{ backgroundColor: '#022c22' }}>
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-white mb-4">Baklava Bilim & Sanat</h1>
            <p className="text-xl text-amber-300 max-w-2xl">
              Baklavaların ardındaki tarih, kültür ve lezzet hakkında derinlemesine makaleler
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Search & Filter */}
          <div className="mb-12">
            <input
              type="text"
              placeholder="Blog yazılarında ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 border-2 border-amber-500/20 rounded-xl focus:outline-none focus:border-amber-500/50 text-lg mb-6 bg-slate-800/50 text-slate-200 placeholder-slate-500"
            />

            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'bg-slate-800/50 border-2 border-amber-500/20 text-slate-300 hover:border-amber-500/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <div className="mb-12">
                <h2 className="text-4xl font-bold text-amber-400 mb-3 font-serif tracking-tight">Öne Çıkan Yazılar</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-amber-500"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-slate-800/50 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-amber-500/20"
                  >
                    {/* Editorial Hero - Category Color Based */}
                    <div className={`h-56 flex items-center justify-center relative overflow-hidden ${
                      post.category === 'Tarih' ? 'bg-gradient-to-br from-amber-800 to-amber-900' :
                      post.category === 'Beslenme' ? 'bg-gradient-to-br from-green-800 to-primary-900' :
                      post.category === 'Tarif' ? 'bg-gradient-to-br from-orange-700 to-amber-800' :
                      post.category === 'Kültür' ? 'bg-gradient-to-br from-red-800 to-primary-900' :
                      post.category === 'Aşçılık' ? 'bg-gradient-to-br from-amber-900 to-orange-900' :
                      'bg-gradient-to-br from-primary-800 to-primary-900'
                    }`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative z-10 text-center px-4">
                        <div className="text-xs font-bold text-amber-200 uppercase tracking-widest mb-2">{post.category}</div>
                        <div className="text-sm font-bold text-white/80 leading-tight">{post.title}</div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="text-xs font-bold text-amber-400 uppercase">{post.category}</span>
                        <span className="text-xs text-slate-400 ml-3">~{post.readTime}</span>
                      </div>
                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex justify-between items-center text-xs text-slate-400 border-t border-amber-500/10 pt-3">
                        <span className="font-medium text-slate-300">{post.author}</span>
                        <span>{new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-amber-400 mb-3 font-serif">
                  {featuredPosts.length > 0 ? 'Tüm Yazılar' : 'Blog Yazıları'}
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-amber-400 to-amber-500"></div>
              </div>
              <div className="space-y-5">
                {regularPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block group bg-slate-800/50 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5 border border-amber-500/20 hover:border-amber-500/40"
                  >
                    <div className="flex gap-6 items-start">
                      {/* Minimal color block */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider ${
                        post.category === 'Tarih' ? 'bg-amber-700' :
                        post.category === 'Beslenme' ? 'bg-green-700' :
                        post.category === 'Tarif' ? 'bg-orange-700' :
                        post.category === 'Kültür' ? 'bg-red-700' :
                        post.category === 'Aşçılık' ? 'bg-amber-900' :
                        'bg-primary-700'
                      }`}>
                        {post.category.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-amber-400 uppercase">{post.category}</span>
                          <span className="text-xs text-slate-400">{post.readTime}</span>
                        </div>
                        <h3 className="text-base font-bold text-amber-300 mb-2 group-hover:text-amber-200 transition">
                          {post.title}
                        </h3>
                        <p className="text-slate-300 text-sm mb-3">{post.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 flex-wrap">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded border border-amber-500/10">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-slate-400 flex gap-3">
                            <span className="font-medium">{post.author}</span>
                            <span>{new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-2xl text-amber-400">Hiç makale bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
