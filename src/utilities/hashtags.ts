import type { Post } from '@/payload-types'

/**
 * Normalize a single hashtag to its canonical stored form:
 * lowercase, no leading `#`, no internal whitespace.
 * e.g. "#Cyber Security" -> "cybersecurity"
 */
export const normalizeHashtag = (raw: unknown): string => {
  if (typeof raw !== 'string') return ''
  return raw
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

/** Extract a post's hashtags as a clean, de-duplicated string array (no `#`). */
export const getHashtags = (post: Partial<Post> | null | undefined): string[] => {
  if (!post || !Array.isArray(post.hashtags)) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of post.hashtags) {
    const tag = normalizeHashtag(raw)
    if (tag && !seen.has(tag)) {
      seen.add(tag)
      out.push(tag)
    }
  }
  return out
}

/** Display form with the leading `#`, e.g. "cybersecurity" -> "#cybersecurity". */
export const displayHashtag = (tag: string): string => `#${normalizeHashtag(tag)}`
