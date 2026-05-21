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
import { LandingHero } from '../../blocks/LandingHero/config'
import { LogoMarquee } from '../../blocks/LogoMarquee/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Stats } from '../../blocks/Stats/config'
import { Testimonials } from '../../blocks/Testimonials/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateService, revalidateServiceDelete } from './hooks/revalidateService'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Services: CollectionConfig<'services'> = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
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
    shortDescription: true,
    icon: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'order', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'services',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'services',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short description',
      admin: {
        description: 'Shown in the header dropdown and on the services index page.',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon (optional)',
      admin: {
        description: 'Small icon shown next to the service in lists/dropdowns.',
      },
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
                LandingHero,
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
          label: 'Content',
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
    afterChange: [revalidateService],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateServiceDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
