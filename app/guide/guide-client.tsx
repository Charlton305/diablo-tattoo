'use client'

import { useTina } from 'tinacms/dist/react'
import type { GuideQuery, HomepageQuery } from '@/tina/__generated__/types'
import GuideSection from '@/components/guide/GuideSection'

interface GuidePageClientProps {
  guide: {
    data: GuideQuery
    query: string
    variables: { relativePath: string }
  }
  homepage: {
    data: HomepageQuery
    query: string
    variables: { relativePath: string }
  }
}

export default function GuidePageClient({ guide, homepage }: GuidePageClientProps) {
  const { data: guideData } = useTina(guide)

  return (
    <div className='pt-20'>
      <GuideSection data={guideData.guide} />
    </div>
  )
}
