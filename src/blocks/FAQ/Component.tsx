import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import {
  ChevronDown,
  MessageCircleQuestion,
  Users,
  DollarSign,
  Code2,
  ShieldCheck,
  Headphones,
  HelpCircle,
  Info,
  Clock,
  Rocket,
  Sparkles,
  Star,
  Lightbulb,
  Settings,
  Globe,
  Zap,
  CheckCircle2,
  MessageCircle,
  Briefcase,
  Handshake,
  Target,
  TrendingUp,
  FileText,
  Lock,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  messageCircleQuestion: MessageCircleQuestion,
  users: Users,
  dollarSign: DollarSign,
  code: Code2,
  shieldCheck: ShieldCheck,
  headphones: Headphones,
  helpCircle: HelpCircle,
  info: Info,
  clock: Clock,
  rocket: Rocket,
  sparkles: Sparkles,
  star: Star,
  lightbulb: Lightbulb,
  settings: Settings,
  globe: Globe,
  zap: Zap,
  checkCircle: CheckCircle2,
  messageCircle: MessageCircle,
  briefcase: Briefcase,
  handshake: Handshake,
  target: Target,
  trendingUp: TrendingUp,
  fileText: FileText,
  lock: Lock,
}

const Icon: React.FC<{ name?: string | null; className?: string }> = ({ name, className }) => {
  const Cmp = (name && iconMap[name]) || MessageCircleQuestion
  return <Cmp className={className} aria-hidden />
}

const renderHeading = (raw: string) => {
  const parts = raw.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <span key={i} className="text-brand">
          {p.slice(2, -2)}
        </span>
      )
    }
    return <React.Fragment key={i}>{p}</React.Fragment>
  })
}

export const FAQBlock: React.FC<FAQBlockProps & { id?: string }> = ({
  id,
  eyebrow,
  heading,
  intro,
  illustration,
  layout = 'split',
  allowMultipleOpen,
  items,
  footer,
  features,
}) => {
  const isSplit = layout === 'split'
  const groupName = allowMultipleOpen
    ? undefined
    : `faq-${id || Math.random().toString(36).slice(2, 9)}`

  const hasFeatures = Array.isArray(features) && features.length > 0
  const hasIllustration = Boolean(illustration)
  const showFooterCard = Boolean(footer?.enabled)

  const headerBlock = (
    <div className={cn(!isSplit && 'text-center max-w-2xl mx-auto')}>
      {eyebrow && (
        <div
          className={cn(
            'inline-flex items-center gap-2 text-xs sm:text-[0.8rem] uppercase tracking-[0.18em] text-brand font-semibold mb-5',
            !isSplit && 'justify-center',
          )}
        >
          <span className="h-px w-6 bg-brand/70" />
          {eyebrow}
        </div>
      )}
      {heading && (
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-4">
          {renderHeading(heading)}
        </h2>
      )}
      {intro && (
        <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-md">{intro}</p>
      )}
    </div>
  )

  const sideCard = showFooterCard && (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-blue-100/80 shadow-sm shadow-blue-100/40 p-5 sm:p-6">
      <div
        aria-hidden
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-brand/5 blur-2xl"
      />
      <div className="relative flex items-center gap-4 sm:gap-5">
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand text-white flex items-center justify-center shadow-md shadow-blue-300/40">
          <Icon name={footer?.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="flex-1 min-w-0 border-l border-blue-100 pl-4 sm:pl-5">
          {footer?.text && (
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
              {footer.text}
            </h3>
          )}
          {footer?.subtext && (
            <p className="mt-1 text-sm text-gray-600 leading-snug">{footer.subtext}</p>
          )}
          {Array.isArray(footer?.links) && footer!.links!.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {footer!.links!.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  size="sm"
                  {...link}
                  className="rounded-full! font-semibold px-5!"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const accordion = (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-xl shadow-blue-100/40 p-3 sm:p-5">
      <div className="space-y-3">
        {(items || []).map((item, i) => (
          <details
            key={i}
            name={groupName}
            open={item.defaultOpen ?? false}
            className={cn(
              'group rounded-2xl border transition-colors',
              'border-gray-100 bg-gray-50/60 hover:bg-blue-50/40',
              'open:bg-blue-50/70 open:border-blue-100',
            )}
          >
            <summary className="flex items-center gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-4 sm:px-5 py-4 sm:py-5">
              <span
                className={cn(
                  'shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors',
                  'bg-blue-100/70 text-brand',
                  'group-open:bg-brand group-open:text-white',
                )}
              >
                <Icon name={item.icon} className="w-5 h-5" />
              </span>
              <span
                className={cn(
                  'flex-1 text-base sm:text-lg font-semibold leading-snug transition-colors',
                  'text-gray-900 group-open:text-brand',
                )}
              >
                {item.question}
              </span>
              <span className="shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 group-open:text-brand transition-transform group-open:rotate-180">
                <ChevronDown className="w-5 h-5" strokeWidth={2.5} />
              </span>
            </summary>
            <div className="px-4 sm:px-5 pb-5 -mt-1 pl-15 sm:pl-17 text-gray-600 leading-relaxed">
              <RichText data={item.answer} enableGutter={false} />
            </div>
          </details>
        ))}
      </div>
    </div>
  )

  const leftColumn = (
    <div className="flex flex-col gap-8">
      {headerBlock}
      {hasIllustration && (
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(64,126,201,0.12),transparent_65%)] blur-2xl"
          />
          <Media
            resource={illustration}
            imgClassName="w-full h-auto max-w-md mx-auto"
          />
        </div>
      )}
      {sideCard}
    </div>
  )

  return (
    <section className="relative overflow-hidden bg-blue-50/40 py-16 lg:py-24">
      <div
        aria-hidden
        className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(64,126,201,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(64,126,201,0.08),transparent_70%)]"
      />

      <div className="container">
        {isSplit ? (
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-12 items-start">
            <div className="lg:sticky lg:top-24">{leftColumn}</div>
            <div>{accordion}</div>
          </div>
        ) : (
          <>
            <div className="mb-12 lg:mb-16">{headerBlock}</div>
            <div className="max-w-3xl mx-auto space-y-8">
              {accordion}
              {sideCard}
            </div>
          </>
        )}

        {hasFeatures && (
          <div className="mt-16 lg:mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features!.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-brand text-white flex items-center justify-center shadow-md shadow-blue-300/40">
                    <Icon name={feature.icon} className="w-6 h-6 lg:w-7 lg:h-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 leading-snug">
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
