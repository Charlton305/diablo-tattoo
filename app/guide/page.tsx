import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import GuideSection from '@/components/guide/GuideSection';

export default function GuidePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <GuideSection />
      </main>
      <Footer />
    </>
  );
}
