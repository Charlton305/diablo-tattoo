import client from '@/tina/__generated__/client'
import ArtistsPageClient from './artists-client'

export default async function ArtistsPage() {
  const result = await client.queries.artists({ relativePath: 'artists.json' })

  return <ArtistsPageClient {...result} />
}
