/**
 * Admin - Unauthorized Access
 * Admin olmayan kullanıcılar bu sayfayı görür
 */

import Link from 'next/link';

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl mb-4">🔒</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Erişim Reddedildi</h2>
        <p className="text-teal-200 mb-8">
          Bu alana erişim yalnızca Yönetici rolü olan kullanıcılar için açıktır.
        </p>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 mb-8">
          <p className="text-teal-300 mb-4">
            ✨ <strong>Sarayın anahtarlarını</strong> henüz sizin için açmadık.
          </p>
          <p className="text-sm text-teal-200">
            Admin erişimi için sistem yöneticisine başvurunuz.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/admin/login"
            className="block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Farklı Hesapla Giriş Yap
          </Link>
          <Link
            href="/"
            className="block bg-white/10 hover:bg-white/20 text-teal-200 font-semibold py-3 rounded-lg border border-white/20 transition"
          >
            ← Anasayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
