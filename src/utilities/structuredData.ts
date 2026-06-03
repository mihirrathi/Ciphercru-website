import type { Media, Post } from '@/payload-types'

import { getServerSideURL } from './getURL'
import { SITE_DESCRIPTION, SITE_LOGO_PATH, SITE_NAME } from './brand'
import { getHashtags } from './hashtags'

type JsonLdObject = Record<string, unknown>

const absolute = (path: string): string => {
  const base = getServerSideURL()
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

const imageURL = (image?: Media | string | null): string | undefined => {
  if (!image || typeof image !== 'object') return undefined
  const og = image.sizes?.og?.url
  const url = og || image.url
  return url ? absolute(url) : undefined
}

/** Organization schema — identifies CipherCru as the publisher. */
export const organizationSchema = (): JsonLdObject => {
  const base = getServerSideURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: base,
    logo: absolute(SITE_LOGO_PATH),
    description: SITE_DESCRIPTION,
  }
}

/**
 * BlogPosting schema for an individual article — drives rich results
 * (author, date, image) in search.
 */
export const blogPostingSchema = (args: {
  post: Post
  url: string
}): JsonLdObject => {
  const { post, url } = args
  const base = getServerSideURL()

  const heroImage =
    (post.heroImage && typeof post.heroImage === 'object' && post.heroImage) ||
    (post.meta?.image && typeof post.meta.image === 'object' && post.meta.image) ||
    null
  const image = imageURL(heroImage)

  const authors = (post.populatedAuthors ?? [])
    .map((a) => a?.name)
    .filter((name): name is string => Boolean(name))
    .map((name) => ({ '@type': 'Person', name }))

  const hashtags = getHashtags(post)

  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.meta?.description || SITE_DESCRIPTION,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: base,
      logo: {
        '@type': 'ImageObject',
        url: absolute(SITE_LOGO_PATH),
      },
    },
  }

  if (image) schema.image = [image]
  if (post.publishedAt) schema.datePublished = post.publishedAt
  if (post.updatedAt || post.publishedAt) {
    schema.dateModified = post.updatedAt || post.publishedAt
  }
  if (authors.length > 0) schema.author = authors
  if (hashtags.length > 0) schema.keywords = hashtags.join(', ')

  return schema
}

/** WebSite schema — enables the sitelinks search box and names the site. */
export const websiteSchema = (): JsonLdObject => {
  const base = getServerSideURL()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: base,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/** BreadcrumbList schema — renders the breadcrumb trail in search results. */
export const breadcrumbSchema = (
  items: { name: string; url: string }[],
): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
})
