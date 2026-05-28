import React from 'react'
import {
  BarChart3,
  Bell,
  Briefcase,
  Check,
  Cloud,
  Code,
  Database,
  FileText,
  Gauge,
  Globe,
  Heart,
  Lightbulb,
  Lock,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserCog,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  shield: Shield,
  users: Users,
  star: Star,
  briefcase: Briefcase,
  globe: Globe,
  code: Code,
  sparkles: Sparkles,
  zap: Zap,
  trophy: Trophy,
  heart: Heart,
  check: Check,
  target: Target,
  lightbulb: Lightbulb,
  trendingUp: TrendingUp,
  gauge: Gauge,
  fileText: FileText,
  wallet: Wallet,
  userCog: UserCog,
  barChart: BarChart3,
  lock: Lock,
  bell: Bell,
  settings: Settings,
  cloud: Cloud,
  database: Database,
}

/** Render a lucide icon by its CMS select value, falling back to a sensible default. */
export const Icon: React.FC<{
  name?: string | null
  className?: string
  fallback?: keyof typeof ICONS
}> = ({ name, className, fallback = 'sparkles' }) => {
  const Cmp = (name && ICONS[name]) || ICONS[fallback]
  return <Cmp className={className} aria-hidden />
}

/**
 * Render text with **double-asterisk** segments highlighted in brand colour.
 * Mirrors the convention used by the Testimonials block.
 */
export const highlightText = (raw?: string | null): React.ReactNode => {
  if (!raw) return null
  return raw.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="text-brand">
          {part.slice(2, -2)}
        </span>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}
