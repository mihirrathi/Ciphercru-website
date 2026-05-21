import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (optional)',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading (optional)',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading (optional)',
    },
    {
      name: 'style',
      type: 'select',
      label: 'Style',
      defaultValue: 'plain',
      options: [
        { label: 'Plain (white)', value: 'plain' },
        { label: 'Brand band (gradient blue)', value: 'brand' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Stats',
      labels: { singular: 'Stat', plural: 'Stats' },
      minRows: 2,
      maxRows: 6,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
          admin: {
            description: 'e.g. "200+", "99.9%", "10 yrs".',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            description: 'e.g. "Projects delivered".',
          },
        },
      ],
    },
  ],
  graphQL: { singularName: 'StatsBlock' },
  labels: {
    plural: 'Stats Blocks',
    singular: 'Stats Block',
  },
}
