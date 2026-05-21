import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, User } from 'lucide-react'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { Media } from '@/components/Media'
import { generateMeta } from '@/utilities/generateMeta'
import ProjectPageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { CATEGORY_LABELS } from '../_constants'

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

  const { hero, layout, coverImage, category, client, year, tags, liveUrl, caseStudyHighlight, summary, title } = project

  const categoryLabel = category ? CATEGORY_LABELS[category] || category : null
  const hasHero = hero && hero.type && hero.type !== 'none'

  return (
    <article className="pb-24">
      <ProjectPageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {hasHero ? (
        <RenderHero {...hero} />
      ) : (
        <header className="relative bg-linear-to-b from-blue-50 to-white pt-12 pb-16">
          <div className="container">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to portfolio
            </Link>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                {categoryLabel && (
                  <div className="inline-block text-xs uppercase tracking-wider text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full mb-4">
                    {categoryLabel}
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-tight">
                  {title}
                </h1>
                {summary && (
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">{summary}</p>
                )}

                <dl className="grid grid-cols-2 gap-6 mb-8">
                  {client && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                        <User className="w-3.5 h-3.5" />
                        Client
                      </dt>
                      <dd className="text-base font-semibold text-gray-900">{client}</dd>
                    </div>
                  )}
                  {year && (
                    <div>
                      <dt className="text-xs uppercase tracking-wider text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Year
                      </dt>
                      <dd className="text-base font-semibold text-gray-900">{year}</dd>
                    </div>
                  )}
                </dl>

                {Array.isArray(tags) && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full"
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                )}

                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
                  >
                    Visit live site
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <Media
                    resource={coverImage}
                    imgClassName="w-full h-auto"
                  />
                </div>
                {caseStudyHighlight && (
                  <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg">
                    <div className="text-2xl font-bold">{caseStudyHighlight}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="pt-12">
        <RenderBlocks blocks={layout} />
      </div>
    </article>
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
