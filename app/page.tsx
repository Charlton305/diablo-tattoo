import client from '@/tina/__generated__/client'
import HomeClient from './home-client'

export default async function Home() {
  const homepageResult = await client.queries.homepage({ relativePath: 'homepage.json' })
  const artistsResult = await client.queries.artists({ relativePath: 'artists.json' })

  return <HomeClient homepage={homepageResult} artists={artistsResult} />
}
