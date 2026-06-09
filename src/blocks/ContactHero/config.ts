import type { Block } from 'payload'

export const ContactHero: Block = {
  slug: 'contactHero',
  interfaceName: 'ContactHeroBlock',
  labels: {
    plural: 'Contact Heroes',
    singular: 'Contact Hero',
  },
  graphQL: { singularName: 'ContactHeroBlock' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (pill above heading)',
      defaultValue: 'Contact Us',
      admin: { description: 'Small label shown in the pill, e.g. "Contact Us".' },
    },
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
      required: true,
      defaultValue: "Let's build something **great** together.",
      admin: {
        description:
          'Big display headline. Press Enter for a line break. Wrap a word in **double asterisks** to colour it brand blue. Example: "Let\'s build something **great** together."',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      admin: { description: 'Short paragraph below the heading.' },
    },
  ],
}
