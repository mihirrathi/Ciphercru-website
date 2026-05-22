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
          label: 'Header',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow',
              defaultValue: 'CONTACT US',
              admin: {
                description: 'Small uppercase label shown above the heading.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headingPrimary',
                  type: 'text',
                  label: 'Heading (primary)',
                  defaultValue: 'Let’s Build Something',
                  admin: { width: '50%' },
                },
                {
                  name: 'headingHighlight',
                  type: 'text',
                  label: 'Heading (highlighted)',
                  defaultValue: 'Great Together',
                  admin: {
                    width: '50%',
                    description: 'Rendered in the brand blue color.',
                  },
                },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone',
                  admin: { width: '50%' },
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'companyName',
              type: 'text',
              label: 'Company name (shown above address)',
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
              name: 'mapLink',
              type: 'text',
              label: 'Google Maps link (optional)',
            },
            {
              name: 'workingHoursTitle',
              type: 'text',
              label: 'Working hours title',
              defaultValue: 'Working Hours',
            },
            {
              name: 'workingHours',
              type: 'array',
              label: 'Working hours lines',
              labels: { singular: 'Line', plural: 'Lines' },
              defaultValue: [
                { text: 'Mon - Fri: 9:00 AM - 6:00 PM' },
                { text: 'Sat - Sun: Closed' },
              ],
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Line',
                },
              ],
            },
          ],
        },
        {
          label: 'Support Card',
          fields: [
            {
              name: 'showSupportCard',
              type: 'checkbox',
              label: 'Show support card',
              defaultValue: true,
            },
            {
              name: 'supportTitle',
              type: 'text',
              label: 'Title',
              defaultValue: 'Need immediate support?',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.showSupportCard),
              },
            },
            {
              name: 'supportSubtitle',
              type: 'text',
              label: 'Subtitle',
              defaultValue: 'Our team is ready to help you.',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.showSupportCard),
              },
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.showSupportCard),
              },
              fields: [
                {
                  name: 'supportButtonLabel',
                  type: 'text',
                  label: 'Button label',
                  defaultValue: 'Chat with Us',
                  admin: { width: '50%' },
                },
                {
                  name: 'supportButtonLink',
                  type: 'text',
                  label: 'Button link',
                  defaultValue: '/contact',
                  admin: { width: '50%' },
                },
              ],
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
              defaultValue: 'Send Us a Message',
            },
            {
              name: 'formSubheading',
              type: 'text',
              label: 'Form subheading',
              defaultValue: 'We’ll get back to you as soon as possible.',
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              label: 'Form',
              admin: {
                description:
                  'Use field names like fullName, email, phone, company, subject, message so the icons render correctly.',
              },
            },
            {
              name: 'showAgreement',
              type: 'checkbox',
              label: 'Show Privacy / Terms agreement',
              defaultValue: true,
            },
            {
              type: 'row',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.showAgreement),
              },
              fields: [
                {
                  name: 'privacyPolicyUrl',
                  type: 'text',
                  label: 'Privacy Policy URL',
                  defaultValue: '/privacy-policy',
                  admin: { width: '50%' },
                },
                {
                  name: 'termsUrl',
                  type: 'text',
                  label: 'Terms of Service URL',
                  defaultValue: '/terms-of-service',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'safetyNote',
              type: 'text',
              label: 'Safety note (shown next to submit button)',
              defaultValue: 'Your information is safe with us.',
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
