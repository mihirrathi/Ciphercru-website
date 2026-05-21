import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Brand',
          fields: [
            {
              name: 'tagline',
              type: 'textarea',
              label: 'Tagline / company description',
              defaultValue:
                'Tailored IT solutions, cloud services, and cybersecurity for ambitious teams. We build, secure, and scale the technology that powers your business.',
            },
            {
              name: 'socials',
              type: 'array',
              label: 'Social links',
              labels: { singular: 'Social', plural: 'Socials' },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Twitter / X', value: 'twitter' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'https://linkedin.com/company/your-company',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Link columns',
          fields: [
            {
              name: 'columns',
              type: 'array',
              label: 'Link columns',
              labels: { singular: 'Column', plural: 'Columns' },
              admin: {
                initCollapsed: true,
                description: 'Each column is a heading + a list of links.',
              },
              maxRows: 4,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Column title',
                  required: true,
                  admin: { description: 'e.g. "Services", "Company", "Resources".' },
                },
                {
                  name: 'links',
                  type: 'array',
                  label: 'Links',
                  labels: { singular: 'Link', plural: 'Links' },
                  admin: { initCollapsed: true },
                  fields: [link({ appearances: false })],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactHeading',
              type: 'text',
              label: 'Contact heading',
              defaultValue: 'Get in touch',
            },
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Email',
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Phone',
            },
            {
              name: 'contactAddress',
              type: 'textarea',
              label: 'Address',
            },
          ],
        },
        {
          label: 'Bottom bar',
          fields: [
            {
              name: 'copyright',
              type: 'text',
              label: 'Copyright text',
              defaultValue: '© CipherCru. All rights reserved.',
              admin: {
                description: 'Use {year} to auto-insert the current year, e.g. "© {year} CipherCru".',
              },
            },
            {
              name: 'legalLinks',
              type: 'array',
              label: 'Legal / utility links',
              labels: { singular: 'Link', plural: 'Links' },
              admin: {
                initCollapsed: true,
                description: 'Privacy, Terms, Cookies, etc.',
              },
              fields: [link({ appearances: false })],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
