import type { Metadata } from 'next'
import client from '@/tina/__generated__/client'
import GalleryPageClient from './gallery-client'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse the tattoo gallery at Diablo Tattoo, Rochester, Kent — a showcase of custom artwork spanning traditional, black and grey, realism, and more.',
}
import { getGalleryImages } from '@/lib/getGalleryImages'
import ContactSection from '@/components/shared/ContactSection'

const { images: galleryImages, artistNames } = getGalleryImages()

export default async function GalleryPage() {
  const galleryResult = await client.queries.gallery({ relativePath: 'gallery.json' })
  return (
    <>
      <GalleryPageClient gallery={galleryResult} artists={artistNames} images={galleryImages} />
      <ContactSection />
    </>
  )
}
