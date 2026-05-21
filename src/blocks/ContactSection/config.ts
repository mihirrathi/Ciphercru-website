import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ContactSection: Block = {
  slug: 'contactSection',
  interfaceName: 'ContactSectionBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Address',
          fields: [
            {
              name: 'addressHeading',
              type: 'text',
              label: 'Heading',
              defaultValue: 'Get in touch',
            },
            {
              name: 'addressIntro',
              type: 'richText',
              label: 'Intro',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
            {
              name: 'companyName',
              type: 'text',
              label: 'Company name',
            },
            {
              name: 'addressLine1',
              type: 'text',
              label: 'Address line 1',
            },
            {
              name: 'addressLine2',
              type: 'text',
              label: 'Address line 2',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  label: 'City',
                  admin: { width: '50%' },
                },
                {
                  name: 'stateRegion',
                  type: 'text',
                  label: 'State / Region',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'Postal code',
                  admin: { width: '50%' },
                },
                {
                  name: 'country',
                  type: 'text',
                  label: 'Country',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email',
                  admin: { width: '50%' },
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'mapLink',
              type: 'text',
              label: 'Google Maps link (optional)',
            },
          ],
        },
        {
          label: 'Form',
          fields: [
            {
              name: 'formHeading',
              type: 'text',
              label: 'Form heading',
              defaultValue: 'Send us a message',
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              label: 'Form',
            },
          ],
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'ContactSectionBlock',
  },
  labels: {
    plural: 'Contact Sections',
    singular: 'Contact Section',
  },
}
