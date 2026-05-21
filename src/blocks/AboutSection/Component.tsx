import React from 'react'

import type { AboutSectionBlock as AboutSectionBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export const AboutSectionBlock: React.FC<AboutSectionBlockProps> = (props) => {
  const { eyebrow, heading, content, links, image, imagePosition } = props

  const imageOnLeft = imagePosition === 'left'

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className={cn(imageOnLeft && 'md:order-2')}>
          {eyebrow && (
            <div className="text-sm uppercase tracking-wider text-primary mb-3 font-medium">
              {eyebrow}
            </div>
          )}
          {heading && (
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">{heading}</h2>
          )}
          {content && (
            <RichText
              className="text-muted-foreground"
              data={content}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8">
              {links.map(({ link }, i) => (
                <CMSLink key={i} size="lg" {...link} />
              ))}
            </div>
          )}
        </div>

        <div className={cn(imageOnLeft && 'md:order-1')}>
          {image && (
            <Media
              resource={image}
              imgClassName="w-full h-auto rounded-[0.8rem] border border-border"
            />
          )}
        </div>
      </div>
    </div>
  )
}
