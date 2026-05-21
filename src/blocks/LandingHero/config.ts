import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const LandingHero: Block = {
  slug: 'landingHero',
  interfaceName: 'LandingHeroBlock',
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Badge (small pill above heading)',
      admin: {
        description: 'Optional small label, e.g. "🛡️ Trusted by 200+ companies".',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Main heading',
      required: true,
      admin: {
        description:
          'Use double asterisks to highlight a word in brand color, e.g. "Securing **your business** in a digital world".',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      admin: {
        description: 'One or two sentences. Keep it concise and benefit-focused.',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        label: 'CTA buttons',
        admin: {
          description: 'Call-to-action buttons (max 2). First one is bold, second is outline.',
        },
        maxRows: 2,
      },
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero image (optional)',
      admin: {
        description: 'Shown on the right side. Leave empty for a text-only hero.',
      },
    },
    {
      name: 'trustText',
      type: 'text',
      label: 'Trust strip text (optional)',
      admin: {
        description:
          'Small note below the CTAs, e.g. "No credit card required • 14-day free trial".',
      },
    },
    {
      name: 'background',
      type: 'select',
      label: 'Background style',
      defaultValue: 'gradient',
      options: [
        { label: 'Soft gradient with glows', value: 'gradient' },
        { label: 'Grid pattern', value: 'grid' },
        { label: 'Plain', value: 'plain' },
      ],
    },
    {
      name: 'introContent',
      type: 'richText',
      label: 'Extra rich content (optional)',
      admin: {
        description: 'Use if you need formatting beyond plain heading + subheading.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
  ],
  graphQL: { singularName: 'LandingHeroBlock' },
  labels: {
    plural: 'Landing Heroes',
    singular: 'Landing Hero',
  },
}
