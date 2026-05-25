'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

type Props = {
  value: string
  duration?: number
  className?: string
}

// Parse strings like "200+", "99.9%", "10 yrs", "$1.2M" into a numeric
// target plus the surrounding prefix/suffix so we can animate just the number.
const parseValue = (raw: string) => {
  const match = raw.match(/^(\D*)(-?\d+(?:[.,]\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, numStr, suffix] = match
  const normalized = numStr.replace(',', '.')
  const target = parseFloat(normalized)
  if (Number.isNaN(target)) return null
  const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0
  return { prefix, suffix, target, decimals }
}

const formatNumber = (n: number, decimals: number) =>
  decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString()

export const AnimatedNumber: React.FC<Props> = ({ value, duration = 1.6, className }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const parsed = useMemo(() => parseValue(value), [value])
  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.prefix}${formatNumber(0, parsed.decimals)}${parsed.suffix}` : value,
  )

  useEffect(() => {
    if (!parsed || !inView) return
    const controls = animate(0, parsed.target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(`${parsed.prefix}${formatNumber(latest, parsed.decimals)}${parsed.suffix}`)
      },
    })
    return () => controls.stop()
  }, [inView, parsed, duration])

  if (!parsed) {
    return <span className={className}>{value}</span>
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

export default AnimatedNumber
