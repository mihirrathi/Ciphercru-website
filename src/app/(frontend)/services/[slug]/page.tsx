import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import ServicePageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const services = await payload.find({
    collection: 'services',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return (services.docs ?? []).map(({ slug }) => ({ slug: slug ?? '' }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function ServicePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/services/${decodedSlug}`

  const service = await queryServiceBySlug({ slug: decodedSlug })

  if (!service) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = service
  const [logoMarqueeBlock, contactBlock] = await Promise.all([
    queryLogoMarqueeBlock(),
    queryContactSectionBlock(),
  ])

  return (
    <article>
      <ServicePageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />

      {logoMarqueeBlock && <RenderBlocks blocks={[logoMarqueeBlock]} />}

      {contactBlock && (
        <div id="contact-form" className="scroll-mt-24">
          <RenderBlocks blocks={[contactBlock]} />
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const service = await queryServiceBySlug({ slug: decodedSlug })

  return generateMeta({ doc: service })
}

const queryServiceBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'services',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

// Pulls the LogoMarquee block ("companies we work with") from the home page
// so the same logo strip shows on every Service page right above the form.
const queryLogoMarqueeBlock = cache(async (): Promise<Page['layout'][0] | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: { slug: { equals: 'home' } },
  })

  const page = result.docs?.[0]
  const marquee = page?.layout?.find((b) => b?.blockType === 'logoMarquee')
  return marquee ?? null
})

// Finds the first ContactSection block on any published page whose slug
// contains "contact" (so it works whether the page slug is "contacts",
// "contact-us", or "contact") and reuses it at the bottom of every Service
// page. Admin edits the form once on the contact page; it propagates here.
const queryContactSectionBlock = cache(async (): Promise<Page['layout'][0] | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 10,
    pagination: false,
    overrideAccess: false,
    where: { slug: { contains: 'contact' } },
  })

  for (const page of result.docs ?? []) {
    const contact = page.layout?.find((b) => b?.blockType === 'contactSection')
    if (contact) return contact
  }
  return null
})
