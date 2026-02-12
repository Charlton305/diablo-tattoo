'use client';

import { useTina } from 'tinacms/dist/react';
import FAQSection from '@/components/faq/FAQSection';

export default function FAQPageClient(props: {
  data: any;
  query: string;
  variables: any;
}) {
  const { data } = useTina(props);

  return (
    <div className="pt-20">
      <FAQSection data={data.faq} />
    </div>
  );
}
