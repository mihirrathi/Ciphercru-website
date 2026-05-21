import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { Linkedin, Twitter, Github, Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

type NavLink = NonNullable<NonNullable<FooterType['columns']>[number]['links']>[number]['link']

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
}

const socialLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter / X',
  github: 'GitHub',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
}

const renderCopyright = (text: string | null | undefined): string => {
  if (!text) return ''
  return text.replace('{year}', String(new Date().getFullYear()))
}

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 2)()) as FooterType

  const {
    tagline,
    socials,
    columns,
    contactHeading,
    contactEmail,
    contactPhone,
    contactAddress,
    copyright,
    legalLinks,
  } = footerData || {}

  const hasContact = Boolean(contactEmail || contactPhone || contactAddress)

  return (
    <footer className="relative mt-auto bg-blue-950 text-gray-300 overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(64,126,201,0.18),transparent_55%),radial-gradient(circle_at_85%_110%,rgba(64,126,201,0.12),transparent_55%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent"
      />

      <div className="relative">
        <div className="container py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
            {/* BRAND — left */}
            <div className="md:col-span-4 lg:col-span-4">
              <Link href="/" className="inline-flex items-center mb-6">
                <Logo className="brightness-0 invert opacity-95" />
              </Link>

              {tagline && (
                <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
                  {tagline}
                </p>
              )}

              {Array.isArray(socials) && socials.length > 0 && (
                <div className="mt-7 flex items-center gap-3">
                  {socials.map((s, i) => {
                    const Icon = socialIcons[s.platform || ''] || ArrowUpRight
                    const label = socialLabels[s.platform || ''] || s.platform || 'Social'
                    return (
                      <a
                        key={i}
                        href={s.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-300 hover:bg-brand hover:border-brand hover:text-white transition-all hover:-translate-y-0.5"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* COLUMNS — middle */}
            {Array.isArray(columns) && columns.length > 0 && (
              <div className="md:col-span-8 lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
                {columns.slice(0, 3).map((col, i) => (
                  <div key={i}>
                    <div className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                      {col.title}
                    </div>
                    <ul className="space-y-3">
                      {(col.links || []).map((linkItem, j) => (
                        <li key={j}>
                          <CMSLink
                            {...(linkItem.link as NavLink)}
                            appearance="link"
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT — right */}
            {hasContact && (
              <div className="md:col-span-12 lg:col-span-3">
                {contactHeading && (
                  <div className="text-sm font-semibold text-white uppercase tracking-wider mb-5">
                    {contactHeading}
                  </div>
                )}
                <ul className="space-y-4 text-sm">
                  {contactEmail && (
                    <li>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="group inline-flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
                      >
                        <Mail className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                        <span className="break-all">{contactEmail}</span>
                      </a>
                    </li>
                  )}
                  {contactPhone && (
                    <li>
                      <a
                        href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                        className="group inline-flex items-start gap-3 text-gray-400 hover:text-white transition-colors"
                      >
                        <Phone className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                        <span>{contactPhone}</span>
                      </a>
                    </li>
                  )}
                  {contactAddress && (
                    <li className="flex items-start gap-3 text-gray-400 leading-relaxed">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand" />
                      <span className="whitespace-pre-line">{contactAddress}</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10">
          <div className="container py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-gray-500">
              {renderCopyright(copyright) || `© ${new Date().getFullYear()} All rights reserved.`}
            </div>
            {Array.isArray(legalLinks) && legalLinks.length > 0 && (
              <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {legalLinks.map((item, i) => (
                  <CMSLink
                    key={i}
                    {...(item.link as NavLink)}
                    appearance="link"
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  />
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
