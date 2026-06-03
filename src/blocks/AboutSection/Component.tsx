import React from 'react'

import type { AboutSectionBlock as AboutSectionBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { Reveal } from '@/components/Reveal'
import {
  Users,
  UserCheck,
  Rocket,
  Lightbulb,
  Sparkles,
  Star,
  ShieldCheck,
  Lock,
  Building2,
  Briefcase,
  Award,
  Trophy,
  Code2,
  Cpu,
  Settings,
  Heart,
  Target,
  TrendingUp,
  BarChart3,
  Globe,
  Zap,
  Clock,
  CheckCircle2,
  MessageCircle,
  Layers,
  Handshake,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  userCheck: UserCheck,
  rocket: Rocket,
  lightbulb: Lightbulb,
  sparkles: Sparkles,
  star: Star,
  shieldCheck: ShieldCheck,
  lock: Lock,
  building: Building2,
  briefcase: Briefcase,
  award: Award,
  trophy: Trophy,
  code: Code2,
  cpu: Cpu,
  settings: Settings,
  heart: Heart,
  target: Target,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  globe: Globe,
  zap: Zap,
  clock: Clock,
  checkCircle: CheckCircle2,
  messageCircle: MessageCircle,
  layers: Layers,
  handshake: Handshake,
}

const Icon: React.FC<{ name?: string | null; className?: string }> = ({
  name,
  className,
}) => {
  const Cmp = (name && iconMap[name]) || Sparkles
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

export const AboutSectionBlock: React.FC<AboutSectionBlockProps> = (props) => {
  const {
    eyebrow,
    heading,
    content,
    features,
    links,
    image,
    imagePosition,
    floatingCard,
    showStats,
    stats,
  } = props

  const imageOnLeft = imagePosition === 'left'
  const hasFeatures = Array.isArray(features) && features.length > 0
  const hasFloatingCard = Boolean(floatingCard?.text)
  const hasStats = Boolean(showStats) && Array.isArray(stats) && stats.length > 0

  return (
    <section className="relative">
      {/* Top area: about content */}
      <div className="relative overflow-hidden bg-blue-50/40 py-20 lg:py-24">
        <div
          aria-hidden
          className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(64,126,201,0.18),transparent_70%)]"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(64,126,201,0.10),transparent_70%)]"
        />

        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text column */}
            <div className={cn('relative', imageOnLeft && 'md:order-2')}>
              {eyebrow && (
                <Reveal delay={0}>
                  <div className="inline-flex items-center gap-2 text-xs sm:text-[0.8rem] uppercase tracking-[0.18em] text-brand font-semibold mb-5">
                    <span className="h-px w-6 bg-brand/70" />
                    {eyebrow}
                  </div>
                </Reveal>
              )}
              {heading && (
                <Reveal delay={0.08}>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-5">
                    {renderHeading(heading)}
                  </h2>
                </Reveal>
              )}
              {content && (
                <Reveal delay={0.16}>
                  <RichText
                    className={cn(
                      'text-gray-600 leading-relaxed max-w-xl',
                      '[&_p]:mb-4 [&_p:last-child]:mb-0 [&_p]:text-left!',
                      '[&_strong]:text-gray-900 [&_strong]:font-semibold',
                    )}
                    data={content}
                    enableGutter={false}
                    enableProse={false}
                  />
                </Reveal>
              )}

              {hasFeatures && (
                <ul className="mt-8 space-y-6 max-w-xl">
                  {features!.map((feature, i) => (
                    <Reveal as="li" key={i} delay={0.24 + i * 0.1} className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center shadow-md shadow-blue-300/40">
                        <Icon name={feature.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900 leading-snug">
                          {feature.title}
                        </h3>
                        {feature.description && (
                          <p className="mt-1 text-sm lg:text-base text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </ul>
              )}

              {Array.isArray(links) && links.length > 0 && (
                <Reveal delay={0.32} className="flex flex-wrap gap-4 mt-10">
                  {links.map(({ link }, i) => (
                    <CMSLink
                      key={i}
                      size="lg"
                      {...link}
                      className={cn(
                        'font-semibold rounded-full! px-7 transition-all duration-200 hover:-translate-y-0.5',
                        i === 0 &&
                          'shadow-lg shadow-blue-300/40 hover:shadow-xl hover:shadow-blue-400/40',
                      )}
                    />
                  ))}
                </Reveal>
              )}
            </div>

            {/* Image column */}
            <div className={cn('relative', imageOnLeft && 'md:order-1')}>
              {image && (
                <Reveal direction={imageOnLeft ? 'right' : 'left'} amount={0.3} className="relative">
                  <div
                    aria-hidden
                    className="absolute -inset-6 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(64,126,201,0.18),transparent_65%)] blur-2xl"
                  />

                  <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/80 border border-white shadow-2xl shadow-blue-400/20">
                    <Media
                      resource={image}
                      imgClassName="w-full h-auto object-cover aspect-[4/3]"
                    />
                  </div>

                  {hasFloatingCard && (
                    <Reveal
                      delay={0.3}
                      className={cn(
                        'absolute -bottom-8 left-4 right-4 sm:left-8 sm:right-8 lg:-bottom-10',
                        'rounded-2xl bg-brand text-white px-5 py-5 sm:px-6 sm:py-6',
                        'shadow-xl shadow-blue-500/30',
                        'flex items-center gap-4',
                      )}
                    >
                      <div className="shrink-0 w-14 h-14 rounded-full bg-white text-brand flex items-center justify-center shadow-inner">
                        <Icon name={floatingCard?.icon} className="w-7 h-7" />
                      </div>
                      <p className="text-sm sm:text-base lg:text-lg font-medium leading-snug">
                        {floatingCard?.text}
                      </p>
                    </Reveal>
                  )}
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom area: stats strip */}
      {hasStats && (
        <div className="relative bg-white">
          <div
            className={cn(
              'container',
              hasFloatingCard ? 'pt-20 lg:pt-24' : 'pt-16 lg:pt-20',
              'pb-16 lg:pb-20',
            )}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              {stats!.map((stat, i) => (
                <Reveal
                  key={i}
                  delay={i * 0.12}
                  amount={0.4}
                  className={cn(
                    'flex items-center gap-4 lg:gap-5',
                    i > 1 && 'pt-10 lg:pt-0',
                    i > 0 && 'lg:pl-6',
                  )}
                >
                  <div className="shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-blue-50 text-brand flex items-center justify-center">
                    <Icon name={stat.icon} className="w-7 h-7 lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <AnimatedNumber
                      value={stat.value}
                      className="block text-3xl lg:text-4xl font-bold text-brand leading-none tabular-nums"
                    />
                    <div className="mt-1.5 text-sm lg:text-base font-semibold text-gray-900">
                      {stat.label}
                    </div>
                    {stat.caption && (
                      <div className="mt-0.5 text-xs lg:text-sm text-gray-500">
                        {stat.caption}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
