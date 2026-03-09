import type { Metadata } from 'next'
import client from '@/tina/__generated__/client'
import ArtistPageClient from './artist-client'

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const artistResult = await client.queries.artist({ relativePath: `${slug}.json` })
  const artist = artistResult.data.artist
  const firstSentence = artist.bio?.split('.')[0] ?? ''
  return {
    title: artist.name,
    description: firstSentence,
    openGraph: {
      images: artist.image ? [{ url: artist.image }] : [],
    },
  }
}

export async function generateStaticParams() {
  const artistsResult = await client.queries.artistConnection()
  const edges = artistsResult.data.artistConnection.edges ?? []

  return edges.flatMap(edge => (edge?.node?.slug ? [{ slug: edge.node.slug }] : []))
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artistResult = await client.queries.artist({ relativePath: `${slug}.json` })

  return <ArtistPageClient artist={artistResult} />
}
