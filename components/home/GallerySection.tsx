import Link from 'next/link'
import Image from 'next/image'
import homepageData from '@/content/homepage.json'
import { getShuffledImages } from '@/lib/getShufffledImages'

const previewImages = getShuffledImages(6)

export default function GallerySection() {
  return (
    <section className='py-20 md:py-32 bg-black'>
      <div className='container mx-auto px-4 max-w-8xl'>
        <h2 className='text-4xl sm:text-5xl md:text-6xl uppercase font-bold text-center mb-16'>
          {homepageData.galleryPreview.heading}
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12'>
          {previewImages.map((image, index) => (
            <div
              key={index}
              className='relative aspect-square overflow-hidden group'
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className='object-cover transition-transform duration-500 group-hover:scale-110'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              />
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
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
