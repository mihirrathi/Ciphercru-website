import React from 'react'

import type { LogoMarqueeBlock as LogoMarqueeBlockProps, Media as MediaType } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'

const speedToDuration: Record<string, string> = {
  slow: '60s',
  medium: '35s',
  fast: '20s',
}

type LogoItem = NonNullable<LogoMarqueeBlockProps['logos']>[number]

const Logo: React.FC<{ logo: LogoItem; grayscale: boolean }> = ({ logo, grayscale }) => {
  const img = logo.image && typeof logo.image === 'object' ? (logo.image as MediaType) : null
  const inner = (
    <div
      className={cn(
        'flex items-center justify-center h-16 sm:h-20 px-6 sm:px-10 shrink-0 transition-all',
        grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100',
      )}
      aria-label={logo.name}
    >
      {img && (
        <Media
          resource={img}
          className="flex items-center justify-center"
          pictureClassName="block"
          imgClassName="block max-h-10 sm:max-h-12 w-auto max-w-[180px] object-contain"
        />
      )}
    </div>
  )

  if (logo.url) {
    return (
      <a
        href={logo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0"
      >
        {inner}
      </a>
    )
  }
  return inner
}

export const LogoMarqueeBlock: React.FC<LogoMarqueeBlockProps> = ({
  eyebrow,
  heading,
  speed = 'medium',
  pauseOnHover = true,
  grayscale = true,
  background = 'plain',
  logos,
}) => {
  const items = Array.isArray(logos) ? logos : []
  if (items.length === 0) return null

  const duration = speedToDuration[speed || 'medium']
  const isTint = background === 'tint'

  return (
    <section
      className={cn(
        'relative overflow-hidden py-12 lg:py-16',
        isTint && 'bg-linear-to-b from-blue-50/50 to-white',
      )}
    >
      <div className="container">
        {(eyebrow || heading) && (
          <div className="text-center mb-8 lg:mb-10">
            {eyebrow && (
              <div className="text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold text-brand mb-2">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                {heading}
              </h2>
            )}
          </div>
        )}

        <div
          className="group relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div
            className={cn(
              'flex items-center w-max animate-marquee',
              pauseOnHover && 'group-hover:paused',
            )}
            style={{ ['--marquee-duration' as string]: duration }}
          >
            {/* Original set */}
            {items.map((logo, i) => (
              <Logo key={`a-${i}`} logo={logo} grayscale={grayscale ?? true} />
            ))}
            {/* Duplicated set for seamless loop */}
            {items.map((logo, i) => (
              <Logo key={`b-${i}`} logo={logo} grayscale={grayscale ?? true} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
