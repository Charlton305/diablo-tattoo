import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import ContactForm from '@/components/shared/ContactForm'

interface ContactSectionProps {
  contactData: {
    heading?: string | null
    description?: string | null
    formDescription?: string | null
  }
  siteData: {
    address?: string | null
    phone?: string | null
    email?: string | null
    openingHours?: Record<string, string | null> | null
  }
}

export default function ContactSection({ contactData, siteData }: ContactSectionProps) {
  console.log(siteData)
  return (
    <section className='py-20 md:py-32 bg-black'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl text-center mb-8'>
          {contactData.heading ?? ''}
        </h1>
        <p className='text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto'>
          {contactData.description ?? ''}
        </p>

        <div className='grid lg:grid-cols-2 gap-12 md:gap-16'>
          <div className='lg:order-2'>
            <h2 className='text-2xl mb-6'>Send Us a Message</h2>
            <p className='text-gray-400 mb-6'>{contactData.formDescription ?? ''}</p>

            <ContactForm variant='darker' />
          </div>

          <div className='space-y-8 lg:order-1'>
            <div>
              <h2 className='text-2xl mb-6'>Contact Details</h2>

              <div className='space-y-4'>
                <div className='flex items-start space-x-4'>
                  <MapPin className='w-6 h-6 text-accent flex-shrink-0 mt-1' />
                  <div>
                    <p className=' mb-1'>Address</p>
                    <p className='text-gray-400'>{siteData.address ?? ''}</p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <Phone className='w-6 h-6 text-accent flex-shrink-0 mt-1' />
                  <div>
                    <p className=' mb-1'>Phone</p>
                    <a
                      href={`tel:${siteData.phone ?? ''}`}
                      className='text-gray-400 hover:text-white transition-colors'
                    >
                      {siteData.phone ?? ''}
                    </a>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <Mail className='w-6 h-6 text-accent flex-shrink-0 mt-1' />
                  <div>
                    <p className=' mb-1'>Email</p>
                    <a
                      href={`mailto:${siteData.email ?? ''}`}
                      className='text-gray-400 hover:text-white transition-colors'
                    >
                      {siteData.email ?? ''}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className='text-2xl mb-6 flex items-center'>Opening Hours</h2>
              <div className='space-y-2'>
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                  day => (
                    <div key={day} className='flex justify-between py-2 border-b border-white/10'>
                      <span className='font-semibold'>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </span>
                      <span className='text-gray-400'>
                        {siteData.openingHours?.[day as keyof typeof siteData.openingHours] ?? ''}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className='aspect-video relative bg-zinc-900 overflow-hidden'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2489.8284442427694!2d0.5049946000000001!3d51.387831000000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8ccf800914b93%3A0x8315ac7fab0402e8!2s116%20High%20St%2C%20Rochester%20ME1%201JT!5e0!3m2!1sen!2suk!4v1770725852574!5m2!1sen!2suk'
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Diablo Tattoo Location'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
