'use client'

import { useTina } from 'tinacms/dist/react'
import type { HomepageQuery, ArtistsQuery } from '@/tina/__generated__/types'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import ArtistsSection from '@/components/home/ArtistsSection'
import GallerySection from '@/components/home/GallerySection'
import ContactSection from '@/components/shared/ContactSection'

interface HomeClientProps {
  homepage: {
    data: HomepageQuery
    query: string
    variables: { relativePath: string }
  }
  artists: {
    data: ArtistsQuery
    query: string
    variables: { relativePath: string }
  }
}

export default function HomeClient({ homepage, artists }: HomeClientProps) {
  const { data: homepageData } = useTina(homepage)
  const { data: artistsData } = useTina(artists)
  const homepageContent = homepageData.homepage

  const artistsList = (artistsData.artists.artists ?? [])
    .filter((a): a is NonNullable<typeof a> => a != null)
    .map(a => ({
      slug: a.slug,
      image: a.image ?? '',
      imageAlt: a.imageAlt ?? '',
      name: a.name,
    }))

  // Build a map of image src → alt text from all artists
  const altTextMap = new Map<string, string>()
  ;(artistsData.artists.artists ?? []).forEach(artist => {
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
      <GallerySection
        galleryPreviewData={homepageContent.galleryPreview}
        images={previewImages}
      />
    </>
  )
}
