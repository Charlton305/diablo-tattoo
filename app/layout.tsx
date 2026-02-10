import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, EB_Garamond } from 'next/font/google';

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
  title: 'Diablo Tattoo - Custom Art & Bespoke Design | Rochester, Kent',
  description: 'Located in the heart of Rochester High Street, Diablo Tattoo is home to five talented artists creating custom artwork as unique as you are.',
  keywords: 'tattoo, custom tattoo, Rochester, Kent, tattoo studio, bespoke design, tattoo artists',
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
