import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small label above heading)',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'What our clients say',
    },
    {
      name: 'intro',
      type: 'richText',
      label: 'Intro (optional)',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid-3',
      options: [
        { label: '2 columns', value: 'grid-2' },
        { label: '3 columns', value: 'grid-3' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Testimonials',
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Quote',
          required: true,
        },
        {
          name: 'rating',
          type: 'select',
          label: 'Star rating (optional)',
          options: [
            { label: 'No rating', value: '0' },
            { label: '1 star', value: '1' },
            { label: '2 stars', value: '2' },
            { label: '3 stars', value: '3' },
            { label: '4 stars', value: '4' },
            { label: '5 stars', value: '5' },
          ],
          defaultValue: '5',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'authorName',
              type: 'text',
              label: 'Author name',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'authorRole',
              type: 'text',
              label: 'Role / Title',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'authorCompany',
          type: 'text',
          label: 'Company (optional)',
        },
        {
          name: 'authorPhoto',
          type: 'upload',
          relationTo: 'media',
          label: 'Author photo (optional)',
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'TestimonialsBlock',
  },
  labels: {
    plural: 'Testimonials Blocks',
    singular: 'Testimonials Block',
  },
}
