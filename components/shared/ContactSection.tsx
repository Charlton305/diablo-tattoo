import client from '@/tina/__generated__/client'
import ContactSectionClient from './ContactSectionClient'

export default async function ContactSection() {
  const result = await client.queries.contactSection({ relativePath: 'contact-section.json' })
  return <ContactSectionClient contactSection={result} />
}