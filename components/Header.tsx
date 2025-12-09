'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/lib/context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { items } = useCart();
  const cartCount = items.reduce((sum: number, item) => sum + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-white via-cream-50 to-white shadow-lg sticky top-0 z-50 border-b border-gold-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold text-primary-800">🍰</span>
            <div>
              <span className="font-display text-xl font-bold text-primary-800 tracking-wide">
                COŞKUN YAYCI
              </span>
              <div className="text-xs text-gold-600 font-semibold">BAKLAVA</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-medium"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/products" 
              className="px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-medium"
            >
              Ürünler
            </Link>
            <Link 
              href="/blog" 
              className="px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-medium"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-medium"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/sommelier" 
              className="px-4 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-all font-bold"
            >
              🍰 Sommelier
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all font-medium"
            >
              İletişim
            </Link>
            <Link 
              href="/b2b" 
              className="px-4 py-2 text-gold-500 border-2 border-gold-400 hover:bg-gold-50 hover:border-gold-500 rounded-lg transition-all font-bold hover:text-gold-600 hover:shadow-lg hover:shadow-gold-200/50"
            >
              B2B Çözümler
            </Link>
            <Link 
              href="/admin/dashboard" 
              className="px-4 py-2 text-white bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 rounded-lg transition-all font-bold text-sm"
              title="Admin Panel"
            >
              🎛️ Kontrol
            </Link>

            {/* Sepet İkonu */}
            <Link 
              href="/sepetim"
              className="relative ml-4 p-2 text-gray-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all"
              title="Sepetim"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {session ? (
              <div className="ml-4 relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-4 py-2 text-gray-700 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  {session.user?.name}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/siparislerim"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Siparişlerim
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="ml-4 px-4 py-2 text-gray-700 hover:text-primary-700 font-medium"
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link 
              href="/" 
              className="block py-2 text-gray-700 hover:text-primary-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/products" 
              className="block py-2 text-gray-700 hover:text-primary-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ürünler
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-primary-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-gray-700 hover:text-primary-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              İletişim
            </Link>

            {/* Mobil Sepet */}
            <Link 
              href="/sepetim"
              className="block py-2 text-gray-700 hover:text-primary-700 font-semibold flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Sepetim {cartCount > 0 && `(${cartCount})`}
            </Link>

            {session ? (
              <>
                <Link
                  href="/siparislerim"
                  className="block py-2 text-gray-700 hover:text-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Siparişlerim
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-gray-700 hover:text-primary-700"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block py-2 text-gray-700 hover:text-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block py-2 text-primary-700 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
