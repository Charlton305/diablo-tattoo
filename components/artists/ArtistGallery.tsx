'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  src: string
  alt: string
}

interface ArtistGalleryProps {
  images: GalleryImage[]
}

export default function ArtistGallery({ images }: ArtistGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Main image carousel
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true })

  // Thumbnail carousel — dragFree allows smooth free-scroll,
  // containScroll keeps thumbs from overscrolling past edges
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  // When main carousel changes slide, sync thumbnails
  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    const index = emblaMainApi.selectedScrollSnap()
    setSelectedIndex(index)
    emblaThumbsApi.scrollTo(index)
  }, [emblaMainApi, emblaThumbsApi])

  useEffect(() => {
    if (!emblaMainApi) return
    emblaMainApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaMainApi.off('select', onSelect)
    }
  }, [emblaMainApi, onSelect])

  return (
    <div className='space-y-4'>
      {/* Main image carousel */}
      <div className='relative max-w-5xl mx-auto'>
        <div className='overflow-hidden' ref={emblaMainRef}>
          <div className='flex items-center'>
            {images.map((image, index) => (
              <div key={index} className='flex-[0_0_100%] min-w-0 flex justify-center'>
                <img
                  src={image.src}
                  alt={image.alt}
                  className='max-h-[70vh] max-w-full object-contain'
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaMainApi?.scrollPrev()}
          className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-accent p-3 transition-colors'
          aria-label='Previous image'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>

        <button
          onClick={() => emblaMainApi?.scrollNext()}
          className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-accent p-3 transition-colors'
          aria-label='Next image'
        >
          <ChevronRight className='w-6 h-6' />
        </button>
      </div>

      {/* Mobile: image counter */}
      <p className='text-center text-white/60 text-sm md:hidden'>
        {selectedIndex + 1} / {images.length}
      </p>

      {/* Desktop: synced thumbnail carousel */}
      <div className='hidden md:flex items-center gap-2 max-w-4xl mx-auto'>
        <button
          onClick={() => emblaThumbsApi?.scrollPrev()}
          className='shrink-0 bg-black/80 hover:bg-accent p-2 transition-colors'
          aria-label='Previous thumbnails'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>

        <div className='overflow-hidden flex-1' ref={emblaThumbsRef}>
          <div className='flex gap-2'>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => emblaMainApi?.scrollTo(index)}
                className={`flex-[0_0_calc(33.333%-6px)] lg:flex-[0_0_calc(20%-6.4px)] min-w-0 relative aspect-square overflow-hidden transition-all ${
                  index === selectedIndex
                    ? 'ring-2 ring-ring opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className='absolute inset-0 w-full h-full object-cover'
                  loading='lazy'
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaThumbsApi?.scrollNext()}
          className='shrink-0 bg-black/80 hover:bg-accent p-2 transition-colors'
          aria-label='Next thumbnails'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}
