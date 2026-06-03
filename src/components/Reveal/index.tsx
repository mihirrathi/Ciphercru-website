'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  down: { x: 0, y: -28 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
}

// Shared easing — matches the curve already used in AnimatedNumber / the heroes.
const EASE = [0.16, 1, 0.3, 1] as const

export type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Delay in seconds before the animation starts (use index * step for cascades). */
  delay?: number
  /** Direction the element travels in from. */
  direction?: Direction
  /** Animation duration in seconds. */
  duration?: number
  /** How much of the element must be visible before it triggers (0–1). */
  amount?: number
  /** Animate only the first time it enters the viewport. */
  once?: boolean
  /** HTML element to render as (e.g. 'li' inside a list). Defaults to 'div'. */
  as?: 'div' | 'li' | 'section' | 'span' | 'ul' | 'nav' | 'h1' | 'p'
}

/**
 * Scroll-triggered entrance animation (fade + slide). Wrap any element/section
 * to have it ease into view as the user scrolls. Honours `prefers-reduced-motion`
 * by rendering the content statically.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  amount = 0.2,
  once = true,
  as = 'div',
}) => {
  const reduced = useReducedMotion()
  const Tag = motion[as]

  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  const { x, y } = offset[direction]

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

export default Reveal
