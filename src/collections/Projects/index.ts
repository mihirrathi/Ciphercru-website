import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidateProject'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

// Shared icon options. Values map to lucide-react icons on the frontend
// in `app/(frontend)/projects/_icons.tsx`.
const iconOptions = [
  { label: 'Target', value: 'target' },
  { label: 'Lightbulb', value: 'lightbulb' },
  { label: 'Trending Up', value: 'trendingUp' },
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
  { label: 'Gauge', value: 'gauge' },
  { label: 'File Text', value: 'fileText' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'User Cog', value: 'userCog' },
  { label: 'Bar Chart', value: 'barChart' },
  { label: 'Lock', value: 'lock' },
  { label: 'Bell', value: 'bell' },
  { label: 'Settings', value: 'settings' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Database', value: 'database' },
]

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    titleAccent: true,
    slug: true,
    client: true,
    summary: true,
    coverImage: true,
    category: true,
    tags: true,
    year: true,
    featured: true,
  },
  admin: {
    defaultColumns: ['title', 'client', 'category', 'year', 'featured', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'projects',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'projects',
        req,
      }),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Project title',
          required: true,
          admin: {
            width: '50%',
            description: 'Primary title shown in black, e.g. "FinDash – Smart".',
          },
        },
        {
          name: 'titleAccent',
          type: 'text',
          label: 'Title accent (optional)',
          admin: {
            width: '50%',
            description: 'Optional secondary title rendered in brand blue on a new line, e.g. "Financial Dashboard".',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'text',
          label: 'Client',
          admin: { width: '25%' },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration',
          admin: {
            width: '25%',
            description: 'e.g. "8 Weeks".',
          },
        },
        {
          name: 'teamSize',
          type: 'text',
          label: 'Team size',
          admin: {
            width: '25%',
            description: 'e.g. "4 Members".',
          },
        },
        {
          name: 'year',
          type: 'number',
          label: 'Year',
          admin: { width: '25%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Summary',
      admin: {
        description: 'Short description shown on the portfolio card and at the top of the case study (1–2 sentences).',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover / mockup image',
      required: true,
      admin: {
        description: 'Used on the portfolio grid card and as the large device-mockup image in the case study header.',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      required: true,
      options: [
        { label: 'Web Development', value: 'web' },
        { label: 'Mobile App', value: 'mobile' },
        { label: 'AI / ML', value: 'ai' },
        { label: 'Cloud & DevOps', value: 'cloud' },
        { label: 'UI / UX Design', value: 'design' },
        { label: 'Cybersecurity', value: 'security' },
        { label: 'E-commerce', value: 'ecommerce' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tech stack / tags',
      labels: { singular: 'Tag', plural: 'Tags' },
      admin: {
        description: 'Technologies used, e.g. "React", "Node.js", "AWS". Shown as pill badges on the portfolio card.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'liveUrl',
          type: 'text',
          label: 'Live website URL',
          admin: { width: '50%' },
        },
        {
          name: 'sourceUrl',
          type: 'text',
          label: 'Source code URL',
          admin: {
            width: '50%',
            description: 'Optional. Renders the "View Source Code" button next to "Live Website".',
          },
        },
      ],
    },
    {
      name: 'caseStudyHighlight',
      type: 'text',
      label: 'Cover badge (optional)',
      admin: {
        description: 'A one-line highlight overlaid on the cover image, e.g. "+45% conversion".',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'overview',
              type: 'textarea',
              label: 'Project overview',
              admin: {
                description: 'Longer description shown on the left of the "Project Overview" section.',
              },
            },
            {
              name: 'highlightStats',
              type: 'array',
              label: 'Highlight stats (blue gradient panel)',
              labels: { singular: 'Stat', plural: 'Stats' },
              maxRows: 4,
              admin: {
                description: 'Up to 4 headline numbers shown in the blue gradient card under the overview text.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Value',
                      required: true,
                      admin: {
                        width: '50%',
                        description: 'e.g. "40%", "2.5x".',
                      },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Label',
                      required: true,
                      admin: {
                        width: '50%',
                        description: 'e.g. "More Efficiency".',
                      },
                    },
                  ],
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  defaultValue: 'gauge',
                  options: iconOptions,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'challenge',
                  type: 'group',
                  label: 'The Challenge',
                  admin: { width: '33%' },
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      defaultValue: 'target',
                      options: iconOptions,
                    },
                    {
                      name: 'heading',
                      type: 'text',
                      label: 'Heading',
                      defaultValue: 'The Challenge',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Description',
                    },
                  ],
                },
                {
                  name: 'solution',
                  type: 'group',
                  label: 'Our Solution',
                  admin: { width: '33%' },
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      defaultValue: 'lightbulb',
                      options: iconOptions,
                    },
                    {
                      name: 'heading',
                      type: 'text',
                      label: 'Heading',
                      defaultValue: 'Our Solution',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'Description',
                    },
                  ],
                },
                {
                  name: 'results',
                  type: 'group',
                  label: 'The Results',
                  admin: { width: '34%' },
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      defaultValue: 'trendingUp',
                      options: iconOptions,
                    },
                    {
                      name: 'heading',
                      type: 'text',
                      label: 'Heading',
                      defaultValue: 'The Results',
                    },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Result bullets',
                      labels: { singular: 'Result', plural: 'Results' },
                      admin: { initCollapsed: true },
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tech & Features',
          fields: [
            {
              name: 'technologiesHeading',
              type: 'text',
              label: '"Technologies Used" heading',
              defaultValue: 'Technologies Used',
            },
            {
              name: 'technologies',
              type: 'array',
              label: 'Technologies used',
              labels: { singular: 'Technology', plural: 'Technologies' },
              admin: {
                description: 'Tools/libraries shown with a logo and name in the left card.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Name',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'logo',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Logo',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'keyFeaturesHeading',
              type: 'text',
              label: '"Key Features" heading',
              defaultValue: 'Key Features',
            },
            {
              name: 'keyFeatures',
              type: 'array',
              label: 'Key features',
              labels: { singular: 'Feature', plural: 'Features' },
              admin: {
                description: 'Up to ~6 product features, each rendered as an icon card.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      defaultValue: 'sparkles',
                      options: iconOptions,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Title',
                      required: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                },
              ],
            },
          ],
        },
        {
          label: 'Screenshots',
          fields: [
            {
              name: 'screenshotsHeading',
              type: 'text',
              label: '"Project Screenshots" heading',
              defaultValue: 'Project Screenshots',
            },
            {
              name: 'screenshots',
              type: 'array',
              label: 'Project screenshots',
              labels: { singular: 'Screenshot', plural: 'Screenshots' },
              admin: {
                description: 'Images shown in the horizontally-scrollable screenshots carousel.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption (optional)',
                },
              ],
            },
          ],
        },
        {
          label: 'Testimonial',
          fields: [
            {
              name: 'testimonial',
              type: 'group',
              label: 'Client testimonial',
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Quote',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'authorName',
                      type: 'text',
                      label: 'Author name',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'authorRole',
                      type: 'text',
                      label: 'Author role / company',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'authorImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Author photo',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'rating',
                      type: 'number',
                      label: 'Rating (1–5)',
                      defaultValue: 5,
                      min: 1,
                      max: 5,
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured project',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this project prominently on the homepage or featured sections.',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Sort order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers show first in listings and drive the previous/next navigation order.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProject],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateProjectDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
