import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'
import { iconOptions } from '../_shared/iconOptions'

export const WhyChooseUs: Block = {
  slug: 'whyChooseUs',
  interfaceName: 'WhyChooseUsBlock',
  labels: {
    plural: 'Why Choose Us blocks',
    singular: 'Why Choose Us block',
  },
  graphQL: { singularName: 'WhyChooseUsBlock' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'WHY CHOOSE US',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    linkGroup({
      appearances: ['default'],
      overrides: {
        label: 'CTA button (optional)',
        maxRows: 1,
      },
    }),
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      labels: { singular: 'Stat', plural: 'Stats' },
      minRows: 2,
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'smile',
          options: iconOptions,
        },
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
          admin: { description: 'e.g. "150+", "98%", "24/7"' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
    },
  ],
}
