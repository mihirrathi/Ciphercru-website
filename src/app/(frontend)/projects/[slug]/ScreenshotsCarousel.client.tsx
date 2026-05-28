'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Shot = {
  image: MediaType | string | number
  caption?: string | null
  id?: string | null
}

export const ScreenshotsCarousel: React.FC<{
  heading?: string | null
  screenshots: Shot[]
}> = ({ heading, screenshots }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateAvailability = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateAvailability()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener('scroll', updateAvailability, { passive: true })
    window.addEventListener('resize', updateAvailability)
    return () => {
      el.removeEventListener('scroll', updateAvailability)
      window.removeEventListener('resize', updateAvailability)
    }
  }, [updateAvailability])

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const firstChild = el.firstElementChild as HTMLElement | null
    const step = firstChild ? firstChild.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: step * dir, behavior: 'smooth' })
  }

  return (
    <section className="container py-10 lg:py-14">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
            {heading || 'Project Screenshots'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Previous screenshots"
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border transition-colors',
                canPrev
                  ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed',
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Next screenshots"
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                canNext
                  ? 'bg-brand text-white hover:bg-brand/90'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed',
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {screenshots.map((shot, i) => (
            <figure
              key={shot.id || i}
              className="snap-start shrink-0 w-[78%] sm:w-[48%] lg:w-[31%] rounded-xl border border-gray-100 bg-gray-50 overflow-hidden"
            >
              <div className="aspect-[16/11] overflow-hidden">
                <Media
                  resource={shot.image}
                  imgClassName="w-full h-full object-cover"
                />
              </div>
              {shot.caption && (
                <figcaption className="px-4 py-3 text-sm text-gray-600">
                  {shot.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
