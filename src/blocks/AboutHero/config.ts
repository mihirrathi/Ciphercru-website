import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const AboutHero: Block = {
  slug: 'aboutHero',
  interfaceName: 'AboutHeroBlock',
  labels: {
    plural: 'About Heroes',
    singular: 'About Hero',
  },
  graphQL: { singularName: 'AboutHeroBlock' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (pill above heading)',
      admin: { description: 'e.g. "About CipherCru"' },
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
      required: true,
      admin: {
        description:
          'Big display headline. Press Enter for a line break. Wrap a word in **double asterisks** to colour it brand blue. Example: "We engineer\\n**cyber-resilience**\\nat scale."',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      admin: { description: 'Short paragraph below the heading.' },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero media (image, GIF or MP4 — right side)',
      admin: {
        description:
          'Upload an image, GIF, or MP4 video. Videos play muted and looping on the right side of the hero.',
      },
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'links',
        label: 'CTA buttons',
        maxRows: 2,
      },
    }),
  ],
}
