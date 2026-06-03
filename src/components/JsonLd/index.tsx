import React from 'react'

/**
 * Renders one or more schema.org objects as a single application/ld+json
 * script tag. Safe for server components.
 */
export const JsonLd: React.FC<{ data: Record<string, unknown> | Record<string, unknown>[] }> = ({
  data,
}) => {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      // Schema is server-generated from trusted CMS data; `<` is escaped above.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
