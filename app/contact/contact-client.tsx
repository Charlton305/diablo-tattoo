'use client';

import { useTina } from 'tinacms/dist/react';
import ContactSection from '@/components/contact/ContactSection';

export default function ContactPageClient({
  contact,
  site,
}: {
  contact: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.contact>>;
  site: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.site>>;
}) {
  const { data: contactData } = useTina(contact);
  const { data: siteData } = useTina(site);

  return (
    <div className="pt-20">
      <ContactSection
        contactData={contactData.contact}
        siteData={siteData.site}
      />
    </div>
  );
}
