import type { Block } from 'payload'

import { link } from '../../fields/link'

export const LandingHeroV2: Block = {
  slug: 'landingHeroV2',
  interfaceName: 'LandingHeroV2Block',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small pill above heading)',
      admin: {
        description: 'Small label rendered above the heading, e.g. "An IT services agency, engineered for momentum".',
      },
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline (plain part)',
      required: true,
      admin: {
        description: 'Plain part of the headline. E.g. "Software,".',
      },
    },
    {
      name: 'italicWord',
      type: 'text',
      label: 'Headline italic word',
      required: true,
      admin: {
        description: 'Word shown in serif italic + brand color on the next line, e.g. "engineered.".',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      admin: {
        description:
          'Short paragraph below the heading. Wrap words in *asterisks* to italicize them (e.g. "One crew of *engineers, designers and operators*").',
      },
    },
    {
      name: 'primaryCta',
      type: 'group',
      label: 'Primary CTA (filled button)',
      fields: [link({ appearances: false })],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      label: 'Secondary CTA (ghost link with play icon)',
      fields: [link({ appearances: false })],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Floating service cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 0,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description:
          'Up to 6 cards floating around the headline. Order here is the order they appear (top-left, top-right, mid-left, mid-right, bottom-left, bottom-right).',
      },
      fields: [
        {
          name: 'idx',
          type: 'text',
          label: 'Index label',
          required: true,
          admin: { description: 'Small number shown at the top of the card, e.g. "01".' },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          admin: { description: 'e.g. "Web Development".' },
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Tag line',
          required: true,
          admin: { description: 'Comma-separated stack, e.g. "Next · React · Astro".' },
        },
        link({
          appearances: false,
          disableLabel: true,
          overrides: {
            name: 'cardLink',
            label: 'Card link (optional — makes the whole card clickable)',
            required: false,
          },
        }),
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Bottom stats',
      labels: { singular: 'Stat', plural: 'Stats' },
      minRows: 0,
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
          admin: { description: 'e.g. "150+", "24/7".' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: { description: 'e.g. "Global clients".' },
        },
      ],
    },
    {
      name: 'trustedByLabel',
      type: 'text',
      label: 'Trusted-by label',
      defaultValue: 'Trusted by',
    },
    {
      name: 'trustedByLogos',
      type: 'array',
      label: 'Trusted-by logos (text only)',
      labels: { singular: 'Logo', plural: 'Logos' },
      minRows: 0,
      maxRows: 8,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          admin: { description: 'Shown in monospace caps, e.g. "NORTHWIND".' },
        },
      ],
    },
  ],
  graphQL: { singularName: 'LandingHeroV2Block' },
  labels: {
    plural: 'Landing Heroes V2',
    singular: 'Landing Hero V2',
  },
}
