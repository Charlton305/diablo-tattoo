// tina/fields/GalleryManager/FullscreenView.tsx
import { AddImagePanel } from './AddImagePanel'
import { ImageGrid } from './ImageGrid'
import { AltTextModal } from './AltTextModal'
import type { GalleryImage } from './index'

type SaveStatus = 'idle' | 'success' | 'error'

interface FullscreenViewProps {
  localImages: GalleryImage[]
  pendingFiles: Map<string, File>
  previewUrls: Map<string, string>
  showFileInput: boolean
  pendingSrc: string
  newAlt: string
  viewingIndex: number | null
  deletingIndex: number | null
  isSaving: boolean
  saveStatus: SaveStatus
  hasChanges: boolean
  hasPendingFiles: boolean
  imgSrc: (src: string) => string
  onClose: () => void
  onSave: () => void
  onShowFileInput: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAddToGallery: () => void
  onCancelAdd: () => void
  onNewAltChange: (alt: string) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onDelete: (index: number) => void
  onViewOpen: (index: number) => void
  onViewClose: () => void
  onAltSave: (index: number, alt: string) => void
  onDeletingIndex: (index: number) => void
}

const saveButtonLabel = (isSaving: boolean) => {
  if (isSaving) return 'Saving...'
  return 'Save'
}

const saveButtonBackground = (saveStatus: SaveStatus) => {
  if (saveStatus === 'error') return '#dc2626'
  return '#EC4815'
}

export const FullscreenView = ({
  localImages,
  pendingFiles,
  previewUrls,
  showFileInput,
  pendingSrc,
  newAlt,
  viewingIndex,
  deletingIndex,
  isSaving,
  saveStatus,
  hasChanges,
  hasPendingFiles,
  imgSrc,
  onClose,
  onSave,
  onShowFileInput,
  onFileSelect,
  onAddToGallery,
  onCancelAdd,
  onNewAltChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  onViewOpen,
  onViewClose,
  onAltSave,
  onDeletingIndex,
}: FullscreenViewProps) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'white',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    {/* Header */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0,
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Gallery Images</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280', marginTop: 2 }}>
          {localImages.length} image{localImages.length !== 1 ? 's' : ''}
          {hasPendingFiles && ` · ${pendingFiles.size} new`}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type='button'
          onClick={onSave}
          disabled={!hasChanges || isSaving}
          style={{
            padding: '8px 32px',
            background: saveButtonBackground(saveStatus),
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: !hasChanges || isSaving ? 'default' : 'pointer',
            fontSize: 14,
            fontWeight: 600,
            opacity: !hasChanges || isSaving ? 0.5 : 1,
          }}
        >
          {saveButtonLabel(isSaving)}
        </button>
        <button
          type='button'
          onClick={onClose}
          style={{
            padding: '8px 24px',
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ✕ Close
        </button>
      </div>
    </div>

    {saveStatus === 'success' && (
      <div
        style={{
          padding: '10px 24px',
          background: '#f0fdf4',
          borderBottom: '1px solid #bbf7d0',
          color: '#15803d',
          fontSize: 14,
          fontWeight: 500,
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'normal',
        }}
      >
        ✓ Changes saved — updates may take a few minutes to appear on the live site.
      </div>
    )}

    {saveStatus === 'error' && (
      <div
        style={{
          padding: '10px 24px',
          background: '#fef2f2',
          borderBottom: '1px solid #fecaca',
          color: '#dc2626',
          fontSize: 14,
          fontWeight: 500,
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'normal',
        }}
      >
        ✗ Something went wrong — changes were not saved. Please try again.
      </div>
    )}

    {/* Body */}
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <AddImagePanel
          showFileInput={showFileInput}
          pendingSrc={pendingSrc}
          newAlt={newAlt}
          imgSrc={imgSrc}
          onShowFileInput={onShowFileInput}
          onFileSelect={onFileSelect}
          onAltChange={onNewAltChange}
          onAdd={onAddToGallery}
          onCancel={onCancelAdd}
        />
      </div>
      <ImageGrid
        images={localImages}
        previewUrls={previewUrls}
        deletingIndex={deletingIndex}
        imgSrc={imgSrc}
        onView={onViewOpen}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDeleteRequest={onDeletingIndex}
        onDeleteConfirm={onDelete}
        onDeleteCancel={() => onDeletingIndex(-1)}
      />
    </div>

    {/* Alt text modal */}
    {viewingIndex !== null && localImages[viewingIndex] && (
      <AltTextModal
        image={localImages[viewingIndex]}
        imgSrc={imgSrc}
        onSave={alt => onAltSave(viewingIndex, alt)}
        onClose={onViewClose}
      />
    )}
  </div>
)
