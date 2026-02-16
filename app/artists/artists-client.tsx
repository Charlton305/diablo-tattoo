'use client'

import { useTina } from 'tinacms/dist/react'
import type { ArtistsQuery } from '@/tina/__generated__/types'
import ArtistsGrid from '@/components/shared/ArtistsGrid'

interface ArtistsPageClientProps {
  data: ArtistsQuery
  query: string
  variables: { relativePath: string }
}

export default function ArtistsPageClient(props: ArtistsPageClientProps) {
  const { data } = useTina(props)
  const artistsContent = data.artists

  const artists = (artistsContent.artists ?? [])
    .filter((a): a is NonNullable<typeof a> => a != null)
    .map(a => ({
      slug: a.slug,
      image: a.image ?? '',
      imageAlt: a.imageAlt ?? '',
      name: a.name,
    }))

  return (
    <div className="pt-20">
      <section className="py-20 md:py-32 bg-black">
        <div className="container mx-auto px-4 max-w-8xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-center mb-8">
            {artistsContent.heading}
          </h1>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            {artistsContent.description}
          </p>

          <ArtistsGrid artists={artists} />
        </div>
      </section>
    </div>
  )
}
