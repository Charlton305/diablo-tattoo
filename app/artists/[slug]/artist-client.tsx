'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { useTina, tinaField } from 'tinacms/dist/react'
import type { ArtistsQuery } from '@/tina/__generated__/types'
import ArtistGallery from '@/components/artists/ArtistGallery'
import LinkButton from '@/components/shared/LinkButton'

interface ArtistPageClientProps {
  data: ArtistsQuery
  query: string
  variables: { relativePath: string }
  slug: string
}

export default function ArtistPageClient(props: ArtistPageClientProps) {
  const { slug } = props
  const { data } = useTina(props)
  const artist = (data.artists.artists ?? []).find(a => a?.slug === slug)
  
  if (!artist) {
    return null
  }

  const buttonText = artist.isArtist ? `Book with ${artist.name}` : 'Get in touch'

  const galleryImages = (artist.galleryImages ?? [])
    .filter((img): img is NonNullable<typeof img> => img != null)
    .map(img => ({
      src: img.src ?? '',
      alt: img.alt ?? '',
    }))

  return (
    <div className='pt-12'>
      <section className='py-20 bg-black'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
          <Link
            href='/artists'
            className='inline-flex items-center text-lg text-gray-400 hover:text-white group transition-colors mb-8'
          >
            <ChevronLeft className='w-4 h-4 mr-1 group-hover:mr-2 transition-all' />
            Back to Artists
          </Link>

          <div className='grid md:grid-cols-2 gap-12 md:gap-16 mb-16'>
            <div
              className='relative aspect-[3/4] overflow-hidden'
              data-tina-field={artist ? tinaField(artist, 'image') : undefined}
            >
              {artist.image && (
                <Image
                  src={artist.image}
                  alt={artist.imageAlt ?? ''}
                  fill
                  className='object-cover'
                />
              )}
            </div>

            <div className='space-y-6'>
              <h1
                className='text-4xl sm:text-4xL font-semibold uppercase md:text-5xl'
                data-tina-field={artist ? tinaField(artist, 'name') : undefined}
              >
                {artist.name}
              </h1>
              <p
                className='text-lg leading-relaxed text-gray-300 whitespace-pre-line'
                data-tina-field={artist ? tinaField(artist, 'bio') : undefined}
              >
                {artist.bio}
              </p>

              <LinkButton href='/contact'>{buttonText}</LinkButton>
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div className='space-y-8'>
              <h2 className='text-3xl sm:text-4xl text-center'>{artist.name}&apos;s work</h2>
              <ArtistGallery
                key={galleryImages.map(img => img.src).join(',')}
                images={galleryImages}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
