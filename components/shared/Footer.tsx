import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';
import siteData from '@/content/site.json';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">{siteData.siteName}</h3>
            <p className="text-gray-400 mb-2">{siteData.tagline}</p>
            <p className="text-gray-400">{siteData.address}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <nav className="flex flex-col space-y-2">
              {siteData.navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
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
            <p className="text-gray-400 text-sm">{siteData.email}</p>
            <p className="text-gray-400 text-sm">{siteData.phone}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {siteData.siteName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
