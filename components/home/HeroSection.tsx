import homepageData from '@/content/homepage.json'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className='relative h-screen flex items-center justify-center overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1605647533135-51b5906087d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
        role='img'
        aria-label='Interior of Diablo Tattoo studio'
      />

      <div className='relative z-10 text-center px-4 mt-[80px]'>
        <Image
          src='/diablo-tattoo-logo.webp'
          alt='Diablo Tattoo Logo'
          width={764}
          height={295}
          className='mb-6 fade-in'
        />
        <p className='text-xl sm:text-2xl md:text-3xl mb-6 tracking-wide fade-in-delay-1'>
          {homepageData.hero.subtitle}
        </p>
        <p className='text-xl sm:text-2xl md:text-4xl font-bold tracking-widest uppercase fade-in-delay-2'>
          {homepageData.hero.location}
        </p>
      </div>
    </section>
  )
}
