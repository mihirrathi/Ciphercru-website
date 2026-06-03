import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'
import { iconOptions } from '../_shared/iconOptions'

export const ServiceHero: Block = {
  slug: 'serviceHero',
  interfaceName: 'ServiceHeroBlock',
  labels: {
    plural: 'Service Heroes',
    singular: 'Service Hero',
  },
  graphQL: { singularName: 'ServiceHeroBlock' },
  fields: [
    {
      name: 'breadcrumbs',
      type: 'array',
      label: 'Breadcrumbs',
      labels: { singular: 'Crumb', plural: 'Crumbs' },
      admin: {
        description: 'e.g. Home › Services › Web Development',
        initCollapsed: true,
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          admin: {
            description: 'Leave empty for the last (current) crumb.',
          },
        },
      ],
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        description: 'Main heading, e.g. "Web Development Services".',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Short paragraph below the title.',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlight pills',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      maxRows: 4,
      admin: {
        description: 'Small feature pills shown under the description (e.g. Custom Solutions).',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'sparkles',
          options: iconOptions,
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'links',
        label: 'CTA buttons',
        admin: {
          description: 'Call-to-action buttons shown under the highlight pills.',
        },
        maxRows: 2,
      },
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero image',
      admin: {
        description: 'Shown on the right side over the brand-color hero panel.',
      },
    },
    {
      name: 'techStack',
      type: 'array',
      label: 'Tech stack badges',
      labels: { singular: 'Logo', plural: 'Logos' },
      maxRows: 8,
      admin: {
        description: 'Small white tiles shown beneath the hero image (e.g. HTML, CSS, JS, React).',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Alt / tooltip text',
        },
      ],
    },
  ],
}
