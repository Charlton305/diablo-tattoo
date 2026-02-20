import Image from 'next/image'
import { tinaField } from 'tinacms/dist/react'
import type { HomepageHero } from '@/tina/__generated__/types'

interface HeroSectionProps {
  hero: HomepageHero | null | undefined
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className='relative lg:h-screen flex items-center justify-center overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-top bg-no-repeat'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/home/hero.png')`,
        }}
        role='img'
        aria-label='Exterior of Diablo Tattoo studio'
      />

      <div className='relative z-10 text-center px-4 pt-[80px] mb-[40px] lg:my-[80px]'>
        <h1>
          <Image
            src='/diablo-tattoo-logo.webp'
            alt='Diablo Tattoo - Tattoo Studio in Rochester, Kent'
            width={764}
            height={295}
            className='mb-6 fade-in'
          />
        </h1>
        <p
          className='text-xl sm:text-2xl md:text-3xl mb-6 tracking-wide fade-in-delay-1'
          data-tina-field={hero ? tinaField(hero, 'subtitle') : undefined}
        >
          {hero?.subtitle ?? ''}
        </p>
        <p
          className='text-xl sm:text-2xl md:text-4xl font-bold tracking-widest uppercase fade-in-delay-2'
          data-tina-field={hero ? tinaField(hero, 'location') : undefined}
        >
          {hero?.location ?? ''}
        </p>
      </div>
    </section>
  )
}
