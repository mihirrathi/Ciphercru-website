'use client'
import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>()

  const row = data?.data
  const rowNumber = data?.rowNumber !== undefined ? data.rowNumber + 1 : ''

  let label = 'Row'
  if (row) {
    if (row.type === 'menu') {
      const menuLabel = row.menuLabel || 'Menu'
      const groups = Array.isArray(row.menuGroups) ? row.menuGroups : []
      const totalItems = groups.reduce(
        (sum, g) => sum + (Array.isArray(g.items) ? g.items.length : 0),
        0,
      )
      label = `Nav item ${rowNumber}: ${menuLabel} (mega menu — ${groups.length} group${groups.length === 1 ? '' : 's'}, ${totalItems} item${totalItems === 1 ? '' : 's'})`
    } else if (row.link?.label) {
      label = `Nav item ${rowNumber}: ${row.link.label}`
    }
  }

  return <div>{label}</div>
}
