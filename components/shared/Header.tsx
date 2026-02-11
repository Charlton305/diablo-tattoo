'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Instagram, Facebook } from 'lucide-react';
import siteData from '@/content/site.json';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-20">
            <div className="flex justify-start">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold tracking-wider hover:text-accent transition-colors"
              >
                <img src='/diablo-tattoo-logo.png' alt="Diablo Tattoo Logo" className="h-8 sm:h-14" />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center justify-center space-x-8">
              {siteData.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm uppercase tracking-wide hover:text-accent transition-colors relative group whitespace-nowrap"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="flex justify-end items-center gap-4">
              <div className="hidden lg:flex items-center space-x-4">
                <a
                  href={siteData.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={siteData.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>

              <button
                className="lg:hidden text-white hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden bg-black border-t border-white/10 transition-all duration-300 ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <nav className="container mx-auto px-4 py-6 flex flex-col items-center space-y-4">
            {siteData.navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg uppercase tracking-wide hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-white/10 w-full">
              <a
                href={siteData.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={siteData.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
