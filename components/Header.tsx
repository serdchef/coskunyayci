'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/lib/context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { items } = useCart();
  const cartCount = items.reduce((sum: number, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5" style={{ backgroundColor: 'rgba(2, 44, 34, 0.8)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-x-16">
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0 min-w-[320px]">
            <Image 
              src="/logo.png" 
              alt="Coşkun Yaycı Baklava Logo"
              width={40}
              height={40}
              className="h-10 w-auto flex-shrink-0"
            />
            <div>
              <span className="font-display text-lg font-bold text-white tracking-wider">
                COŞKUN YAYCI
              </span>
              <div className="text-xs text-amber-400 font-semibold tracking-widest">BAKLAVA</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="px-5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all font-medium whitespace-nowrap"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/products" 
              className="px-5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all font-medium whitespace-nowrap"
            >
              Ürünler
            </Link>
            <Link 
              href="/blog" 
              className="px-5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all font-medium whitespace-nowrap"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="px-5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all font-medium whitespace-nowrap"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/sommelier" 
              className="px-5 py-2 text-amber-300 hover:text-amber-200 hover:bg-slate-800/50 rounded-lg transition-all font-bold whitespace-nowrap"
            >
              🥜 Sommelier
            </Link>
            <Link 
              href="/contact" 
              className="px-5 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all font-medium whitespace-nowrap"
            >
              İletişim
            </Link>
            <Link 
              href="/b2b" 
              className="px-5 py-2 text-amber-400 border border-amber-500/40 hover:border-amber-500/60 hover:bg-slate-800/50 rounded-lg transition-all font-bold hover:shadow-lg hover:shadow-amber-500/10 whitespace-nowrap"
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
              className="relative ml-4 p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all"
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
                  className="px-4 py-2 text-slate-300 hover:text-amber-400 font-medium flex items-center gap-2"
                >
                  {session.user?.name}
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-lg border border-amber-500/20 py-2 z-50">
                    <Link
                      href="/siparislerim"
                      className="block px-4 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Siparişlerim
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 transition"
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
                  className="ml-4 px-4 py-2 text-slate-300 hover:text-amber-400 font-medium"
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg hover:shadow-lg hover:shadow-amber-500/20 transition-all font-semibold"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button - Luxury Style */}
          <motion.button
            className="md:hidden p-2 text-amber-400 hover:text-amber-300 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              {mobileMenuOpen ? (
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu - Full Screen Luxury Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-gradient-to-br from-primary-900 via-emerald-900 to-primary-900 md:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Ghost Gold Pattern Background */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'url(/images/logo.png)',
                  backgroundSize: '100px 100px',
                  backgroundPosition: '0 0',
                  filter: 'saturate(1.5) hue-rotate(5deg) brightness(1.1)',
                  pointerEvents: 'none'
                }}
              />
              
              {/* Backdrop Blur Effect */}
              <div className="absolute inset-0 backdrop-blur-sm" />
              
              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                {/* Top Section - Close Button */}
                <div className="flex justify-end">
                  <motion.button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-amber-400 hover:text-amber-300 p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Kapat"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </motion.button>
                </div>
                
                {/* Middle Section - Navigation Links */}
                <nav className="flex flex-col gap-8 items-center justify-center flex-1">
                  {[
                    { href: '/', label: 'Ana Sayfa' },
                    { href: '/products', label: 'Ürünler' },
                    { href: '/about', label: 'Hakkımızda' },
                    { href: '/contact', label: 'İletişim' },
                    { href: '/demo', label: '🥜 Sommelier' },
                  ].map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                    >
                      <Link
                        href={link.href}
                        className="text-2xl sm:text-3xl font-playfair text-amber-400 hover:text-amber-300 transition-colors tracking-wide"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Sepet Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Link
                      href="/sepetim"
                      className="text-2xl sm:text-3xl font-playfair text-amber-400 hover:text-amber-300 transition-colors tracking-wide flex items-center gap-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🛍️ Sepetim {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </motion.div>
                  
                  {/* Auth Links */}
                  {!session ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      >
                        <Link
                          href="/auth/signin"
                          className="text-xl sm:text-2xl font-playfair text-amber-400 hover:text-amber-300 transition-colors tracking-wide border-t border-amber-400/30 pt-8 mt-8"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Giriş Yap
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                      >
                        <Link
                          href="/auth/signup"
                          className="text-xl sm:text-2xl font-playfair text-amber-400 hover:text-amber-300 transition-colors tracking-wide"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Kayıt Ol
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      >
                        <Link
                          href="/siparislerim"
                          className="text-xl sm:text-2xl font-playfair text-amber-400 hover:text-amber-300 transition-colors tracking-wide border-t border-amber-400/30 pt-8 mt-8"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Siparişlerim
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                      >
                        <button
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="text-xl sm:text-2xl font-playfair text-amber-400 hover:text-amber-300 transition-colors tracking-wide"
                        >
                          Çıkış
                        </button>
                      </motion.div>
                    </>
                  )}
                </nav>
                
                {/* Bottom Section - CTA & Social */}
                <motion.div
                  className="flex flex-col items-center gap-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  {/* Phone CTA */}
                  <a
                    href="tel:+905551234567"
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    <p className="text-xs text-slate-300 uppercase tracking-widest mb-2">Hemen Sipariş</p>
                    <p className="text-xl sm:text-2xl font-playfair tracking-wider">+90 555 123 45 67</p>
                  </a>
                  
                  {/* Social Icons */}
                  <div className="flex gap-6 justify-center pt-4 border-t border-amber-400/30">
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-amber-400 hover:text-amber-300 transition-colors hover:scale-125"
                      onClick={(e) => e.stopPropagation()}
                    >
                      📷
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-amber-400 hover:text-amber-300 transition-colors hover:scale-125"
                      onClick={(e) => e.stopPropagation()}
                    >
                      𝕏
                    </a>
                    <a 
                      href="https://tiktok.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-amber-400 hover:text-amber-300 transition-colors hover:scale-125"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🎵
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
