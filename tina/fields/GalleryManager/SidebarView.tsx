// tina/fields/GalleryManager/SidebarView.tsx
interface SidebarViewProps {
  label: string
  imageCount: number
  onOpen: () => void
}

export const SidebarView = ({ label, imageCount, onOpen }: SidebarViewProps) => (
  <div>
    <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>{label}</label>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: 4,
        background: '#fafafa',
        gap: '10px',
      }}
    >
      <span style={{ fontSize: 14, color: '#555' }}>
        {imageCount} image{imageCount !== 1 ? 's' : ''}
      </span>
      <button
        type='button'
        onClick={onOpen}
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
        Manage Gallery →
      </button>
    </div>
  </div>
)
