import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutSectionBlock } from '@/blocks/AboutSection/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactSectionBlock } from '@/blocks/ContactSection/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LandingHeroBlock } from '@/blocks/LandingHero/Component'
import { LogoMarqueeBlock } from '@/blocks/LogoMarquee/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'

const blockComponents = {
  aboutSection: AboutSectionBlock,
  archive: ArchiveBlock,
  contactSection: ContactSectionBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  features: FeaturesBlock,
  formBlock: FormBlock,
  landingHero: LandingHeroBlock,
  logoMarquee: LogoMarqueeBlock,
  mediaBlock: MediaBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="mt-8 lg:mt-16 first:mt-0" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
