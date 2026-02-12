'use client'

import { useTina } from 'tinacms/dist/react'
import type { GuideQuery, HomepageQuery } from '@/tina/__generated__/types'
import GuideSection from '@/components/guide/GuideSection'
import ContactSection from '@/components/shared/ContactSection'

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
  const { data: homepageData } = useTina(homepage)

  return (
    <div className="pt-20">
      <GuideSection data={guideData.guide} />
      <ContactSection contact={homepageData.homepage.contact} />
    </div>
  )
}
