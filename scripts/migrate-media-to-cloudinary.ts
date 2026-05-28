/**
 * One-time migration: upload existing Media docs' files from public/media/
 * directly to Cloudinary, then patch the Media docs in the DB.
 *
 * We bypass `payload.update({ file })` because the cloud-storage plugin's
 * afterChange tries to delete a "previous" Cloudinary file that never existed
 * for legacy local docs, throwing "File is missing a cloudinaryPublicId or
 * mimeType". Direct SDK upload + `payload.db.updateOne()` sidesteps the hook.
 *
 * Run with:  node --env-file=.env --import tsx scripts/migrate-media-to-cloudinary.ts
 */
console.log('[migrate] script start')

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import { getPayload } from 'payload'

console.log('[migrate] importing payload config…')
import config from '../src/payload.config'
console.log('[migrate] payload config imported')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MEDIA_DIR = path.resolve(__dirname, '../public/media')

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

const mimeFor = (filename: string): string =>
  MIME_BY_EXT[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'

async function main() {
  console.log('[migrate] main() entered')
  console.log('[migrate] CLOUDINARY_CLOUD_NAME =', process.env.CLOUDINARY_CLOUD_NAME || '(empty)')
  console.log('[migrate] DATABASE_URL =', process.env.DATABASE_URL || '(empty)')

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not set — populate .env before running.')
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  console.log('[migrate] calling getPayload()…')
  const payload = await getPayload({ config })
  console.log('[migrate] payload initialized')

  const { docs } = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
    depth: 0,
  })

  payload.logger.info(`Found ${docs.length} Media docs`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const doc of docs) {
    const label = `[${doc.id}] ${doc.filename ?? '(no filename)'}`

    if (!doc.filename) {
      payload.logger.info(`SKIP ${label}: no filename`)
      skipped++
      continue
    }

    // Already migrated (cloudinaryPublicId is injected by the plugin)
    if ((doc as { cloudinaryPublicId?: string }).cloudinaryPublicId) {
      payload.logger.info(`SKIP ${label}: already in Cloudinary`)
      skipped++
      continue
    }

    const filePath = path.join(MEDIA_DIR, doc.filename)
    if (!fs.existsSync(filePath)) {
      payload.logger.warn(`SKIP ${label}: original file missing on disk`)
      skipped++
      continue
    }

    try {
      const mimeType = mimeFor(doc.filename)
      const resourceType: 'image' | 'video' | 'raw' = mimeType.startsWith('video')
        ? 'video'
        : mimeType.startsWith('image')
          ? 'image'
          : 'raw'

      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'company-website',
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      })

      // Direct DB update — bypasses Payload collection hooks (and the
      // cloud-storage plugin's afterChange that tries to delete a non-existent
      // previous Cloudinary file).
      await payload.db.updateOne({
        collection: 'media',
        where: { id: { equals: doc.id } },
        data: {
          cloudinaryPublicId: result.public_id,
          url: result.secure_url,
          mimeType,
        },
      })

      payload.logger.info(`OK   ${label} → ${result.public_id}`)
      migrated++
    } catch (err) {
      payload.logger.error(`FAIL ${label}: ${(err as Error).message}`)
      failed++
    }
  }

  payload.logger.info(`Done — migrated: ${migrated}, skipped: ${skipped}, failed: ${failed}`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
