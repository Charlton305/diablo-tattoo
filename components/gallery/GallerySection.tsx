'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import galleryData from '@/content/gallery.json';

export default function GallerySection() {
  const [selectedArtist, setSelectedArtist] = useState(galleryData.filterLabel);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const artists = [
    galleryData.filterLabel,
    ...Array.from(new Set(galleryData.items.map((item) => item.artist))),
  ];

  const filteredImages =
    selectedArtist === galleryData.filterLabel
      ? galleryData.items
      : galleryData.items.filter((img) => img.artist === selectedArtist);

  return (
    <>
      <section className="py-20 md:py-32 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-8">
            {galleryData.heading}
          </h1>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            {galleryData.description}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {artists.map((artist) => (
              <button
                key={artist}
                onClick={() => setSelectedArtist(artist)}
                className={`px-6 py-2 uppercase tracking-wider text-sm transition-all ${
                  selectedArtist === artist
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {artist}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square overflow-hidden group cursor-pointer"
                onClick={() => setLightboxImage(index)}
              >
                <Image
                  src={image.image}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-lg font-semibold">
                      {image.artist}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-red-600 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={filteredImages[lightboxImage].image}
              alt={filteredImages[lightboxImage].alt}
              fill
              className="object-contain"
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
            <p className="text-lg">
              {lightboxImage + 1} / {filteredImages.length}
            </p>
            <p className="text-sm text-gray-400">
              By {filteredImages[lightboxImage].artist}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
