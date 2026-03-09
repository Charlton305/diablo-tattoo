import type { Metadata } from 'next'
import client from '@/tina/__generated__/client'
import ArtistsPageClient from './artists-client'

export const metadata: Metadata = {
  title: 'Our Artists',
  description: 'Meet the talented tattoo artists at Diablo Tattoo in Rochester, Kent. Each artist brings a unique style and years of experience to every piece.',
}

export default async function ArtistsPage() {
  const pageResult = await client.queries.artistsPage({ relativePath: 'artists.json' })
  const artistsResult = await client.queries.artistConnection()

  return <ArtistsPageClient page={pageResult} artists={artistsResult} />
}
