import React from 'react'

import type { StatsBlock as StatsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

export const StatsBlock: React.FC<StatsBlockProps> = ({
  eyebrow,
  heading,
  subheading,
  style = 'plain',
  items,
}) => {
  const isBrand = style === 'brand'
  const count = Array.isArray(items) ? items.length : 0
  const grid =
    count <= 2
      ? 'sm:grid-cols-2'
      : count === 3
        ? 'sm:grid-cols-3'
        : count === 4
          ? 'grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-2 lg:grid-cols-3'

  return (
    <section
      className={cn(
        'relative',
        isBrand && 'bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden',
      )}
    >
      {isBrand && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_50%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
          />
        </>
      )}

      <div className="container relative py-16 lg:py-20">
        {(eyebrow || heading || subheading) && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            {eyebrow && (
              <div
                className={cn(
                  'text-sm uppercase tracking-wider font-semibold mb-3',
                  isBrand ? 'text-blue-100' : 'text-brand',
                )}
              >
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p
                className={cn(
                  'text-base',
                  isBrand ? 'text-blue-50/90' : 'text-gray-600',
                )}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <div className={cn('grid gap-8 lg:gap-12', grid)}>
            {items.map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className={cn(
                    'text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none',
                    isBrand
                      ? 'bg-linear-to-r from-white to-blue-100 bg-clip-text text-transparent'
                      : 'text-brand',
                  )}
                >
                  {item.value}
                </div>
                <div
                  className={cn(
                    'mt-3 text-sm font-medium',
                    isBrand ? 'text-blue-100' : 'text-gray-600',
                  )}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
