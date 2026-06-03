import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import Link from 'next/link'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { BlogPage, Category, Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

import PageClient from './page.client'
import { BlogContent } from './BlogContent.client'
import { NewsletterForm } from './NewsletterForm.client'

export const dynamic = 'force-static'
export const revalidate = 600

const isPost = (p: unknown): p is Post => typeof p === 'object' && p !== null && 'id' in p

export default async function BlogIndexPage() {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, categoriesResult, blog] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 2,
      limit: 500,
      overrideAccess: false,
      pagination: false,
      sort: '-publishedAt',
      where: {
        _status: { equals: 'published' },
      },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      pagination: false,
      sort: 'title',
    }),
    getCachedGlobal('blog-page', 2)() as Promise<BlogPage>,
  ])

  const posts = postsResult.docs
  const categories = categoriesResult.docs

  const categoryCounts: Record<string, number> = {}
  for (const post of posts) {
    if (!Array.isArray(post.categories)) continue
    for (const c of post.categories) {
      const id = typeof c === 'string' ? c : c.id
      categoryCounts[id] = (categoryCounts[id] ?? 0) + 1
    }
  }

  const featuredPost = posts.find((p) => p.featured) ?? null

  const popularPosts: Post[] = Array.isArray(blog?.popularPosts)
    ? blog.popularPosts.filter(isPost)
    : []

  const sidebar = (
    <Sidebar
      totalPosts={posts.length}
      categories={categories}
      categoryCounts={categoryCounts}
      popularPosts={popularPosts}
      blog={blog}
    />
  )

  return (
    <div className="bg-white">
      <PageClient />
      <BlogContent
        posts={posts}
        featuredPost={featuredPost}
        categories={categories}
        blog={blog}
        sidebar={sidebar}
      />
    </div>
  )
}

const Sidebar: React.FC<{
  totalPosts: number
  categories: Category[]
  categoryCounts: Record<string, number>
  popularPosts: Post[]
  blog: BlogPage | null | undefined
}> = ({ totalPosts, categories, categoryCounts, popularPosts, blog }) => {
  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
      {/* Categories */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {blog?.categoriesHeading ?? 'Categories'}
        </h2>
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/blog"
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-brand/10 flex items-center justify-center">
                  <span className="w-3 h-3 rounded-sm bg-brand/70" aria-hidden />
                </span>
                <span className="font-medium">
                  {blog?.allCategoriesLabel ?? 'All Categories'}
                </span>
              </span>
              <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                {totalPosts}
              </span>
            </Link>
          </li>
          {categories.map((cat) => {
            const count = categoryCounts[cat.id] ?? 0
            if (count === 0) return null
            return (
              <li key={cat.id}>
                <Link
                  href={`/blog?category=${encodeURIComponent(cat.slug ?? '')}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-md bg-brand/10 flex items-center justify-center">
                      <span className="w-3 h-3 rounded-sm bg-brand/70" aria-hidden />
                    </span>
                    <span className="font-medium truncate">{cat.title}</span>
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                    {count}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Popular posts */}
      {popularPosts.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {blog?.popularHeading ?? 'Popular Posts'}
          </h2>
          <ul className="flex flex-col gap-4">
            {popularPosts.slice(0, 4).map((p) => (
              <li key={p.id}>
                <PopularPostRow post={p} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Newsletter */}
      {blog?.newsletterEnabled !== false && (
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand to-indigo-600 p-6 text-white">
          <div
            aria-hidden
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"
          />
          <div className="relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold mb-1.5">
              {blog?.newsletterHeading ?? 'Subscribe to our Newsletter'}
            </h2>
            {blog?.newsletterText && (
              <p className="text-white/85 text-sm leading-relaxed mb-5">{blog.newsletterText}</p>
            )}
            <NewsletterForm
              placeholder={blog?.newsletterPlaceholder ?? 'Enter your email'}
              buttonLabel={blog?.newsletterButtonLabel ?? 'Subscribe Now'}
              endpoint={blog?.newsletterEndpoint ?? null}
            />
          </div>
        </div>
      )}
    </aside>
  )
}

const PopularPostRow: React.FC<{ post: Post }> = ({ post }) => {
  const cover =
    (post.heroImage && typeof post.heroImage === 'object' && post.heroImage) ||
    (post.meta?.image && typeof post.meta.image === 'object' && post.meta.image) ||
    null
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <Link href={`/blog/${post.slug}`} className="group flex items-center gap-3">
      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {cover && (
          <Media
            resource={cover}
            fill
            size="64px"
            htmlElement={null}
            pictureClassName="absolute inset-0"
            imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand transition-colors">
          {post.title}
        </div>
        {date && <div className="text-xs text-gray-500 mt-1">{date}</div>}
      </div>
    </Link>
  )
}

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, ideas, and innovation from the CipherCru team.',
  // Filter variants (?tag=, ?category=) consolidate to the canonical /blog.
  alternates: {
    canonical: `${getServerSideURL()}/blog`,
  },
}
