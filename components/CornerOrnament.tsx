/**
 * Köşe süslemeleri - Kutu tasarımındaki köşe detayları
 */

export function CornerOrnament({ position = "top-left" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const rotations = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90"
  };

  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0"
  };

  return (
    <div className={`absolute ${positions[position]} w-64 h-64 opacity-30 pointer-events-none`}>
      <svg 
        className={`w-full h-full ${rotations[position]}`} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ana çerçeve */}
        <path 
          d="M 10,10 L 190,10 L 190,50 Q 170,50 170,70 L 170,190 L 50,190 L 50,170 Q 50,150 30,150 L 10,150 Z"
          fill="none"
          stroke="#d4a017"
          strokeWidth="2"
        />
        
        {/* İç çerçeve */}
        <path 
          d="M 20,20 L 180,20 L 180,55 Q 165,55 165,70 L 165,180 L 55,180 L 55,165 Q 55,150 40,150 L 20,150 Z"
          fill="none"
          stroke="#d4a017"
          strokeWidth="1"
          opacity="0.6"
        />
        
        {/* Köşe çiçek deseni */}
        <g transform="translate(30, 30)">
          <circle cx="0" cy="0" r="8" fill="#d4a017" opacity="0.7"/>
          <circle cx="0" cy="0" r="12" fill="none" stroke="#d4a017" strokeWidth="1" opacity="0.5"/>
          
          {/* 4 petal */}
          <path d="M 0,-15 Q 5,-10 0,-5 Q -5,-10 0,-15" fill="#d4a017" opacity="0.6"/>
          <path d="M 15,0 Q 10,5 5,0 Q 10,-5 15,0" fill="#d4a017" opacity="0.6"/>
          <path d="M 0,15 Q -5,10 0,5 Q 5,10 0,15" fill="#d4a017" opacity="0.6"/>
          <path d="M -15,0 Q -10,-5 -5,0 Q -10,5 -15,0" fill="#d4a017" opacity="0.6"/>
        </g>
        
        {/* Scroll detayları */}
        <path 
          d="M 60,30 Q 70,25 80,30 Q 90,35 95,30"
          fill="none"
          stroke="#d4a017"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <path 
          d="M 30,60 Q 25,70 30,80 Q 35,90 30,95"
          fill="none"
          stroke="#d4a017"
          strokeWidth="1.5"
          opacity="0.7"
        />
        
        {/* Nokta süslemeler */}
        <circle cx="100" cy="30" r="3" fill="#d4a017" opacity="0.6"/>
        <circle cx="30" cy="100" r="3" fill="#d4a017" opacity="0.6"/>
        <circle cx="120" cy="40" r="2" fill="#d4a017" opacity="0.5"/>
        <circle cx="40" cy="120" r="2" fill="#d4a017" opacity="0.5"/>
      </svg>
    </div>
  );
}

// Merkez madalyon süsleme
export function CenterMedallion({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Dış çerçeve */}
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      
      {/* 8 köşeli yıldız */}
      <polygon
        points="100,20 110,80 140,60 120,90 160,100 120,110 140,140 110,120 100,180 90,120 60,140 80,110 40,100 80,90 60,60 90,80"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1"
      />
      
      {/* İç çember */}
      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      
      {/* Merkez süsleme */}
      <g transform="translate(100, 100)">
        {/* 4 yönlü scroll */}
        <path d="M 0,-25 Q 8,-20 5,-10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
        <path d="M 25,0 Q 20,8 10,5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
        <path d="M 0,25 Q -8,20 -5,10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
        <path d="M -25,0 Q -20,-8 -10,-5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
        
        {/* Merkez nokta */}
        <circle cx="0" cy="0" r="8" fill="currentColor" opacity="0.4"/>
        <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.6"/>
      </g>
      
      {/* Dış yıldız noktaları */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x = 100 + 75 * Math.cos(angle - Math.PI / 2);
        const y = 100 + 75 * Math.sin(angle - Math.PI / 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="currentColor" opacity="0.5" />;
      })}
    </svg>
  );
}
