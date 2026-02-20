import sharp from 'sharp'
import { readdir, rename } from 'fs/promises'
import { existsSync, readFileSync, statSync } from 'fs'
import { join, extname } from 'path'

const IMAGES_DIR = 'public/images/artists'
const MANIFEST_PATH = 'scripts/optimised-manifest.json'
const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

// Read manifest — Lee's pre-optimised images, never touch these
const manifest = existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8')) : []

console.log('Manifest loaded:', manifest.length, 'entries')
console.log('First entry:', manifest[0])

async function getAllImages(dir) {
  if (!existsSync(dir)) {
    console.log(`No images folder found at ${dir} — skipping.`)
    return []
  }
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await getAllImages(full)))
    } else if (SUPPORTED.includes(extname(entry.name).toLowerCase())) {
      files.push(full)
    }
  }
  return files
}

async function run() {
  console.log('\nOptimising images...\n')

  const images = await getAllImages(IMAGES_DIR)
  if (!images.length) {
    console.log('No images found — skipping.\n')
    return
  }

  let done = 0,
    skipped = 0,
    errors = 0

  for (const input of images) {
    // Get path relative to artists dir for manifest lookup
    // e.g. "jin/jin-horror-pennywise-child.jpg"
    const normalised = input.replaceAll('\\', '/')
    const relative = normalised.replace(IMAGES_DIR + '/', '')

    // Skip if in manifest — Lee already optimised this one
    if (manifest.includes(relative)) {
      skipped++
      continue
    }

    const temp = input + '.tmp'

    try {
      await sharp(input)
        .rotate()
        .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
        .toFile(temp)

      // Atomically replace original with optimised version
      await rename(temp, input)

      console.log(`  ✓ ${relative}`)
      done++
    } catch (err) {
      console.error(`  ✗ ${relative} — ${err.message}`)
      errors++
    }
  }

  console.log(`\nDone — ${done} optimised, ${skipped} skipped, ${errors} errors\n`)
  if (errors) process.exit(1)
}

run()
