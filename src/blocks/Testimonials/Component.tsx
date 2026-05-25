'use client'

import React, { useEffect, useMemo, useState } from 'react'

import type { TestimonialsBlock as TestimonialsBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { Star, Quote } from 'lucide-react'

const renderHeading = (raw: string) => {
  const parts = raw.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <span key={i} className="text-brand">
          {p.slice(2, -2)}
        </span>
      )
    }
    return <React.Fragment key={i}>{p}</React.Fragment>
  })
}

const DotPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div
    aria-hidden
    className={cn('grid grid-cols-6 gap-2', className)}
  >
    {Array.from({ length: 36 }).map((_, i) => (
      <span key={i} className="w-1.5 h-1.5 rounded-full bg-brand/30" />
    ))}
  </div>
)

type Item = NonNullable<TestimonialsBlockProps['items']>[number]

const TestimonialCard: React.FC<{ item: Item }> = ({ item }) => {
  const rating = item.rating ? parseInt(item.rating, 10) : 0
  const hasPhoto = item.authorPhoto && typeof item.authorPhoto === 'object'
  const hasLogo = item.companyLogo && typeof item.companyLogo === 'object'

  return (
    <figure className="flex flex-col h-full p-6 lg:p-7 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-blue-100/40">
      <Quote
        className="w-10 h-10 text-brand mb-4 shrink-0 -scale-x-100"
        fill="currentColor"
        strokeWidth={0}
      />

      <blockquote className="text-base leading-relaxed text-gray-700 grow mb-6">
        {item.quote}
      </blockquote>

      <hr className="border-gray-200 mb-5" />

      <figcaption className="flex items-center gap-4">
        {hasPhoto && (
          <Media
            resource={item.authorPhoto}
            imgClassName="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 leading-tight">{item.authorName}</div>
          {(item.authorRole || item.authorCompany) && (
            <div className="text-sm text-gray-500 truncate">
              {[item.authorRole, item.authorCompany].filter(Boolean).join(', ')}
            </div>
          )}
          {rating > 0 && (
            <div className="flex gap-0.5 mt-1.5" aria-label={`${rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={cn(
                    'w-3.5 h-3.5',
                    idx < rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200',
                  )}
                />
              ))}
            </div>
          )}
        </div>
        {hasLogo && (
          <div className="shrink-0 max-w-26">
            <Media
              resource={item.companyLogo}
              imgClassName="max-h-9 w-auto object-contain"
            />
          </div>
        )}
      </figcaption>
    </figure>
  )
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = (props) => {
  const { eyebrow, heading, intro, perSlide, autoplay, items } = props

  const [activeSlide, setActiveSlide] = useState(0)
  const [columns, setColumns] = useState(1)

  const desktopPerSlide = perSlide === '2' ? 2 : 3

  useEffect(() => {
    const compute = () => {
      if (typeof window === 'undefined') return
      const w = window.innerWidth
      if (w >= 1024) setColumns(desktopPerSlide)
      else if (w >= 640) setColumns(2)
      else setColumns(1)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [desktopPerSlide])

  const slides = useMemo(() => {
    const list = items || []
    if (list.length === 0) return [] as Item[][]
    const result: Item[][] = []
    for (let i = 0; i < list.length; i += columns) {
      result.push(list.slice(i, i + columns))
    }
    return result
  }, [items, columns])

  useEffect(() => {
    if (activeSlide > slides.length - 1) setActiveSlide(0)
  }, [slides.length, activeSlide])

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length)
    }, 6000)
    return () => clearInterval(id)
  }, [autoplay, slides.length])

  const showDots = slides.length > 1
  const gridCols =
    columns === 3 ? 'grid-cols-3' : columns === 2 ? 'grid-cols-2' : 'grid-cols-1'

  return (
    <section className="relative bg-blue-50/40 py-16 lg:py-24 overflow-hidden">
      <DotPattern className="absolute top-24 left-6 lg:left-12 opacity-70 hidden sm:grid" />
      <DotPattern className="absolute bottom-24 right-6 lg:right-12 opacity-70 hidden sm:grid" />

      <div className="container relative">
        {(eyebrow || heading || intro) && (
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-14">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 text-xs sm:text-[0.8rem] uppercase tracking-[0.18em] text-brand font-semibold mb-4">
                <span className="h-px w-6 bg-brand/70" />
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-4">
                {renderHeading(heading)}
              </h2>
            )}
            {intro && (
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">{intro}</p>
            )}
          </div>
        )}

        {slides.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((slide, sIdx) => (
                  <div key={sIdx} className="w-full shrink-0">
                    <div className={cn('grid gap-6 lg:gap-8 px-1', gridCols)}>
                      {slide.map((item, iIdx) => (
                        <TestimonialCard key={iIdx} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showDots && (
              <div className="flex justify-center items-center gap-2 mt-10">
                {slides.map((_, i) => {
                  const isActive = i === activeSlide
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'h-2.5 rounded-full transition-all',
                        isActive ? 'w-7 bg-brand' : 'w-2.5 bg-gray-300 hover:bg-gray-400',
                      )}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
