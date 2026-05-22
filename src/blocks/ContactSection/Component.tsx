import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { ArrowRight, Clock, Headphones, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { ContactSectionBlock as ContactSectionBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'

import { ContactForm } from './ContactForm'

type InfoRowProps = {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  href?: string | null
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, children, href }) => {
  const content = (
    <div className="flex items-start gap-4 py-4">
      <div className="shrink-0 w-12 h-12 rounded-full bg-blue-50 text-brand flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-base font-bold text-gray-900 mb-0.5">{label}</div>
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  )

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="block transition-colors hover:bg-gray-50/60 rounded-lg -mx-2 px-2"
      >
        {content}
      </a>
    )
  }

  return content
}

export const ContactSectionBlock: React.FC<ContactSectionBlockProps> = (props) => {
  const {
    eyebrow,
    headingPrimary,
    headingHighlight,
    description,
    phone,
    email,
    companyName,
    addressLine1,
    addressLine2,
    city,
    stateRegion,
    postalCode,
    country,
    mapLink,
    workingHoursTitle,
    workingHours,
    showSupportCard,
    supportTitle,
    supportSubtitle,
    supportButtonLabel,
    supportButtonLink,
    formHeading,
    formSubheading,
    form,
    showAgreement,
    privacyPolicyUrl,
    termsUrl,
    safetyNote,
  } = props

  const locality = [city, stateRegion].filter(Boolean).join(', ')
  const cityLine = [locality, postalCode].filter(Boolean).join(' ')
  const addressLines = [companyName, addressLine1, addressLine2, cityLine, country].filter(Boolean)
  const hasAddress = addressLines.length > 0
  const hasWorkingHours = Array.isArray(workingHours) && workingHours.length > 0

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-linear-to-b from-blue-50/40 via-white to-white">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_10%_10%,rgba(64,126,201,0.10),transparent_55%),radial-gradient(circle_at_90%_90%,rgba(99,102,241,0.08),transparent_55%)]"
      />

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Info column */}
          <div>
            {eyebrow && (
              <div className="flex items-center gap-2 mb-5">
                <span className="h-px w-6 bg-brand" />
                <span className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">
                  {eyebrow}
                </span>
              </div>
            )}

            {(headingPrimary || headingHighlight) && (
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5 text-gray-900">
                {headingPrimary}
                {headingPrimary && headingHighlight && <br />}
                {headingHighlight && <span className="text-brand">{headingHighlight}</span>}
              </h2>
            )}

            {description && (
              <RichText
                className="text-base text-gray-600 leading-relaxed mb-8 max-w-lg"
                data={description}
                enableGutter={false}
              />
            )}

            <div className="divide-y divide-gray-100">
              {phone && (
                <InfoRow
                  icon={<Phone className="w-5 h-5" />}
                  label="Phone"
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                >
                  {phone}
                </InfoRow>
              )}

              {email && (
                <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" href={`mailto:${email}`}>
                  {email}
                </InfoRow>
              )}

              {hasAddress && (
                <InfoRow
                  icon={<MapPin className="w-5 h-5" />}
                  label="Location"
                  href={mapLink || undefined}
                >
                  <address className="not-italic">
                    {addressLines.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </address>
                </InfoRow>
              )}

              {hasWorkingHours && (
                <InfoRow icon={<Clock className="w-5 h-5" />} label={workingHoursTitle || 'Working Hours'}>
                  {workingHours!.map((item, idx) => (
                    <div key={item.id || idx}>{item.text}</div>
                  ))}
                </InfoRow>
              )}
            </div>

            {showSupportCard && (supportTitle || supportButtonLabel) && (
              <div className="relative mt-8 overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 to-blue-700 p-6 text-white shadow-xl shadow-blue-200/50">
                <div
                  aria-hidden
                  className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10"
                />
                <div
                  aria-hidden
                  className="absolute right-10 top-4 w-20 h-20 rounded-full bg-white/5"
                />
                <div className="relative flex items-center gap-4">
                  <div className="shrink-0 w-14 h-14 rounded-full bg-white text-brand flex items-center justify-center shadow-md">
                    <Headphones className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {supportTitle && (
                      <div className="text-lg font-semibold leading-snug">{supportTitle}</div>
                    )}
                    {supportSubtitle && (
                      <div className="text-sm text-white/80 mt-0.5">{supportSubtitle}</div>
                    )}
                    {supportButtonLabel && (
                      <Link
                        href={supportButtonLink || '/contact'}
                        className="mt-3 inline-flex items-center gap-1.5 bg-white text-brand text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        {supportButtonLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — Form card */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 bg-linear-to-br from-blue-200/30 to-blue-100/10 rounded-[2rem] blur-2xl"
            />
            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-100/30 p-6 sm:p-8 lg:p-10">
              {(formHeading || formSubheading) && (
                <div className="mb-7">
                  {formHeading && (
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-1.5">
                      {formHeading}
                    </h3>
                  )}
                  {formSubheading && (
                    <p className="text-sm text-gray-500">{formSubheading}</p>
                  )}
                </div>
              )}

              {form && typeof form === 'object' && (
                <ContactForm
                  form={form as unknown as FormType}
                  showAgreement={showAgreement}
                  privacyPolicyUrl={privacyPolicyUrl}
                  termsUrl={termsUrl}
                  safetyNote={safetyNote}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
