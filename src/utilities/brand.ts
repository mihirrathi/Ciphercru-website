/**
 * Central brand identity used across SEO metadata, Open Graph, and titles.
 * Update these in one place rather than scattering literals through the app.
 */
export const SITE_NAME = 'CipherCru'

/** Default / homepage title (used when a page has no title of its own). */
export const SITE_TITLE = 'CipherCru — IT Solutions, Cloud & Cybersecurity'

/** Default description for Open Graph and meta when a page provides none. */
export const SITE_DESCRIPTION =
  'Tailored IT solutions, cloud services, and cybersecurity for ambitious teams. We build, secure, and scale the technology that powers your business.'

/** Suffix appended to page titles, e.g. "My Post | CipherCru". */
export const titleWithSuffix = (title?: string | null): string =>
  title ? `${title} | ${SITE_NAME}` : SITE_TITLE

// NOTE: placeholder — update to CipherCru's real X/Twitter handle when available.
export const TWITTER_HANDLE = '@ciphercru'

/** Logo path under /public, used as the publisher logo in structured data. */
export const SITE_LOGO_PATH = '/new%20text%20with%20logo%20(2).png'
