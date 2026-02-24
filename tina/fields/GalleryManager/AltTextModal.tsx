// tina/fields/GalleryManager/AltTextModal.tsx
import { useState } from 'react'
import type { GalleryImage } from './index'

interface AltTextModalProps {
  image: GalleryImage
  imgSrc: (src: string) => string
  onSave: (alt: string) => void
  onClose: () => void
}

export const AltTextModal = ({ image, imgSrc, onSave, onClose }: AltTextModalProps) => {
  const [altText, setAltText] = useState(image.alt || '')

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', borderRadius: 8, padding: 20, maxWidth: 400, width: '90%' }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imgSrc(image.src)}
          alt={image.alt}
          style={{ width: '100%', borderRadius: 4, marginBottom: 12 }}
        />
        <label style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
          Alt Text
        </label>
        <textarea
          value={altText}
          onChange={e => setAltText(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid #ddd',
            borderRadius: 4,
            marginBottom: 12,
            boxSizing: 'border-box',
            fontSize: 14,
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type='button'
            onClick={() => onSave(altText)}
            style={{
              padding: '8px 16px',
              background: '#0084FF',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Save
          </button>
          <button
            type='button'
            onClick={onClose}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: '1px solid #ddd',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
