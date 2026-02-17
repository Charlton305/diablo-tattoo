'use client'

import { useTina } from 'tinacms/dist/react'
import GallerySection from '@/components/gallery/GallerySection'

export default function GalleryPageClient({
  gallery,
  artists,
  images,
}: {
  gallery: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.gallery>>
  artists: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.artists>>
  images: { src: string; alt: string; artist: string }[]
}) {
  const { data: galleryData } = useTina(gallery)
  const { data: artistsData } = useTina(artists)

  const artistNames = (artistsData.artists.artists ?? [])
    .filter(artist => artist?.isArtist)
    .map(artist => artist!.name)

  return (
    <div className='pt-20'>
      <GallerySection
        images={images}
        galleryData={galleryData.gallery}
        artistNames={artistNames}
      />
    </div>
  )
}
