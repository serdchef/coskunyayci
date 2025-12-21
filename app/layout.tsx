import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// SEO Metadata
export const metadata = {
  title: 'Coşkun Yaycı Baklava - Premium Turkish Baklava Online',
  description: 'Authentic Gaziantep baklava crafted by Coşkun Yaycı. Premium quality, corporate gifting, B2B solutions. Free shipping Turkey-wide.',
  keywords: 'baklava, antep fıstığı, gaziantep baklava, baklava sipariş, kurumsal hediye, baklava online',
  openGraph: {
    title: 'Coşkun Yaycı Baklava',
    description: 'Premium Turkish Baklava',
    url: 'https://coskunyaycibaklava.com',
    type: 'website',
  },
  robots: 'index, follow',
};

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const lexend = Lexend({ 
  subsets: ['latin'],
  variable: '--font-lexend',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${lexend.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-teal-50 via-cream-50 to-gold-50 font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
