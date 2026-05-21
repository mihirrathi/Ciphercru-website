import React from 'react'

import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Star, Quote } from 'lucide-react'

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = (props) => {
  const { eyebrow, heading, intro, layout, items } = props

  const gridClass =
    layout === 'grid-2'
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div className="container">
      {(eyebrow || heading || intro) && (
        <div className="text-center max-w-2xl mx-auto mb-12">
          {eyebrow && (
            <div className="text-sm uppercase tracking-wider text-primary mb-3 font-medium">
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{heading}</h2>
          )}
          {intro && (
            <RichText
              className="text-muted-foreground"
              data={intro}
              enableGutter={false}
            />
          )}
        </div>
      )}

      {Array.isArray(items) && items.length > 0 && (
        <div className={cn('grid gap-6 lg:gap-8', gridClass)}>
          {items.map((item, i) => {
            const rating = item.rating ? parseInt(item.rating, 10) : 0
            return (
              <figure
                key={i}
                className="flex flex-col h-full p-6 lg:p-8 bg-card border border-border rounded-[0.8rem]"
              >
                <Quote className="w-8 h-8 text-primary/30 mb-4 shrink-0" />

                {rating > 0 && (
                  <div className="flex gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={cn(
                          'w-4 h-4',
                          idx < rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted text-muted',
                        )}
                      />
                    ))}
                  </div>
                )}

                <blockquote className="text-base leading-relaxed flex-grow mb-6">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3 mt-auto">
                  {item.authorPhoto && typeof item.authorPhoto === 'object' && (
                    <Media
                      resource={item.authorPhoto}
                      imgClassName="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{item.authorName}</div>
                    {(item.authorRole || item.authorCompany) && (
                      <div className="text-sm text-muted-foreground">
                        {[item.authorRole, item.authorCompany].filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      )}
    </div>
  )
}
