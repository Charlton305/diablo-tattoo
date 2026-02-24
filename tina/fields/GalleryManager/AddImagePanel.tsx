// tina/fields/GalleryManager/AddImagePanel.tsx
interface AddImagePanelProps {
  showFileInput: boolean
  pendingSrc: string
  newAlt: string
  imgSrc: (src: string) => string
  onShowFileInput: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAltChange: (alt: string) => void
  onAdd: () => void
  onCancel: () => void
}

export const AddImagePanel = ({
  showFileInput,
  pendingSrc,
  newAlt,
  imgSrc,
  onShowFileInput,
  onFileSelect,
  onAltChange,
  onAdd,
  onCancel,
}: AddImagePanelProps) => {
  if (!showFileInput) {
    return (
      <button
        type='button'
        onClick={onShowFileInput}
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
        + Add Image
      </button>
    )
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, padding: 16, background: '#f9fafb' }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600 }}>New Image</h3>

      {!pendingSrc ? (
        <input
          type='file'
          accept='image/*'
          style={{ marginBottom: 12, display: 'block' }}
          onChange={onFileSelect}
        />
      ) : (
        <img
          src={imgSrc(pendingSrc)}
          style={{ maxWidth: 240, borderRadius: 4, marginBottom: 12, display: 'block' }}
        />
      )}

      {pendingSrc && (
        <>
          <label style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'block' }}>
            Alt Text{' '}
            <span style={{ color: '#6b7280', fontWeight: 400 }}>
              (e.g. Japanese sleeve tattoo by Ray)
            </span>
          </label>
          <input
            type='text'
            value={newAlt}
            onChange={e => onAltChange(e.target.value)}
            placeholder='Describe the tattoo...'
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #ddd',
              borderRadius: 4,
              marginBottom: 12,
              boxSizing: 'border-box',
              fontSize: 14,
            }}
          />
        </>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {pendingSrc && (
          <button
            type='button'
            onClick={onAdd}
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
            Add to Gallery
          </button>
        )}
        <button
          type='button'
          onClick={onCancel}
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
  )
}
