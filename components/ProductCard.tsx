"use client";

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
 

type ProductCardProps = {
  // Accept a partial product shape because some pages may pass lightweight
  // objects (fallbacks) that don't include all DB fields.
  product: Partial<Product>;
};

export default function ProductCard({ product }: ProductCardProps) {
  const price = (((product.priceCents ?? 0) as number) / 100).toFixed(2);

  return (
    <Link href={`/products/${product.sku || product.id}`} className="block cursor-pointer">
    <div className="group relative rounded-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2">
      {/* Glassmorphism arka plan */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md border-2 border-gold-400/30 group-hover:border-gold-400/60 rounded-2xl transition-all" />
      
      {/* Altın çerçeve efekti - hover'da görünür */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {/* Köşe süslemeleri */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold-300 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-300 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-300 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold-300 rounded-br-2xl" />
        
        {/* Köşe noktaları */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-gold-300 rounded-full" />
        <div className="absolute top-2 right-2 w-2 h-2 bg-gold-300 rounded-full" />
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-gold-300 rounded-full" />
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-gold-300 rounded-full" />
      </div>
      
      {/* Ottoman motif overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id={`pattern-${product.id}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="2" fill="#d4a017"/>
            <path d="M30,15 L33,25 L30,22 L27,25 Z" fill="#0f766e" opacity="0.3"/>
            <path d="M30,20 Q 35,22 32,28" fill="none" stroke="#d4a017" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pattern-${product.id})`}/>
        </svg>
      </div>
      
      <div className="relative p-6">
      <div className="relative h-56 mb-6 bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-gold-400/20">
        {(product.image || product.imageUrl) ? (
          <img
            src={product.image || product.imageUrl || ''}
            alt={product.name ?? ''}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load failed:', product.image || product.imageUrl, e);
            }}
            onLoad={() => {
              console.log('Image loaded:', product.image || product.imageUrl);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-xs text-center">Resim yok: {product.name}</span>
          </div>
        )}
        
        {product.isFeatured && (
          <span className="absolute top-2 right-2 badge badge-warning">
            Öne Çıkan
          </span>
        )}
      </div>

      <h3 className="font-display font-semibold text-xl mb-2 line-clamp-2 text-white group-hover:text-gold-300 transition-colors">
        {product.name}
      </h3>
      
      <p className="text-cream-200 text-sm mb-4 line-clamp-3 leading-relaxed">
        {product.description}
      </p>

      <div className="flex items-baseline justify-between mb-6 pt-4 border-t border-gold-400/20">
        <div>
          <span className="text-3xl font-bold text-gold-300">
            {price}
          </span>
          <span className="text-lg text-gold-400 ml-1">TL</span>
        </div>
        <span className="text-sm text-cream-200 font-medium bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-gold-400/30">
          {product.weightGr}g
        </span>
      </div>

      <button
        onClick={async () => {
          try {
            // Debug logs: track click, payload and response in browser console
            // eslint-disable-next-line no-console
            console.log('quick-order: button clicked', { sku: product.sku, name: product.name });

            const phone = window.prompt('Lütfen telefon numaranızı girin (örn +905551234567):');
            if (!phone) return;
            const payload = {
              items: [
                {
                  sku: product.sku,
                  qty: 1,
                },
              ],
              customer: {
                name: 'Müşteri',
                phone,
                email: '',
              },
              deliveryType: 'pickup',
              paymentMethod: 'cash',
              notes: `Ordered from product card: ${product.name}`,
            } as any;

            // eslint-disable-next-line no-console
            console.log('quick-order: payload', payload);

            // Use same-origin proxy to avoid CORS and to keep the quick-service API key on the server.
            const quickUrl = '/api/quick-order';

            const res = await fetch(quickUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            let data: any = null;
            try {
              data = await res.json();
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('quick-order: response not JSON', e);
            }

            // eslint-disable-next-line no-console
            console.log('quick-order: response', { status: res.status, ok: res.ok, body: data });

            if (!res.ok) {
              window.alert(data?.error || 'Sipariş oluşturulamadı');
              return;
            }

            window.alert(`Sipariş oluşturuldu: ${data.orderNumber}`);
          } catch (err) {
            // fallback
            // eslint-disable-next-line no-console
            console.error('quick-order: error', err);
            window.alert('Sipariş sırasında bir hata oluştu');
          }
        }}
        className="w-full py-3 bg-gold-600 hover:bg-gold-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl relative overflow-hidden group/btn"
      >
        <span className="relative z-10 flex items-center justify-center">
          <svg className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Sipariş Ver
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-gold-700 to-gold-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />
      </button>
    </div>
    </div>
    </Link>
  );
}
