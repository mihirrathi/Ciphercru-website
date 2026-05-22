'use client'

import React, { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Sparkles } from 'lucide-react'

import type {
  Header as HeaderType,
  Media as MediaType,
  Service,
} from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type MenuGroup = NonNullable<NavItem['menuGroups']>[number]
type MenuGroupItem = NonNullable<MenuGroup['items']>[number]
type LinkField =
  | NonNullable<NavItem['link']>
  | NonNullable<MenuGroupItem['link']>

const getHref = (link?: LinkField | null): string => {
  if (!link) return '#'
  if (link.type === 'reference' && typeof link.reference?.value === 'object') {
    const value = link.reference.value as { slug?: string }
    const relationTo = link.reference.relationTo
    const prefix = relationTo === 'pages' ? '' : `/${relationTo}`
    return value.slug ? `${prefix}/${value.slug}` : '#'
  }
  return link.url || '#'
}

const getInheritedIcon = (item: MenuGroupItem): MediaType | null => {
  if (item.icon && typeof item.icon === 'object') return item.icon as MediaType
  const ref = item.link?.reference
  if (
    ref &&
    typeof ref.value === 'object' &&
    ref.relationTo === 'services'
  ) {
    const svc = ref.value as Service
    if (svc.icon && typeof svc.icon === 'object') return svc.icon as MediaType
  }
  return null
}

export const HeaderNav: React.FC<{ data: HeaderType; isScrolled?: boolean }> = ({
  data,
  isScrolled = true,
}) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const idleLinkClass = isScrolled
    ? 'text-gray-600'
    : 'text-white/90 drop-shadow-sm'
  const activeLinkClass = isScrolled
    ? 'text-blue-600'
    : 'text-white drop-shadow-sm'
  const hoverLinkClass = isScrolled
    ? 'hover:text-blue-600'
    : 'hover:text-white'

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openNow = useCallback(
    (i: number) => {
      cancelClose()
      setOpenMenu(i)
    },
    [cancelClose],
  )

  const closeSoon = useCallback(() => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 180)
  }, [cancelClose])

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item, i) => {
        if (item.type === 'menu') {
          const groups = item.menuGroups || []
          const promo = item.megaPromo
          const showPromo = Boolean(promo?.enabled)
          const isOpen = openMenu === i
          const isActive = groups.some((g) =>
            (g.items || []).some((mi) => pathname === getHref(mi.link)),
          )
          const groupCount = Math.max(groups.length, 1)
          const groupCols =
            groupCount >= 3
              ? 'md:grid-cols-3'
              : groupCount === 2
                ? 'md:grid-cols-2'
                : 'md:grid-cols-1'

          const promoHref = promo?.link ? getHref(promo.link as LinkField) : null

          return (
            <div
              key={i}
              className="static"
              onMouseEnter={() => openNow(i)}
              onMouseLeave={closeSoon}
            >
              <button
                type="button"
                onClick={() => (isOpen ? setOpenMenu(null) : openNow(i))}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={cn(
                  'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                  hoverLinkClass,
                  isActive ? activeLinkClass : idleLinkClass,
                )}
              >
                {item.menuLabel || 'Menu'}
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>

              {isOpen && (
                <div
                  className="absolute left-0 right-0 top-full pt-3 z-50 px-6"
                  role="menu"
                  onMouseEnter={cancelClose}
                  onMouseLeave={closeSoon}
                >
                  <div className="max-w-7xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                    <div
                      className={cn(
                        'grid gap-0',
                        showPromo ? 'md:grid-cols-[18rem_1fr]' : 'md:grid-cols-1',
                      )}
                    >
                      {showPromo && promo && (
                        <PromoPanel
                          title={promo.title}
                          subtitle={promo.subtitle}
                          image={
                            promo.image && typeof promo.image === 'object'
                              ? (promo.image as MediaType)
                              : null
                          }
                          imageOverlayText={promo.imageOverlayText}
                          href={promoHref}
                          onNavigate={() => setOpenMenu(null)}
                        />
                      )}

                      <div className="p-6 lg:p-8">
                        <div className={cn('grid gap-8', groupCols)}>
                          {groups.map((group, gi) => (
                            <div key={gi}>
                              <div className="text-base font-semibold text-gray-900 mb-4">
                                {group.title}
                              </div>
                              <div className="flex flex-col gap-3">
                                {(group.items || []).map((mi, j) => {
                                  const href = getHref(mi.link)
                                  const itemActive = pathname === href
                                  const icon = getInheritedIcon(mi)

                                  return (
                                    <Link
                                      key={j}
                                      href={href}
                                      role="menuitem"
                                      onClick={() => setOpenMenu(null)}
                                      className={cn(
                                        'group flex items-start gap-3 rounded-lg p-1.5 -m-1.5 hover:bg-gray-50 transition-colors',
                                        itemActive && 'bg-blue-50',
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          'shrink-0 w-9 h-9 rounded-md flex items-center justify-center',
                                          icon
                                            ? 'bg-white border border-gray-100'
                                            : 'bg-blue-50',
                                        )}
                                      >
                                        {icon ? (
                                          <Media
                                            resource={icon}
                                            imgClassName="w-5 h-5 object-contain"
                                          />
                                        ) : (
                                          <Sparkles className="w-4 h-4 text-blue-600" />
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div
                                          className={cn(
                                            'text-sm font-semibold leading-snug',
                                            itemActive
                                              ? 'text-blue-600'
                                              : 'text-gray-900 group-hover:text-blue-600',
                                          )}
                                        >
                                          {mi.link?.label}
                                        </div>
                                        {mi.description && (
                                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                            {mi.description}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }

        const href = getHref(item.link)
        const isActive = pathname === href

        return (
          <CMSLink
            key={i}
            {...item.link}
            appearance="link"
            className={cn(
              'text-sm font-medium transition-colors',
              hoverLinkClass,
              isActive
                ? cn(
                    activeLinkClass,
                    'border-b-2 pb-0.5',
                    isScrolled ? 'border-blue-600' : 'border-white',
                  )
                : idleLinkClass,
            )}
          />
        )
      })}
    </nav>
  )
}

type PromoPanelProps = {
  title?: string | null
  subtitle?: string | null
  image?: MediaType | null
  imageOverlayText?: string | null
  href?: string | null
  onNavigate?: () => void
}

const PromoPanel: React.FC<PromoPanelProps> = ({
  title,
  subtitle,
  image,
  imageOverlayText,
  href,
  onNavigate,
}) => {
  const content = (
    <div className="h-full bg-blue-50/60 p-6 lg:p-8 flex flex-col">
      {title && (
        <div className="text-xl font-semibold text-blue-900 leading-tight">
          {title}
        </div>
      )}
      {subtitle && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{subtitle}</p>
      )}

      {image && (
        <div className="mt-auto pt-6">
          <div className="relative rounded-xl overflow-hidden">
            <Media
              resource={image}
              imgClassName="w-full h-40 object-cover"
            />
            {imageOverlayText && (
              <>
                <div className="absolute inset-0 bg-linear-to-t from-blue-950/90 via-blue-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm font-medium leading-snug">
                  {imageOverlayText}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )

  if (href && href !== '#') {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className="block hover:bg-blue-50 transition-colors"
      >
        {content}
      </Link>
    )
  }

  return content
}
