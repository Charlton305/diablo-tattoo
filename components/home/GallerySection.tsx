import Link from 'next/link'
import Image from 'next/image'
import { tinaField } from 'tinacms/dist/react'
import type { HomepageGalleryPreview } from '@/tina/__generated__/types'

interface GallerySectionProps {
  galleryPreviewData: HomepageGalleryPreview | null | undefined
  images: { src: string; alt: string }[]
}

export default function GallerySection({ galleryPreviewData, images }: GallerySectionProps) {
  return (
    <section className='py-20 md:py-32 bg-black'>
      <div className='container mx-auto px-4 max-w-8xl'>
        <h2
          className='text-4xl sm:text-5xl md:text-6xl uppercase text-center mb-16'
          data-tina-field={
            galleryPreviewData ? tinaField(galleryPreviewData, 'heading') : undefined
          }
        >
          {galleryPreviewData?.heading ?? ''}
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12'>
          {images.map((image, index) => (
            <div
              key={index}
              className='relative aspect-square overflow-hidden group'
              data-tina-field={
                galleryPreviewData
                  ? tinaField(galleryPreviewData, `image${index + 1}` as any)
                  : undefined
              }
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className='object-cover transition-transform duration-500 sm:group-hover:scale-110'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              />
              <div className='absolute inset-0 bg-black/50 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300' />
            </div>
          ))}
        </div>

        <div className='text-center'>
          <Link
            href='/gallery'
            className='inline-block px-8 py-3 bg-accent hover:bg-accent transition-colors uppercase tracking-wider font-semibold'
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  )
}
