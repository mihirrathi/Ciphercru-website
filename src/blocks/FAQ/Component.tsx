import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Plus, MessageCircleQuestion } from 'lucide-react'

export const FAQBlock: React.FC<FAQBlockProps & { id?: string }> = ({
  id,
  eyebrow,
  heading,
  intro,
  layout = 'split',
  allowMultipleOpen,
  items,
  footer,
}) => {
  const isSplit = layout === 'split'
  // Use a unique group name per block instance so multiple FAQ blocks on the same page
  // don't interfere with each other's exclusive-accordion behavior.
  const groupName = allowMultipleOpen ? undefined : `faq-${id || Math.random().toString(36).slice(2, 9)}`

  const headerBlock = (
    <div className={cn(!isSplit && 'text-center max-w-2xl mx-auto')}>
      {eyebrow && (
        <div className="text-sm uppercase tracking-[0.18em] font-semibold text-brand mb-3">
          {eyebrow}
        </div>
      )}
      {heading && (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-tight mb-4">
          {heading}
        </h2>
      )}
      {intro && (
        <p className="text-base lg:text-lg text-gray-600 leading-relaxed">{intro}</p>
      )}
    </div>
  )

  const accordion = (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {(items || []).map((item, i) => (
        <details
          key={i}
          name={groupName}
          open={item.defaultOpen ?? false}
          className="group py-5 sm:py-6"
        >
          <summary className="flex items-start gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="flex-1 text-base sm:text-lg font-semibold text-gray-900 group-hover:text-brand transition-colors leading-snug pt-0.5">
              {item.question}
            </span>
            <span className="shrink-0 w-9 h-9 rounded-full bg-blue-50 text-brand flex items-center justify-center transition-all group-open:bg-brand group-open:text-white group-open:rotate-45">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </summary>
          <div className="mt-4 pl-1 pr-12 text-gray-600 leading-relaxed">
            <RichText data={item.answer} enableGutter={false} />
          </div>
        </details>
      ))}
    </div>
  )

  return (
    <section className="container py-16 lg:py-24">
      {isSplit ? (
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">{headerBlock}</div>
          <div>{accordion}</div>
        </div>
      ) : (
        <>
          <div className="mb-12 lg:mb-16">{headerBlock}</div>
          <div className="max-w-3xl mx-auto">{accordion}</div>
        </>
      )}

      {footer?.enabled && (
        <div className="mt-16 lg:mt-20">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-white to-blue-50/60 border border-blue-100 p-8 sm:p-10 lg:p-12">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-brand/10 blur-3xl"
            />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-10">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center shadow-md shadow-blue-200/60">
                <MessageCircleQuestion className="w-6 h-6" />
              </div>
              <div className="flex-1">
                {footer.text && (
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                    {footer.text}
                  </h3>
                )}
                {footer.subtext && (
                  <p className="text-sm sm:text-base text-gray-600">{footer.subtext}</p>
                )}
              </div>
              {Array.isArray(footer.links) && footer.links.length > 0 && (
                <div className="flex flex-wrap gap-3 sm:shrink-0">
                  {footer.links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      size="lg"
                      {...link}
                      className="rounded-full! font-semibold"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
