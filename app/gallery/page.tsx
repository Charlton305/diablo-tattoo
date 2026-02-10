import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import GallerySection from '@/components/gallery/GallerySection';

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <GallerySection />
      </main>
      <Footer />
    </>
  );
}
