import { Instagram, Facebook } from 'lucide-react';
import siteData from '@/content/site.json';
import homepageData from '@/content/homepage.json';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${homepageData.hero.backgroundImage}')`,
        }}
        role="img"
        aria-label={homepageData.hero.backgroundImageAlt}
      />

      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-wider uppercase fade-in">
          {homepageData.hero.title}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl mb-4 tracking-wide fade-in-delay-1">
          {homepageData.hero.subtitle}
        </p>
        <p className="text-lg sm:text-xl md:text-2xl tracking-widest uppercase fade-in-delay-2">
          {homepageData.hero.location}
        </p>
      </div>
    </section>
  );
}
