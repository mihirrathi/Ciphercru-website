import React from 'react'

import type { WhyChooseUsBlock as WhyChooseUsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { Reveal } from '@/components/Reveal'
import { Icon } from '../_shared/Icon'
import type { IconKey } from '../_shared/iconOptions'

export const WhyChooseUsBlock: React.FC<WhyChooseUsBlockProps> = ({
  eyebrow,
  heading,
  description,
  links,
  stats,
}) => {
  const count = Array.isArray(stats) ? stats.length : 0
  const statsGrid =
    count <= 2
      ? 'grid-cols-2'
      : count === 3
        ? 'grid-cols-3'
        : 'grid-cols-2 lg:grid-cols-4'

  return (
    <section className="container py-6 lg:py-8">
      <Reveal className="rounded-3xl bg-linear-to-br from-blue-50 via-blue-50/60 to-white border border-blue-100 p-8 lg:p-12 shadow-sm">
        <div className="grid items-center gap-10 lg:grid-cols-[5fr_7fr]">
          {/* LEFT — content */}
          <div>
            {eyebrow && (
              <div className="text-xs sm:text-sm uppercase tracking-[0.18em] text-brand font-semibold mb-3">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-sm lg:text-base text-gray-600 leading-relaxed max-w-md">
                {description}
              </p>
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    size="default"
                    {...link}
                    className="rounded-full! px-6 font-semibold"
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — stats */}
          {Array.isArray(stats) && stats.length > 0 && (
            <div className={cn('grid gap-6 lg:gap-8', statsGrid)}>
              {stats.map((s, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.08}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center mb-3">
                    <Icon
                      name={s.icon as IconKey | null | undefined}
                      className="w-10 h-10 text-brand"
                    />
                  </div>
                  <AnimatedNumber
                    value={s.value}
                    className="block text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand tabular-nums leading-none"
                  />
                  <div className="mt-2 text-xs lg:text-sm font-medium text-gray-600 leading-snug max-w-40">
                    {s.label}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
