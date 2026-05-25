'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'

import type { LandingHeroBlock as LandingHeroBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
}

const renderHeading = (raw: string) => {
  const parts = raw.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <span
          key={i}
          className="block sm:inline bg-linear-to-r from-brand via-blue-500 to-blue-400 bg-clip-text text-transparent"
        >
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
  videoBackground,
  videoPoster,
  trustText,
  background = 'gradient',
  introContent,
}) => {
  const hasVideo =
    videoBackground &&
    typeof videoBackground === 'object' &&
    typeof videoBackground.mimeType === 'string' &&
    videoBackground.mimeType.includes('video')

  if (hasVideo) {
    return (
      <section className="relative overflow-hidden isolate min-h-screen -mt-28 flex items-center">
        {/* Background video */}
        <div className="absolute inset-0 -z-20">
          <Media
            resource={videoBackground}
            videoClassName="absolute inset-0 w-full h-full object-cover"
          />
          {/* Poster image fallback layer (shown until video paints) */}
          {videoPoster && typeof videoPoster === 'object' && (
            <Media
              resource={videoPoster}
              imgClassName="absolute inset-0 w-full h-full object-cover -z-10"
            />
          )}
        </div>

        {/* Legibility overlays */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-b from-black/70 via-black/55 to-black/80"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(64,126,201,0.35),transparent_60%)]"
        />

        <div className="container py-24 lg:py-32 w-full">
          <motion.div
            className="mx-auto max-w-4xl text-center text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {badge && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur px-3.5 py-1.5 text-xs sm:text-[0.8rem] tracking-[0.16em] font-semibold text-white uppercase mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-blue-300 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-300" />
                </span>
                {badge}
              </motion.div>
            )}

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-bold tracking-tight uppercase leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
            >
              {renderHeading(heading)}
            </motion.h1>

            {subheading && (
              <motion.p
                variants={itemVariants}
                className="mt-6 mx-auto max-w-2xl text-base lg:text-lg text-white/85 leading-relaxed"
              >
                {subheading}
              </motion.p>
            )}

            {introContent && (
              <motion.div
                variants={itemVariants}
                className="mt-6 mx-auto max-w-2xl text-white/85"
              >
                <RichText data={introContent} enableGutter={false} />
              </motion.div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-wrap gap-4 justify-center"
              >
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    size="lg"
                    {...link}
                    className={cn(
                      'uppercase tracking-wider font-semibold rounded-full! px-7 transition-all duration-200 hover:-translate-y-0.5',
                      i === 0 &&
                        'shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-900/60',
                    )}
                  />
                ))}
              </motion.div>
            )}

            {trustText && (
              <motion.div
                variants={itemVariants}
                className="mt-8 flex items-center justify-center gap-2.5 text-sm text-white/75"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-blue-300"
                >
                  <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <p>{trustText}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden">
      {background === 'gradient' && (
        <>
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-blue-50/60 via-white to-white" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-70 bg-[radial-gradient(circle_at_10%_-10%,rgba(64,126,201,0.22),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(64,126,201,0.10),transparent_50%),radial-gradient(circle_at_50%_110%,rgba(64,126,201,0.16),transparent_55%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-40 bg-[linear-gradient(rgba(64,126,201,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(64,126,201,0.06)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_top,black_25%,transparent_75%)]"
          />
        </>
      )}
      {background === 'grid' && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(64,126,201,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(64,126,201,0.08)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
        />
      )}

      <div className="container pt-14 pb-20 lg:pt-20 lg:pb-32">
        <div
          className={cn(
            'grid items-center gap-12 lg:gap-16',
            image ? 'lg:grid-cols-[6fr_7fr]' : 'lg:grid-cols-1 lg:text-center',
          )}
        >
          {/* LEFT — content */}
          <motion.div
            className={cn('relative', !image && 'mx-auto max-w-3xl')}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {badge && (
              <motion.div
                variants={itemVariants}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white/70 backdrop-blur px-3.5 py-1.5 text-xs sm:text-[0.8rem] tracking-[0.16em] font-semibold text-brand uppercase mb-6 shadow-sm shadow-blue-100/60',
                )}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-brand opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                {badge}
              </motion.div>
            )}

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 uppercase leading-[1.02]"
            >
              {renderHeading(heading)}
            </motion.h1>

            {subheading && (
              <motion.p
                variants={itemVariants}
                className="mt-6 text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl"
              >
                {subheading}
              </motion.p>
            )}

            {introContent && (
              <motion.div variants={itemVariants} className="mt-6 max-w-xl text-gray-600">
                <RichText data={introContent} enableGutter={false} />
              </motion.div>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <motion.div
                variants={itemVariants}
                className={cn(
                  'mt-10 flex flex-wrap gap-4',
                  !image && 'justify-center',
                )}
              >
                {links.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    size="lg"
                    {...link}
                    className={cn(
                      'uppercase tracking-wider font-semibold rounded-full! px-7 transition-all duration-200 hover:-translate-y-0.5',
                      i === 0 &&
                        'shadow-lg shadow-blue-300/40 hover:shadow-xl hover:shadow-blue-400/40',
                    )}
                  />
                ))}
              </motion.div>
            )}

            {trustText && (
              <motion.div
                variants={itemVariants}
                className="mt-8 flex items-center gap-2.5 text-sm text-gray-500"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-brand"
                >
                  <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <p>{trustText}</p>
              </motion.div>
            )}
          </motion.div>

          {/* RIGHT — image + geometric backdrop */}
          {image && (
            <motion.div
              className="relative"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Soft blur halo behind the whole composition */}
              <div
                aria-hidden
                className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_70%_40%,rgba(64,126,201,0.25),transparent_60%)] blur-2xl"
              />

              {/* Big brand-color geometric shape on the right */}
              <div
                aria-hidden
                className="absolute -right-6 sm:-right-10 lg:-right-16 -top-6 lg:-top-10 -bottom-10 lg:-bottom-16 w-[65%] sm:w-[60%] bg-linear-to-br from-brand via-brand to-blue-600 rounded-l-4xl rounded-tr-4xl overflow-hidden shadow-2xl shadow-blue-400/40"
              >
                <CircuitPattern className="absolute inset-0 w-full h-full" />
                {/* subtle inner shine */}
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/15" />
                {/* tiny accent strokes top-right */}
                <div className="absolute top-6 right-6 flex flex-col gap-1.5">
                  <div className="w-12 h-0.5 bg-white/50 rounded-full" />
                  <div className="w-8 h-0.5 bg-white/35 rounded-full" />
                  <div className="w-4 h-0.5 bg-white/25 rounded-full" />
                </div>
              </div>

              {/* Decorative dot grid top-left */}
              <div
                aria-hidden
                className="hidden lg:block absolute -left-8 -top-8 w-28 h-28 opacity-50 bg-[radial-gradient(circle,rgba(64,126,201,0.55)_1.2px,transparent_1.6px)] bg-size-[14px_14px]"
              />

              {/* Lower-left accent block */}
              <div
                aria-hidden
                className="hidden lg:block absolute -left-4 -bottom-6 w-24 h-24 bg-linear-to-br from-brand to-blue-600 rounded-2xl rotate-6 opacity-95 shadow-lg shadow-blue-400/40"
              />

              {/* The image on top of everything */}
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/80 border border-white shadow-2xl shadow-blue-400/30 mr-6 sm:mr-10 lg:mr-14">
                <Media
                  resource={image}
                  imgClassName="w-full h-auto object-cover aspect-[4/3]"
                />
                {/* subtle gradient overlay on image edge for depth */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent"
                />
              </div>

              {/* Floating shield badge — purely decorative */}
              <div
                aria-hidden
                className="hidden sm:flex absolute -bottom-5 left-4 lg:left-10 items-center justify-center h-14 w-14 rounded-2xl border border-white bg-white shadow-xl shadow-blue-300/40"
              >
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-linear-to-br from-brand to-blue-600 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
