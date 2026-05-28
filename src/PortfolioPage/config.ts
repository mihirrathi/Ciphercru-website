import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidatePortfolioPage } from './hooks/revalidatePortfolioPage'

// Shared icon options for the hero highlights and stats. Values are mapped to
// lucide-react icons on the frontend in `app/(frontend)/projects/_icons.tsx`.
const iconOptions = [
  { label: 'Rocket', value: 'rocket' },
  { label: 'Shield', value: 'shield' },
  { label: 'Users', value: 'users' },
  { label: 'Star', value: 'star' },
  { label: 'Briefcase', value: 'briefcase' },
  { label: 'Globe', value: 'globe' },
  { label: 'Code', value: 'code' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Lightning', value: 'zap' },
  { label: 'Trophy', value: 'trophy' },
  { label: 'Heart', value: 'heart' },
  { label: 'Check', value: 'check' },
]

export const PortfolioPage: GlobalConfig = {
  slug: 'portfolio-page',
  label: 'Portfolio Page',
  access: {
    read: () => true,
  },
  admin: {
    description: 'Controls the hero, stats, CTA card and testimonial on the /projects page.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow (small label above heading)',
              defaultValue: 'Our Portfolio',
            },
            {
              name: 'heading',
              type: 'text',
              label: 'Heading',
              defaultValue: 'Our Work Speaks for **Itself**',
              admin: {
                description:
                  'Wrap part of the heading in **double asterisks** to highlight it in brand colour. Example: "Our Work Speaks for **Itself**".',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitle',
              defaultValue:
                "Explore a curated collection of projects we've built for businesses across different industries.",
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero image',
              admin: {
                description: 'The illustration / dashboard mockup shown beside the heading.',
              },
            },
            {
              name: 'highlights',
              type: 'array',
              label: 'Feature highlights',
              labels: { singular: 'Highlight', plural: 'Highlights' },
              maxRows: 4,
              admin: { initCollapsed: true },
              defaultValue: [
                {
                  icon: 'rocket',
                  title: 'Modern Solutions',
                  text: 'Built with the latest technologies',
                },
                {
                  icon: 'shield',
                  title: 'Quality Focused',
                  text: 'Clean code and best practices',
                },
                {
                  icon: 'users',
                  title: 'Client Success',
                  text: 'Results that drive real growth',
                },
              ],
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  defaultValue: 'rocket',
                  options: iconOptions,
                },
                { name: 'title', type: 'text', label: 'Title', required: true },
                { name: 'text', type: 'textarea', label: 'Text' },
              ],
            },
          ],
        },
        {
          label: 'Stats',
          fields: [
            {
              name: 'statsHeading',
              type: 'text',
              label: 'Stats heading',
              defaultValue: 'Our Work in Numbers',
            },
            {
              name: 'stats',
              type: 'array',
              label: 'Stats',
              labels: { singular: 'Stat', plural: 'Stats' },
              minRows: 2,
              maxRows: 6,
              admin: { initCollapsed: true },
              defaultValue: [
                { value: '120+', label: 'Projects Completed', icon: 'briefcase' },
                { value: '80+', label: 'Happy Clients', icon: 'users' },
                { value: '5+', label: 'Years of Experience', icon: 'star' },
                { value: '15+', label: 'Industries Served', icon: 'globe' },
              ],
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  label: 'Value',
                  required: true,
                  admin: { description: 'e.g. "120+", "99.9%".' },
                },
                { name: 'label', type: 'text', label: 'Label', required: true },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  defaultValue: 'briefcase',
                  options: iconOptions,
                },
              ],
            },
          ],
        },
        {
          label: 'CTA card',
          fields: [
            {
              name: 'ctaHeading',
              type: 'text',
              label: 'Heading',
              defaultValue: 'Have a project in mind?',
            },
            {
              name: 'ctaText',
              type: 'textarea',
              label: 'Text',
              defaultValue: "Let's build something amazing together.",
            },
            link({
              appearances: false,
              overrides: {
                name: 'ctaLink',
                label: 'Button',
              },
            }),
          ],
        },
        {
          label: 'Testimonial',
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              label: 'Quote',
              defaultValue:
                'Their team understood our requirements perfectly and delivered beyond our expectations. Highly professional and cooperative!',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'authorName',
                  type: 'text',
                  label: 'Author name',
                  admin: { width: '50%' },
                  defaultValue: 'Rohit Sharma',
                },
                {
                  name: 'authorRole',
                  type: 'text',
                  label: 'Author role / company',
                  admin: { width: '50%' },
                  defaultValue: 'CTO, TechNova Solutions',
                },
              ],
            },
            {
              name: 'authorImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Author photo',
            },
            {
              name: 'rating',
              type: 'number',
              label: 'Rating (1–5)',
              defaultValue: 5,
              min: 1,
              max: 5,
            },
          ],
        },
        {
          label: 'Search',
          fields: [
            {
              name: 'searchPlaceholder',
              type: 'text',
              label: 'Search box placeholder',
              defaultValue: 'Search projects...',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePortfolioPage],
  },
}
