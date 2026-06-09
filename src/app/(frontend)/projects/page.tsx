import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import { ArrowRight, Quote, Star } from 'lucide-react'

import type { PortfolioPage } from '@/payload-types'
import { Media } from '@/components/Media'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'

import { PortfolioGrid } from './PortfolioGrid.client'
import { Icon, highlightText } from './_icons'

export const dynamic = 'force-static'
export const revalidate = 600

/** Resolve a CMS link group to an href string. */
const resolveHref = (link?: PortfolioPage['ctaLink']): string | undefined => {
  if (!link) return undefined
  if (
    link.type === 'reference' &&
    link.reference &&
    typeof link.reference.value === 'object' &&
    'slug' in link.reference.value &&
    link.reference.value.slug
  ) {
    const rel = link.reference.relationTo
    return `${rel !== 'pages' ? `/${rel}` : ''}/${link.reference.value.slug}`
  }
  return link.url || undefined
}

export default async function ProjectsIndexPage() {
  const payload = await getPayload({ config: configPromise })

  const [result, portfolio] = await Promise.all([
    payload.find({
      collection: 'projects',
      draft: false,
      limit: 200,
      overrideAccess: false,
      pagination: false,
      sort: ['-featured', 'order', '-publishedAt'],
    }),
    getCachedGlobal('portfolio-page', 2)() as Promise<PortfolioPage>,
  ])

  const projects = result.docs ?? []

  const heroImage =
    portfolio?.image && typeof portfolio.image === 'object' ? portfolio.image : null
  const authorImage =
    portfolio?.authorImage && typeof portfolio.authorImage === 'object'
      ? portfolio.authorImage
      : null
  const ctaHref = resolveHref(portfolio?.ctaLink) ?? '/contact'
  const ctaLabel = portfolio?.ctaLink?.label || 'Get in Touch'
  const rating = Math.max(0, Math.min(5, portfolio?.rating ?? 5))

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-white to-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 bg-[radial-gradient(circle_at_20%_-10%,rgba(64,126,201,0.18),transparent_50%),radial-gradient(circle_at_80%_-10%,rgba(99,102,241,0.15),transparent_50%)]"
        />
        <div className="container pt-20 pb-12 lg:pt-28 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              {portfolio?.eyebrow && (
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-8 bg-brand" />
                  <span className="text-sm uppercase tracking-wider text-brand font-semibold">
                    {portfolio.eyebrow}
                  </span>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                {highlightText(portfolio?.heading) ?? 'Our Work'}
              </h1>
              {portfolio?.subtitle && (
                <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                  {portfolio.subtitle}
                </p>
              )}

              {Array.isArray(portfolio?.highlights) && portfolio.highlights.length > 0 && (
                <div className="mt-10 grid sm:grid-cols-3 gap-6">
                  {portfolio.highlights.map((h) => (
                    <div key={h.id} className="flex flex-col gap-3">
                      <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center">
                        <Icon name={h.icon} className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{h.title}</div>
                        {h.text && (
                          <div className="text-sm text-gray-600 leading-snug mt-0.5">
                            {h.text}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {heroImage && (
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-tr from-brand/10 to-indigo-200/30 blur-2xl"
                />
                <Media
                  resource={heroImage}
                  fill
                  priority
                  size="(max-width: 1024px) 100vw, 50vw"
                  htmlElement={null}
                  pictureClassName="relative block aspect-4/3 w-full"
                  imgClassName="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body: grid + sidebar */}
      <section className="container py-12 lg:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 min-w-0">
            <PortfolioGrid
              projects={projects}
              searchPlaceholder={portfolio?.searchPlaceholder ?? 'Search projects...'}
            />
          </div>

          <aside className="lg:sticky lg:top-24 flex flex-col gap-6">
            {/* Stats */}
            {Array.isArray(portfolio?.stats) && portfolio.stats.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                {portfolio?.statsHeading && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-5">
                    {portfolio.statsHeading}
                  </h2>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {portfolio.stats.map((s) => (
                    <div key={s.id} className="rounded-xl bg-gray-50 p-4">
                      <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                        <Icon name={s.icon} className="w-4 h-4 text-brand" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 leading-none">
                        {s.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5 leading-snug">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA card */}
            {(portfolio?.ctaHeading || portfolio?.ctaText) && (
              <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand to-indigo-600 p-6 text-white">
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10"
                />
                {portfolio?.ctaHeading && (
                  <h2 className="text-xl font-semibold mb-2">{portfolio.ctaHeading}</h2>
                )}
                {portfolio?.ctaText && (
                  <p className="text-white/85 text-sm leading-relaxed mb-5">{portfolio.ctaText}</p>
                )}
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand hover:bg-gray-50 transition-colors"
                >
                  {ctaLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Testimonial */}
            {portfolio?.quote && (
              <figure className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <Quote className="w-7 h-7 text-brand/30 mb-3" aria-hidden />
                <blockquote className="text-sm text-gray-700 leading-relaxed mb-5">
                  {portfolio.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  {authorImage && (
                    <Media
                      resource={authorImage}
                      fill
                      size="44px"
                      htmlElement={null}
                      pictureClassName="relative block w-11 h-11 rounded-full overflow-hidden shrink-0"
                      imgClassName="object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    {portfolio.authorName && (
                      <div className="font-semibold text-gray-900 text-sm truncate">
                        {portfolio.authorName}
                      </div>
                    )}
                    {portfolio.authorRole && (
                      <div className="text-xs text-gray-500 truncate">{portfolio.authorRole}</div>
                    )}
                  </div>
                  <div className="flex gap-0.5 ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3.5 h-3.5',
                          i < rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200 fill-gray-200',
                        )}
                        aria-hidden
                      />
                    ))}
                  </div>
                </figcaption>
              </figure>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected case studies and projects.',
}
