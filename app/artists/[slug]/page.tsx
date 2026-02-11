import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ArtistGallery from '@/components/artists/ArtistGallery'
import artistsContent from '@/content/artists.json'

export function generateStaticParams() {
  return artistsContent.artists.map(artist => ({
    slug: artist.slug,
  }))
}

export default function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = artistsContent.artists.find(a => a.slug === params.slug)

  if (!artist) {
    return (
      <>
        <Header />
        <main className='pt-20 min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold mb-4'>Artist Not Found</h1>
            <Link href='/artists' className='text-accent hover:underline'>
              Back to Artists
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className='pt-20'>
        <section className='py-20 md:py-32 bg-black'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
            <Link
              href='/artists'
              className='inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8'
            >
              <ChevronLeft className='w-4 h-4 mr-1' />
              Back to Artists
            </Link>

            <div className='grid md:grid-cols-2 gap-12 md:gap-16 mb-16'>
              <div className='relative aspect-[3/4] overflow-hidden'>
                <Image
                  src={artist.image}
                  alt={artist.imageAlt}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
              </div>

              <div className='space-y-6'>
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold'>{artist.name}</h1>
                <p className='text-lg leading-relaxed text-gray-300 whitespace-pre-line'>
                  {artist.bio}
                </p>

                <Link
                  href='/contact'
                  className='inline-block px-8 py-3 bg-accent hover:bg-accent transition-colors uppercase tracking-wider font-semibold mt-4'
                >
                  Book with {artist.name}
                </Link>
              </div>
            </div>

            {artist.galleryImages && artist.galleryImages.length > 0 && (
              <div className='space-y-8'>
                <h2 className='text-3xl sm:text-4xl font-bold text-center'>{artist.name}'s work</h2>
                <ArtistGallery images={artist.galleryImages} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
