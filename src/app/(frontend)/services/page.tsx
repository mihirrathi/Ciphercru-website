import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ServicesIndexPage() {
  const payload = await getPayload({ config: configPromise })

  const services = await payload.find({
    collection: 'services',
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'order',
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      icon: true,
    },
  })

  const items = services.docs ?? []

  return (
    <div className="container py-16 lg:py-24">
      <div className="max-w-2xl mb-12">
        <div className="text-sm uppercase tracking-wider text-primary mb-3 font-medium">
          Services
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">What we offer</h1>
        <p className="text-muted-foreground">
          Explore our range of services. Click any service to learn more.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">No services published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group block p-6 lg:p-8 bg-card border border-border rounded-[0.8rem] hover:border-primary transition-colors"
            >
              {service.icon && typeof service.icon === 'object' && (
                <div className="mb-4 w-12 h-12">
                  <Media
                    resource={service.icon}
                    imgClassName="w-full h-full object-contain"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h2>
              {service.shortDescription && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.shortDescription}
                </p>
              )}
              <span className="inline-block mt-4 text-sm text-primary font-medium">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Services',
  description: 'Browse our full range of services.',
}
