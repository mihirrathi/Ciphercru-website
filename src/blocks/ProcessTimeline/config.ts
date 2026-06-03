import type { Block } from 'payload'

import { iconOptions } from '../_shared/iconOptions'

export const ProcessTimeline: Block = {
  slug: 'processTimeline',
  interfaceName: 'ProcessTimelineBlock',
  labels: {
    plural: 'Process Timelines',
    singular: 'Process Timeline',
  },
  graphQL: { singularName: 'ProcessTimelineBlock' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      defaultValue: 'OUR PROCESS',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'Our Web Development Process',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      labels: { singular: 'Step', plural: 'Steps' },
      minRows: 2,
      maxRows: 8,
      admin: {
        description: 'Numbered automatically — order them in this list.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'clipboardList',
          options: iconOptions,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Step title',
          required: true,
          admin: { description: 'e.g. "Discovery". Number prefix is added automatically.' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Step description',
        },
      ],
    },
  ],
}
