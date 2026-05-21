import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { AboutSection } from '../../blocks/AboutSection/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { ContactSection } from '../../blocks/ContactSection/config'
import { Content } from '../../blocks/Content/config'
import { FAQ } from '../../blocks/FAQ/config'
import { Features } from '../../blocks/Features/config'
import { FormBlock } from '../../blocks/Form/config'
import { LogoMarquee } from '../../blocks/LogoMarquee/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Stats } from '../../blocks/Stats/config'
import { Testimonials } from '../../blocks/Testimonials/config'
import { hero } from '@/heros/config'
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
      name: 'title',
      type: 'text',
      label: 'Project title',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'text',
          label: 'Client',
          admin: { width: '50%' },
        },
        {
          name: 'year',
          type: 'number',
          label: 'Year',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Summary',
      admin: {
        description: 'Short description shown on the portfolio card (1–2 sentences).',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover image',
      required: true,
      admin: {
        description: 'Used on the portfolio grid card and as the page header image.',
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
        description: 'Technologies used, e.g. "React", "Node.js", "AWS".',
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
          label: 'Live URL (optional)',
          admin: { width: '50%' },
        },
        {
          name: 'caseStudyHighlight',
          type: 'text',
          label: 'Headline result (optional)',
          admin: {
            width: '50%',
            description: 'A one-line highlight, e.g. "+45% conversion".',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        { fields: [hero], label: 'Hero' },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                LogoMarquee,
                Stats,
                Features,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                ContactSection,
                AboutSection,
                Testimonials,
                FAQ,
              ],
              required: true,
              admin: { initCollapsed: true },
            },
          ],
          label: 'Case study content',
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
        description: 'Lower numbers show first in listings.',
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
