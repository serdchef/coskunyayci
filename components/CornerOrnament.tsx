/**
 * Köşe süslemeleri - Artık kullanılmıyor
 * Tüm sayfada tek parça logo pattern için globals.css body::before kullanılıyor
 */

export function CornerOrnament({ position = "top-left" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  // Artık boş döndürüyoruz - global CSS'teki body::before kullanılıyor
  return null;
}
