import type { GlobalConfig } from 'payload'

import { revalidateBlogPage } from './hooks/revalidateBlogPage'

export const BlogPage: GlobalConfig = {
  slug: 'blog-page',
  label: 'Blog Page',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Controls the hero, sidebar widgets, popular posts, and newsletter card on the /blog page.',
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
              defaultValue: 'Our Blog',
            },
            {
              name: 'heading',
              type: 'text',
              label: 'Heading',
              defaultValue: 'Insights. Ideas. Innovation.',
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitle',
              defaultValue:
                'Stay updated with the latest trends, insights, and expert opinions from the world of technology and digital transformation.',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero background image (optional)',
              admin: {
                description:
                  'Used as a subtle right-side image behind the gradient. Leave empty for a plain gradient.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'searchPlaceholder',
                  type: 'text',
                  label: 'Search input placeholder',
                  defaultValue: 'Search blogs, topics...',
                  admin: { width: '50%' },
                },
                {
                  name: 'categoryPlaceholder',
                  type: 'text',
                  label: 'Category dropdown label',
                  defaultValue: 'All Categories',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'featuredHeading',
              type: 'text',
              label: 'Featured section heading',
              defaultValue: 'Featured Article',
            },
            {
              name: 'allArticlesHeading',
              type: 'text',
              label: 'All articles section heading',
              defaultValue: 'All Articles',
            },
            {
              name: 'categoriesHeading',
              type: 'text',
              label: 'Categories sidebar heading',
              defaultValue: 'Categories',
            },
            {
              name: 'allCategoriesLabel',
              type: 'text',
              label: '"All categories" row label',
              defaultValue: 'All Categories',
            },
            {
              name: 'postsPerPage',
              type: 'number',
              label: 'Articles per page',
              defaultValue: 6,
              min: 3,
              max: 24,
            },
          ],
        },
        {
          label: 'Popular posts',
          fields: [
            {
              name: 'popularHeading',
              type: 'text',
              label: 'Sidebar heading',
              defaultValue: 'Popular Posts',
            },
            {
              name: 'popularPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              maxRows: 6,
              label: 'Popular posts',
              admin: {
                description:
                  'Pick the posts shown in the "Popular Posts" sidebar widget. Order matters.',
              },
            },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            {
              name: 'newsletterEnabled',
              type: 'checkbox',
              label: 'Show newsletter card',
              defaultValue: true,
            },
            {
              name: 'newsletterHeading',
              type: 'text',
              label: 'Heading',
              defaultValue: 'Subscribe to our Newsletter',
              admin: {
                condition: (_, sib) => Boolean(sib?.newsletterEnabled),
              },
            },
            {
              name: 'newsletterText',
              type: 'textarea',
              label: 'Description',
              defaultValue: 'Get the latest insights and articles delivered to your inbox.',
              admin: {
                condition: (_, sib) => Boolean(sib?.newsletterEnabled),
              },
            },
            {
              type: 'row',
              admin: {
                condition: (_, sib) => Boolean(sib?.newsletterEnabled),
              },
              fields: [
                {
                  name: 'newsletterPlaceholder',
                  type: 'text',
                  label: 'Email input placeholder',
                  defaultValue: 'Enter your email',
                  admin: { width: '50%' },
                },
                {
                  name: 'newsletterButtonLabel',
                  type: 'text',
                  label: 'Button label',
                  defaultValue: 'Subscribe Now',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'newsletterEndpoint',
              type: 'text',
              label: 'Form submit URL (optional)',
              admin: {
                condition: (_, sib) => Boolean(sib?.newsletterEnabled),
                description:
                  'POST endpoint that receives `{ email }`. Leave blank to use a mailto: link or a placeholder no-op.',
              },
            },
          ],
        },
        {
          label: 'Empty state',
          fields: [
            {
              name: 'noResultsText',
              type: 'text',
              label: 'No-results message',
              defaultValue: 'No articles match your search.',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateBlogPage],
  },
}
