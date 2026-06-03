import React from 'react'

import type { FeaturesBlock as FeaturesBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { Sparkles } from 'lucide-react'

const colGrid: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  eyebrow,
  heading,
  intro,
  alignment = 'center',
  columns = '3',
  cardStyle = 'soft',
  items,
}) => {
  const isCentered = alignment === 'center'
  const grid = colGrid[columns || '3']

  return (
    <section className="container py-16 lg:py-24">
      {(eyebrow || heading || intro) && (
        <Reveal
          className={cn(
            'mb-12 lg:mb-16',
            isCentered ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl',
          )}
        >
          {eyebrow && (
            <div className="text-sm uppercase tracking-wider text-brand font-semibold mb-3">
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-tight">
              {heading}
            </h2>
          )}
          {intro && (
            <RichText
              className="text-gray-600 text-base lg:text-lg"
              data={intro}
              enableGutter={false}
            />
          )}
        </Reveal>
      )}

      {Array.isArray(items) && items.length > 0 && (
        <div className={cn('grid gap-6 lg:gap-8 grid-cols-1', grid)}>
          {items.map((item, i) => {
            const hasIcon = item.icon && typeof item.icon === 'object'

            const inner = (
              <>
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-5',
                    hasIcon
                      ? 'bg-white border border-blue-100'
                      : 'bg-blue-50',
                  )}
                >
                  {hasIcon ? (
                    <Media
                      resource={item.icon!}
                      imgClassName="w-7 h-7 object-contain"
                    />
                  ) : (
                    <Sparkles className="w-6 h-6 text-brand" />
                  )}
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </>
            )

            if (cardStyle === 'soft') {
              return (
                <Reveal
                  key={i}
                  delay={(i % 4) * 0.1}
                  className="group p-6 lg:p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40 hover:-translate-y-1 transition-all duration-300"
                >
                  {inner}
                </Reveal>
              )
            }

            return (
              <Reveal key={i} delay={(i % 4) * 0.1} className="p-2">
                {inner}
              </Reveal>
            )
          })}
        </div>
      )}
    </section>
  )
}
