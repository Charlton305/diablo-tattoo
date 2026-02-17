import client from '@/tina/__generated__/client'
import ArtistsPageClient from './artists-client'

export default async function ArtistsPage() {
  const artistsResult = await client.queries.artists({ relativePath: 'artists.json' })
  const homepageResult = await client.queries.homepage({ relativePath: 'homepage.json' })

  return <ArtistsPageClient artists={artistsResult} homepage={homepageResult} />
}
