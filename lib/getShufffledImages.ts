// lib/getShuffledImages.ts
import artistsContent from '@/content/artists.json'

export function getShuffledImages(count?: number) {
  const images = artistsContent.artists
    .filter(artist => artist.isArtist && artist.galleryImages?.length)
    .flatMap(artist =>
      artist.galleryImages.map(image => ({
        ...image,
        artist: artist.name,
      }))
    )
    .sort(() => Math.random() - 0.5)

  return count ? images.slice(0, count) : images
}