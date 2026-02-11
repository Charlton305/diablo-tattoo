import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import ArtistGallery from '@/components/artists/ArtistGallery'
import artistsContent from '@/content/artists.json'
import LinkButton from '@/components/shared/LinkButton'

export const dynamicParams = false

export async function generateStaticParams() {
  return artistsContent.artists.map(artist => ({
    slug: artist.slug,
  }))
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const artist = artistsContent.artists.find(a => a.slug === slug)!

  const buttonText = artist.isArtist ? `Book with ${artist.name}` : 'Get in touch'

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
                <Image src={artist.image} alt={artist.imageAlt} fill className='object-cover' />
              </div>

              <div className='space-y-6'>
                <h1 className='text-4xl sm:text-4xL uppercase md:text-5xl font-bold'>{artist.name}</h1>
                <p className='text-lg leading-relaxed text-gray-300 whitespace-pre-line'>
                  {artist.bio}
                </p>

                <LinkButton href='/contact'>{buttonText}</LinkButton>
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
