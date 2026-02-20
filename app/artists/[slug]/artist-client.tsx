'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTina, tinaField, useEditState } from 'tinacms/dist/react'
import { ChevronLeft } from 'lucide-react'
import ArtistGallery from '@/components/artists/ArtistGallery'
import LinkButton from '@/components/shared/LinkButton'

interface ArtistPageClientProps {
  artist: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.artist>>
}

function resolveImageSrc(src: string): string {
  if (!src) return ''
  if (src.startsWith('https://assets.tina.io/')) {
    const parts = src.split('/')
    return '/' + parts.slice(4).join('/')
  }
  return src
}

export default function ArtistPageClient({ artist: artistProps }: ArtistPageClientProps) {
  const { data } = useTina(artistProps)
  const artist = data.artist

  const buttonText = artist.isArtist ? `Book with ${artist.name}` : 'Get in touch'

  const { edit } = useEditState()
console.log(edit)
  const galleryImages = (artist.galleryImages ?? [])
    .filter((img): img is NonNullable<typeof img> => img != null)
    .map(img => ({
      src: edit ? img.src ?? '' : resolveImageSrc(img.src ?? ''),
      alt: img.alt ?? '',
    }))
console.log(galleryImages)
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
              data-tina-field={tinaField(artist, 'image')}
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
                data-tina-field={tinaField(artist, 'name')}
              >
                {artist.name}
              </h1>
              <p
                className='text-lg leading-relaxed text-gray-300 whitespace-pre-line'
                data-tina-field={tinaField(artist, 'bio')}
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
