import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Category, Post } from '@/payload-types'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { formatAuthors } from '@/utilities/formatAuthors'
import { generateMeta } from '@/utilities/generateMeta'
import { getServerSideURL } from '@/utilities/getURL'
import { displayHashtag, getHashtags } from '@/utilities/hashtags'
import { JsonLd } from '@/components/JsonLd'
import { blogPostingSchema, breadcrumbSchema } from '@/utilities/structuredData'

import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

const formatDate = (d?: string | null) => {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const estimateReadTime = (post: Post): number | null => {
  const root = post.content?.root
  if (!root) return null
  let words = 0
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { text?: unknown; children?: unknown[] }
    if (typeof n.text === 'string') {
      words += n.text.split(/\s+/).filter(Boolean).length
    }
    if (Array.isArray(n.children)) {
      for (const c of n.children) walk(c)
    }
  }
  walk(root)
  if (words === 0) return null
  return Math.max(1, Math.round(words / 225))
}

export default async function BlogArticlePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blog/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const categories = (Array.isArray(post.categories) ? post.categories : []).filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )
  const heroImage =
    post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const author = formatAuthors(post.populatedAuthors ?? [])
  const date = formatDate(post.publishedAt)
  const readTime = estimateReadTime(post)
  const hashtags = getHashtags(post)

  const serverUrl = getServerSideURL()
  const canonical = `${serverUrl}/blog/${decodedSlug}`
  const structuredData = [
    blogPostingSchema({ post, url: canonical }),
    breadcrumbSchema([
      { name: 'Home', url: serverUrl },
      { name: 'Blog', url: `${serverUrl}/blog` },
      { name: post.title, url: canonical },
    ]),
  ]

  return (
    <article className="bg-white">
      <JsonLd data={structuredData} />
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Header */}
      <section className="container pt-8 pb-10">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          <Link href="/blog" className="hover:text-brand transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          <span className="text-gray-700 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="max-w-3xl mx-auto text-center">
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold text-white bg-brand"
                >
                  {c.title.toUpperCase()}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed mb-8">{post.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-500">
            {author && (
              <span className="inline-flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-200" aria-hidden />
                <span className="font-semibold text-gray-900">{author}</span>
              </span>
            )}
            {date && (
              <>
                <span className="text-gray-300" aria-hidden>·</span>
                <time dateTime={post.publishedAt ?? undefined}>{date}</time>
              </>
            )}
            {readTime && (
              <>
                <span className="text-gray-300" aria-hidden>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden />
                  {readTime} min read
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Hero image */}
      {heroImage && (
        <section className="container mb-12">
          <div className="relative aspect-16/8 rounded-2xl overflow-hidden bg-gray-100 max-w-5xl mx-auto">
            <Media
              resource={heroImage}
              fill
              priority
              size="(max-width: 1024px) 100vw, 1024px"
              htmlElement={null}
              pictureClassName="absolute inset-0"
              imgClassName="object-cover"
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="container pb-16">
        <div className="max-w-3xl mx-auto">
          <RichText className="max-w-none" data={post.content} enableGutter={false} />

          {hashtags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <ul className="flex flex-wrap gap-2.5" aria-label="Hashtags">
                {hashtags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full bg-brand/10 px-3.5 py-1.5 text-sm font-medium text-brand hover:bg-brand hover:text-white transition-colors"
                    >
                      {displayHashtag(tag)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16 pt-12 border-t border-gray-100">
            <RelatedPosts
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              docs={post.relatedPosts.filter((p) => typeof p === 'object')}
            />
          </div>
        )}
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })
  const canonical = `${getServerSideURL()}/blog/${decodedSlug}`
  const meta = await generateMeta({ doc: post, url: canonical })
  const hashtags = getHashtags(post)
  if (hashtags.length > 0) meta.keywords = hashtags
  return meta
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: { equals: slug },
    },
  })

  return result.docs?.[0] || null
})
