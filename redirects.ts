import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const postsToBlog = [
    {
      source: '/posts',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/posts/page/:pageNumber',
      destination: '/blog',
      permanent: true,
    },
    {
      source: '/posts/:slug',
      destination: '/blog/:slug',
      permanent: true,
    },
  ]

  return [internetExplorerRedirect, ...postsToBlog]
}
