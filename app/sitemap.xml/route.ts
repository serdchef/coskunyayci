import { NextResponse } from 'next/server';

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>https://coskunyaycibaklava.com/</loc>
    <lastmod>2025-12-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/products</loc>
    <lastmod>2025-12-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/blog</loc>
    <lastmod>2025-12-08</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/about</loc>
    <lastmod>2025-12-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/sommelier</loc>
    <lastmod>2025-12-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/b2b</loc>
    <lastmod>2025-12-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Blog Posts -->
  <url>
    <loc>https://coskunyaycibaklava.com/blog/baklava-tarihi</loc>
    <lastmod>2025-12-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/blog/antep-fistigi-ozellikleri</loc>
    <lastmod>2025-11-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/blog/baklava-yapilisi-rehberi</loc>
    <lastmod>2025-11-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Shop Pages -->
  <url>
    <loc>https://coskunyaycibaklava.com/sepetim</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://coskunyaycibaklava.com/checkout</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
