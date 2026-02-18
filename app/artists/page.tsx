import client from '@/tina/__generated__/client'
import ArtistsPageClient from './artists-client'

export default async function ArtistsPage() {
  const pageResult = await client.queries.artistsPage({ relativePath: 'artists.json' })
  const artistsResult = await client.queries.artistConnection()

  return <ArtistsPageClient page={pageResult} artists={artistsResult} />
}
