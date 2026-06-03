import React from 'react'
import {
  Code,
  Code2,
  ShoppingCart,
  Monitor,
  Gauge,
  LayoutGrid,
  Wrench,
  Smartphone,
  Cloud,
  ShieldCheck,
  Lock,
  Cpu,
  Brain,
  Rocket,
  Sparkles,
  Smile,
  Users,
  Star,
  Trophy,
  LifeBuoy,
  Headphones,
  ClipboardList,
  PencilRuler,
  FlaskConical,
  Send,
  Globe,
  Database,
  Server,
  Box,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import type { IconKey } from './iconOptions'

const iconMap: Record<IconKey, LucideIcon> = {
  code: Code,
  codeSquare: Code2,
  shoppingCart: ShoppingCart,
  monitor: Monitor,
  gauge: Gauge,
  layoutGrid: LayoutGrid,
  wrench: Wrench,
  smartphone: Smartphone,
  cloud: Cloud,
  shieldCheck: ShieldCheck,
  lock: Lock,
  cpu: Cpu,
  brain: Brain,
  rocket: Rocket,
  sparkles: Sparkles,
  smile: Smile,
  users: Users,
  star: Star,
  trophy: Trophy,
  lifeBuoy: LifeBuoy,
  headphones: Headphones,
  clipboardList: ClipboardList,
  pencilRuler: PencilRuler,
  flaskConical: FlaskConical,
  send: Send,
  globe: Globe,
  database: Database,
  server: Server,
  box: Box,
  zap: Zap,
}

type IconProps = {
  name?: IconKey | string | null
  className?: string
  fallback?: LucideIcon
}

export const Icon: React.FC<IconProps> = ({ name, className, fallback = Sparkles }) => {
  const Component = (name && iconMap[name as IconKey]) || fallback
  return <Component className={className} aria-hidden />
}
