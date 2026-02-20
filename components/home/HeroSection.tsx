{
  /* eslint-disable-next-line @next/next/no-img-element */
}
import Image from 'next/image'
import { tinaField } from 'tinacms/dist/react'
import type { HomepageHero } from '@/tina/__generated__/types'

interface HeroSectionProps {
  hero: HomepageHero | null | undefined
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className='relative lg:h-screen flex items-center justify-center overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src='/images/home/hero-1280.jpg'
          srcSet='/images/home/hero-480.webp 480w, /images/home/hero-768.webp 768w, /images/home/hero-1280.webp 1280w'
          sizes='100vw'
          alt='Exterior of Diablo Tattoo studio'
          className='absolute inset-0 w-full h-full object-cover object-top'
        />
        <div className='absolute inset-0 bg-black/60' />
      </div>

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
