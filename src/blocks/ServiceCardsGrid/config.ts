import type { Block } from 'payload'

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
        {
          name: 'link',
          type: 'group',
          label: 'Learn More link (optional)',
          admin: {
            description:
              'Optional. If a label is set, a "Learn More →" link is shown at the bottom of the card.',
            hideGutter: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'radio',
                  defaultValue: 'reference',
                  admin: { layout: 'horizontal', width: '50%' },
                  options: [
                    { label: 'Internal link', value: 'reference' },
                    { label: 'Custom URL', value: 'custom' },
                  ],
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  label: 'Open in new tab',
                  admin: {
                    width: '50%',
                    style: { alignSelf: 'flex-end' },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'reference',
                  type: 'relationship',
                  label: 'Document to link to',
                  relationTo: ['pages', 'posts', 'services', 'projects'],
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => siblingData?.type === 'reference',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Custom URL',
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => siblingData?.type === 'custom',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  defaultValue: 'Learn More',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
