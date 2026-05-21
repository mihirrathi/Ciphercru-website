import React from 'react'

import type { ContactSectionBlock as ContactSectionBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { FormBlock } from '@/blocks/Form/Component'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react'

type InfoCardProps = {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  href?: string
  cta?: string
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, children, href, cta }) => {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href
    ? {
        href,
        ...(href.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {}),
      }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 transition-all ${
        href ? 'hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40 hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-200/60">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
          {label}
        </div>
        <div className="text-sm sm:text-base text-gray-900 font-medium leading-relaxed break-words">
          {children}
        </div>
        {cta && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
            {cta}
            <ArrowUpRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </Wrapper>
  )
}

export const ContactSectionBlock: React.FC<ContactSectionBlockProps> = (props) => {
  const {
    addressHeading,
    addressIntro,
    companyName,
    addressLine1,
    addressLine2,
    city,
    stateRegion,
    postalCode,
    country,
    email,
    phone,
    mapLink,
    formHeading,
    form,
  } = props

  const locality = [city, stateRegion].filter(Boolean).join(', ')
  const cityLine = [locality, postalCode].filter(Boolean).join(' ')

  const hasAnyAddress = Boolean(
    companyName || addressLine1 || addressLine2 || cityLine || country,
  )

  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-blue-50/60 via-white to-white" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_15%_10%,rgba(64,126,201,0.18),transparent_55%),radial-gradient(circle_at_85%_90%,rgba(99,102,241,0.14),transparent_55%)]"
      />

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-start">
          {/* Left — Info column */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              We typically reply within 24 hours
            </div>

            {addressHeading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 leading-tight">
                {addressHeading}
              </h2>
            )}
            {addressIntro && (
              <RichText
                className="mb-8 text-gray-600 text-base lg:text-lg"
                data={addressIntro}
                enableGutter={false}
              />
            )}

            <div className="space-y-4">
              {email && (
                <InfoCard
                  icon={<Mail className="w-5 h-5" />}
                  label="Email"
                  href={`mailto:${email}`}
                  cta="Send email"
                >
                  {email}
                </InfoCard>
              )}

              {phone && (
                <InfoCard
                  icon={<Phone className="w-5 h-5" />}
                  label="Phone"
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  cta="Call now"
                >
                  {phone}
                </InfoCard>
              )}

              {hasAnyAddress && (
                <InfoCard
                  icon={<MapPin className="w-5 h-5" />}
                  label="Office"
                  href={mapLink || undefined}
                  cta={mapLink ? 'Open in Maps' : undefined}
                >
                  <address className="not-italic">
                    {companyName && <div className="font-semibold">{companyName}</div>}
                    {addressLine1 && <div className="text-gray-600 font-normal">{addressLine1}</div>}
                    {addressLine2 && <div className="text-gray-600 font-normal">{addressLine2}</div>}
                    {cityLine && <div className="text-gray-600 font-normal">{cityLine}</div>}
                    {country && <div className="text-gray-600 font-normal">{country}</div>}
                  </address>
                </InfoCard>
              )}
            </div>
          </div>

          {/* Right — Form card */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 bg-linear-to-br from-blue-200/30 to-blue-100/10 rounded-[2rem] blur-2xl"
            />
            <div className="relative bg-white rounded-2xl border border-blue-100/70 shadow-xl shadow-blue-100/40 p-6 sm:p-8 lg:p-10">
              {formHeading && (
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
                    {formHeading}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Fill in your details and we'll get back to you shortly.
                  </p>
                </div>
              )}
              {form && typeof form === 'object' && (
                <FormBlock
                  enableIntro={false}
                  form={form as unknown as FormType}
                  disableContainer
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
