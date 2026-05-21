'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import type { Project, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { CATEGORY_LABELS, CATEGORY_ORDER } from './_constants'

type Props = {
  projects: Project[]
}

export const PortfolioGrid: React.FC<Props> = ({ projects }) => {
  const [active, setActive] = useState<string>('all')

  const availableCategories = useMemo(() => {
    const present = new Set(projects.map((p) => p.category))
    return CATEGORY_ORDER.filter((c) => present.has(c as Project['category']))
  }, [projects])

  const filtered = useMemo(() => {
    if (active === 'all') return projects
    return projects.filter((p) => p.category === active)
  }, [active, projects])

  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-500 py-20">No projects published yet.</p>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        <FilterChip
          label={`All (${projects.length})`}
          active={active === 'all'}
          onClick={() => setActive('all')}
        />
        {availableCategories.map((cat) => {
          const count = projects.filter((p) => p.category === cat).length
          return (
            <FilterChip
              key={cat}
              label={`${CATEGORY_LABELS[cat]} (${count})`}
              active={active === cat}
              onClick={() => setActive(cat)}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
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
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600',
    )}
  >
    {label}
  </button>
)

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { slug, title, client, summary, coverImage, category, tags } = project
  const categoryLabel = category ? CATEGORY_LABELS[category] || category : null
  const cover =
    coverImage && typeof coverImage === 'object' ? (coverImage as MediaType) : null

  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {cover && (
          <Media
            resource={cover}
            imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {categoryLabel && (
          <div className="absolute top-4 left-4 text-[11px] uppercase tracking-wider text-white font-semibold bg-blue-600/95 backdrop-blur-sm px-3 py-1 rounded-full">
            {categoryLabel}
          </div>
        )}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          <ArrowUpRight className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        {client && (
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
            {client}
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
          {title}
        </h3>
        {summary && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow">
            {summary}
          </p>
        )}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
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
      </div>
    </Link>
  )
}
