import type { Env } from './types'
import { getFileFromGitHub, commitFilesToGitHub } from './github'

export async function handleGallery(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const formData = await request.formData()
    const slug = formData.get('slug') as string
    const fieldName = formData.get('field') as string

    if (!slug || !fieldName) {
      return new Response(JSON.stringify({ error: 'Missing slug or field' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const filesToCommit: { path: string; content: string }[] = []

    // Process any new image files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = await value.arrayBuffer()
        const bytes = new Uint8Array(buffer)
        let binary = ''
        const chunkSize = 8192
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize)
          binary += String.fromCharCode(...chunk)
        }
        const base64 = btoa(binary)
        filesToCommit.push({
          path: `public${key}`,
          content: base64,
        })
      }
    }

    // Update the artist JSON file
    const artistJsonPath = `content/artists/${slug}.json`
    const existingArtistJson = await getFileFromGitHub(artistJsonPath, env)
    const artistData = JSON.parse(existingArtistJson)

    if (fieldName === 'galleryImages') {
      const imagesJson = formData.get('images') as string
      if (!imagesJson) throw new Error('Missing images')
      artistData.galleryImages = JSON.parse(imagesJson)
    } else {
      const value = formData.get('value') as string
      if (!value) throw new Error('Missing value')
      artistData[fieldName] = value
    }

    filesToCommit.push({
      path: artistJsonPath,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(artistData, null, 2)))),
    })

    await commitFilesToGitHub(filesToCommit, `Update ${fieldName} for ${slug}`, env)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Worker error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}
