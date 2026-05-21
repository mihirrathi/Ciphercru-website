import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'

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
      defaultValue: 'Frequently asked questions',
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
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'split',
      options: [
        { label: 'Split — heading left, questions right', value: 'split' },
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
      label: 'Bottom CTA (optional)',
      admin: {
        description: 'Shown under the questions, e.g. "Still have questions? Contact us".',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show bottom CTA',
          defaultValue: false,
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
          defaultValue: "Can't find what you're looking for? Our team is here to help.",
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
  ],
  graphQL: { singularName: 'FAQBlock' },
  labels: {
    plural: 'FAQ Blocks',
    singular: 'FAQ Block',
  },
}
