import client from '@/tina/__generated__/client'
import FAQPageClient from './faq-client'

export default async function FAQPage() {
  const faqResult = await client.queries.faq({ relativePath: 'faq.json' })
  return <FAQPageClient {...faqResult} />
}
