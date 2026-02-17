import Image from 'next/image'
import { tinaField } from 'tinacms/dist/react'
import type { HomepageAbout } from '@/tina/__generated__/types'

interface AboutSectionProps {
  about: HomepageAbout | null | undefined
}

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <section className='py-20 md:py-32 bg-black'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        <div className='grid md:grid-cols-2 gap-12 md:gap-16'>
          <div
            className='relative min-h-[500px] md:min-h-[600px] overflow-hidden'
            data-tina-field={about ? tinaField(about, 'image') : undefined}
          >
            <Image
              src={about?.image ?? ''}
              alt={about?.imageAlt ?? ''}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>

          <div className='flex flex-col'>
            <h2
              className='text-4xl sm:text-5xl md:text-6xl mb-4'
              data-tina-field={about ? tinaField(about, 'heading') : undefined}
            >
              {about?.heading ?? ''}
            </h2>
            <div
              className='space-y-4 text-lg leading-relaxed text-gray-300'
              data-tina-field={about ? tinaField(about, 'text') : undefined}
            >
              {(about?.text ?? '').split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
