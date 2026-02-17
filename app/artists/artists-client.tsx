'use client'

import { useTina, tinaField } from 'tinacms/dist/react'
import ArtistsGrid from '@/components/shared/ArtistsGrid'

export default function ArtistsPageClient({
  artists,
  homepage,
}: {
  artists: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.artists>>
  homepage: Awaited<
    ReturnType<typeof import('@/tina/__generated__/client').default.queries.homepage>
  >
}) {
  const { data: artistsData } = useTina(artists)
  const { data: homepageData } = useTina(homepage)

  const artistsContent = artistsData.artists

  const artistsList = (artistsContent.artists ?? [])
    .filter((a): a is NonNullable<typeof a> => a != null)
    .map(a => ({
      slug: a.slug,
      image: a.image ?? '',
      imageAlt: a.imageAlt ?? '',
      name: a.name,
    }))

  return (
    <div className='py-20'>
      <section className='py-20 bg-black'>
        <div className='container mx-auto px-4 max-w-8xl'>
          <h1
            className='text-4xl sm:text-5xl md:text-6xl text-center mb-8'
            data-tina-field={artistsContent ? tinaField(artistsContent, 'heading') : undefined}
          >
            {artistsContent.heading}
          </h1>
          <p
            className='text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto'
            data-tina-field={artistsContent ? tinaField(artistsContent, 'description') : undefined}
          >
            {artistsContent.description}
          </p>

          <ArtistsGrid artists={artistsList} />
        </div>
      </section>
    </div>
  )
}
