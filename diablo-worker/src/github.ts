import type { Env } from './types'

const GITHUB_OWNER = 'Charlton305'
const GITHUB_REPO = 'diablo-tattoo'
const GITHUB_BRANCH = 'main'

export async function getFileFromGitHub(path: string, env: Env): Promise<string> {
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

export async function commitFilesToGitHub(
  files: { path: string; content: string }[],
  message: string,
  env: Env,
): Promise<void> {
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
