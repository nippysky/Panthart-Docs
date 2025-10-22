'use client'

import { useState } from 'react'

export default function CopyAddress({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      aria-label="Copy address"
      style={{
        fontSize: 12,
        padding: '4px 8px',
        borderRadius: 8,
        border: '1px solid var(--nextra-bg-gray-700,#333)',
        background: 'transparent',
        cursor: 'pointer'
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
