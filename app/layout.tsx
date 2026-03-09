import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, EB_Garamond } from 'next/font/google';
import siteData from '@/content/site.json';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://diablotattoo.co.uk'),
  title: {
    template: '%s | Diablo Tattoo',
    default: 'Diablo Tattoo | Custom Tattoo Studio, Rochester, Kent',
  },
  description: siteData.siteDescription,
  keywords: siteData.siteKeywords,
  openGraph: {
    siteName: 'Diablo Tattoo',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    other: [
      { rel: 'icon', url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${playfair.variable} ${garamond.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
