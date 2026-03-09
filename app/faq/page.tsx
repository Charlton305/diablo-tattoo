import type { Metadata } from 'next'
import client from '@/tina/__generated__/client'
import FAQPageClient from './faq-client'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Got questions? Find answers to frequently asked questions about getting a tattoo at Diablo Tattoo in Rochester, Kent.',
}
import ContactSection from '@/components/shared/ContactSection'

export default async function FAQPage() {
  const faqResult = await client.queries.faq({ relativePath: 'faq.json' })
  return (
    <>
      <FAQPageClient {...faqResult} />
      <ContactSection />
    </>
  )
}
