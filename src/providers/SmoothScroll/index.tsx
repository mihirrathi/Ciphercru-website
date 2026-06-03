'use client'

import { ReactLenis } from 'lenis/react'
import React, { useEffect, useState } from 'react'

/**
 * Site-wide momentum/inertia smooth scrolling powered by Lenis.
 *
 * Lenis keeps `window.scrollY` in sync and dispatches native `scroll`
 * events, so scroll-driven UI (e.g. the sticky Header) keeps working.
 *
 * Honours `prefers-reduced-motion`: when the user prefers reduced motion
 * we skip Lenis entirely and fall back to the browser's native scrolling.
 */
export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (reducedMotion) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
