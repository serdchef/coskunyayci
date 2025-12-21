'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function KurumsalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-emerald-900/30 to-slate-900/30 backdrop-blur-xl border-r border-gold-600/20 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } z-40`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gold-600/20">
          <Link href="/kurumsal/dashboard" className="text-center">
            {sidebarOpen ? (
              <div>
                <div className="text-2xl font-bold text-gold-500">🏢</div>
                <div className="text-xs text-gold-400 font-semibold">KURUMSAL</div>
              </div>
            ) : (
              <div className="text-2xl text-gold-500">🏢</div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-2">
          <NavLink
            href="/kurumsal/dashboard"
            icon="📊"
            label="Dashboard"
            active={isActive('/kurumsal/dashboard')}
            sidebarOpen={sidebarOpen}
          />
          <NavLink
            href="/kurumsal/siparis"
            icon="📦"
            label="Toplu Sipariş"
            active={isActive('/kurumsal/siparis')}
            sidebarOpen={sidebarOpen}
          />
          <NavLink
            href="/kurumsal/siparisler"
            icon="📋"
            label="Siparişlerim"
            active={isActive('/kurumsal/siparisler')}
            sidebarOpen={sidebarOpen}
          />
          <NavLink
            href="/kurumsal/faturalar"
            icon="🧾"
            label="Faturalar"
            active={isActive('/kurumsal/faturalar')}
            sidebarOpen={sidebarOpen}
          />
          <NavLink
            href="/kurumsal/ayarlar"
            icon="⚙️"
            label="Ayarlar"
            active={isActive('/kurumsal/ayarlar')}
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-4 left-4 right-4 py-2 px-3 rounded-lg border border-gold-600/20 text-gold-400 hover:bg-gold-600/10 transition text-xs font-semibold"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-gradient-to-r from-emerald-900/50 to-slate-900/50 backdrop-blur-xl border-b border-gold-600/20 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gold-400 hover:text-gold-300 transition hidden sm:block"
            >
              {sidebarOpen ? '☰' : '☰'}
            </button>
            <h1 className="text-2xl font-bold text-gold-500 font-serif">
              Coşkun Yaycı Kurumsal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gold-300 font-semibold">
                {session?.user?.name || 'Kullanıcı'}
              </p>
              <p className="text-xs text-emerald-300">Kurumsal Üye</p>
            </div>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 text-sm bg-red-900/30 text-red-300 rounded-lg border border-red-600/30 hover:bg-red-900/50 transition"
            >
              Çıkış
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
  sidebarOpen,
}: {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  sidebarOpen: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
          active
            ? 'bg-gold-600/20 border border-gold-600/40 text-gold-400'
            : 'text-emerald-200 hover:bg-emerald-900/30 border border-transparent'
        }`}
      >
        <span className="text-lg">{icon}</span>
        {sidebarOpen && <span className="font-semibold text-sm">{label}</span>}
      </div>
    </Link>
  );
}
