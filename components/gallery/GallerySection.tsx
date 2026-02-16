'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

export default function GallerySection({
  images,
  heading,
  description,
  artistNames,
}: {
  images: { src: string; alt: string; artist: string }[]
  heading: string
  description: string
  artistNames: string[]
}) {
  const [selectedArtist, setSelectedArtist] = useState('All')
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)

  const artists = ['All', ...artistNames]

  const filteredImages =
    selectedArtist === 'All' ? images : images.filter(img => img.artist === selectedArtist)

  return (
    <>
      <section className='py-20 bg-black'>
        <div className='container mx-auto px-4 max-w-8xl'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl text-center mb-8'>
            {heading}
          </h1>
          <p className='text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto'>
            {description}
          </p>

          <div className='flex flex-wrap justify-center gap-3 mb-12'>
            {artists.map(artist => (
              <button
                key={artist}
                onClick={() => setSelectedArtist(artist)}
                className={`px-6 py-2 uppercase tracking-wider text-sm transition-all ${
                  selectedArtist === artist
                    ? 'bg-accent text-white'
                    : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {artist}
              </button>
            ))}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredImages.map((image, index) => (
              <div
                key={image.src}
                className='relative aspect-square overflow-hidden group cursor-pointer'
                onClick={() => setLightboxImage(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                />
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <div className='text-center'>
                    <p className='text-white text-lg font-semibold'>{image.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxImage !== null && (
        <div
          className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4'
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className='absolute top-4 right-4 text-white hover:text-accent transition-colors'
            aria-label='Close lightbox'
          >
            <X className='w-8 h-8' />
          </button>

          <div className='relative max-w-5xl max-h-[90vh] w-full h-full'>
            <Image
              src={filteredImages[lightboxImage].src}
              alt={filteredImages[lightboxImage].alt}
              fill
              className='object-contain'
              sizes='100vw'
              onClick={e => e.stopPropagation()}
            />
          </div>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center'>
            <p className='text-sm text-gray-400'>By {filteredImages[lightboxImage].artist}</p>
          </div>
        </div>
      )}
    </>
  )
}
