/**
 * Creates (or updates) the CipherCru "About" page, composed entirely of
 * existing CMS blocks + the new Team block. Re-runnable — it upserts by slug.
 *
 * Run:  pnpm tsx scripts/create-about-page.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// ---------- tiny lexical richText helpers ----------
const text = (value: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

const heading = (value: string, tag: 'h1' | 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const paragraph = (value: string) => ({
  type: 'paragraph',
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const root = (children: unknown[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const customLink = (label: string, url: string, appearance: 'default' | 'outline') => ({
  link: {
    type: 'custom',
    url,
    label,
    appearance,
    newTab: false,
  },
})

async function main() {
  const payload = await getPayload({ config })

  // Grab an existing image to satisfy the AboutSection's required `image`
  // field (the user can swap it in the admin afterwards).
  const media = await payload.find({
    collection: 'media',
    limit: 6,
    depth: 0,
    where: { mimeType: { like: 'image' } },
  })
  const images = media.docs
  const heroImageId = images[0]?.id

  if (!heroImageId) {
    payload.logger.warn(
      '[about] No media found — skipping the "Our Story" AboutSection (it needs an image). Add an image in the admin and re-run if you want it.',
    )
  }

  // ---------- layout blocks ----------
  const layout: any[] = []

  // 1. Hero (left-aligned big display headline, grid bg, eyebrow pill, 2 CTAs)
  layout.push({
    blockType: 'aboutHero',
    blockName: 'About hero',
    eyebrow: 'About CipherCru',
    heading: 'We engineer\n**cyber-resilience**\nthat moves business.',
    subheading:
      'CipherCru partners with ambitious organisations to defend their infrastructure, secure their applications, and respond to threats with confidence.',
    links: [
      { link: { type: 'custom', url: '/services', label: 'Explore Our Work', appearance: 'default', newTab: false } },
      { link: { type: 'custom', url: '#team', label: 'Meet the Team ↓', appearance: 'outline', newTab: false } },
    ],
  })

  // 2. Stats band (brand gradient)
  layout.push({
    blockType: 'stats',
    blockName: 'About stats',
    eyebrow: 'CipherCru by the numbers',
    style: 'brand',
    items: [
      { value: '10+', label: 'Years securing businesses' },
      { value: '500+', label: 'Engagements delivered' },
      { value: '98%', label: 'Client retention' },
      { value: '40+', label: 'Security specialists' },
      { value: '20', label: 'Industries served' },
    ],
  })

  // 3. Our Story (AboutSection — only if we have an image)
  if (heroImageId) {
    layout.push({
      blockType: 'aboutSection',
      blockName: 'Our story',
      eyebrow: 'Our Story',
      heading: 'Security that **enables**, never obstructs.',
      content: root([
        paragraph(
          'CipherCru was founded by a team of security engineers who were tired of cybersecurity that slowed teams down instead of protecting them. We set out to build a different kind of partner — one obsessed with real-world resilience, not box-ticking compliance.',
        ),
        paragraph(
          'Today we help organisations across finance, healthcare, and technology defend their infrastructure, secure their applications, and respond to threats with confidence — embedding security into everything they build from day one.',
        ),
      ]),
      features: [
        {
          icon: 'shieldCheck',
          title: 'Security-first by default',
          description: 'We design defences into your architecture, not bolted on after the fact.',
        },
        {
          icon: 'handshake',
          title: 'Partnership mindset',
          description: 'We work as an extension of your team — your resilience is our metric.',
        },
        {
          icon: 'target',
          title: 'Outcome obsessed',
          description: 'We measure success in reduced risk and real business outcomes.',
        },
        {
          icon: 'zap',
          title: 'Rapid response',
          description: 'When it matters, our team moves fast to contain and recover.',
        },
      ],
      links: [customLink('Talk to our team', '/contact', 'default')],
      image: heroImageId,
      imagePosition: 'right',
      floatingCard: {
        icon: 'shieldCheck',
        text: 'ISO 27001-aligned practices protecting businesses around the clock.',
      },
      showStats: false,
    })
  }

  // 4. Our Journey (ProcessTimeline — years as titles)
  layout.push({
    blockType: 'processTimeline',
    blockName: 'Our journey',
    eyebrow: 'OUR JOURNEY',
    heading: 'Milestones that shaped CipherCru',
    steps: [
      {
        icon: 'rocket',
        title: 'Founded',
        description: 'Started by a small crew of penetration testers and defenders.',
      },
      {
        icon: 'globe',
        title: 'Went global',
        description: 'Expanded services and opened our first international engagements.',
      },
      {
        icon: 'shieldCheck',
        title: 'Managed defence',
        description: 'Launched 24/7 managed detection & response for enterprise clients.',
      },
      {
        icon: 'brain',
        title: 'AI security',
        description: 'Built a practice to secure AI systems and data at scale.',
      },
    ],
  })

  // 5. What Drives Us (Features — values grid)
  layout.push({
    blockType: 'features',
    blockName: 'Our values',
    eyebrow: 'What Drives Us',
    heading: 'Principles that shape every engagement.',
    alignment: 'center',
    columns: '3',
    cardStyle: 'soft',
    items: [
      {
        title: 'Engineering Excellence',
        description:
          'We hold ourselves to the highest technical standards and build defences meant to last.',
      },
      {
        title: 'Radical Transparency',
        description: 'No jargon, no hidden costs, no surprises — clear communication at every stage.',
      },
      {
        title: 'Partnership Mindset',
        description: 'Your success is our metric. We align incentives and work as part of your team.',
      },
      {
        title: 'Security First',
        description: 'We embed security into architecture from day one — a foundation, not an afterthought.',
      },
      {
        title: 'Outcome Obsession',
        description: 'We measure success in reduced risk and business outcomes, not deliverables.',
      },
      {
        title: 'Continuous Innovation',
        description: 'We invest in research so our clients stay ahead of evolving threats.',
      },
    ],
  })

  // 6. The People (new Team block)
  layout.push({
    blockType: 'team',
    blockName: 'Leadership team',
    eyebrow: 'The People',
    heading: 'Leadership that has defended the front lines.',
    intro:
      'Our leadership team brings decades of combined experience across offensive security, threat intelligence, and enterprise defence.',
    columns: '3',
    members: [
      {
        name: 'Amit Agarwal',
        role: 'Founder & CEO',
        bio: 'Two decades building security programmes for high-growth and enterprise organisations.',
      },
      {
        name: 'Priya Nair',
        role: 'CTO',
        bio: 'Cloud and application security architect with deep expertise in distributed systems.',
      },
      {
        name: 'Rohan Mehta',
        role: 'Head of Offensive Security',
        bio: 'OSCP-certified red teamer who has led engagements across finance and healthcare.',
      },
      {
        name: 'Sara Khan',
        role: 'Head of Threat Intelligence',
        bio: 'Tracks adversaries and translates threat data into defensive strategy.',
      },
      {
        name: 'David Lin',
        role: 'VP — Client Success',
        bio: 'Champions long-term client relationships and measurable security outcomes.',
      },
      {
        name: 'Neha Sharma',
        role: 'COO',
        bio: 'Ensures every CipherCru engagement is delivered on time, on scope, on budget.',
      },
    ],
  })

  // 7. Closing CTA
  layout.push({
    blockType: 'ctaBanner',
    blockName: 'About CTA',
    icon: 'shieldCheck',
    heading: "Let's secure your next challenge.",
    subheading:
      "Whether you're hardening infrastructure, securing applications, or preparing for an incident — we'd love to help.",
    links: [
      customLink('Start a conversation', '/contact', 'default'),
      customLink('View our services', '/services', 'outline'),
    ],
  })

  const pageData: any = {
    title: 'About Us',
    slug: 'about',
    _status: 'published',
    hero: {
      // The landingHeroV2 block (first in layout) is the visual hero now.
      type: 'none',
    },
    meta: {
      title: 'About Us — CipherCru',
      description:
        'CipherCru partners with ambitious organisations to defend their infrastructure, secure their applications, and respond to threats with confidence.',
    },
    layout,
  }

  // Upsert by slug
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'about' } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: pageData,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`[about] Updated existing About page (id ${updated.id}).`)
  } else {
    const created = await payload.create({
      collection: 'pages',
      data: pageData,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`[about] Created About page (id ${created.id}).`)
  }

  payload.logger.info('[about] Done. Visit /about (and /admin to edit).')
  process.exit(0)
}

main().catch((err) => {
  console.error('[about] ERROR', err)
  process.exit(1)
})
