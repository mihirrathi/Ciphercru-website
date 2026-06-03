import React from 'react'

import type { CtaBannerBlock as CtaBannerBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { Icon } from '../_shared/Icon'
import type { IconKey } from '../_shared/iconOptions'

export const CtaBannerBlock: React.FC<CtaBannerBlockProps> = ({
  icon,
  heading,
  subheading,
  links,
}) => {
  return (
    <section className="container py-12 lg:py-16">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand via-blue-600 to-blue-700 text-white px-6 py-8 lg:px-12 lg:py-10 shadow-xl shadow-blue-300/30">
        {/* decorative pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_15%_50%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_85%_50%,rgba(0,0,0,0.15),transparent_50%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[36px_36px]"
        />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
          <div className="hidden sm:flex h-16 w-16 lg:h-20 lg:w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm">
            <Icon
              name={icon as IconKey | null | undefined}
              className="w-8 h-8 lg:w-10 lg:h-10 text-white"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl lg:text-3xl font-semibold leading-tight">
              {heading}
            </h3>
            {subheading && (
              <p className="mt-2 text-sm lg:text-base text-white/85 leading-relaxed max-w-2xl">
                {subheading}
              </p>
            )}
          </div>

          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-wrap gap-3 shrink-0">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  size="lg"
                  {...link}
                  className={cn(
                    'font-semibold rounded-full! px-7 transition-all duration-200 hover:-translate-y-0.5',
                    i === 0 && 'bg-white! text-brand! hover:bg-white/95!',
                    i > 0 && 'border-white/40! text-white! hover:bg-white/10!',
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
