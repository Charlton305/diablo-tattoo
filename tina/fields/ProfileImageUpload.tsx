import { useState } from 'react'
import { useCMS } from 'tinacms'

export const ProfileImageUpload = ({ input, field, form }: any) => {
  const cms = useCMS()
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const currentSrc =
    typeof input.value === 'string' && input.value
      ? encodeURI(
          `https://raw.githubusercontent.com/Charlton305/diablo-tattoo/main/public${
            input.value.startsWith('/') ? input.value : `/${input.value}`
          }`,
        )
      : null

  const getSlug = () => form.getState().values?.slug ?? null

  const handleOpen = () => {
    setPreviewUrl(null)
    setPendingFile(null)
    setSaveStatus('idle')
    setIsOpen(true)
  }

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setPendingFile(null)
    setSaveStatus('idle')
    setIsOpen(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
    setPendingFile(file)
    setSaveStatus('idle')
    e.target.value = ''
  }

  const handleSave = async () => {
    if (!pendingFile) return
    setIsSaving(true)
    setSaveStatus('idle')

    const slug = getSlug()
    const safeName = pendingFile.name.replace(/\s+/g, '-').toLowerCase()
    const imagePath = `/images/artists/${slug}/${safeName}`

    const formData = new FormData()
    formData.append('slug', slug)
    formData.append('field', 'image')
    formData.append('value', imagePath)
    formData.append(imagePath, pendingFile)

    try {
      const tinaClient = cms.api.tina as any
      const { id_token } = await tinaClient.authProvider.getToken()

      const res = await fetch(
        `https://diablo-worker.leejcharlton.workers.dev/gallery?clientID=${tinaClient.clientId}`,
        {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${id_token}` },
        },
      )

      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        throw new Error(body.error || 'Unknown error')
      }

      input.onChange(imagePath)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setPendingFile(null)
      setSaveStatus('success')
    } catch (err) {
      console.error('Profile image save failed:', err)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* Sidebar view */}
      <div
        style={{
          marginBottom: '20px',
          padding: '0 8px',
          fontFamily: 'inter, sans-serif',
          color: '#433E52',
        }}
      >
        <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'block' }}>
          {field.label}
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            border: '1px solid #ddd',
            borderRadius: 4,
            background: '#fafafa',
            gap: 10,
          }}
        >
          {currentSrc && (
            <img
              src={currentSrc}
              alt='Profile'
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }}
            />
          )}
          <button
            type='button'
            onClick={handleOpen}
            style={{
              padding: '8px 16px',
              background: '#0084FF',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              marginLeft: 'auto',
            }}
          >
            {currentSrc ? 'Change Photo →' : 'Upload Photo →'}
          </button>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'white',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              flexShrink: 0,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Profile Photo</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type='button'
                onClick={handleSave}
                disabled={!pendingFile || isSaving}
                style={{
                  padding: '8px 16px',
                  background: !pendingFile || isSaving ? '#9ca3af' : '#EC4815',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: !pendingFile || isSaving ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: !pendingFile || isSaving ? 0.5 : 1,
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                type='button'
                onClick={handleClose}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  background: 'none',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                }}
              >
                Close
              </button>
            </div>
          </div>

          {/* Status banners */}
          {saveStatus === 'success' && (
            <div
              style={{
                background: '#f0fdf4',
                borderBottom: '1px solid #bbf7d0',
                padding: '10px 20px',
                fontSize: 14,
                color: '#15803d',
                width: '100%',
                boxSizing: 'border-box',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              ✓ Profile photo saved — updates may take a few minutes to appear on the live site.
            </div>
          )}
          {saveStatus === 'error' && (
            <div
              style={{
                background: '#fef2f2',
                borderBottom: '1px solid #fecaca',
                padding: '10px 20px',
                fontSize: 14,
                color: '#dc2626',
                width: '100%',
                boxSizing: 'border-box',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}
            >
              ✗ Something went wrong — changes were not saved. Please try again.
            </div>
          )}

          {/* Body */}
          <div style={{ padding: 20, overflowY: 'auto', flexGrow: 1 }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 12 }}>
                {previewUrl ? 'New photo preview:' : 'Current photo:'}
              </p>
              {previewUrl ?? currentSrc ? (
                <img
                  src={previewUrl ?? currentSrc!}
                  alt='Profile'
                  style={{
                    width: 160,
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: 6,
                    display: 'block',
                    marginBottom: 16,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 160,
                    height: 160,
                    background: '#f3f4f6',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    color: '#9ca3af',
                    marginBottom: 16,
                  }}
                >
                  No photo yet
                </div>
              )}
            </div>

            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: 6,
                padding: 16,
                background: '#f9fafb',
              }}
            >
              <label
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: '#0084FF',
                  color: 'white',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {pendingFile ? 'Choose Different Photo' : 'Choose Photo'}
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
              {pendingFile && (
                <p
                  style={{
                    marginTop: 10,
                    fontSize: 13,
                    color: '#6b7280',
                    margin: '10px 0 0',
                    whiteSpace: 'normal',
                    wordBreak: 'break-all',
                  }}
                >
                  Selected: {pendingFile.name} ({(pendingFile.size / 1024).toFixed(1)}kb)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
