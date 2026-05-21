import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      labels: { singular: 'Nav Item', plural: 'Nav Items' },
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'link',
          admin: { layout: 'horizontal' },
          options: [
            { label: 'Single link', value: 'link' },
            { label: 'Mega menu', value: 'menu' },
          ],
        },
        // ---- Single link ----
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'link',
            },
          },
        }),
        // ---- Mega menu ----
        {
          name: 'menuLabel',
          type: 'text',
          label: 'Menu label',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'menu',
            description: 'Label shown in the navbar, e.g. "Services".',
          },
        },
        {
          name: 'megaPromo',
          type: 'group',
          label: 'Promo panel (left side of mega menu)',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'menu',
            description:
              'Optional intro card shown on the left of the mega menu. Disable to remove.',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Show promo panel',
              defaultValue: true,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              defaultValue: 'Services We Provide',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enabled),
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitle',
              defaultValue: 'We are here to turn your ideas into outstanding digital solutions.',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enabled),
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Promo image',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enabled),
                description: 'Image shown at the bottom of the promo panel.',
              },
            },
            {
              name: 'imageOverlayText',
              type: 'text',
              label: 'Image overlay text',
              defaultValue: "Maximize your product's development journey with us!",
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.enabled),
              },
            },
            link({
              appearances: false,
              overrides: {
                admin: {
                  condition: (_, siblingData) => Boolean(siblingData?.enabled),
                  description: 'Optional: makes the entire promo card clickable.',
                },
              },
            }),
          ],
        },
        {
          name: 'menuGroups',
          type: 'array',
          label: 'Mega menu groups',
          labels: { singular: 'Group', plural: 'Groups' },
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'menu',
            initCollapsed: true,
            description: 'Each group becomes one column on the right side of the mega menu.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Group title',
              required: true,
              admin: {
                description: 'e.g. "Software Development", "Ideation & Product Design".',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              labels: { singular: 'Item', plural: 'Items' },
              admin: { initCollapsed: true },
              fields: [
                link({ appearances: false }),
                {
                  name: 'description',
                  type: 'text',
                  label: 'Short description',
                  admin: {
                    description: 'Shown under the label, e.g. "Craft user-centered interfaces".',
                  },
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Icon override (optional)',
                  admin: {
                    description:
                      "Leave empty to inherit the linked service's icon.",
                  },
                },
              ],
            },
          ],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
