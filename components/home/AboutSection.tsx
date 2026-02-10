import Image from 'next/image';
import homepageData from '@/content/homepage.json';

export default function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="relative min-h-[500px] md:min-h-[600px] overflow-hidden">
            <h2 className="absolute top-8 left-8 text-4xl sm:text-5xl md:text-6xl z-10 max-w-[80%]">
              {homepageData.about.heading}
            </h2>
            <Image
              src={homepageData.about.image}
              alt={homepageData.about.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex items-center">
            <div className="space-y-4 text-lg leading-relaxed text-gray-300">
              {homepageData.about.text.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
