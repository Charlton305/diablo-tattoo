import client from '@/tina/__generated__/client'
import HomeClient from './home-client'
import ContactSection from '@/components/shared/ContactSection'

export default async function Home() {
  const homepageResult = await client.queries.homepage({ relativePath: 'homepage.json' })
  const artistsResult = await client.queries.artistConnection()

  return (
    <>
      <HomeClient homepage={homepageResult} artists={artistsResult} />
      <ContactSection />
    </>
  )
}