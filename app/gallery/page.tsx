import client from '@/tina/__generated__/client'
import GalleryPageClient from './gallery-client'
import { getShuffledImages } from '@/lib/getShufffledImages'

const shuffledImages = getShuffledImages()

export default async function GalleryPage() {
  const galleryResult = await client.queries.gallery({ relativePath: 'gallery.json' })
  const artistsResult = await client.queries.artists({ relativePath: 'artists.json' })
  const homepageResult = await client.queries.homepage({ relativePath: 'homepage.json' })
  return (
    <GalleryPageClient
      gallery={galleryResult}
      artists={artistsResult}
      homepage={homepageResult}
      images={shuffledImages}
    />
  )
}
