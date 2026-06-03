import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getServerSideURL } from '@/utilities/getURL'
import { SITE_DESCRIPTION, SITE_NAME } from '@/utilities/brand'

const xmlEscape = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const cdata = (value: string): string => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

const getFeed = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL()

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 50,
      pagination: false,
      sort: '-publishedAt',
      where: {
        _status: { equals: 'published' },
      },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        meta: true,
        publishedAt: true,
        updatedAt: true,
        categories: true,
      },
    })

    const items = results.docs
      .filter((post) => Boolean(post?.slug))
      .map((post) => {
        const link = `${SITE_URL}/blog/${post.slug}`
        const description = post.excerpt || post.meta?.description || ''
        const date = post.publishedAt || post.updatedAt
        const pubDate = date ? new Date(date).toUTCString() : undefined
        const categories = Array.isArray(post.categories)
          ? post.categories
              .map((c) => (typeof c === 'object' && c ? c.title : null))
              .filter((t): t is string => Boolean(t))
          : []

        return [
          '    <item>',
          `      <title>${cdata(post.title ?? '')}</title>`,
          `      <link>${xmlEscape(link)}</link>`,
          `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
          pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
          description ? `      <description>${cdata(description)}</description>` : '',
          ...categories.map((c) => `      <category>${cdata(c)}</category>`),
          '    </item>',
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n')

    const lastBuildDate = (results.docs[0]?.publishedAt
      ? new Date(results.docs[0].publishedAt)
      : new Date(0)
    ).toUTCString()

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(`${SITE_NAME} Blog`)}</title>
    <link>${xmlEscape(`${SITE_URL}/blog`)}</link>
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${xmlEscape(`${SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
  },
  ['blog-rss-feed'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const body = await getFeed()

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  })
}
