console.log('[boot-test] start')
import { getPayload } from 'payload'
console.log('[boot-test] importing config…')
import config from '../src/payload.config'
console.log('[boot-test] config imported')

async function main() {
  console.log('[boot-test] before getPayload')
  const p = await getPayload({ config })
  console.log('[boot-test] payload ready, collections:', Object.keys(p.collections))
  process.exit(0)
}
main().catch((e) => {
  console.error('[boot-test] ERROR', e)
  process.exit(1)
})
