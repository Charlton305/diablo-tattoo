import client from '@/tina/__generated__/client';
import ContactPageClient from './contact-client';

export default async function ContactPage() {
  const contactResult = await client.queries.contact({ relativePath: 'contact.json' });
  const siteResult = await client.queries.site({ relativePath: 'site.json' });
  return <ContactPageClient contact={contactResult} site={siteResult} />;
}
