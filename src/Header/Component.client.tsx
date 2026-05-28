'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const darkText = isScrolled || theme !== 'dark'

  return (
    <header
      className={cn(
        'w-full sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300',
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-gray-200/60 shadow-sm'
          : 'bg-transparent border-b border-transparent',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div
        className={cn(
          'max-w-7xl mx-auto px-6 flex justify-between items-center transition-[padding] duration-300',
          isScrolled ? 'py-2' : 'py-4',
        )}
      >

        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo
            loading="eager"
            priority="high"
            className={cn(
              'w-auto transition-[height] duration-300',
              isScrolled ? 'h-12' : 'h-20',
            )}
          />
        </Link>

        {/* Nav Links - Center */}
        <HeaderNav data={data} darkText={darkText} />

        {/* Right Side - Login + CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className={cn(
              'text-sm font-medium transition-colors',
              darkText
                ? 'text-gray-600 hover:text-brand'
                : 'text-white/90 hover:text-white drop-shadow-sm',
            )}
          >
            Login
          </Link>
          <Link
            href="/contact-us"
            className="group inline-flex items-center gap-2 bg-brand hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-900/40 transition-all"
          >
            Get a Quote
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

      </div>
    </header>
  )
}