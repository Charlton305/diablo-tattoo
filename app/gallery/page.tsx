import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import GallerySection from '@/components/gallery/GallerySection'
import { getShuffledImages } from '@/lib/getShufffledImages'
import ContactSection from '@/components/shared/ContactSection'

const shuffledImages = getShuffledImages()

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className='pt-20'>
        <GallerySection images={shuffledImages} />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
