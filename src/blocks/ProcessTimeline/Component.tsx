import React from 'react'

import type { ProcessTimelineBlock as ProcessTimelineBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Reveal } from '@/components/Reveal'
import { Icon } from '../_shared/Icon'
import type { IconKey } from '../_shared/iconOptions'

const lgColsForCount: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
}

export const ProcessTimelineBlock: React.FC<ProcessTimelineBlockProps> = ({
  eyebrow,
  heading,
  steps,
}) => {
  const list = Array.isArray(steps) ? steps : []
  const lgCols = lgColsForCount[Math.min(list.length, 8)] || 'lg:grid-cols-6'

  return (
    <section className="container py-10 lg:py-16">
      <Reveal className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
        {eyebrow && (
          <div className="text-xs sm:text-sm uppercase tracking-[0.18em] text-brand font-semibold mb-3">
            {eyebrow}
          </div>
        )}
        {heading && (
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-tight">
            {heading}
          </h2>
        )}
      </Reveal>

      {list.length > 0 && (
        <div className="relative">
          {/* horizontal dashed connector — desktop only */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-7 left-[8%] right-[8%] border-t-2 border-dashed border-blue-200"
          />

          <ol
            className={cn(
              'relative grid gap-y-10 gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
              lgCols,
            )}
          >
            {list.map((step, i) => (
              <Reveal
                as="li"
                key={i}
                delay={i * 0.08}
                className="relative flex flex-col items-center text-center px-2"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-blue-300/40 ring-4 ring-white">
                  <Icon
                    name={step.icon as IconKey | null | undefined}
                    className="w-6 h-6"
                  />
                </div>
                <h3 className="mt-5 text-sm sm:text-base lg:text-lg font-semibold text-gray-900 leading-snug">
                  {`${i + 1}. ${step.title}`}
                </h3>
                {step.description && (
                  <p className="mt-2 text-xs lg:text-sm text-gray-600 leading-relaxed max-w-[16ch]">
                    {step.description}
                  </p>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
