import { useState } from 'react'
import { useCMS } from 'tinacms'
import { SidebarView } from './SidebarView'
import { FullscreenView } from './FullscreenView'

export type GalleryImage = { src: string; alt: string }

export const GalleryManager = ({ input, field, form }: any) => {
  const cms = useCMS()

  const [savedImages, setSavedImages] = useState<GalleryImage[]>(input.value || [])
  const [isOpen, setIsOpen] = useState(false)
  const [localImages, setLocalImages] = useState<GalleryImage[]>(savedImages)
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map())
  const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map())
  const [showFileInput, setShowFileInput] = useState(false)
  const [pendingSrc, setPendingSrc] = useState('')
  const [newAlt, setNewAlt] = useState('')
  const [viewingIndex, setViewingIndex] = useState<number | null>(null)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const getArtistSlug = () => form.getState().values?.slug ?? null
  const hasChanges =
    JSON.stringify(localImages) !== JSON.stringify(savedImages) || pendingFiles.size > 0
  const hasPendingFiles = pendingFiles.size > 0

  const handleOpen = () => {
    setLocalImages(savedImages)
    setPendingFiles(new Map())
    setPreviewUrls(new Map())
    setShowFileInput(false)
    setPendingSrc('')
    setNewAlt('')
    setSaveStatus('idle')
    setIsOpen(true)
  }

  const handleClose = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url))
    setPreviewUrls(new Map())
    setPendingFiles(new Map())
    setPendingSrc('')
    setNewAlt('')
    setShowFileInput(false)
    setViewingIndex(null)
    setDeletingIndex(null)
    setIsOpen(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const slug = getArtistSlug()
    const realPath = `/images/artists/${slug ?? 'artists'}/${file.name}`
    const blobUrl = URL.createObjectURL(file)
    setPendingFiles(prev => new Map(prev).set(realPath, file))
    setPreviewUrls(prev => new Map(prev).set(realPath, blobUrl))
    setPendingSrc(realPath)
    e.target.value = ''
  }

  const handleAddToGallery = () => {
    setSaveStatus('idle')
    if (!pendingSrc) return
    setLocalImages(prev => [...prev, { src: pendingSrc, alt: newAlt }])
    setPendingSrc('')
    setNewAlt('')
    setShowFileInput(false)
  }

  const handleCancelAdd = () => {
    if (pendingSrc && previewUrls.has(pendingSrc)) {
      URL.revokeObjectURL(previewUrls.get(pendingSrc)!)
      setPreviewUrls(prev => {
        const n = new Map(prev)
        n.delete(pendingSrc)
        return n
      })
      setPendingFiles(prev => {
        const n = new Map(prev)
        n.delete(pendingSrc)
        return n
      })
    }
    setPendingSrc('')
    setNewAlt('')
    setShowFileInput(false)
  }

  const handleDelete = (index: number) => {
    setSaveStatus('idle')
    const src = localImages[index].src
    if (previewUrls.has(src)) {
      URL.revokeObjectURL(previewUrls.get(src)!)
      setPreviewUrls(prev => {
        const n = new Map(prev)
        n.delete(src)
        return n
      })
      setPendingFiles(prev => {
        const n = new Map(prev)
        n.delete(src)
        return n
      })
    }
    setLocalImages(prev => prev.filter((_, i) => i !== index))
    setDeletingIndex(null)
  }

  const handleMoveUp = (index: number) => {
    setSaveStatus('idle')
    if (index === 0) return
    setLocalImages(prev => {
      const updated = [...prev]
      ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
      return updated
    })
  }

  const handleMoveDown = (index: number) => {
    setSaveStatus('idle')
    if (index === localImages.length - 1) return
    setLocalImages(prev => {
      const updated = [...prev]
      ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
      return updated
    })
  }

  const handleAltSave = (index: number, alt: string) => {
    setSaveStatus('idle')
    setLocalImages(prev => prev.map((img, i) => (i === index ? { ...img, alt } : img)))
    setViewingIndex(null)
  }

  const handleSaveToGithub = async () => {
    const tinaClient = cms.api.tina as any
    const { id_token } = await tinaClient.authProvider.getToken()

    setIsSaving(true)
    setSaveStatus('idle')
    const slug = getArtistSlug()

    console.log('=== GALLERY SAVE ===')
    console.log('Artist slug:', slug)
    console.log('Images array:', localImages)
    console.log(
      'Pending new files:',
      Array.from(pendingFiles.entries()).map(([path, file]) => ({
        path,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)}kb`,
        type: file.type,
      })),
    )
    console.log('===================')

    try {
      const formData = new FormData()
      formData.append('slug', slug)
      formData.append('images', JSON.stringify(localImages))

      pendingFiles.forEach((file, path) => {
        formData.append(path, file)
      })

      const tinaClient = cms.api.tina as any
      const res = await fetch(
        `https://diablo-worker.leejcharlton.workers.dev?clientID=${tinaClient.clientId}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        },
      )

      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        throw new Error(body.error || 'Unknown error')
      }

      previewUrls.forEach(url => URL.revokeObjectURL(url))
      setPreviewUrls(new Map())
      setPendingFiles(new Map())
      setSavedImages([...localImages])
      setSaveStatus('success')
    } catch (err: any) {
      console.error('Save failed:', err)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const imgSrc = (src: string) =>
    previewUrls.has(src) ? previewUrls.get(src)! : src.startsWith('/') ? src : `/${src}`

  return (
    <>
      <SidebarView label={field.label} imageCount={savedImages.length} onOpen={handleOpen} />
      {isOpen && (
        <FullscreenView
          localImages={localImages}
          pendingFiles={pendingFiles}
          previewUrls={previewUrls}
          showFileInput={showFileInput}
          pendingSrc={pendingSrc}
          newAlt={newAlt}
          viewingIndex={viewingIndex}
          deletingIndex={deletingIndex}
          isSaving={isSaving}
          saveStatus={saveStatus}
          hasChanges={hasChanges}
          hasPendingFiles={hasPendingFiles}
          imgSrc={imgSrc}
          onClose={handleClose}
          onSave={handleSaveToGithub}
          onShowFileInput={() => setShowFileInput(true)}
          onFileSelect={handleFileSelect}
          onAddToGallery={handleAddToGallery}
          onCancelAdd={handleCancelAdd}
          onNewAltChange={setNewAlt}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onDelete={handleDelete}
          onViewOpen={setViewingIndex}
          onViewClose={() => setViewingIndex(null)}
          onAltSave={handleAltSave}
          onDeletingIndex={setDeletingIndex}
        />
      )}
    </>
  )
}
