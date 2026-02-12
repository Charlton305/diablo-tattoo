'use client'

import { useTina } from 'tinacms/dist/react'
import GallerySection from '@/components/gallery/GallerySection'
import ContactSection from '@/components/shared/ContactSection'

export default function GalleryPageClient({
  gallery,
  artists,
  homepage,
  images,
}: {
  gallery: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.gallery>>
  artists: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.artists>>
  homepage: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.homepage>>
  images: { src: string; alt: string; artist: string }[]
}) {
  const { data: galleryData } = useTina(gallery)
  const { data: artistsData } = useTina(artists)
  const { data: homepageData } = useTina(homepage)

  const artistNames = (artistsData.artists.artists ?? [])
    .filter(artist => artist?.isArtist)
    .map(artist => artist!.name)

  return (
    <div className='pt-20'>
      <GallerySection
        images={images}
        heading={galleryData.gallery.heading ?? ''}
        description={galleryData.gallery.description ?? ''}
        artistNames={artistNames}
      />
      <ContactSection
        contact={{
          heading: homepageData.homepage.contact?.heading,
          description: homepageData.homepage.contact?.description,
        }}
      />
    </div>
  )
}
