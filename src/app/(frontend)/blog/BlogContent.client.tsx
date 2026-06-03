'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, ChevronDown, Search } from 'lucide-react'

import type { BlogPage, Category, Media as MediaType, Post } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { displayHashtag, getHashtags, normalizeHashtag } from '@/utilities/hashtags'

type Props = {
  posts: Post[]
  featuredPost: Post | null
  categories: Category[]
  blog: BlogPage | null | undefined
  sidebar: React.ReactNode
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
  // Walk the lexical content tree, counting text nodes; ~225 wpm.
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

const getCover = (post: Post): MediaType | null => {
  if (post.heroImage && typeof post.heroImage === 'object') return post.heroImage
  if (post.meta?.image && typeof post.meta.image === 'object') return post.meta.image
  return null
}

const getFirstCategory = (post: Post): Category | null => {
  if (!Array.isArray(post.categories)) return null
  const c = post.categories.find((cat) => typeof cat === 'object')
  return (c as Category) ?? null
}

const getExcerpt = (post: Post): string | null => {
  return post.excerpt || post.meta?.description || null
}

export const BlogContent: React.FC<Props> = ({
  posts,
  featuredPost,
  categories,
  blog,
  sidebar,
}) => {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') ?? 'all'
  const initialTag = normalizeHashtag(searchParams.get('tag') ?? '')

  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [activeTag, setActiveTag] = useState<string>(initialTag)
  const [page, setPage] = useState(1)

  const perPage = blog?.postsPerPage ?? 6

  // Reset page when filter/search changes
  const filterKey = `${activeCategory}:${activeTag}:${query.trim().toLowerCase()}`
  const [lastKey, setLastKey] = useState(filterKey)
  if (filterKey !== lastKey) {
    setLastKey(filterKey)
    setPage(1)
  }

  // Sync category state if URL ?category= changes (e.g. clicking sidebar)
  const urlCategory = searchParams.get('category') ?? 'all'
  const [lastUrlCategory, setLastUrlCategory] = useState(urlCategory)
  if (urlCategory !== lastUrlCategory) {
    setLastUrlCategory(urlCategory)
    setActiveCategory(urlCategory)
  }

  // Sync hashtag state if URL ?tag= changes (e.g. clicking a hashtag on a post)
  const urlTag = normalizeHashtag(searchParams.get('tag') ?? '')
  const [lastUrlTag, setLastUrlTag] = useState(urlTag)
  if (urlTag !== lastUrlTag) {
    setLastUrlTag(urlTag)
    setActiveTag(urlTag)
  }

  const filtered = useMemo(() => {
    // Strip a leading "#" so searching "#cybersecurity" matches too.
    const q = query.trim().toLowerCase().replace(/^#+/, '')
    return posts
      .filter((p) => {
        if (featuredPost && p.id === featuredPost.id) return false
        if (activeCategory !== 'all') {
          const slugs =
            Array.isArray(p.categories)
              ? p.categories
                  .map((c) => (typeof c === 'object' ? c.slug : null))
                  .filter(Boolean)
              : []
          if (!slugs.includes(activeCategory)) return false
        }
        if (activeTag && !getHashtags(p).includes(activeTag)) return false
        if (!q) return true
        const haystack = [
          p.title,
          getExcerpt(p),
          Array.isArray(p.categories)
            ? p.categories
                .map((c) => (typeof c === 'object' ? c.title : null))
                .filter(Boolean)
                .join(' ')
            : null,
          getHashtags(p).join(' '),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
  }, [posts, featuredPost, activeCategory, activeTag, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const visible = filtered.slice((page - 1) * perPage, page * perPage)

  const activeCategoryLabel =
    activeCategory === 'all'
      ? blog?.categoryPlaceholder ?? 'All Categories'
      : categories.find((c) => c.slug === activeCategory)?.title ?? 'All Categories'

  return (
    <>
      {/* Hero */}
      <section className="px-4 sm:px-6 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand text-white">
          {blog?.heroImage && typeof blog.heroImage === 'object' && (
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <Media
                resource={blog.heroImage}
                fill
                size="100vw"
                htmlElement={null}
                pictureClassName="absolute inset-0"
                imgClassName="object-cover"
              />
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.1),transparent_60%)]"
          />
          <div className="relative px-6 sm:px-10 lg:px-16 py-14 lg:py-20 text-center">
            {blog?.eyebrow && (
              <div className="text-sm font-medium text-white/85 mb-3">{blog.eyebrow}</div>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-5 leading-[1.1]">
              {blog?.heading ?? 'Insights. Ideas. Innovation.'}
            </h1>
            {blog?.subtitle && (
              <p className="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed mb-8">
                {blog.subtitle}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={blog?.searchPlaceholder ?? 'Search blogs, topics...'}
                  aria-label="Search articles"
                  className="w-full rounded-xl bg-white text-gray-800 placeholder:text-gray-400 py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
              <CategoryDropdown
                categories={categories}
                value={activeCategory}
                onChange={setActiveCategory}
                placeholderLabel={blog?.categoryPlaceholder ?? 'All Categories'}
                activeLabel={activeCategoryLabel}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Body grid */}
      <section className="container py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12 items-start">
          <div className="min-w-0">
            {/* Featured Article */}
            {featuredPost && activeCategory === 'all' && !activeTag && !query && page === 1 && (
              <div className="mb-12">
                <SectionHeading>{blog?.featuredHeading ?? 'Featured Article'}</SectionHeading>
                <FeaturedCard post={featuredPost} />
              </div>
            )}

            {/* Active hashtag filter */}
            {activeTag && (
              <div className="mb-5 flex items-center gap-2 text-sm text-gray-600">
                <span>Showing posts tagged</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 font-medium text-brand">
                  {displayHashtag(activeTag)}
                  <button
                    type="button"
                    onClick={() => setActiveTag('')}
                    aria-label={`Clear ${displayHashtag(activeTag)} filter`}
                    className="text-brand/70 hover:text-brand"
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}

            {/* All articles */}
            <SectionHeading>{blog?.allArticlesHeading ?? 'All Articles'}</SectionHeading>

            {visible.length === 0 ? (
              <p className="text-center text-gray-500 py-16">
                {blog?.noResultsText ?? 'No articles match your search.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </div>

          {sidebar}
        </div>
      </section>
    </>
  )
}

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="block h-6 w-1 rounded-full bg-brand" />
    <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
  </div>
)

const CategoryDropdown: React.FC<{
  categories: Category[]
  value: string
  onChange: (v: string) => void
  placeholderLabel: string
  activeLabel: string
}> = ({ categories, value, onChange, placeholderLabel, activeLabel }) => {
  const [open, setOpen] = useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} className="relative sm:w-56 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full rounded-xl bg-white text-gray-800 py-3.5 px-4 text-sm font-medium flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        <span className="truncate">
          {value === 'all' ? placeholderLabel : activeLabel}
        </span>
        <ChevronDown
          className={cn('w-4 h-4 text-gray-500 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg ring-1 ring-black/5 max-h-72 overflow-auto py-1.5 text-left"
        >
          <DropdownOption
            label={placeholderLabel}
            selected={value === 'all'}
            onClick={() => {
              onChange('all')
              setOpen(false)
            }}
          />
          {categories.map((c) => (
            <DropdownOption
              key={c.id}
              label={c.title}
              selected={value === c.slug}
              onClick={() => {
                onChange(c.slug ?? 'all')
                setOpen(false)
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

const DropdownOption: React.FC<{
  label: string
  selected: boolean
  onClick: () => void
}> = ({ label, selected, onClick }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      role="option"
      aria-selected={selected}
      className={cn(
        'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
        selected ? 'text-brand font-semibold bg-brand/5' : 'text-gray-700',
      )}
    >
      {label}
    </button>
  </li>
)

const CategoryBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold text-white bg-brand">
    {label}
  </span>
)

const FeaturedCard: React.FC<{ post: Post }> = ({ post }) => {
  const cover = getCover(post)
  const category = getFirstCategory(post)
  const excerpt = getExcerpt(post)
  const date = formatDate(post.publishedAt)
  const author = post.populatedAuthors?.[0]?.name
  const readTime = estimateReadTime(post)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid sm:grid-cols-2 gap-6 rounded-2xl border border-gray-100 bg-white p-5 hover:shadow-xl hover:border-brand/30 transition-all duration-300"
    >
      <div className="relative aspect-5/4 sm:aspect-auto sm:h-full rounded-xl overflow-hidden bg-gray-100">
        {cover && (
          <Media
            resource={cover}
            fill
            size="(max-width: 640px) 100vw, 50vw"
            htmlElement={null}
            pictureClassName="absolute inset-0"
            imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="flex flex-col">
        {category && (
          <div className="mb-3">
            <CategoryBadge label={category.title.toUpperCase()} />
          </div>
        )}
        <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 leading-tight mb-3 group-hover:text-brand transition-colors">
          {post.title}
        </h3>
        {excerpt && (
          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5 line-clamp-3">
            {excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0" aria-hidden />
          <div className="min-w-0">
            {author && (
              <div className="font-semibold text-sm text-gray-900 truncate">{author}</div>
            )}
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {date && <span>{date}</span>}
              {date && readTime && <span aria-hidden>·</span>}
              {readTime && <span>{readTime} min read</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const cover = getCover(post)
  const category = getFirstCategory(post)
  const excerpt = getExcerpt(post)
  const date = formatDate(post.publishedAt)
  const author = post.populatedAuthors?.[0]?.name
  const readTime = estimateReadTime(post)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:border-brand/30 transition-all duration-300"
    >
      <div className="relative aspect-16/10 bg-gray-100 overflow-hidden">
        {cover && (
          <Media
            resource={cover}
            fill
            size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            htmlElement={null}
            pictureClassName="absolute inset-0"
            imgClassName="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {category && (
          <div className="absolute top-3 left-3">
            <CategoryBadge label={category.title.toUpperCase()} />
          </div>
        )}
      </div>
      <div className="flex flex-col grow p-5">
        <h3 className="text-base font-semibold text-gray-900 leading-snug mb-3 group-hover:text-brand transition-colors line-clamp-2">
          {post.title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            {date && <span>{date}</span>}
            {date && readTime && <span aria-hidden>·</span>}
            {readTime && <span>{readTime} min read</span>}
          </span>
        </div>
        {author && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" aria-hidden />
            <span className="text-xs font-medium text-gray-700 truncate">{author}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

const Pagination: React.FC<{
  page: number
  totalPages: number
  onChange: (p: number) => void
}> = ({ page, totalPages, onChange }) => {
  const pages = buildPageList(page, totalPages)
  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex justify-center items-center gap-2 flex-wrap"
    >
      <PaginationButton
        ariaLabel="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
      </PaginationButton>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
            className={cn(
              'min-w-9 h-9 px-3 rounded-lg text-sm font-semibold transition-colors',
              p === page
                ? 'bg-brand text-white'
                : 'text-gray-700 bg-white border border-gray-200 hover:border-brand/40 hover:text-brand',
            )}
          >
            {p}
          </button>
        ),
      )}
      <PaginationButton
        ariaLabel="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        <ArrowRight className="w-4 h-4" />
      </PaginationButton>
    </nav>
  )
}

const PaginationButton: React.FC<{
  children: React.ReactNode
  ariaLabel: string
  disabled: boolean
  onClick: () => void
}> = ({ children, ariaLabel, disabled, onClick }) => (
  <button
    type="button"
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'min-w-9 h-9 px-2 rounded-lg flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:border-brand/40 hover:text-brand transition-colors',
      disabled && 'opacity-40 cursor-not-allowed hover:border-gray-200 hover:text-gray-700',
    )}
  >
    {children}
  </button>
)

function buildPageList(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = []
  const add = (v: number | '…') => pages.push(v)
  add(1)
  if (current > 3) add('…')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    add(i)
  }
  if (current < total - 2) add('…')
  add(total)
  return pages
}
