'use client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CountryPanel from './CountryPanel'

type CountryRow = { iso3: string; name: string; flag: string; iea: number | null }

type Props = {
  selected:   string | null
  countries:  CountryRow[]
  onClose:    () => void
  onCompare:  (iso3: string) => void
}

function ieaColor(iea: number | null): string {
  if (iea === null) return '#64748b'
  if (iea <= 20) return '#dc2626'
  if (iea <= 35) return '#f97316'
  if (iea <= 50) return '#facc15'
  if (iea <= 65) return '#a3e635'
  if (iea <= 80) return '#0891b2'
  return '#0e7490'
}

// ── State A: Continental summary ─────────────────────────────────
function ResumenContinental({ countries }: { countries: CountryRow[] }) {
  const sorted = [...countries].filter(c => c.iea !== null).sort((a, b) => (a.iea ?? 0) - (b.iea ?? 0))
  const mostCorrupt = sorted.slice(0, 10)
  const cleanest    = sorted.slice(-10).reverse()
  const maxScore    = Math.max(...countries.map(c => c.iea ?? 0), 1)

  function BarRow({ c, reverse }: { c: CountryRow; reverse: boolean }) {
    const color = ieaColor(c.iea)
    const pct   = ((c.iea ?? 0) / 100) * 100
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-4)', width: 14, textAlign: 'right', flexShrink: 0 }}>
          {sorted.indexOf(c) + 1}
        </span>
        <span style={{ fontSize: 11, flexShrink: 0 }}>{c.flag}</span>
        <div style={{ flex: 1, height: 4, background: 'rgba(148,163,184,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width .4s' }} />
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color, fontWeight: 600, width: 34, textAlign: 'right', flexShrink: 0 }}>
          {c.iea?.toFixed(1)}
        </span>
      </div>
    )
  }

  function SubHead({ label }: { label: string }) {
    return (
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'var(--accent)', marginBottom: 8, marginTop: 12,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        {label}
        <div style={{ flex: 1, height: 1, background: 'var(--accent)', opacity: 0.2 }} />
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 16px 12px', overflowY: 'auto', flex: 1 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>
        RESUMEN CONTINENTAL
      </div>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 4 }}>
        Haz clic en un país en el mapa o en el ranking para abrir su detalle, ver su evolución y compararlo con otro.
      </p>

      <SubHead label="TOP 10 · MÁS CORRUPTOS" />
      {mostCorrupt.map(c => <BarRow key={c.iso3} c={c} reverse={false} />)}

      <SubHead label="TOP 10 · MÁS LIMPIOS" />
      {cleanest.map(c => <BarRow key={c.iso3} c={c} reverse={true} />)}
    </div>
  )
}

// ── Country action bar ──────────────────────────────────────────
function ActionBar({ iso3, onClose, onCompare }: { iso3: string; onClose: () => void; onCompare: () => void }) {
  const router = useRouter()

  const btnBase: React.CSSProperties = {
    flex: 1, padding: '7px 4px',
    fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.1em', textTransform: 'uppercase',
    cursor: 'pointer', border: '1px solid rgba(148,163,184,0.2)',
    background: 'transparent', color: 'var(--text-3)',
    borderRadius: 6, transition: 'all .15s',
  }

  return (
    <div style={{
      display: 'flex', gap: 6, padding: '10px 14px',
      borderTop: '1px solid var(--line-2)', flexShrink: 0,
      background: 'var(--bg-2)',
    }}>
      <button
        onClick={onCompare}
        style={btnBase}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.08)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
      >
        COMPARAR
      </button>

      <button
        onClick={() => router.push(`/foro?country=${iso3}`)}
        style={btnBase}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.08)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
      >
        FORO
      </button>

      <button
        onClick={() => router.push(`/pais/${iso3}`)}
        style={{
          ...btnBase,
          background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
          border: 'none', color: '#fff',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        EXPANDIR
      </button>

      <button
        onClick={onClose}
        style={btnBase}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.08)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
      >
        CERRAR
      </button>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────
export default function RightPanel({ selected, countries, onClose, onCompare }: Props) {
  const WIDTH = selected ? 380 : 320

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selected ?? 'resumen'}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0,  opacity: 1 }}
        exit={{   x: 40,  opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: WIDTH, flexShrink: 0,
          background: 'var(--bg-2)', borderLeft: '1px solid var(--line-2)',
          display: 'flex', flexDirection: 'column', height: '100%',
          overflow: 'hidden',
        }}
      >
        {selected ? (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <CountryPanel iso3={selected} onClose={onClose} />
            </div>
            <ActionBar iso3={selected} onClose={onClose} onCompare={() => onCompare(selected)} />
          </>
        ) : (
          <ResumenContinental countries={countries} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
