import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, EB_Garamond } from 'next/font/google';
import siteData from '@/content/site.json';

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
  title: siteData.siteTitle,
  description: siteData.siteDescription,
  keywords: siteData.siteKeywords,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${garamond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
