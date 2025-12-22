/**
 * Admin Login Page
 * Admin Panel'e erişim için Google OAuth + Email/Password
 */

'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Eğer zaten login ise admin'e yönlendir
  useEffect(() => {
    if (session) {
      router.push('/admin/dashboard');
    }
  }, [session, router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError('Giriş sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn('google', { redirect: false });
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Google ile giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">🏛️</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Zümrüt Temeller</h2>
          <p className="text-teal-200">Admin Kontrol Merkezi</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-6 bg-white text-teal-900 font-semibold py-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google ile Giriş Yap
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/10 text-teal-200">veya</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@coskunyayci.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none focus:border-teal-400 transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-teal-300/50 focus:outline-none focus:border-teal-400 transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3 rounded-lg hover:from-teal-600 hover:to-emerald-600 transition disabled:opacity-50"
            >
              {loading ? '🔄 Giriş yapılıyor...' : '✨ Admin Paneline Giriş'}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-emerald-200 text-xs font-semibold mb-2">👑 Saray Muhafızı (SUPER_ADMIN):</p>
            <p className="text-emerald-300 text-xs mb-1">📧 <code>serdchef@gmail.com</code></p>
            <p className="text-emerald-300 text-xs">🔑 <code>test123</code></p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-teal-200 text-sm">
            İnsan kullanıcısı mısın?{' '}
            <Link href="/auth/login" className="text-white font-semibold hover:text-teal-300 transition">
              Ana giriş sayfasına dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
