import Link from 'next/link'
import Image from 'next/image'

interface Artist {
  slug: string
  image: string
  imageAlt: string
  name: string
}

interface ArtistsGridProps {
  artists: Artist[]
}

export default function ArtistsGrid({ artists }: ArtistsGridProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
      {artists.map(artist => (
        <Link key={artist.slug} href={`/artists/${artist.slug}`} className='group'>
          <div className='relative aspect-[3/4] overflow-hidden mb-4'>
            <Image
              src={artist.image}
              alt={artist.imageAlt}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-110'
              sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          </div>
          <h3 className='text-2xl font-bold uppercase transition-colors'>
            <span className='relative inline-block'>
              {artist.name}
              <span className='absolute left-0 bottom-0 h-[2px] w-full bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300' />
            </span>
          </h3>
          <p className='text-sm text-gray-400 group-hover:text-white transition-colors mt-1 uppercase tracking-wider'>
            View Work
          </p>
        </Link>
      ))}
    </div>
  )
}
