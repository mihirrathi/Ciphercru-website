import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AboutHeroBlock } from '@/blocks/AboutHero/Component'
import { AboutSectionBlock } from '@/blocks/AboutSection/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactHeroBlock } from '@/blocks/ContactHero/Component'
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
import { TeamBlock } from '@/blocks/Team/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { WhyChooseUsBlock } from '@/blocks/WhyChooseUs/Component'
import { Reveal } from '@/components/Reveal'

// Block types temporarily hidden site-wide. Remove an entry here to show it again.
const HIDDEN_BLOCK_TYPES: ReadonlyArray<Page['layout'][0]['blockType']> = ['landingHero']

// Blocks that animate themselves (heroes / marquee already have entrance
// motion; the grids stagger their own cards) so we skip the generic wrapper.
const SELF_ANIMATED_BLOCK_TYPES: ReadonlyArray<Page['layout'][0]['blockType']> = [
  'landingHero',
  'landingHeroV2',
  'serviceHero',
  'logoMarquee',
  'serviceCardsGrid',
  'features',
  'aboutHero',
  'aboutSection',
  'contactHero',
  'team',
]

const blockComponents = {
  aboutHero: AboutHeroBlock,
  aboutSection: AboutSectionBlock,
  archive: ArchiveBlock,
  contactHero: ContactHeroBlock,
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
  team: TeamBlock,
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
              const rendered = (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block {...block} disableInnerContainer />
              )

              return (
                <div key={index}>
                  {SELF_ANIMATED_BLOCK_TYPES.includes(blockType) ? (
                    rendered
                  ) : (
                    <Reveal amount={0.15}>{rendered}</Reveal>
                  )}
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
