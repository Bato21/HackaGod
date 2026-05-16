'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type CountryRow = {
  iso3: string
  name: string
  flag: string
  iea:  number | null
  rank: number
}

type SortOrder = 'corrupt' | 'clean' | 'az'

type Props = {
  countries:  CountryRow[]
  selected:   string | null
  onSelect:   (iso3: string) => void
  year:       number
  rangeMin:   number
  rangeMax:   number
  onRange:    (min: number, max: number) => void
}

const SEV_COLOR: Record<string, string> = {
  clean:    '#0e7490',
  low:      '#0891b2',
  medlow:   '#a3e635',
  mid:      '#facc15',
  midhigh:  '#f97316',
  high:     '#dc2626',
  critical: '#7f1d1d',
}

function ieaColor(iea: number | null): string {
  if (iea === null) return '#1e293b'
  if (iea <= 20) return '#dc2626'
  if (iea <= 35) return '#f97316'
  if (iea <= 50) return '#facc15'
  if (iea <= 65) return '#a3e635'
  if (iea <= 80) return '#0891b2'
  return '#0e7490'
}

const STORAGE_KEY = 'aletheia.atlas.leftPanel'

export default function LeftPanel({ countries, selected, onSelect, year, rangeMin, rangeMax, onRange }: Props) {
  const [open, setOpen]       = useState(() => {
    if (typeof window === 'undefined') return true
    const v = localStorage.getItem(STORAGE_KEY)
    return v !== 'false'
  })
  const [search, setSearch]   = useState('')
  const [sort, setSort]       = useState<SortOrder>('corrupt')
  const [localMin, setLocalMin] = useState(rangeMin)
  const [localMax, setLocalMax] = useState(rangeMax)

  useEffect(() => { setLocalMin(rangeMin) }, [rangeMin])
  useEffect(() => { setLocalMax(rangeMax) }, [rangeMax])

  function toggleOpen() {
    setOpen(v => {
      const next = !v
      try { localStorage.setItem(STORAGE_KEY, String(next)) } catch {}
      return next
    })
  }

  const filtered = countries
    .filter(c => {
      const q = search.toLowerCase()
      if (q && !c.name.toLowerCase().includes(q) && !c.iso3.toLowerCase().includes(q)) return false
      if (c.iea !== null && (c.iea < localMin || c.iea > localMax)) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name, 'es')
      if (sort === 'corrupt') return (a.iea ?? 999) - (b.iea ?? 999)
      return (b.iea ?? -999) - (a.iea ?? -999)
    })

  return (
    <div style={{
      display: 'flex', position: 'relative',
      height: '100%',
    }}>
      {/* Panel body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: 'var(--bg-2)', borderRight: '1px solid var(--line-2)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              height: '100%', flexShrink: 0,
            }}
          >
            {/* ── Search ── */}
            <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 12 }}>⌕</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar país, código…"
                  style={{
                    width: '100%', background: 'rgba(56,189,248,.04)',
                    border: '1px solid var(--line-2)',
                    color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11,
                    padding: '7px 30px 7px 28px', outline: 'none',
                    borderRadius: 6, boxSizing: 'border-box',
                    transition: 'border-color .15s, box-shadow .15s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.1)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'var(--line-2)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    style={{
                      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-3)', fontSize: 13, padding: 0, lineHeight: 1,
                    }}
                  >×</button>
                )}
              </div>
            </div>

            {/* ── Range filter ── */}
            <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                  FILTRO POR RANGO
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--accent)' }}>
                  {localMin}–{localMax}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="range" min={0} max={localMax} value={localMin}
                  onChange={e => { const v = +e.target.value; setLocalMin(v); onRange(v, localMax) }}
                  style={{ flex: 1, accentColor: 'var(--accent)' }}
                />
                <input
                  type="range" min={localMin} max={100} value={localMax}
                  onChange={e => { const v = +e.target.value; setLocalMax(v); onRange(localMin, v) }}
                  style={{ flex: 1, accentColor: 'var(--accent)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {[localMin, localMax].map((val, i) => (
                  <input
                    key={i}
                    type="number" min={0} max={100} value={val}
                    onChange={e => {
                      const v = Math.max(0, Math.min(100, +e.target.value))
                      if (i === 0) { setLocalMin(v); onRange(v, localMax) }
                      else         { setLocalMax(v); onRange(localMin, v) }
                    }}
                    style={{
                      flex: 1, background: 'var(--bg-3)', border: '1px solid var(--line-2)',
                      color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11,
                      padding: '4px 6px', borderRadius: 4, outline: 'none', textAlign: 'center',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Sort ── */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 7 }}>
                ORDEN
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {([
                  { id: 'corrupt', label: '+ Corruptos' },
                  { id: 'clean',   label: '+ Limpios'   },
                  { id: 'az',      label: 'A–Z'          },
                ] as const).map(o => (
                  <button
                    key={o.id}
                    onClick={() => setSort(o.id)}
                    style={{
                      flex: 1, padding: '5px 4px',
                      fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.06em', textTransform: 'uppercase',
                      cursor: 'pointer', borderRadius: 5, border: 'none', transition: 'all .15s',
                      background: sort === o.id
                        ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)'
                        : 'rgba(148,163,184,0.08)',
                      color: sort === o.id ? '#fff' : 'var(--text-3)',
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Ranking ── */}
            <div style={{ flexShrink: 0, padding: '8px 12px 4px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                  RANKING · <span style={{ color: 'var(--accent)' }}>{filtered.length}</span>
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-4)' }}>{year}</span>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <style>{`::-webkit-scrollbar{width:2px}::-webkit-scrollbar-thumb{background:var(--line-2)}`}</style>
              {filtered.map((c, idx) => {
                const active  = c.iso3 === selected
                const color   = ieaColor(c.iea)
                const inRange = c.iea === null || (c.iea >= localMin && c.iea <= localMax)
                return (
                  <motion.div
                    key={c.iso3}
                    onClick={() => onSelect(c.iso3)}
                    whileHover={{ backgroundColor: active ? undefined : 'rgba(16,30,52,0.9)' }}
                    style={{
                      display: 'grid', gridTemplateColumns: '26px 20px 1fr 46px 10px',
                      gap: 5, alignItems: 'center',
                      padding: '7px 12px 7px 10px', cursor: 'pointer',
                      borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                      background: active ? 'var(--bg-4)' : 'transparent',
                      borderBottom: '1px solid var(--line)',
                      opacity: inRange ? 1 : 0.35,
                      transition: 'background .12s, border-left-color .12s, opacity .2s',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-4)', textAlign: 'right' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 11, textAlign: 'center' }}>{c.flag}</span>
                    <span style={{ fontSize: 11.5, color: active ? 'var(--text)' : 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color .12s' }}>
                      {c.name}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 600, textAlign: 'right', color, transition: 'color .12s' }}>
                      {c.iea !== null ? c.iea.toFixed(1) : '—'}
                    </span>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chevron toggle strip */}
      <button
        onClick={toggleOpen}
        style={{
          position: 'absolute', right: open ? -14 : 0, top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, width: 14, height: 48,
          background: 'var(--bg-3)', border: '1px solid var(--line-2)',
          borderRadius: '0 6px 6px 0', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-3)', fontSize: 9,
          transition: 'background .15s, color .15s, right .3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-4)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-3)' }}
        title={open ? 'Colapsar panel' : 'Expandir panel'}
      >
        {open ? '‹' : '›'}
      </button>
    </div>
  )
}
