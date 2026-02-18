'use client'

import { useTina } from 'tinacms/dist/react'
import GallerySection from '@/components/gallery/GallerySection'

export default function GalleryPageClient({
  gallery,
  images,
  artists,
}: {
  gallery: Awaited<ReturnType<typeof import('@/tina/__generated__/client').default.queries.gallery>>
  images: { src: string; alt: string; artist: string }[]
  artists: string[]
}) {
  const { data: galleryData } = useTina(gallery)

  return (
    <div className='pt-20'>
      <GallerySection images={images} galleryData={galleryData.gallery} artistNames={artists} />
    </div>
  )
}
