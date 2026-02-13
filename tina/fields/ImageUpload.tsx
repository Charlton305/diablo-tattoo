import { useCMS } from 'tinacms'

export const ImageUpload = ({ input, field, form }: any) => {
  const cms = useCMS()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const match = input.name.match(/artists\.(\d+)/)
      const artistIndex = match ? parseInt(match[1]) : null
      const state = form.getState()
      const slug = artistIndex !== null ? state.values?.artists?.[artistIndex]?.slug : null

      const [uploaded] = await cms.media.persist([
        { directory: slug ? `artists/${slug}` : 'artists', file },
      ])

      input.onChange(uploaded.src)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <div>
      <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>{field.label}</label>
      {input.value ? (
        <img
          src={input.value.startsWith('/') ? input.value : `/${input.value}`}
          style={{ maxWidth: 200, borderRadius: 4, marginBottom: 16 }}
        />
      ) : (
        <input type='file' accept='image/*' style={{ marginBottom: 16 }} onChange={handleUpload} />
      )}
    </div>
  )
}