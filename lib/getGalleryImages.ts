import fs from 'fs'
import path from 'path'

const artistsDir = path.join(process.cwd(), 'content/artists')
const files = fs.readdirSync(artistsDir)

interface Artist {
  name: string
  isArtist: boolean
  order?: number
  galleryImages?: { src: string; alt: string }[]
}

interface GetGalleryImagesResult {
  images: { src: string; alt: string; artist: string }[]
  artistNames: string[]
}

const artists: Artist[] = files
  .filter(file => file.endsWith('.json'))
  .map(file => {
    const content = fs.readFileSync(path.join(artistsDir, file), 'utf-8')
    return JSON.parse(content)
  })

export function getGalleryImages(count?: number): GetGalleryImagesResult {
  const artistsWithImages = artists.filter(
    artist => artist.isArtist && artist.galleryImages?.length
  ).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  const artistNames = artistsWithImages.map(a => a.name)

  const allImages = artistsWithImages.flatMap(artist =>
    (artist.galleryImages ?? []).map((image: { src: string; alt: string }) => ({
      ...image,
      artist: artist.name,
    }))
  )

  // Dedupe by src (keeps first occurrence)
  const uniqueImages = allImages.filter(
    (img, index, arr) => arr.findIndex(i => i.src === img.src) === index
  )

  const shuffled = uniqueImages.sort(() => Math.random() - 0.5)
  const images = count ? shuffled.slice(0, count) : shuffled

  return { images, artistNames }
}