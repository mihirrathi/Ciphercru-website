'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion'

import type { LandingHeroV2Block as LandingHeroV2BlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.09 },
  }),
}

const DEFAULT_CARD_LAYOUT: Array<{ x: number; y: number; rot: number; depth: number; phase: number }> = [
  { x: -36, y: -22, rot: -3.5, depth: 0.4, phase: 0.0 },
  { x: 34, y: -28, rot: 4, depth: 0.7, phase: 0.8 },
  { x: -42, y: 16, rot: 2, depth: 0.6, phase: 1.4 },
  { x: 38, y: 10, rot: -3, depth: 0.4, phase: 2.1 },
  { x: -28, y: 34, rot: -2.5, depth: 0.8, phase: 2.8 },
  { x: 30, y: 38, rot: 3.5, depth: 0.5, phase: 3.4 },
]

const renderItalicMarks = (raw: string) => {
  const parts = raw.split(/(\*[^*]+\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
      return (
        <em key={i} className="font-serif italic text-gray-900">
          {p.slice(1, -1)}
        </em>
      )
    }
    return <React.Fragment key={i}>{p}</React.Fragment>
  })
}

const ArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 14 14" fill="none" className={className} aria-hidden>
    <path d="M2 7 H12 M8 3 L12 7 L8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PlayCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 13 13" fill="none" className={className} aria-hidden>
    <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 4 L9 6.5 L5 9 Z" fill="currentColor" />
  </svg>
)

const OpenArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 11 11" fill="none" className={className} aria-hidden>
    <path d="M2 9 L9 2 M3.5 2 H9 V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CCMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
    <path
      d="M100 20 a80 80 0 1 0 60 132 l-22 -20 a50 50 0 1 1 0 -64 l22 -20 A80 80 0 0 0 100 20 z"
      fill="currentColor"
    />
  </svg>
)

export const LandingHeroV2Block: React.FC<LandingHeroV2BlockProps> = ({
  eyebrow,
  headline,
  italicWord,
  subheading,
  primaryCta,
  secondaryCta,
  cards,
  trustedByLabel,
  trustedByLogos,
}) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 })

  const watermarkX = useTransform(sx, (v) => v * -16)
  const watermarkY = useTransform(sy, (v) => v * -10)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      mx.set(x)
      my.set(y)
    }
    const onLeave = () => {
      mx.set(0)
      my.set(0)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [mx, my])

  const safeCards = (cards ?? []).slice(0, DEFAULT_CARD_LAYOUT.length)

  return (
    <section
      ref={stageRef}
      className="relative isolate overflow-hidden bg-white text-gray-900 min-h-[760px] lg:min-h-[820px]"
    >
      {/* Watermark mark */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-0 text-brand opacity-[0.05]"
        style={{ x: watermarkX, y: watermarkY }}
      >
        <CCMark className="w-275 max-w-none h-auto" />
      </motion.div>

      {/* Soft radial halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(50%_50%_at_50%_45%,rgba(64,126,201,0.13),transparent_70%)]"
      />

      {/* Stage */}
      <div className="container relative z-10 flex flex-col min-h-[760px] lg:min-h-[820px] pt-10 pb-12">
        <div className="relative flex-1 flex items-center justify-center py-8">
          {/* Floating service cards */}
          {safeCards.map((card, i) => {
            const layout = DEFAULT_CARD_LAYOUT[i]
            return (
              <FloatingCard
                key={card.id ?? i}
                index={i}
                layout={layout}
                idx={card.idx}
                title={card.title}
                tag={card.tag}
                cardLink={card.cardLink}
                px={sx}
                py={sy}
              />
            )
          })}

          {/* Center content */}
          <motion.div
            className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center gap-4 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {eyebrow && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/70 backdrop-blur px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] text-gray-500 font-mono shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span>{eyebrow}</span>
              </motion.div>
            )}

            <motion.h1
              variants={itemVariants}
              className="font-medium text-gray-900 leading-[0.92] tracking-[-0.045em] text-balance"
              style={{ fontSize: 'clamp(58px, 9vw, 144px)' }}
            >
              <span className="block">{headline}</span>
              <span className="block font-serif italic font-normal text-brand tracking-[-0.02em]">
                {italicWord}
              </span>
            </motion.h1>

            {subheading && (
              <motion.p
                variants={itemVariants}
                className="mt-2 max-w-xl text-base sm:text-[17px] leading-relaxed text-gray-600"
              >
                {renderItalicMarks(subheading)}
              </motion.p>
            )}

            {(primaryCta?.link || secondaryCta?.link) && (
              <motion.div
                variants={itemVariants}
                className="mt-5 flex flex-wrap items-center justify-center gap-4"
              >
                {primaryCta?.link && (
                  <CMSLink
                    {...primaryCta.link}
                    label={null}
                    className={cn(
                      'group inline-flex items-center gap-3 rounded-full bg-brand text-white pl-6 pr-2 py-2 text-[15px] font-medium',
                      'shadow-[0_12px_28px_-8px_rgba(64,126,201,0.45)] transition-all duration-200 hover:-translate-y-0.5',
                    )}
                  >
                    <span>{primaryCta.link.label}</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </CMSLink>
                )}
                {secondaryCta?.link && (
                  <CMSLink
                    {...secondaryCta.link}
                    label={null}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>{secondaryCta.link.label}</span>
                  </CMSLink>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        {trustedByLogos && trustedByLogos.length > 0 && (
          <div className="relative z-10 mt-10 flex flex-col gap-6 border-t border-gray-200 pt-5 lg:flex-row lg:items-end lg:justify-between">
            {trustedByLogos && trustedByLogos.length > 0 && (
              <div className="text-left lg:text-right">
                {trustedByLabel && (
                  <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500 mb-2">
                    {trustedByLabel}
                  </span>
                )}
                <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end font-mono text-[12px] tracking-[0.08em] text-gray-600">
                  {trustedByLogos.map((l, i) => (
                    <span key={l.id ?? i} className="opacity-75">
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ---------- Floating card ----------

type CardProps = {
  index: number
  layout: { x: number; y: number; rot: number; depth: number; phase: number }
  idx: string
  title: string
  tag: string
  cardLink?: any
  px: any
  py: any
}

const FloatingCard: React.FC<CardProps> = ({ index, layout, idx, title, tag, cardLink, px, py }) => {
  const [hover, setHover] = useState(false)
  const tx = useTransform(px, (v: number) => v * layout.depth * 26)
  const ty = useTransform(py, (v: number) => v * layout.depth * 18)

  const hasLink = Boolean(cardLink && (cardLink.url || cardLink.reference))

  return (
    <motion.div
      className={cn('absolute hidden lg:block w-50 z-2', hover && 'z-9')}
      style={{
        left: `calc(50% + ${layout.x}%)`,
        top: `calc(50% + ${layout.y}%)`,
        translateX: '-50%',
        translateY: '-50%',
        x: tx,
        y: ty,
        rotate: layout.rot,
      }}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className={cn(
          'relative rounded-[14px] border border-gray-200 bg-white/80 backdrop-blur p-4 transition-all duration-300',
          'shadow-[0_24px_48px_-16px_rgba(0,0,0,0.18)]',
          hover && 'border-gray-900 shadow-[0_32px_60px_-16px_rgba(0,0,0,0.3)] -translate-y-1.5 scale-[1.04]',
        )}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: layout.phase }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-wider text-gray-500">{idx}</span>
          <span className="h-2 w-2 rounded-full bg-brand" />
        </div>
        <div className="mt-4 text-[17px] font-medium tracking-[-0.02em] text-gray-900">{title}</div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-gray-500">{tag}</div>
        <div className="mt-3 flex items-center gap-1.5 border-t border-gray-200 pt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-gray-900">
          <span>Open</span>
          <OpenArrow className="h-2.75 w-2.75" />
        </div>
        {hasLink && (
          <CMSLink {...cardLink} label={null} className="absolute inset-0 z-10">
            <span className="sr-only">Open {title}</span>
          </CMSLink>
        )}
      </motion.div>
    </motion.div>
  )
}
