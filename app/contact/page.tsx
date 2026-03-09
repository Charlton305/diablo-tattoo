import type { Metadata } from 'next'
import client from '@/tina/__generated__/client';
import ContactPageClient from './contact-client';

export const metadata: Metadata = {
  title: 'Contact & Booking',
  description: 'Get in touch with Diablo Tattoo in Rochester, Kent to book a consultation or ask about your next tattoo. Located at 116 High Street, Rochester.',
}

export default async function ContactPage() {
  const contactResult = await client.queries.contact({ relativePath: 'contact.json' });
  const siteResult = await client.queries.site({ relativePath: 'site.json' });
  return <ContactPageClient contact={contactResult} site={siteResult} />;
}
