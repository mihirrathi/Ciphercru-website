import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'
import { iconOptions } from '../_shared/iconOptions'

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CtaBannerBlock',
  labels: {
    plural: 'CTA Banners',
    singular: 'CTA Banner',
  },
  graphQL: { singularName: 'CtaBannerBlock' },
  fields: [
    {
      name: 'icon',
      type: 'select',
      label: 'Decorative icon (left side)',
      defaultValue: 'globe',
      options: iconOptions,
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: { description: 'e.g. "Ready to Build Your Next Website?"' },
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        label: 'CTA buttons',
        maxRows: 2,
      },
    }),
  ],
}
