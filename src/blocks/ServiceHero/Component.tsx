import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type { ServiceHeroBlock as ServiceHeroBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { Reveal } from '@/components/Reveal'
import { Icon } from '../_shared/Icon'
import type { IconKey } from '../_shared/iconOptions'

export const ServiceHeroBlock: React.FC<ServiceHeroBlockProps> = ({
  breadcrumbs,
  title,
  description,
  highlights,
  links,
  image,
  techStack,
}) => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-brand via-blue-600 to-blue-700 text-white">
      {/* decorative grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_center,black_45%,transparent_80%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_90%_85%,rgba(0,0,0,0.18),transparent_50%)]"
      />

      <div className="container relative pt-10 pb-20 lg:pt-14 lg:pb-28">
        {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-sm text-white/80 mb-10"
            >
            {breadcrumbs.map((c, i) => {
              const isLast = i === breadcrumbs.length - 1
              return (
                <React.Fragment key={i}>
                  {c.href && !isLast ? (
                    <Link
                      href={c.href}
                      className="hover:text-white transition-colors"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className={cn(isLast && 'text-white font-medium')}>{c.label}</span>
                  )}
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-white/50" />}
                </React.Fragment>
              )
            })}
            </nav>
          </Reveal>
        )}

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <Reveal as="h1" delay={0.05} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              {title}
            </Reveal>
            {description && (
              <Reveal as="p" delay={0.15} className="mt-6 max-w-xl text-base lg:text-lg text-white/85 leading-relaxed">
                {description}
              </Reveal>
            )}

            {Array.isArray(highlights) && highlights.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-4">
                {highlights.map((h, i) => (
                  <Reveal
                    key={i}
                    delay={0.25 + i * 0.1}
                    className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3 min-w-[200px]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 border border-white/20">
                      <Icon
                        name={h.icon as IconKey | null | undefined}
                        className="w-4 h-4 text-white"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-tight">
                        {h.title}
                      </div>
                      {h.description && (
                        <div className="text-xs text-white/75 mt-0.5 leading-snug">
                          {h.description}
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <Reveal delay={0.45} className="mt-10 flex flex-wrap gap-4">
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    size="lg"
                    {...link}
                    className={cn(
                      'font-semibold rounded-full! px-7 transition-all duration-200 hover:-translate-y-0.5',
                      i === 0 &&
                        'bg-white! text-brand! hover:bg-white/95! shadow-lg shadow-blue-900/30',
                      i > 0 && 'border-white/40! text-white! hover:bg-white/10!',
                    )}
                  />
                ))}
              </Reveal>
            )}
          </div>

          {/* RIGHT — image + tech tiles */}
          {image && (
            <Reveal direction="left" delay={0.2} className="relative">
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl shadow-blue-900/40">
                <Media
                  resource={image}
                  imgClassName="w-full h-auto object-cover aspect-[16/11]"
                />
              </div>

              {Array.isArray(techStack) && techStack.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {techStack.map((t, i) => (
                    <div
                      key={i}
                      className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-lg shadow-blue-900/20 p-2"
                      title={t.label || undefined}
                    >
                      <Media
                        resource={t.logo}
                        imgClassName="w-full h-full object-contain"
                        alt={t.label || ''}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
