import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (optional)',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
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
      name: 'alignment',
      type: 'select',
      label: 'Heading alignment',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'cardStyle',
      type: 'select',
      label: 'Card style',
      defaultValue: 'soft',
      options: [
        { label: 'Soft card with border', value: 'soft' },
        { label: 'Minimal (no card)', value: 'minimal' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Features',
      labels: { singular: 'Feature', plural: 'Features' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon (optional)',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
  ],
  graphQL: { singularName: 'FeaturesBlock' },
  labels: {
    plural: 'Features Blocks',
    singular: 'Features Block',
  },
}
