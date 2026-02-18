'use client'

import { useTina, tinaField } from 'tinacms/dist/react'
import ArtistsGrid from '@/components/shared/ArtistsGrid'

export default function ArtistsPageClient({
  page,
  artists,
}: {
  page: Awaited<
    ReturnType<typeof import('@/tina/__generated__/client').default.queries.artistsPage>
  >
  artists: Awaited<
    ReturnType<typeof import('@/tina/__generated__/client').default.queries.artistConnection>
  >
}) {
  const { data: pageData } = useTina(page)
  const { data: artistsData } = useTina(artists)

  const pageContent = pageData.artistsPage
  const artistEdges = artistsData.artistConnection.edges ?? []

  const artistsList = artistEdges
    .flatMap(edge =>
      edge?.node
        ? [
            {
              slug: edge.node.slug,
              image: edge.node.image ?? '',
              imageAlt: edge.node.imageAlt ?? '',
              name: edge.node.name,
              order: edge.node.order,
            },
          ]
        : [],
    )
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <div className='py-20'>
      <section className='py-20 bg-black'>
        <div className='container mx-auto px-4 max-w-8xl'>
          <h1
            className='text-4xl sm:text-5xl md:text-6xl text-center mb-8'
            data-tina-field={pageContent ? tinaField(pageContent, 'heading') : undefined}
          >
            {pageContent.heading}
          </h1>
          <p
            className='text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto'
            data-tina-field={pageContent ? tinaField(pageContent, 'description') : undefined}
          >
            {pageContent.description}
          </p>

          <ArtistsGrid artists={artistsList} />
        </div>
      </section>
    </div>
  )
}
