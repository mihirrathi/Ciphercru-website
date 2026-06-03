'use client'

import React, { useState } from 'react'

type Props = {
  placeholder: string
  buttonLabel: string
  endpoint: string | null
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export const NewsletterForm: React.FC<Props> = ({ placeholder, buttonLabel, endpoint }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('submitting')
    setMessage(null)
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      } else {
        // No endpoint configured — simulate success so the UI is usable.
        await new Promise((r) => setTimeout(r, 500))
      }
      setStatus('success')
      setMessage("You're subscribed. Thank you!")
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
      <input
        type="email"
        required
        suppressHydrationWarning
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        aria-label="Email address"
        disabled={status === 'submitting'}
        className="w-full rounded-lg bg-white text-gray-800 placeholder:text-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-lg bg-white text-brand font-semibold text-sm px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : buttonLabel}
      </button>
      {message && (
        <p
          role="status"
          className="text-xs text-white/85 leading-snug"
        >
          {message}
        </p>
      )}
    </form>
  )
}
