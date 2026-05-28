'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, RotateCw, Search } from 'lucide-react'

import type { Project, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { CATEGORY_LABELS, CATEGORY_ORDER } from './_constants'

const PAGE_SIZE = 6

type Props = {
  projects: Project[]
  searchPlaceholder?: string
}

export const PortfolioGrid: React.FC<Props> = ({
  projects,
  searchPlaceholder = 'Search projects...',
}) => {
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const availableCategories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category))
    return CATEGORY_ORDER.filter((c) => present.has(c as Project['category']))
  }, [projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      if (active !== 'all' && p.category !== active) return false
      if (!q) return true
      const haystack = [
        p.title,
        p.client,
        p.summary,
        ...(Array.isArray(p.tags) ? p.tags.map((t) => t.label) : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [active, query, projects])

  // Reset the visible count whenever the filter or search changes.
  const filterKey = `${active}:${query.trim().toLowerCase()}`
  const [lastKey, setLastKey] = useState(filterKey)
  if (filterKey !== lastKey) {
    setLastKey(filterKey)
    setVisible(PAGE_SIZE)
  }

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  if (projects.length === 0) {
    return <p className="text-center text-gray-500 py-20">No projects published yet.</p>
  }

  return (
    <>
      {/* Controls: filter tabs + search */}
      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All Projects" active={active === 'all'} onClick={() => setActive('all')} />
          {availableCategories.map((cat) => (
            <FilterChip
              key={cat}
              label={CATEGORY_LABELS[cat]}
              active={active === cat}
              onClick={() => setActive(cat)}
            />
          ))}
        </div>

        <div className="relative lg:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search projects"
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No projects match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
          {shown.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand transition-colors"
          >
            Load More Projects
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )
}

const FilterChip: React.FC<{
  label: string
  active: boolean
  onClick: () => void
}> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'text-sm font-medium px-4 py-2 rounded-full border transition-colors',
      active
        ? 'bg-brand text-white border-brand'
        : 'bg-white text-gray-700 border-gray-200 hover:border-brand/40 hover:text-brand',
    )}
  >
    {label}
  </button>
)

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { slug, title, client, summary, coverImage, category, tags } = project
  const categoryLabel = category ? CATEGORY_LABELS[category] || category : null
  const cover = coverImage && typeof coverImage === 'object' ? (coverImage as MediaType) : null

  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand/30 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-gray-50">
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
        {categoryLabel && (
          <div className="absolute top-4 left-4 text-[11px] uppercase tracking-wider text-white font-semibold bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
            {categoryLabel}
          </div>
        )}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <ArrowUpRight className="w-5 h-5 text-brand" />
        </div>
      </div>

      <div className="flex flex-col grow p-6">
        {client && (
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
            {client}
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand transition-colors leading-snug">
          {title}
        </h3>
        {summary && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{summary}</p>
        )}

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 4).map((t, i) => (
              <span
                key={i}
                className="text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full"
              >
                {t.label}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-[11px] font-medium text-gray-500 px-2.5 py-1">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          View Case Study
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
