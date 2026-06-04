import React from 'react'
import { ArrowRight } from 'lucide-react'

import type { ServiceCardsGridBlock as ServiceCardsGridBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { Reveal } from '@/components/Reveal'
import { Icon } from '../_shared/Icon'
import type { IconKey } from '../_shared/iconOptions'

const colGrid: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
}

export const ServiceCardsGridBlock: React.FC<ServiceCardsGridBlockProps> = ({
  eyebrow,
  heading,
  columns = '3',
  cards,
}) => {
  const grid = colGrid[columns || '3']

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
        <div className="mt-5 flex items-center justify-center">
          <span className="block h-1 w-16 rounded-full bg-brand" />
        </div>
      </Reveal>

      {Array.isArray(cards) && cards.length > 0 && (
        <div className={cn('grid gap-6 lg:gap-8 grid-cols-1', grid)}>
          {cards.map((card, i) => (
            <Reveal
              key={i}
              delay={(i % 3) * 0.1}
              className="group flex flex-col p-7 lg:p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand text-white shadow-md shadow-blue-300/40">
                <Icon
                  name={card.icon as IconKey | null | undefined}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 leading-snug">
                {card.title}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed flex-1">
                {card.description}
              </p>
              {card.link && (card.link.url || card.link.reference) && (
                <CMSLink
                  appearance="inline"
                  {...card.link}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700 transition-colors"
                >
                  <span>{card.link.label || 'Learn More'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </CMSLink>
              )}
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
