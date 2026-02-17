import client from '@/tina/__generated__/client'
import GalleryPageClient from './gallery-client'
import { getShuffledImages } from '@/lib/getShufffledImages'
import ContactSection from '@/components/shared/ContactSection'

const shuffledImages = getShuffledImages()

export default async function GalleryPage() {
  const galleryResult = await client.queries.gallery({ relativePath: 'gallery.json' })
  const artistsResult = await client.queries.artists({ relativePath: 'artists.json' })
  return (
    <>
      <GalleryPageClient gallery={galleryResult} artists={artistsResult} images={shuffledImages} />
      <ContactSection />
    </>
  )
}
