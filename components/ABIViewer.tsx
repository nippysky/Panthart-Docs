'use client'

import { useEffect, useMemo, useState } from 'react'

type AbiParam = { name?: string; type: string; indexed?: boolean; internalType?: string }
type AbiItem = {
  type: 'function' | 'event' | 'constructor' | 'fallback' | 'receive' | string
  name?: string
  inputs?: AbiParam[]
  outputs?: AbiParam[]
  stateMutability?: 'view' | 'pure' | 'nonpayable' | 'payable' | string
  anonymous?: boolean
}

// ----- helpers
const fnSig = (name: string, inputs: AbiParam[] = []) =>
  `${name}(${inputs.map(p => p.type).join(',')})`

const eventSig = (name: string, inputs: AbiParam[] = []) =>
  `${name}(${inputs.map(p => (p.indexed ? 'indexed ' : '') + p.type).join(',')})`

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for unusual contexts
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
}

// ----- component
export default function AbiViewer({ file, title }: { file: string; title?: string }) {
  const [abi, setAbi] = useState<AbiItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null) // stores last copied signature

  useEffect(() => {
    let alive = true
    fetch(`/abi/${file}`)
      .then(r => (r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`)))
      .then(json => {
        if (!alive) return
        setAbi(Array.isArray(json) ? json : (json?.abi ?? []))
      })
      .catch(e => alive && setErr(String(e)))
    return () => {
      alive = false
    }
  }, [file])

  const funcs = useMemo(() => (abi ?? []).filter(x => x.type === 'function'), [abi])
  const events = useMemo(() => (abi ?? []).filter(x => x.type === 'event'), [abi])

  if (err) return <div style={{ color: 'tomato' }}>Failed to load ABI: {err}</div>
  if (!abi) return <div>Loading ABI…</div>

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {title ? <h2 style={{ margin: 0 }}>{title}</h2> : null}

      {/* FUNCTIONS */}
      <section>
        <h3 style={{ margin: '8px 0' }}>Functions</h3>
        {funcs.length === 0 ? (
          <div>No functions</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Signature</th>
                  <th align="left">State</th>
                  <th align="left">Inputs</th>
                  <th align="left">Outputs</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {funcs.map(fn => {
                  const name = fn.name ?? '(anonymous)'
                  const signature = fnSig(name, fn.inputs)
                  return (
                    <tr
                      key={signature}
                      style={{ borderTop: '1px solid var(--nextra-bg-gray-700,#2e2e2e)' }}
                    >
                      <td style={{ padding: '8px 8px 8px 0', whiteSpace: 'nowrap' }}>
                        <code>{signature}</code>
                      </td>
                      <td style={{ padding: '8px 8px 8px 0' }}>
                        {fn.stateMutability ?? '—'}
                      </td>
                      <td style={{ padding: '8px 8px 8px 0' }}>
                        {fn.inputs?.length
                          ? fn.inputs.map((p, i) => (
                              <div key={i}>
                                <code>{p.name || `arg${i}`}</code>: <code>{p.type}</code>
                              </div>
                            ))
                          : '—'}
                      </td>
                      <td style={{ padding: '8px 8px 8px 0' }}>
                        {fn.outputs?.length
                          ? fn.outputs.map((p, i) => <div key={i}><code>{p.type}</code></div>)
                          : '—'}
                      </td>
                      <td style={{ padding: '8px 0' }}>
                        <button
                          onClick={async () => {
                            const ok = await copy(signature)
                            if (ok) {
                              setCopied(signature)
                              setTimeout(() => setCopied(null), 1200)
                            }
                          }}
                          title="Copy signature"
                          style={{
                            fontSize: 12,
                            padding: '4px 8px',
                            borderRadius: 8,
                            border: '1px solid var(--nextra-bg-gray-700,#333)',
                            background: 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                          {copied === signature ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* EVENTS */}
      <section>
        <h3 style={{ margin: '8px 0' }}>Events</h3>
        {events.length === 0 ? (
          <div>No events</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left">Event</th>
                  <th align="left">Inputs</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {events.map((ev, idx) => {
                  const name = ev.name ?? '(anonymous)'
                  const signature = eventSig(name, ev.inputs)
                  // Use full signature as key (handles overloaded "Initialized" etc.). Fallback to idx if needed.
                  const rowKey = signature || `${name}-${idx}`
                  return (
                    <tr
                      key={rowKey}
                      style={{ borderTop: '1px solid var(--nextra-bg-gray-700,#2e2e2e)' }}
                    >
                      <td style={{ padding: '8px 8px 8px 0' }}>
                        <code>{name}</code>
                      </td>
                      <td style={{ padding: '8px 8px 8px 0' }}>
                        {ev.inputs?.length
                          ? ev.inputs.map((p, i) => (
                              <div key={i}>
                                <code>{p.name || `arg${i}`}</code>:{' '}
                                <code>
                                  {p.indexed ? 'indexed ' : ''}
                                  {p.type}
                                </code>
                              </div>
                            ))
                          : '—'}
                      </td>
                      <td style={{ padding: '8px 0' }}>
                        <button
                          onClick={async () => {
                            const ok = await copy(signature)
                            if (ok) {
                              setCopied(signature)
                              setTimeout(() => setCopied(null), 1200)
                            }
                          }}
                          title="Copy event signature"
                          style={{
                            fontSize: 12,
                            padding: '4px 8px',
                            borderRadius: 8,
                            border: '1px solid var(--nextra-bg-gray-700,#333)',
                            background: 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                          {copied === signature ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
