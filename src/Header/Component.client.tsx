'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  return (
    <header
      className="w-full bg-white/85 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50 shadow-sm shadow-blue-50/30"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo loading="eager" priority="high" />
        </Link>

        {/* Nav Links - Center */}
        <HeaderNav data={data} />

        {/* Right Side - Login + CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
          >
            Login
          </Link>
          <Link
            href="/contact-us"
            className="group inline-flex items-center gap-2 bg-brand hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-md shadow-blue-200/60 hover:shadow-lg hover:shadow-blue-200/80 transition-all"
          >
            Get a Quote
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

      </div>
    </header>
  )
}