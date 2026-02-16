import ContactForm from '@/components/shared/ContactForm';
import type { HomepageContact } from '@/tina/__generated__/types';

interface ContactSectionProps {
  contact: HomepageContact | null | undefined;
}

export default function ContactSection({ contact }: ContactSectionProps) {

  return (
    <section className="py-20 md:py-32 bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl mb-8">
              {contact?.heading ?? ''}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-300">
              {(contact?.description ?? '')
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
