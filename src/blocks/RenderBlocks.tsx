import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutSectionBlock } from '@/blocks/AboutSection/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactSectionBlock } from '@/blocks/ContactSection/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CtaBannerBlock } from '@/blocks/CtaBanner/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { LandingHeroBlock } from '@/blocks/LandingHero/Component'
import { LandingHeroV2Block } from '@/blocks/LandingHeroV2/Component'
import { LogoMarqueeBlock } from '@/blocks/LogoMarquee/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProcessTimelineBlock } from '@/blocks/ProcessTimeline/Component'
import { ServiceCardsGridBlock } from '@/blocks/ServiceCardsGrid/Component'
import { ServiceHeroBlock } from '@/blocks/ServiceHero/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { WhyChooseUsBlock } from '@/blocks/WhyChooseUs/Component'

// Block types temporarily hidden site-wide. Remove an entry here to show it again.
const HIDDEN_BLOCK_TYPES: ReadonlyArray<Page['layout'][0]['blockType']> = ['landingHero']

const blockComponents = {
  aboutSection: AboutSectionBlock,
  archive: ArchiveBlock,
  contactSection: ContactSectionBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  ctaBanner: CtaBannerBlock,
  faq: FAQBlock,
  features: FeaturesBlock,
  formBlock: FormBlock,
  landingHero: LandingHeroBlock,
  landingHeroV2: LandingHeroV2Block,
  logoMarquee: LogoMarqueeBlock,
  mediaBlock: MediaBlock,
  processTimeline: ProcessTimelineBlock,
  serviceCardsGrid: ServiceCardsGridBlock,
  serviceHero: ServiceHeroBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
  whyChooseUs: WhyChooseUsBlock,
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

          if (HIDDEN_BLOCK_TYPES.includes(blockType)) {
            return null
          }

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
