import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small label above heading)',
      defaultValue: 'Testimonials',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'What Our Clients Say **About Us**',
      admin: {
        description:
          'Wrap part of the heading in **double asterisks** to highlight it in brand blue. Example: "What Our Clients Say **About Us**".',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro (optional)',
      defaultValue:
        "We take pride in delivering exceptional solutions that help businesses grow. Here's what our clients have to say about working with us.",
      admin: {
        description: 'Short paragraph under the heading.',
      },
    },
    {
      name: 'perSlide',
      type: 'select',
      label: 'Cards per slide (desktop)',
      defaultValue: '3',
      options: [
        { label: '2 cards', value: '2' },
        { label: '3 cards', value: '3' },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Auto-rotate slides',
      defaultValue: true,
      admin: {
        description: 'Slides advance automatically every few seconds.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Testimonials',
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Quote',
          required: true,
        },
        {
          name: 'rating',
          type: 'select',
          label: 'Star rating (optional)',
          options: [
            { label: 'No rating', value: '0' },
            { label: '1 star', value: '1' },
            { label: '2 stars', value: '2' },
            { label: '3 stars', value: '3' },
            { label: '4 stars', value: '4' },
            { label: '5 stars', value: '5' },
          ],
          defaultValue: '5',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'authorName',
              type: 'text',
              label: 'Author name',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'authorRole',
              type: 'text',
              label: 'Role / Title',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'authorCompany',
          type: 'text',
          label: 'Company (optional)',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'authorPhoto',
              type: 'upload',
              relationTo: 'media',
              label: 'Author photo',
              admin: { width: '50%' },
            },
            {
              name: 'companyLogo',
              type: 'upload',
              relationTo: 'media',
              label: 'Company logo (optional)',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'TestimonialsBlock',
  },
  labels: {
    plural: 'Testimonials Blocks',
    singular: 'Testimonials Block',
  },
}
