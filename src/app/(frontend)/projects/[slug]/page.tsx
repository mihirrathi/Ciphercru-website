import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  LayoutGrid,
  Star,
  User,
  Users,
} from 'lucide-react'
import React, { cache } from 'react'

import type { Project } from '@/payload-types'
import { Media } from '@/components/Media'
import { generateMeta } from '@/utilities/generateMeta'
import { cn } from '@/utilities/ui'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import ProjectPageClient from './page.client'
import { ScreenshotsCarousel } from './ScreenshotsCarousel.client'
import { CATEGORY_LABELS } from '../_constants'
import { Icon } from '../_icons'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return (projects.docs ?? []).map(({ slug }) => ({ slug: slug ?? '' }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/projects/${decodedSlug}`

  const project = await queryProjectBySlug({ slug: decodedSlug })

  if (!project) {
    return <PayloadRedirects url={url} />
  }

  const { prev, next } = await queryAdjacentProjects(project)

  const {
    title,
    titleAccent,
    summary,
    coverImage,
    category,
    client,
    duration,
    teamSize,
    year,
    tags,
    liveUrl,
    sourceUrl,
    caseStudyHighlight,
    overview,
    highlightStats,
    challenge,
    solution,
    results,
    technologiesHeading,
    technologies,
    keyFeaturesHeading,
    keyFeatures,
    screenshotsHeading,
    screenshots,
    testimonial,
  } = project

  const categoryLabel = category ? CATEGORY_LABELS[category] || category : null
  const rating = Math.max(0, Math.min(5, testimonial?.rating ?? 0))

  return (
    <article className="bg-gray-50 pb-20">
      <ProjectPageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Header */}
      <header className="relative overflow-hidden bg-linear-to-b from-blue-50/70 via-white to-white pt-8 pb-12 lg:pt-12 lg:pb-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 bg-[radial-gradient(circle_at_85%_-10%,rgba(64,126,201,0.18),transparent_55%)]"
        />
        <div className="container">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              {categoryLabel && (
                <div className="inline-block text-xs uppercase tracking-wider text-brand font-semibold bg-brand/10 px-3 py-1.5 rounded-full mb-5">
                  {categoryLabel}
                </div>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.1] mb-5">
                <span className="text-gray-900">{title}</span>
                {titleAccent && (
                  <>
                    <br />
                    <span className="text-brand">{titleAccent}</span>
                  </>
                )}
              </h1>
              {summary && (
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                  {summary}
                </p>
              )}

              {(client || duration || teamSize || year) && (
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
                  {client && (
                    <MetaItem
                      icon={<User className="w-4 h-4" />}
                      label="Client"
                      value={client}
                    />
                  )}
                  {duration && (
                    <MetaItem
                      icon={<Clock className="w-4 h-4" />}
                      label="Duration"
                      value={duration}
                    />
                  )}
                  {teamSize && (
                    <MetaItem
                      icon={<Users className="w-4 h-4" />}
                      label="Team Size"
                      value={teamSize}
                    />
                  )}
                  {year && (
                    <MetaItem
                      icon={<Calendar className="w-4 h-4" />}
                      label="Year"
                      value={String(year)}
                    />
                  )}
                </dl>
              )}

              {Array.isArray(tags) && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((t, i) => (
                    <span
                      key={t.id || i}
                      className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full"
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Website
                  </a>
                )}
                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-lg border border-gray-200 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    View Source Code
                  </a>
                )}
              </div>
            </div>

            <div className="relative">
              <Media
                resource={coverImage}
                imgClassName="w-full h-auto object-contain"
                pictureClassName="block"
              />
              {caseStudyHighlight && (
                <div className="absolute -bottom-4 -left-4 bg-brand text-white px-5 py-3 rounded-xl shadow-lg">
                  <div className="text-lg font-bold">{caseStudyHighlight}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Project Overview */}
      {(overview || (highlightStats && highlightStats.length > 0) || challenge?.description || solution?.description || (results?.items && results.items.length > 0)) && (
        <section className="container py-8 lg:py-10">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 mb-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
                  Project Overview
                </h2>
                {overview && (
                  <p className="text-gray-600 leading-relaxed">{overview}</p>
                )}
              </div>

              {Array.isArray(highlightStats) && highlightStats.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand to-indigo-600 p-6 text-white">
                  <div
                    aria-hidden
                    className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"
                  />
                  <div
                    aria-hidden
                    className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/5"
                  />
                  <div className="relative grid grid-cols-2 gap-x-6 gap-y-6">
                    {highlightStats.map((s, i) => (
                      <div key={s.id || i}>
                        <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center mb-3">
                          <Icon name={s.icon} className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-3xl font-bold leading-none">{s.value}</div>
                        <div className="text-xs text-white/80 mt-1.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(challenge?.description || solution?.description || (results?.items && results.items.length > 0)) && (
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 pt-8 border-t border-gray-100">
                {challenge?.description && (
                  <Pillar
                    icon={<Icon name={challenge.icon || 'target'} className="w-5 h-5 text-rose-500" />}
                    iconBg="bg-rose-50"
                    heading={challenge.heading || 'The Challenge'}
                  >
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {challenge.description}
                    </p>
                  </Pillar>
                )}
                {solution?.description && (
                  <Pillar
                    icon={<Icon name={solution.icon || 'lightbulb'} className="w-5 h-5 text-emerald-500" />}
                    iconBg="bg-emerald-50"
                    heading={solution.heading || 'Our Solution'}
                  >
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {solution.description}
                    </p>
                  </Pillar>
                )}
                {results?.items && results.items.length > 0 && (
                  <Pillar
                    icon={<Icon name={results.icon || 'trendingUp'} className="w-5 h-5 text-brand" />}
                    iconBg="bg-brand/10"
                    heading={results.heading || 'The Results'}
                  >
                    <ul className="space-y-2.5">
                      {results.items.map((item, i) => (
                        <li
                          key={item.id || i}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </Pillar>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Technologies + Key Features */}
      {((technologies && technologies.length > 0) || (keyFeatures && keyFeatures.length > 0)) && (
        <section className="container py-8 lg:py-10">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 lg:p-8 grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
            {technologies && technologies.length > 0 && (
              <div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">
                  {technologiesHeading || 'Technologies Used'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                  {technologies.map((tech, i) => (
                    <div
                      key={tech.id || i}
                      className="flex flex-col items-start gap-2.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                        {tech.logo && typeof tech.logo === 'object' ? (
                          <Media
                            resource={tech.logo}
                            imgClassName="w-7 h-7 object-contain"
                          />
                        ) : (
                          <LayoutGrid className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-700">{tech.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {keyFeatures && keyFeatures.length > 0 && (
              <div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">
                  {keyFeaturesHeading || 'Key Features'}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {keyFeatures.map((f, i) => (
                    <div key={f.id || i} className="flex flex-col gap-3">
                      <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center">
                        <Icon name={f.icon} className="w-5 h-5 text-brand" />
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">{f.title}</div>
                      {f.description && (
                        <div className="text-xs text-gray-600 leading-relaxed -mt-1">
                          {f.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Screenshots */}
      {Array.isArray(screenshots) && screenshots.length > 0 && (
        <ScreenshotsCarousel heading={screenshotsHeading} screenshots={screenshots} />
      )}

      {/* Testimonial */}
      {testimonial?.quote && (
        <section className="container py-8 lg:py-10">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8 lg:p-10">
            <div
              aria-hidden
              className="absolute left-6 top-6 text-[8rem] leading-none font-serif text-brand/15 select-none"
            >
              &ldquo;
            </div>
            <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 lg:gap-8 items-center">
              {testimonial.authorImage && typeof testimonial.authorImage === 'object' && (
                <div className="shrink-0">
                  <Media
                    resource={testimonial.authorImage}
                    imgClassName="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                  />
                </div>
              )}
              <div className="min-w-0">
                <blockquote className="text-base lg:text-lg text-gray-800 leading-relaxed mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                {(testimonial.authorName || testimonial.authorRole) && (
                  <div>
                    {testimonial.authorName && (
                      <div className="font-semibold text-gray-900">
                        {testimonial.authorName}
                      </div>
                    )}
                    {testimonial.authorRole && (
                      <div className="text-sm text-gray-500">{testimonial.authorRole}</div>
                    )}
                  </div>
                )}
              </div>
              {rating > 0 && (
                <div className="flex md:flex-col gap-1 md:items-end">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-5 h-5',
                          i < rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200 fill-gray-200',
                        )}
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Prev / Next */}
      {(prev || next) && (
        <section className="container py-8 lg:py-10">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 lg:p-6 grid md:grid-cols-[1fr_auto_1fr] items-center gap-6">
            <PrevNextLink project={prev} direction="prev" />
            <div className="hidden md:flex w-10 h-10 rounded-full bg-brand text-white items-center justify-center mx-auto">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <PrevNextLink project={next} direction="next" />
          </div>
        </section>
      )}
    </article>
  )
}

/* -------- Helpers (server) -------- */

const MetaItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-xs text-gray-500 leading-none mb-1">{label}</div>
      <div className="text-sm font-semibold text-gray-900 truncate">{value}</div>
    </div>
  </div>
)

const Pillar: React.FC<{
  icon: React.ReactNode
  iconBg: string
  heading: string
  children: React.ReactNode
}> = ({ icon, iconBg, heading, children }) => (
  <div>
    <div
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center mb-4',
        iconBg,
      )}
    >
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-3">{heading}</h3>
    {children}
  </div>
)

const PrevNextLink: React.FC<{
  project: Pick<Project, 'slug' | 'title' | 'coverImage'> | null
  direction: 'prev' | 'next'
}> = ({ project, direction }) => {
  if (!project) return <div />
  const isPrev = direction === 'prev'
  const label = isPrev ? 'Previous Project' : 'Next Project'

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        'group flex items-center gap-4',
        isPrev ? 'justify-start' : 'justify-end md:flex-row-reverse md:text-right',
      )}
    >
      {project.coverImage && typeof project.coverImage === 'object' && (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
          <Media
            resource={project.coverImage}
            imgClassName="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="min-w-0">
        <div
          className={cn(
            'text-xs text-gray-500 flex items-center gap-1',
            isPrev ? '' : 'md:justify-end',
          )}
        >
          {isPrev && <ArrowLeft className="w-3 h-3" />}
          {label}
          {!isPrev && <ArrowRight className="w-3 h-3" />}
        </div>
        <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand transition-colors">
          {project.title}
        </div>
      </div>
    </Link>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug({ slug: decodedSlug })
  return generateMeta({ doc: project })
}

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})

type AdjacentProject = Pick<Project, 'slug' | 'title' | 'coverImage'> | null

const queryAdjacentProjects = async (
  current: Project,
): Promise<{ prev: AdjacentProject; next: AdjacentProject }> => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'projects',
    draft: false,
    overrideAccess: false,
    pagination: false,
    limit: 1000,
    sort: ['order', '-publishedAt'],
    select: { slug: true, title: true, coverImage: true, order: true, publishedAt: true },
  })

  const docs = result.docs ?? []
  const idx = docs.findIndex((d) => d.id === current.id)
  if (idx === -1) return { prev: null, next: null }

  return {
    prev: idx > 0 ? (docs[idx - 1] as AdjacentProject) : null,
    next: idx < docs.length - 1 ? (docs[idx + 1] as AdjacentProject) : null,
  }
}
