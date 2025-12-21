/**
 * Ottoman/Geleneksel Türk Motifleri - Coşkun Yayçı Baklava marka kimliği
 * Gerçek kutu tasarımlarından ilham alınmıştır
 */

// Logo Görselini Direkt Kullan - Artık kullanılmıyor, body::before ile replace edildi
// Tüm sayfada tek parça logo pattern için globals.css body::before kullanılıyor
export function OttomanFloral() {
  // Artık boş döndürüyoruz - global CSS'teki body::before kullanılıyor
  return null;
}

// Zengin süsleme bordürü (kutu kenarlarındaki pattern)
export function OttomanBorder({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <defs>
        {/* Tek bir süsleme motifi */}
        <g id="border-motif">
          <path d="M 0,40 Q 5,30 10,40 Q 5,50 0,40" fill="currentColor" opacity="0.6"/>
          <circle cx="10" cy="40" r="2" fill="currentColor" opacity="0.8"/>
          <path d="M 10,35 Q 15,33 18,35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
          <path d="M 10,45 Q 15,47 18,45" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
          <circle cx="20" cy="40" r="1.5" fill="currentColor" opacity="0.7"/>
        </g>
      </defs>
      
      {/* Ana çizgiler */}
      <path d="M0,35 L1200,35" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <path d="M0,40 L1200,40" stroke="currentColor" strokeWidth="3" opacity="0.6"/>
      <path d="M0,45 L1200,45" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      
      {/* Tekrarlayan süsleme motifleri */}
      {Array.from({ length: 40 }).map((_, i) => (
        <use key={i} href="#border-motif" x={i * 30} opacity="0.7" />
      ))}
      
      {/* Üst detay çizgisi */}
      <path 
        d="M0,25 Q30,20 60,25 T120,25 T180,25 T240,25 T300,25 T360,25 T420,25 T480,25 T540,25 T600,25 T660,25 T720,25 T780,25 T840,25 T900,25 T960,25 T1020,25 T1080,25 T1140,25 T1200,25"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
      
      {/* Alt detay çizgisi */}
      <path 
        d="M0,55 Q30,60 60,55 T120,55 T180,55 T240,55 T300,55 T360,55 T420,55 T480,55 T540,55 T600,55 T660,55 T720,55 T780,55 T840,55 T900,55 T960,55 T1020,55 T1080,55 T1140,55 T1200,55"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

export function GeometricPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="geometric-ottoman" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* 8 köşeli yıldız */}
          <polygon
            points="60,20 70,50 90,40 80,60 100,70 70,70 80,90 60,80 50,100 50,70 30,80 40,60 20,50 50,50 40,30"
            fill="#0f766e"
            opacity="0.3"
          />
          
          {/* Köşe noktaları */}
          <circle cx="10" cy="10" r="2" fill="#d4a017" opacity="0.5"/>
          <circle cx="110" cy="10" r="2" fill="#d4a017" opacity="0.5"/>
          <circle cx="10" cy="110" r="2" fill="#d4a017" opacity="0.5"/>
          <circle cx="110" cy="110" r="2" fill="#d4a017" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geometric-ottoman)" />
    </svg>
  );
}

// Marka logosu SVG component
export function BrandLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50,50)">
        {/* Merkez elmas */}
        <path d="M 0,-8 L 8,0 L 0,8 L -8,0 Z" fill="#d4a017"/>
        
        {/* 4 yön süsleme - kutu logosundaki gibi */}
        <g className="animate-pulse-slow">
          {/* Üst */}
          <path d="M 0,-25 Q 8,-18 0,-12 Q -8,-18 0,-25" fill="currentColor"/>
          <path d="M 2,-24 Q 6,-20 2,-14" stroke="#d4a017" strokeWidth="0.5" fill="none"/>
          
          {/* Sağ */}
          <path d="M 25,0 Q 18,8 12,0 Q 18,-8 25,0" fill="currentColor"/>
          <path d="M 24,2 Q 20,6 14,2" stroke="#d4a017" strokeWidth="0.5" fill="none"/>
          
          {/* Alt */}
          <path d="M 0,25 Q -8,18 0,12 Q 8,18 0,25" fill="currentColor"/>
          <path d="M -2,24 Q -6,20 -2,14" stroke="#d4a017" strokeWidth="0.5" fill="none"/>
          
          {/* Sol */}
          <path d="M -25,0 Q -18,-8 -12,0 Q -18,8 -25,0" fill="currentColor"/>
          <path d="M -24,-2 Q -20,-6 -14,-2" stroke="#d4a017" strokeWidth="0.5" fill="none"/>
        </g>
        
        {/* Köşe elmaslar */}
        <path d="M 15,-15 L 18,-18 L 15,-21 L 12,-18 Z" fill="#d4a017" opacity="0.8"/>
        <path d="M 15,15 L 18,18 L 15,21 L 12,18 Z" fill="#d4a017" opacity="0.8"/>
        <path d="M -15,15 L -12,18 L -15,21 L -18,18 Z" fill="#d4a017" opacity="0.8"/>
        <path d="M -15,-15 L -12,-18 L -15,-21 L -18,-18 Z" fill="#d4a017" opacity="0.8"/>
      </g>
    </svg>
  );
}
