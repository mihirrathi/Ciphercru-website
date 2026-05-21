import type { Block } from 'payload'

export const LogoMarquee: Block = {
  slug: 'logoMarquee',
  interfaceName: 'LogoMarqueeBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (optional)',
      defaultValue: 'Trusted by',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading (optional)',
      admin: {
        description: 'Short headline above the logo strip. Leave empty for just the strip.',
      },
    },
    {
      name: 'speed',
      type: 'select',
      label: 'Scroll speed',
      defaultValue: 'medium',
      options: [
        { label: 'Slow (60s)', value: 'slow' },
        { label: 'Medium (35s)', value: 'medium' },
        { label: 'Fast (20s)', value: 'fast' },
      ],
    },
    {
      name: 'pauseOnHover',
      type: 'checkbox',
      label: 'Pause on hover',
      defaultValue: true,
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      label: 'Grayscale logos (color on hover)',
      defaultValue: true,
      admin: {
        description: 'Most logo strips look cleaner in grayscale.',
      },
    },
    {
      name: 'background',
      type: 'select',
      label: 'Background',
      defaultValue: 'plain',
      options: [
        { label: 'Plain (white)', value: 'plain' },
        { label: 'Soft tint', value: 'tint' },
      ],
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      labels: { singular: 'Logo', plural: 'Logos' },
      minRows: 3,
      admin: {
        description: 'Add at least 3–4 logos. They will loop seamlessly.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo image',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Company name',
          required: true,
          admin: {
            description: 'Used as alt text for accessibility.',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Website URL (optional)',
          admin: {
            description: 'Makes the logo clickable.',
          },
        },
      ],
    },
  ],
  graphQL: { singularName: 'LogoMarqueeBlock' },
  labels: {
    plural: 'Logo Marquees',
    singular: 'Logo Marquee',
  },
}
