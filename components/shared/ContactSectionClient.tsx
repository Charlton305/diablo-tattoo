'use client'

import { useTina, tinaField } from 'tinacms/dist/react'
import type { ContactSectionQuery } from '@/tina/__generated__/types'
import ContactForm from '@/components/shared/ContactForm'

interface ContactSectionClientProps {
  contactSection: {
    data: ContactSectionQuery
    query: string
    variables: { relativePath: string }
  }
}

export default function ContactSectionClient({ contactSection }: ContactSectionClientProps) {
  const { data } = useTina(contactSection)
  const contact = data.contactSection

  return (
    <section className='py-20 md:py-32 bg-zinc-950'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        <div className='grid md:grid-cols-2 gap-12 md:gap-16'>
          <div className='space-y-6'>
            <h2
              className='text-4xl sm:text-5xl md:text-6xl mb-8'
              data-tina-field={contact ? tinaField(contact, 'heading') : undefined}
            >
              {contact?.heading ?? ''}
            </h2>
            <div
              className='space-y-4 text-lg leading-relaxed text-gray-300'
              data-tina-field={contact ? tinaField(contact, 'description') : undefined}
            >
              {(contact?.description ?? '').split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
