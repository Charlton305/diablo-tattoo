import { useState } from 'react'
import { useCMS } from 'tinacms'

export const GalleryManager = ({ input, field, form }: any) => {
  const cms = useCMS()
  const images: { src: string; alt: string }[] = input.value || []
  const [isAdding, setIsAdding] = useState(false)
  const [newAlt, setNewAlt] = useState('')
  const [newSrc, setNewSrc] = useState('')
  const [viewingIndex, setViewingIndex] = useState<number | null>(null)
  const [viewAlt, setViewAlt] = useState('')
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  const getArtistSlug = () => {
    const match = input.name.match(/artists\.(\d+)/)
    const artistIndex = match ? parseInt(match[1]) : null
    const state = form.getState()
    return artistIndex !== null ? state.values?.artists?.[artistIndex]?.slug : null
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const slug = getArtistSlug()
      const [uploaded] = await cms.media.persist([
        { directory: slug ? `artists/${slug}` : 'artists', file },
      ])
      setNewSrc(uploaded.src || '')
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  const handleSave = () => {
    if (!newSrc) return
    input.onChange([...images, { src: newSrc, alt: newAlt }])
    setNewSrc('')
    setNewAlt('')
    setIsAdding(false)
  }

  const handleCancel = () => {
    setNewSrc('')
    setNewAlt('')
    setIsAdding(false)
  }

  const handleDelete = (index: number) => {
    input.onChange(images.filter((_, i) => i !== index))
    setDeletingIndex(null)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updated = [...images]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    input.onChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return
    const updated = [...images]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    input.onChange(updated)
  }

  const handleViewOpen = (index: number) => {
    setViewAlt(images[index].alt || '')
    setViewingIndex(index)
  }

  const handleViewSave = () => {
    if (viewingIndex === null) return
    const updated = images.map((img, i) =>
      i === viewingIndex ? { ...img, alt: viewAlt } : img
    )
    input.onChange(updated)
    setViewingIndex(null)
    setViewAlt('')
  }

  const handleViewClose = () => {
    setViewingIndex(null)
    setViewAlt('')
  }

  const imgSrc = (src: string) => (src?.startsWith('/') ? src : `/${src}`)

  return (
    <div style={{ overflow: 'hidden' }}>
      <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>{field.label}</label>

      {/* Add image UI */}
      {isAdding ? (
        <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 12, marginBottom: 12 }}>
          <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Image</label>
          {newSrc ? (
            <img
              src={imgSrc(newSrc)}
              style={{ maxWidth: 200, borderRadius: 4, marginBottom: 16 }}
            />
          ) : (
            <input
              type='file'
              accept='image/*'
              style={{ marginBottom: 16 }}
              onChange={handleUpload}
            />
          )}

          <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>
            Alt Text (e.g. Japanese sleeve tattoo)
          </label>
          <input
            type='text'
            value={newAlt}
            onChange={e => setNewAlt(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #ddd',
              borderRadius: 4,
              marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type='button'
              onClick={handleSave}
              disabled={!newSrc}
              style={{
                padding: '8px 16px',
                background: newSrc ? '#0084FF' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: newSrc ? 'pointer' : 'default',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Add to Gallery
            </button>
            <button
              type='button'
              onClick={handleCancel}
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
      ) : (
        <button
          type='button'
          onClick={() => setIsAdding(true)}
          style={{
            padding: '8px 16px',
            background: '#0084FF',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Add Image
        </button>
      )}

      {/* Image detail overlay */}
      {viewingIndex !== null && images[viewingIndex] && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={handleViewClose}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 8,
              padding: 20,
              maxWidth: 400,
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={imgSrc(images[viewingIndex].src)}
              alt={images[viewingIndex].alt}
              style={{
                width: '100%',
                borderRadius: 4,
                marginBottom: 16,
              }}
            />

            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block', fontSize: 14 }}>
              Alt Text
            </label>
            <textarea
              value={viewAlt}
              onChange={e => setViewAlt(e.target.value)}
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
                onClick={handleViewSave}
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
                onClick={handleViewClose}
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
      )}

      {/* Image list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {images.map((img, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              {/* Reorder buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                <button
                  type='button'
                  onClick={() => handleMoveUp(i)}
                  disabled={i === 0}
                  title='Move up'
                  style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    borderRadius: 3,
                    cursor: i === 0 ? 'default' : 'pointer',
                    padding: 2,
                    opacity: i === 0 ? 0.3 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='#666' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <polyline points='18 15 12 9 6 15' />
                  </svg>
                </button>
                <button
                  type='button'
                  onClick={() => handleMoveDown(i)}
                  disabled={i === images.length - 1}
                  title='Move down'
                  style={{
                    background: 'none',
                    border: '1px solid #ddd',
                    borderRadius: 3,
                    cursor: i === images.length - 1 ? 'default' : 'pointer',
                    padding: 2,
                    opacity: i === images.length - 1 ? 0.3 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='#666' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <polyline points='6 9 12 15 18 9' />
                  </svg>
                </button>
              </div>

              <button
                type='button'
                onClick={() => handleViewOpen(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <img
                  src={imgSrc(img.src)}
                  alt={img.alt}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                    borderRadius: 4,
                    display: 'block',
                  }}
                />
              </button>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: img.alt ? '#333' : '#999',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    maxWidth: '100%',
                  }}
                >
                  {img.alt || 'No alt text'}
                </div>
              </div>
              <button
                type='button'
                onClick={() => setDeletingIndex(i)}
                title='Delete image'
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  flexShrink: 0,
                }}
              >
                <svg
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='#dc2626'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <polyline points='3 6 5 6 21 6' />
                  <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
                  <line x1='10' y1='11' x2='10' y2='17' />
                  <line x1='14' y1='11' x2='14' y2='17' />
                </svg>
              </button>
            </div>

            {/* Delete confirmation */}
            {deletingIndex === i && (
              <div
                style={{
                  marginTop: 8,
                  marginLeft: 94,
                  padding: 8,
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 12, color: '#dc2626' }}>Delete this image?</span>
                <button
                  type='button'
                  onClick={() => handleDelete(i)}
                  style={{
                    padding: '4px 10px',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
                <button
                  type='button'
                  onClick={() => setDeletingIndex(null)}
                  style={{
                    padding: '4px 10px',
                    background: 'none',
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}