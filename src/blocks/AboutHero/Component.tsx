import React from 'react'

import type { AboutHeroBlock as AboutHeroBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
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

export const AboutHeroBlock: React.FC<AboutHeroBlockProps> = ({
  eyebrow,
  heading,
  subheading,
  links,
}) => {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* faint grid background, fading at top & bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(64,126,201,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(64,126,201,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, rgba(0,0,0,0.45) 28%, rgba(0,0,0,0.45) 72%, transparent)',
          maskImage:
            'linear-gradient(to bottom, transparent, rgba(0,0,0,0.45) 28%, rgba(0,0,0,0.45) 72%, transparent)',
        }}
      />
      {/* soft brand blob, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 z-0 h-[600px] w-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(64,126,201,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="container relative z-10 pt-16 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-3xl">
          {eyebrow && (
            <Reveal>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {eyebrow}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.08}>
            <h1
              className="font-extrabold tracking-[-0.04em] text-gray-900"
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                lineHeight: 1.05,
              }}
            >
              {renderHeading(heading)}
            </h1>
          </Reveal>

          {subheading && (
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 lg:text-lg">
                {subheading}
              </p>
            </Reveal>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap gap-4">
                {links.map(({ link }, i) => {
                  const isOutline = link?.appearance === 'outline'
                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      appearance="inline"
                      className={cn(
                        'inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-[15px] font-medium transition-all duration-200 hover:-translate-y-0.5',
                        isOutline
                          ? 'border border-gray-300 bg-transparent text-gray-900 hover:border-brand hover:text-brand'
                          : 'bg-brand text-white shadow-[0_10px_28px_-10px_rgba(64,126,201,0.6)] hover:bg-blue-700',
                      )}
                    />
                  )
                })}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
