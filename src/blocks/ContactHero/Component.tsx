import React from 'react'

import type { ContactHeroBlock as ContactHeroBlockProps } from '@/payload-types'

import { Reveal } from '@/components/Reveal'

// Render a heading string: "\n" → line break, **word** → brand-blue highlight.
const renderHeading = (raw: string) =>
  raw.split('\n').map((line, li) => (
    <span key={li} className="block">
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return (
            <span key={pi} className="text-brand">
              {part.slice(2, -2)}
            </span>
          )
        }
        return <React.Fragment key={pi}>{part}</React.Fragment>
      })}
    </span>
  ))

export const ContactHeroBlock: React.FC<ContactHeroBlockProps> = ({
  eyebrow,
  heading,
  subheading,
}) => {
  return (
    <section className="relative isolate overflow-hidden rounded-b-[2.5rem] bg-linear-to-b from-blue-50/70 via-blue-50/40 to-white">
      {/* soft brand blob, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 z-0 h-[600px] w-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(64,126,201,0.16) 0%, transparent 70%)',
        }}
      />

      <div className="container relative z-10 pt-20 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-3xl">
          {eyebrow && (
            <Reveal>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {eyebrow}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.08}>
            <h1
              className="font-extrabold tracking-[-0.04em] text-gray-900"
              style={{
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                lineHeight: 0.98,
              }}
            >
              {renderHeading(heading)}
            </h1>
          </Reveal>

          {subheading && (
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-gray-600 lg:text-lg">
                {subheading}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
