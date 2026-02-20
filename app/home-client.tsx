'use client'

import { useTina } from 'tinacms/dist/react'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import ArtistsSection from '@/components/home/ArtistsSection'
import GallerySection from '@/components/home/GallerySection'

export default function HomeClient({
  homepage,
  artists,
}: {
  homepage: Awaited<
    ReturnType<typeof import('@/tina/__generated__/client').default.queries.homepage>
  >
  artists: Awaited<
    ReturnType<typeof import('@/tina/__generated__/client').default.queries.artistConnection>
  >
}) {
  const { data: homepageData } = useTina(homepage)
  const homepageContent = homepageData.homepage
  const artistEdges = artists.data.artistConnection.edges ?? []

  const artistsList = artistEdges
    .flatMap(edge =>
      edge?.node
        ? [
            {
              slug: edge.node.slug,
              image: edge.node.image ?? '',
              imageAlt: edge.node.imageAlt ?? '',
              name: edge.node.name,
              galleryImages: edge.node.galleryImages ?? [],
              order: edge.node.order,
            },
          ]
        : [],
    )
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  // Build a map of image src → alt text from all artists
  const altTextMap = new Map<string, string>()
  ;(artistsList ?? []).forEach(artist => {
    if (!artist?.galleryImages) return
    artist.galleryImages.forEach(img => {
      if (img?.src && img?.alt) {
        altTextMap.set(img.src, img.alt)
      }
    })
  })

  const galleryPreview = homepageContent.galleryPreview
  const previewImages = [
    galleryPreview?.image1,
    galleryPreview?.image2,
    galleryPreview?.image3,
    galleryPreview?.image4,
    galleryPreview?.image5,
    galleryPreview?.image6,
  ]
    .filter((src): src is string => typeof src === 'string' && src !== '')
    .map(src => ({
      src,
      alt: altTextMap.get(src) ?? 'Tattoo by Diablo Tattoo',
    }))

  return (
    <>
      <HeroSection hero={homepageContent.hero} />
      <AboutSection about={homepageContent.about} />
      <ArtistsSection artistsData={homepageContent.artists} artists={artistsList} />
      <GallerySection galleryPreviewData={homepageContent.galleryPreview} images={previewImages} />
    </>
  )
}
