import client from '@/tina/__generated__/client'
import GuidePageClient from './guide-client'

export default async function GuidePage() {
  const guideResult = await client.queries.guide({ relativePath: 'guide.json' })
  const homepageResult = await client.queries.homepage({ relativePath: 'homepage.json' })
  return <GuidePageClient guide={guideResult} homepage={homepageResult} />
}
