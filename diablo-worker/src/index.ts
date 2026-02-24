export interface Env {
  GITHUB_TOKEN: string
  TINA_CLIENT_ID: string
}

const GITHUB_OWNER = 'Charlton305'
const GITHUB_REPO = 'diablo-tattoo'
const GITHUB_BRANCH = 'main'

const handler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers so the Tina admin can call this
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const url = new URL(request.url)
    const clientId = url.searchParams.get('clientID') ?? env.TINA_CLIENT_ID
    const token = request.headers.get('Authorization') ?? ''

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorised' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const isValid = await verifyTinaToken(token, clientId)
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Unauthorised' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    try {
      const formData = await request.formData()
      const slug = formData.get('slug') as string
      const imagesJson = formData.get('images') as string

      if (!slug || !imagesJson) {
        return new Response(JSON.stringify({ error: 'Missing slug or images' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const images: { src: string; alt: string }[] = JSON.parse(imagesJson)

      // Collect all files to commit
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
          // key is the full path e.g. /images/artists/ray/ray-foo.jpg
          // GitHub API wants path without leading slash
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
      artistData.galleryImages = images

      filesToCommit.push({
        path: artistJsonPath,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(artistData, null, 2)))),
      })

      // Commit everything in one go
      await commitFilesToGitHub(filesToCommit, `Update gallery for ${slug}`, env)

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
  },
}

async function getFileFromGitHub(path: string, env: Env): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'diablo-worker',
      },
    },
  )

  if (!res.ok) throw new Error(`Failed to fetch ${path} from GitHub: ${res.status}`)
  const data: any = await res.json()
  return atob(data.content.replace(/\n/g, ''))
}

async function commitFilesToGitHub(
  files: { path: string; content: string }[],
  message: string,
  env: Env,
): Promise<void> {
  // Get the current commit SHA for the branch
  const refRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'diablo-worker',
      },
    },
  )
  if (!refRes.ok) throw new Error(`Failed to get branch ref: ${refRes.status}`)
  const refData: any = await refRes.json()
  const latestCommitSha = refData.object.sha

  // Get the tree SHA for the latest commit
  const commitRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${latestCommitSha}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'diablo-worker',
      },
    },
  )
  if (!commitRes.ok) throw new Error(`Failed to get commit: ${commitRes.status}`)
  const commitData: any = await commitRes.json()
  const baseTreeSha = commitData.tree.sha

  // Create blobs for each file
  const treeItems = await Promise.all(
    files.map(async file => {
      const blobRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'diablo-worker',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: file.content, encoding: 'base64' }),
        },
      )
      if (!blobRes.ok) throw new Error(`Failed to create blob for ${file.path}: ${blobRes.status}`)
      const blobData: any = await blobRes.json()
      return {
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      }
    }),
  )

  // Create a new tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'diablo-worker',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
    },
  )
  if (!treeRes.ok) throw new Error(`Failed to create tree: ${treeRes.status}`)
  const treeData: any = await treeRes.json()

  // Create the commit
  const newCommitRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'diablo-worker',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [latestCommitSha],
      }),
    },
  )
  if (!newCommitRes.ok) throw new Error(`Failed to create commit: ${newCommitRes.status}`)
  const newCommitData: any = await newCommitRes.json()

  // Update the branch to point to the new commit
  const updateRefRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'diablo-worker',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sha: newCommitData.sha }),
    },
  )
  if (!updateRefRes.ok) throw new Error(`Failed to update branch ref: ${updateRefRes.status}`)
}

async function verifyTinaToken(token: string, clientId: string): Promise<boolean> {
  const res = await fetch(
    `https://identity.tinajs.io/v2/apps/${clientId}/currentUser`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    },
  )
  if (!res.ok) return false
  const user: any = await res.json()
  return user.verified === true
}

export default handler