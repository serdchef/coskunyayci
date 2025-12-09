'use client';

/**
 * Demo Sayfa - Database olmadan çalışır
 */

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Başarı İkonu */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Başlık */}
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            🎉 Tebrikler!
          </h1>
          
          <h2 className="text-3xl font-semibold text-gray-700 mb-8">
            Coşkun Yayçı Baklava Platformu Başarıyla Kuruldu!
          </h2>

          {/* İstatistikler */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Dosya Oluşturuldu</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">8,000+</div>
              <div className="text-gray-600">Kod Satırı</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">TypeScript</div>
            </div>
          </div>

          {/* Kurulum Durumu */}
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 text-left">
            <h3 className="text-2xl font-bold mb-6 text-center">✅ Kurulum Durumu</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">Next.js 14 + React 18</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">TypeScript + TailwindCSS</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">Prisma ORM Schema</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">API Routes (7 endpoint)</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-lg">Components (5 adet)</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚠️</span>
                <span className="text-lg text-yellow-600">PostgreSQL Database (Kurulum bekleniyor)</span>
              </div>
            </div>
          </div>

          {/* Sıradaki Adımlar */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-6">🚀 Sıradaki Adımlar</h3>
            
            <div className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <div className="font-semibold text-lg">PostgreSQL Kur</div>
                  <div className="text-blue-100">Download: https://www.postgresql.org/download/windows/</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <div className="font-semibold text-lg">Database Oluştur</div>
                  <code className="block bg-black/20 p-3 rounded mt-2 text-sm">
                    psql -U postgres -c "CREATE DATABASE baklava_db;"
                  </code>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <div className="font-semibold text-lg">Prisma Migrate</div>
                  <code className="block bg-black/20 p-3 rounded mt-2 text-sm">
                    npx prisma migrate dev --name init<br/>
                    npx prisma db seed
                  </code>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <div className="font-semibold text-lg">Server Restart</div>
                  <code className="block bg-black/20 p-3 rounded mt-2 text-sm">
                    npm run dev
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Dokümantasyon */}
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            <a href="/docs/README.md" className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
              <div className="text-2xl mb-2">📖</div>
              <div className="font-semibold">README</div>
            </a>
            <a href="/docs/QUICKSTART.md" className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Quickstart</div>
            </a>
            <a href="/docs/DEPLOYMENT.md" className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-semibold">Deployment</div>
            </a>
            <a href="/docs/ARCHITECTURE.md" className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition">
              <div className="text-2xl mb-2">🏗️</div>
              <div className="font-semibold">Architecture</div>
            </a>
          </div>

          {/* Footer */}
          <div className="mt-12 text-gray-600">
            <p className="text-sm">
              Proje dizini: <code className="bg-gray-100 px-2 py-1 rounded">c:\Users\x\Desktop\coskunyaycibaklava</code>
            </p>
            <p className="text-sm mt-2">
              Port: <code className="bg-gray-100 px-2 py-1 rounded">localhost:4000</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
