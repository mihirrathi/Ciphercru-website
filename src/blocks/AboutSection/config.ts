import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

export const AboutSection: Block = {
  slug: 'aboutSection',
  interfaceName: 'AboutSectionBlock',
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
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Body content',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        admin: {
          description: 'Optional call-to-action buttons shown under the content.',
        },
        maxRows: 2,
      },
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Image',
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Image position',
      defaultValue: 'right',
      options: [
        { label: 'Right (text left, image right)', value: 'right' },
        { label: 'Left (image left, text right)', value: 'left' },
      ],
      admin: {
        description: 'Switch sides if you want to alternate sections on a page.',
      },
    },
  ],
  graphQL: {
    singularName: 'AboutSectionBlock',
  },
  labels: {
    plural: 'About Sections',
    singular: 'About Section',
  },
}
