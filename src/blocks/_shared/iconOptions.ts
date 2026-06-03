// Curated Lucide icon set used by the icon picker across blocks.
// The string value is the Lucide component name — see iconMap.tsx for the renderer.

export type IconKey =
  | 'code'
  | 'codeSquare'
  | 'shoppingCart'
  | 'monitor'
  | 'gauge'
  | 'layoutGrid'
  | 'wrench'
  | 'smartphone'
  | 'cloud'
  | 'shieldCheck'
  | 'lock'
  | 'cpu'
  | 'brain'
  | 'rocket'
  | 'sparkles'
  | 'smile'
  | 'users'
  | 'star'
  | 'trophy'
  | 'lifeBuoy'
  | 'headphones'
  | 'clipboardList'
  | 'pencilRuler'
  | 'flaskConical'
  | 'send'
  | 'globe'
  | 'database'
  | 'server'
  | 'box'
  | 'zap'

export const iconOptions: { label: string; value: IconKey }[] = [
  { label: 'Code', value: 'code' },
  { label: 'Code (square)', value: 'codeSquare' },
  { label: 'Shopping Cart', value: 'shoppingCart' },
  { label: 'Monitor / Responsive', value: 'monitor' },
  { label: 'Gauge / Performance', value: 'gauge' },
  { label: 'Layout Grid / CMS', value: 'layoutGrid' },
  { label: 'Wrench / Maintenance', value: 'wrench' },
  { label: 'Smartphone', value: 'smartphone' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Shield Check', value: 'shieldCheck' },
  { label: 'Lock', value: 'lock' },
  { label: 'CPU / AI', value: 'cpu' },
  { label: 'Brain / ML', value: 'brain' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Sparkles', value: 'sparkles' },
  { label: 'Smile', value: 'smile' },
  { label: 'Users / People', value: 'users' },
  { label: 'Star', value: 'star' },
  { label: 'Trophy', value: 'trophy' },
  { label: 'Life Buoy', value: 'lifeBuoy' },
  { label: 'Headphones / Support', value: 'headphones' },
  { label: 'Clipboard / Discovery', value: 'clipboardList' },
  { label: 'Pencil + Ruler / Design', value: 'pencilRuler' },
  { label: 'Flask / Testing', value: 'flaskConical' },
  { label: 'Send / Deploy', value: 'send' },
  { label: 'Globe', value: 'globe' },
  { label: 'Database', value: 'database' },
  { label: 'Server', value: 'server' },
  { label: 'Box / Package', value: 'box' },
  { label: 'Zap / Speed', value: 'zap' },
]
