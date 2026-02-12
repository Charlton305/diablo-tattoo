/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { wrapFieldsWithMeta } from 'tinacms'

const GalleryImagePicker = wrapFieldsWithMeta(({ input }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<{ src: string; alt: string; artist: string }[]>([])

  const loadImages = async () => {
    // Fetch artists data from Tina's GraphQL endpoint
    const res = await fetch('http://localhost:4001/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ artists(relativePath: "artists.json") { artists { name galleryImages { src alt } } } }`,
      }),
    })
    const { data } = await res.json()
    const allImages: { src: string; alt: string; artist: string }[] = []
    data.artists.artists?.forEach((artist: any) => {
      artist.galleryImages?.forEach((img: any) => {
        if (img?.src) allImages.push({ src: img.src, alt: img.alt || '', artist: artist.name })
      })
    })
    setImages(allImages)
    setIsOpen(true)
  }

  return (
    <div>
      {input.value && (
        <div className='mb-2'>
          <img
            src={input.value}
            alt=''
            className='w-full max-h-40 object-contain rounded border border-gray-200'
          />
        </div>
      )}

      <div className='flex gap-2'>
        <button
          type='button'
          onClick={loadImages}
          className='px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          {input.value ? 'Change Image' : 'Select Image'}
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '90vw',
                maxWidth: '900px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <h3 style={{ fontWeight: 600, margin: 0 }}>Select Gallery Image</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                }}
              >
                {images.map(img => (
                  <button
                    key={img.src}
                    type='button'
                    onClick={() => {
                      input.onChange(img.src)
                      setIsOpen(false)
                    }}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: 0,
                      paddingBottom: '100%',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: input.value === img.src ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                      background: '#000',
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        fontSize: '11px',
                        padding: '2px 4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {img.artist}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
})

export default GalleryImagePicker
