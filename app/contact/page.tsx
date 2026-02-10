import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ContactSection from '@/components/contact/ContactSection';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
