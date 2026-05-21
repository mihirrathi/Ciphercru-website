import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PortfolioGrid } from './PortfolioGrid.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ProjectsIndexPage() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 200,
    overrideAccess: false,
    pagination: false,
    sort: ['-featured', 'order', '-publishedAt'],
  })

  const projects = result.docs ?? []

  return (
    <div>
      <section className="relative overflow-hidden bg-linear-to-b from-blue-50 via-white to-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_20%_-10%,rgba(59,130,246,0.18),transparent_50%),radial-gradient(circle_at_80%_-10%,rgba(99,102,241,0.15),transparent_50%)]"
        />
        <div className="container pt-20 pb-16 lg:pt-28 lg:pb-20 text-center">
          <div className="text-sm uppercase tracking-wider text-blue-600 font-semibold mb-4">
            Our Portfolio
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
            Crafted solutions for ambitious teams
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A selection of recent work — products, platforms, and experiences we've shipped
            for clients across industries.
          </p>
        </div>
      </section>

      <section className="container pb-24">
        <PortfolioGrid projects={projects} />
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Selected case studies and projects.',
}
