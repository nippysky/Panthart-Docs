'use client'

import Link from 'next/link'

export interface CardItem {
  title: string
  desc: string
  href: string
  badge?: string
}

export default function DocsCards({ items }: { items: CardItem[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 14,
        margin: '8px 0 12px'
      }}
    >
      {items.map((it) => (
        <Link key={it.href} href={it.href} style={{ textDecoration: 'none' }}>
          <article
            style={{
              border: '1px solid var(--nextra-bg-gray-700, #2e2e2e)',
              borderRadius: 14,
              padding: 16,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--nextra-primary-hue), transparent 94%) 0%, transparent 100%)',
              transition: 'transform .15s ease, border-color .15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'color-mix(in srgb, var(--nextra-primary-hue), #2e2e2e 70%)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = ''
              ;(e.currentTarget as HTMLDivElement).style.borderColor =
                'var(--nextra-bg-gray-700, #2e2e2e)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{it.title}</h3>
              {it.badge ? (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 999,
                    border: '1px solid var(--nextra-bg-gray-700, #2e2e2e)',
                    opacity: 0.9
                  }}
                >
                  {it.badge}
                </span>
              ) : null}
            </div>
            <p style={{ margin: 0, opacity: 0.9, fontSize: 13 }}>{it.desc}</p>
            <span
              aria-hidden
              style={{
                marginTop: 'auto',
                fontSize: 12,
                opacity: 0.75
              }}
            >
              Open →
            </span>
          </article>
        </Link>
      ))}
    </div>
  )
}
