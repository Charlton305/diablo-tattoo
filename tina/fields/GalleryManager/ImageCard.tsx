// tina/fields/GalleryManager/ImageCard.tsx
import type { GalleryImage } from './index'

interface ImageCardProps {
  image: GalleryImage
  index: number
  total: number
  isDeleting: boolean
  isPending: boolean
  imgSrc: (src: string) => string
  onView: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDeleteRequest: () => void
  onDeleteConfirm: () => void
  onDeleteCancel: () => void
}

export const ImageCard = ({
  image,
  index,
  total,
  isDeleting,
  isPending,
  imgSrc,
  onView,
  onMoveUp,
  onMoveDown,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: ImageCardProps) => (
  <div
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: 6,
      overflow: 'hidden',
      background: 'white',
      position: 'relative',
    }}
  >
    {isPending && (
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          background: '#0084FF',
          color: 'white',
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: 3,
          zIndex: 1,
        }}
      >
        NEW
      </div>
    )}

    <button
      type='button'
      onClick={onView}
      style={{
        display: 'block',
        width: '100%',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
      }}
    >
      <img
        src={imgSrc(image.src)}
        alt={image.alt}
        style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
      />
    </button>

    <div style={{ padding: '6px 8px', borderTop: '1px solid #f3f4f6' }}>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: image.alt ? '#374151' : '#9ca3af',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {image.alt || 'No alt text'}
      </p>
    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 8px',
        borderTop: '1px solid #f3f4f6',
      }}
    >
      <div style={{ display: 'flex', gap: 2 }}>
        <button
          type='button'
          onClick={onMoveUp}
          disabled={index === 0}
          title='Move left'
          style={{
            background: 'none',
            border: '1px solid #e5e7eb',
            borderRadius: 3,
            padding: '2px 4px',
            cursor: index === 0 ? 'default' : 'pointer',
            opacity: index === 0 ? 0.3 : 1,
          }}
        >
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#666' strokeWidth='2'>
            <polyline points='15 18 9 12 15 6' />
          </svg>
        </button>
        <button
          type='button'
          onClick={onMoveDown}
          disabled={index === total - 1}
          title='Move right'
          style={{
            background: 'none',
            border: '1px solid #e5e7eb',
            borderRadius: 3,
            padding: '2px 4px',
            cursor: index === total - 1 ? 'default' : 'pointer',
            opacity: index === total - 1 ? 0.3 : 1,
          }}
        >
          <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#666' strokeWidth='2'>
            <polyline points='9 18 15 12 9 6' />
          </svg>
        </button>
      </div>
      <button
        type='button'
        onClick={onDeleteRequest}
        title='Delete'
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
      >
        <svg
          width='14'
          height='14'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#dc2626'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='3 6 5 6 21 6' />
          <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
        </svg>
      </button>
    </div>

    {isDeleting && (
      <div
        style={{
          padding: 8,
          background: '#fef2f2',
          borderTop: '1px solid #fecaca',
          display: 'flex',
          gap: 6,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: '#dc2626', flex: 1 }}>Delete?</span>
        <button
          type='button'
          onClick={onDeleteConfirm}
          style={{
            padding: '3px 8px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 3,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Yes
        </button>
        <button
          type='button'
          onClick={onDeleteCancel}
          style={{
            padding: '3px 8px',
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: 3,
            cursor: 'pointer',
            fontSize: 11,
          }}
        >
          No
        </button>
      </div>
    )}
  </div>
)
