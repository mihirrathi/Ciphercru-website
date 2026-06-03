import type { Metadata } from 'next'

import type { Media, Page, Post, Project, Service, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { SITE_DESCRIPTION, titleWithSuffix } from './brand'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Service> | Partial<Project> | null
  /** Absolute canonical URL for this document (also used as the OG url). */
  url?: string
}): Promise<Metadata> => {
  const { doc, url } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = titleWithSuffix(doc?.meta?.title)
  const description = doc?.meta?.description || SITE_DESCRIPTION

  // Dates are only present on dated content (posts); used for article freshness signals.
  const publishedAt =
    doc && 'publishedAt' in doc && typeof doc.publishedAt === 'string'
      ? doc.publishedAt
      : undefined
  const modifiedAt =
    doc && 'updatedAt' in doc && typeof doc.updatedAt === 'string' ? doc.updatedAt : undefined

  const canonical = url ?? getServerSideURL()

  return {
    description,
    alternates: {
      canonical,
    },
    openGraph: mergeOpenGraph({
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: canonical,
      ...(publishedAt
        ? {
            type: 'article',
            publishedTime: publishedAt,
            modifiedTime: modifiedAt ?? publishedAt,
          }
        : {}),
    }),
    title,
  }
}
