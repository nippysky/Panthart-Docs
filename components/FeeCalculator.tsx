// components/FeeCalculator.tsx
'use client'

import { useMemo, useState } from 'react'

function toNumber(v: string) {
  const x = Number(v.replace(/[,_\s]/g, ''))
  return Number.isFinite(x) ? x : 0
}

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

const PANEL: React.CSSProperties = {
  border: '1px solid var(--nextra-bg-gray-700, #2e2e2e)',
  borderRadius: 12,
  padding: 16,
  background:
    'linear-gradient(180deg, color-mix(in srgb, var(--nextra-primary-hue), transparent 92%) 0%, transparent 100%)'
}

const KPI_GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
  gap: 12,
  marginTop: 12
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      style={{
        border: '1px dashed var(--nextra-bg-gray-700, #2e2e2e)',
        borderRadius: 10,
        padding: '10px 12px',
        background: accent
          ? 'color-mix(in srgb, var(--nextra-primary-hue), transparent 90%)'
          : 'transparent'
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  )
}

export default function FeeCalculator() {
  // editable trade amount string (so users can type freely)
  const [amount, setAmount] = useState<string>('100')

  const trade = useMemo(() => Math.max(0, toNumber(amount)), [amount])

  // fee math (same as your original)
  const { feeTotal, rewards, panthart, sellerProceeds } = useMemo(() => {
    const feeTotal = trade * 0.025
    const rewards = trade * 0.015
    const panthart = trade * 0.01
    const sellerProceeds = trade - feeTotal
    return { feeTotal, rewards, panthart, sellerProceeds }
  }, [trade])

  return (
    <section style={PANEL}>
      {/* input + unit */}
      <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ fontSize: 12, opacity: 0.8 }} htmlFor="trade-amount">
          Trade Amount (ETN equivalent)
        </label>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: 12
          }}
        >
          <input
            id="trade-amount"
            aria-label="Trade amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 100"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid var(--nextra-bg-gray-700, #2e2e2e)',
              background: 'transparent',
              outlineOffset: 2
            }}
          />
          <span style={{ fontSize: 12, opacity: 0.75, whiteSpace: 'nowrap' }}>ETN</span>
        </div>

        {/* quick slider for exploration */}
        <input
          type="range"
          min={0}
          max={10000}
          step={1}
          value={trade}
          onChange={(e) => setAmount(e.target.value)}
          aria-label="Adjust amount"
          style={{ width: '100%', accentColor: 'var(--nextra-primary-hue)' }}
        />
      </div>

      {/* KPIs */}
      <div style={KPI_GRID}>
        <Stat label="Marketplace fee (2.5%)" value={fmt(feeTotal)} accent />
        <Stat label="→ Rewards (1.5%)" value={fmt(rewards)} />
        <Stat label="→ Panthart fee (1%)" value={fmt(panthart)} />
        <Stat label="Seller receives" value={fmt(sellerProceeds)} />
      </div>

      {/* small explainer */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid var(--nextra-bg-gray-700, #2e2e2e)',
          fontSize: 13,
          lineHeight: 1.55,
          opacity: 0.9
        }}
      >
        Fees are applied to the trade amount. <strong>1.5%</strong> routes to the Reward Distributor and{' '}
        <strong>1%</strong> to the Panthart fee wallet; the seller receives the remainder.
      </div>
    </section>
  )
}
