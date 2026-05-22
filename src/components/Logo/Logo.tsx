import React from 'react'

import { cn } from '@/utilities/ui'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="CipherCRU"
      width={100}
      height={100}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={cn('h-20 w-auto', className)}
      src="/new text with logo (2).png"
    />
  )
}
