import React from 'react'

import type { LandingHeroBlock as LandingHeroBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

const renderHeading = (raw: string) => {
  const parts = raw.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <span key={i} className="text-brand block sm:inline">
          {p.slice(2, -2)}
        </span>
      )
    }
    return <React.Fragment key={i}>{p}</React.Fragment>
  })
}

const CircuitPattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    aria-hidden
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
  >
    <g stroke="white" strokeWidth="1.2" opacity="0.35">
      <path d="M0 80 L120 80 L140 100 L240 100" />
      <circle cx="240" cy="100" r="4" />
      <path d="M240 100 L260 80 L360 80" />
      <circle cx="360" cy="80" r="4" />

      <path d="M40 160 L160 160 L180 180 L320 180" />
      <circle cx="320" cy="180" r="4" />

      <path d="M0 240 L80 240 L100 260 L200 260 L220 240 L360 240" />
      <circle cx="100" cy="260" r="3" />
      <circle cx="220" cy="240" r="3" />

      <path d="M40 320 L140 320 L160 340 L300 340" />
      <circle cx="300" cy="340" r="4" />
    </g>
    <g fill="white" opacity="0.5">
      <rect x="20" y="40" width="60" height="14" rx="2" />
      <rect x="280" y="200" width="50" height="12" rx="2" />
      <rect x="150" y="300" width="40" height="10" rx="2" />
    </g>
  </svg>
)

export const LandingHeroBlock: React.FC<LandingHeroBlockProps> = ({
  badge,
  heading,
  subheading,
  links,
  image,
  trustText,
  background = 'gradient',
  introContent,
}) => {
  return (
    <section className="relative overflow-hidden">
      {background === 'gradient' && (
        <>
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-blue-50/40 via-white to-white" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-60 bg-[radial-gradient(circle_at_10%_-10%,rgba(64,126,201,0.18),transparent_55%),radial-gradient(circle_at_50%_110%,rgba(64,126,201,0.12),transparent_55%)]"
          />
        </>
      )}
      {background === 'grid' && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(64,126,201,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(64,126,201,0.08)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
        />
      )}

      <div className="container pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div
          className={cn(
            'grid items-center gap-10 lg:gap-12',
            image ? 'lg:grid-cols-[6fr_7fr]' : 'lg:grid-cols-1 lg:text-center',
          )}
        >
          {/* LEFT — content */}
          <div className={cn('relative', !image && 'mx-auto max-w-3xl')}>
            {badge && (
              <div className="text-xs sm:text-sm tracking-[0.18em] font-bold text-gray-900 uppercase mb-5">
                {badge}
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 uppercase leading-[1.02]">
              {renderHeading(heading)}
            </h1>

            {subheading && (
              <p className="mt-6 text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl">
                {subheading}
              </p>
            )}

            {introContent && (
              <div className="mt-6 max-w-xl">
                <RichText data={introContent} enableGutter={false} />
              </div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <div
                className={cn(
                  'mt-9 flex flex-wrap gap-4',
                  !image && 'justify-center',
                )}
              >
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    size="lg"
                    {...link}
                    className="uppercase tracking-wider font-semibold rounded-full! px-7"
                  />
                ))}
              </div>
            )}

            {trustText && (
              <p className="mt-6 text-sm text-gray-500">{trustText}</p>
            )}
          </div>

          {/* RIGHT — image + geometric backdrop */}
          {image && (
            <div className="relative">
              {/* Big brand-color geometric shape on the right */}
              <div
                aria-hidden
                className="absolute -right-6 sm:-right-10 lg:-right-16 -top-6 lg:-top-10 -bottom-10 lg:-bottom-16 w-[65%] sm:w-[60%] bg-brand rounded-l-4xl rounded-tr-4xl overflow-hidden shadow-xl shadow-blue-300/30"
              >
                <CircuitPattern className="absolute inset-0 w-full h-full" />
                {/* tiny accent strokes top-right */}
                <div className="absolute top-6 right-6 flex flex-col gap-1.5">
                  <div className="w-10 h-0.5 bg-white/40 rounded-full" />
                  <div className="w-6 h-0.5 bg-white/30 rounded-full" />
                </div>
              </div>

              {/* Lower-left accent block */}
              <div
                aria-hidden
                className="hidden lg:block absolute -left-4 -bottom-6 w-24 h-24 bg-brand rounded-2xl rotate-6 opacity-90 shadow-lg shadow-blue-300/40"
              />

              {/* The image on top of everything */}
              <div className="relative rounded-2xl overflow-hidden border border-white shadow-2xl shadow-blue-300/30 mr-6 sm:mr-10 lg:mr-14">
                <Media
                  resource={image}
                  imgClassName="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
