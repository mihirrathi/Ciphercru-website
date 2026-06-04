/**
 * Deletes Media docs whose underlying file is missing.
 *
 * "Missing" = (no cloudinaryPublicId OR Cloudinary lookup 404s) AND the file
 * is not present on local disk under media/.
 *
 * Run with:
 *   node --env-file=.env --import tsx scripts/delete-orphan-media.ts
 *
 * Add --dry to preview without deleting:
 *   node --env-file=.env --import tsx scripts/delete-orphan-media.ts --dry
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LOCAL_DIR = path.resolve(__dirname, '../media')
const DRY = process.argv.includes('--dry')

async function main() {
  const cloudinaryReady = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )

  if (cloudinaryReady) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
    depth: 0,
  })

  payload.logger.info(`[cleanup] inspecting ${docs.length} media docs${DRY ? ' (DRY RUN)' : ''}`)

  let deleted = 0
  let kept = 0

  for (const doc of docs) {
    const label = `[${doc.id}] ${doc.filename ?? '(no filename)'}`

    if (!doc.filename) {
      payload.logger.info(`KEEP ${label}: no filename, leaving alone`)
      kept++
      continue
    }

    const publicId = (doc as { cloudinaryPublicId?: string }).cloudinaryPublicId

    // 1. Is it on Cloudinary?
    if (publicId && cloudinaryReady) {
      try {
        await cloudinary.api.resource(publicId)
        kept++
        continue
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        payload.logger.warn(`[cleanup] cloudinary 404 for ${label}: ${msg}`)
      }
    }

    // 2. Is it on local disk?
    const localPath = path.join(LOCAL_DIR, doc.filename)
    if (fs.existsSync(localPath)) {
      kept++
      continue
    }

    // Orphan — delete.
    if (DRY) {
      payload.logger.info(`WOULD DELETE ${label}`)
    } else {
      try {
        await payload.delete({ collection: 'media', id: doc.id })
        payload.logger.info(`DELETED ${label}`)
        deleted++
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        payload.logger.error(`FAILED to delete ${label}: ${msg}`)
      }
    }
  }

  payload.logger.info(`[cleanup] done — kept ${kept}, deleted ${deleted}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[cleanup] fatal', err)
  process.exit(1)
})
