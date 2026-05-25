import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

const iconOptions = [
  { label: 'Message Circle Question', value: 'messageCircleQuestion' },
  { label: 'Users (team)', value: 'users' },
  { label: 'Dollar / Pricing', value: 'dollarSign' },
  { label: 'Code', value: 'code' },
  { label: 'Shield (security)', value: 'shieldCheck' },
  { label: 'Headphones (support)', value: 'headphones' },
  { label: 'Help Circle', value: 'helpCircle' },
  { label: 'Info', value: 'info' },
  { label: 'Clock', value: 'clock' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Star', value: 'star' },
  { label: 'Lightbulb', value: 'lightbulb' },
  { label: 'Settings', value: 'settings' },
  { label: 'Globe', value: 'globe' },
  { label: 'Zap', value: 'zap' },
  { label: 'Check Circle', value: 'checkCircle' },
  { label: 'Message Circle', value: 'messageCircle' },
  { label: 'Briefcase', value: 'briefcase' },
  { label: 'Handshake', value: 'handshake' },
  { label: 'Target', value: 'target' },
  { label: 'Trending Up', value: 'trendingUp' },
  { label: 'File Text', value: 'fileText' },
  { label: 'Lock', value: 'lock' },
]

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (optional)',
      defaultValue: 'FAQ',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Frequently Asked **Questions**',
      admin: {
        description:
          'Wrap part of the heading in **double asterisks** to highlight it in brand blue. Example: "Frequently Asked **Questions**".',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro (optional)',
      admin: {
        description: 'One short paragraph under the heading.',
      },
    },
    {
      name: 'illustration',
      type: 'upload',
      relationTo: 'media',
      label: 'Illustration (optional)',
      admin: {
        description:
          'Image shown on the left side under the heading (e.g. a 3D character or graphic).',
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'split',
      options: [
        { label: 'Split — heading + illustration left, questions right', value: 'split' },
        { label: 'Stacked — heading on top, questions below (centered)', value: 'stacked' },
      ],
    },
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      label: 'Allow multiple questions open at once',
      defaultValue: false,
      admin: {
        description: 'If unchecked, opening one question closes the others.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Questions',
      labels: { singular: 'Question', plural: 'Questions' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          options: iconOptions,
          defaultValue: 'messageCircleQuestion',
        },
        {
          name: 'question',
          type: 'text',
          label: 'Question',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Answer',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'defaultOpen',
          type: 'checkbox',
          label: 'Open by default',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Side CTA card (under illustration)',
      admin: {
        description:
          'Small card shown under the illustration on the left, e.g. "Still have questions? Contact us".',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show CTA card',
          defaultValue: true,
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          options: iconOptions,
          defaultValue: 'headphones',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
        {
          name: 'text',
          type: 'text',
          label: 'Heading',
          defaultValue: 'Still have questions?',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
        {
          name: 'subtext',
          type: 'text',
          label: 'Subtext',
          defaultValue: 'Our support team is here to help you.',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
        linkGroup({
          appearances: ['default', 'outline'],
          overrides: {
            label: 'CTA buttons',
            maxRows: 2,
            admin: {
              condition: (_, siblingData) => Boolean(siblingData?.enabled),
            },
          },
        }),
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Bottom feature strip (optional)',
      maxRows: 4,
      admin: {
        description:
          'Small feature highlights shown in a row below the FAQ (e.g. "Quick Answers", "Reliable Information"). Leave empty to hide.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: iconOptions,
          defaultValue: 'clock',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
        },
      ],
    },
  ],
  graphQL: { singularName: 'FAQBlock' },
  labels: {
    plural: 'FAQ Blocks',
    singular: 'FAQ Block',
  },
}
