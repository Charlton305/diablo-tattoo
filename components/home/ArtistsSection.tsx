import homepageData from '@/content/homepage.json';
import ArtistsGrid from '@/components/shared/ArtistsGrid';

export default function ArtistsSection() {
  return (
    <section className="py-20 md:py-32 bg-zinc-950">
      <div className="container mx-auto px-4 max-w-8xl">
        <h2 className="text-4xl sm:text-5xl uppercase md:text-6xl font-bold text-center mb-16">
          {homepageData.artists.heading}
        </h2>

        <ArtistsGrid />
      </div>
    </section>
  );
}
