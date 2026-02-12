import client from '@/tina/__generated__/client'
import ArtistPageClient from './artist-client'
import artistsContent from '@/content/artists.json'

export const dynamicParams = false

export async function generateStaticParams() {
  return artistsContent.artists.map(artist => ({
    slug: artist.slug,
  }))
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const result = await client.queries.artists({ relativePath: 'artists.json' })

  return <ArtistPageClient {...result} slug={slug} />
}
