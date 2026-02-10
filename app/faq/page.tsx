import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import FAQSection from '@/components/faq/FAQSection';

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
