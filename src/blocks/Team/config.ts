import type { Block } from 'payload'

export const Team: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (optional)',
      defaultValue: 'The People',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro (optional)',
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'members',
      type: 'array',
      label: 'Team members',
      labels: { singular: 'Member', plural: 'Members' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Photo (optional)',
          admin: {
            description: 'Square photo works best. Leave empty to show initials.',
          },
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role / Title',
          required: true,
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Short bio (optional)',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL (optional)',
          admin: { description: 'Makes the photo / name link to their profile.' },
        },
      ],
    },
  ],
  graphQL: { singularName: 'TeamBlock' },
  labels: {
    plural: 'Team Blocks',
    singular: 'Team Block',
  },
}
