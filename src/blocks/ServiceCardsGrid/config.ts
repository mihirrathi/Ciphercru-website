import type { Block } from 'payload'

import { link } from '../../fields/link'
import { iconOptions } from '../_shared/iconOptions'

export const ServiceCardsGrid: Block = {
  slug: 'serviceCardsGrid',
  interfaceName: 'ServiceCardsGridBlock',
  labels: {
    plural: 'Service Cards Grids',
    singular: 'Service Cards Grid',
  },
  graphQL: { singularName: 'ServiceCardsGridBlock' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small label above heading)',
      defaultValue: 'WHAT WE OFFER',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'Our Web Development Services',
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      maxRows: 9,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'code',
          options: iconOptions,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        link({
          appearances: false,
          overrides: {
            label: 'Learn More link (optional)',
            admin: {
              description: 'Adds a "Learn More →" link at the bottom of the card.',
            },
          },
        }),
      ],
    },
  ],
}
