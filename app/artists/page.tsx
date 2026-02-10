import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ArtistsGrid from '@/components/shared/ArtistsGrid';
import artistsContent from '@/content/artists.json';

export default function ArtistsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8">
              {artistsContent.heading}
            </h1>
            <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
              {artistsContent.description}
            </p>

            <ArtistsGrid />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
