import React from 'react'

import type { TeamBlock as TeamBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'

const colGrid: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

// Brand-shade rotation for the initials avatars (mirrors the reference design).
const avatarShades = ['#407ec9', '#285285', '#5f97cf', '#213f69', '#4587ca', '#3265a6']

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

export const TeamBlock: React.FC<TeamBlockProps> = ({
  eyebrow,
  heading,
  intro,
  columns = '3',
  members,
}) => {
  const grid = colGrid[columns || '3']
  const list = Array.isArray(members) ? members : []

  return (
    <section className="container py-16 lg:py-24">
      {(eyebrow || heading || intro) && (
        <Reveal className="mb-12 lg:mb-16 max-w-2xl">
          {eyebrow && (
            <div className="text-sm uppercase tracking-wider text-brand font-semibold mb-3">
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-tight">
              {heading}
            </h2>
          )}
          {intro && (
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">{intro}</p>
          )}
        </Reveal>
      )}

      {list.length > 0 && (
        <div className={cn('grid gap-8 lg:gap-10 grid-cols-1', grid)}>
          {list.map((member, i) => {
            const hasPhoto = member.photo && typeof member.photo === 'object'

            const avatar = (
              <div className="relative mx-auto mb-5 h-24 w-24">
                <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-blue-100">
                  {hasPhoto ? (
                    <Media
                      resource={member.photo!}
                      imgClassName="h-24 w-24 object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xl font-bold text-white"
                      style={{ backgroundColor: avatarShades[i % avatarShades.length] }}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                </div>
              </div>
            )

            return (
              <Reveal
                key={i}
                delay={(i % 4) * 0.1}
                className="text-center"
              >
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-opacity hover:opacity-90"
                  >
                    {avatar}
                  </a>
                ) : (
                  avatar
                )}
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">
                  {member.name}
                </h3>
                <div className="mt-1 text-sm font-medium text-brand">{member.role}</div>
                {member.bio && (
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-gray-600">
                    {member.bio}
                  </p>
                )}
              </Reveal>
            )
          })}
        </div>
      )}
    </section>
  )
}
