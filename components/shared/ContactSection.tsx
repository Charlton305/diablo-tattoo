import ContactForm from '@/components/shared/ContactForm';
import homepageData from '@/content/homepage.json';

interface ContactSectionProps {
  contact?: {
    heading?: string | null;
    description?: string | null;
  } | null;
}

export default function ContactSection({ contact }: ContactSectionProps = {}) {
  const heading = contact?.heading ?? homepageData.contact.heading;
  const description = contact?.description ?? homepageData.contact.description;

  return (
    <section className="py-20 md:py-32 bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
              {heading}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-300">
              {(description ?? '')
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          <div>
            <ContactForm variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
