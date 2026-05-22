import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

const iconOptions = [
  { label: 'Users (team)', value: 'users' },
  { label: 'User Check', value: 'userCheck' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Lightbulb', value: 'lightbulb' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Star', value: 'star' },
  { label: 'Shield Check', value: 'shieldCheck' },
  { label: 'Lock', value: 'lock' },
  { label: 'Building', value: 'building' },
  { label: 'Briefcase', value: 'briefcase' },
  { label: 'Award / Medal', value: 'award' },
  { label: 'Trophy', value: 'trophy' },
  { label: 'Code', value: 'code' },
  { label: 'Cpu', value: 'cpu' },
  { label: 'Settings / Cog', value: 'settings' },
  { label: 'Heart', value: 'heart' },
  { label: 'Target', value: 'target' },
  { label: 'Trending Up', value: 'trendingUp' },
  { label: 'Bar Chart', value: 'barChart' },
  { label: 'Globe', value: 'globe' },
  { label: 'Zap', value: 'zap' },
  { label: 'Clock', value: 'clock' },
  { label: 'Check Circle', value: 'checkCircle' },
  { label: 'Message Circle', value: 'messageCircle' },
  { label: 'Layers', value: 'layers' },
  { label: 'Handshake', value: 'handshake' },
]

export const AboutSection: Block = {
  slug: 'aboutSection',
  interfaceName: 'AboutSectionBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small label above heading)',
      admin: { description: 'e.g. "About Us"' },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        description:
          'Wrap part of the heading in **double asterisks** to highlight it in brand blue. Example: "Turning Ideas into **Intelligent Solutions**".',
      },
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
    {
      name: 'features',
      type: 'array',
      label: 'Feature highlights',
      maxRows: 4,
      admin: {
        description:
          'Bulleted highlights shown under the body (e.g. "Client-Centric Approach", "Innovation Driven").',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: iconOptions,
          defaultValue: 'sparkles',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        admin: {
          description:
            'Optional call-to-action buttons (e.g. a "Know More About Us" link).',
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
    {
      name: 'floatingCard',
      type: 'group',
      label: 'Floating card (overlay on image)',
      admin: {
        description:
          'Optional blue card that overlays the bottom of the image. Leave the text empty to hide it.',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: iconOptions,
          defaultValue: 'building',
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Text',
          admin: {
            description:
              'e.g. "Building digital solutions that empower businesses and enrich lives."',
          },
        },
      ],
    },
    {
      name: 'showStats',
      type: 'checkbox',
      label: 'Show stats strip below',
      defaultValue: true,
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      maxRows: 4,
      admin: {
        description: 'Metric callouts shown in the strip below the about content.',
        condition: (_, siblingData) => Boolean(siblingData?.showStats),
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: iconOptions,
          defaultValue: 'users',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value',
          admin: { description: 'e.g. "50+", "120+", "99.9%"' },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: { description: 'e.g. "Happy Clients", "Projects Delivered"' },
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption (optional)',
          admin: { description: 'e.g. "Across diverse industries"' },
        },
      ],
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
