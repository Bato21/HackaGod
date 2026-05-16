'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_REPORTS, type MockReport, MOCK_COUNTRIES } from '@/lib/mock-data'

const SEV_COLOR: Record<number, string> = {
  1: '#0e7490',
  2: '#0891b2',
  3: '#f97316',
  4: '#dc2626',
  5: '#7f1d1d',
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h    = Math.floor(diff / 3600000)
  if (h < 24) return `HACE ${h}H`
  return `HACE ${Math.floor(h / 24)}D`
}

function NewsCard({ report, onClick }: { report: MockReport; onClick: () => void }) {
  const color = SEV_COLOR[report.severity] ?? '#64748b'
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        padding: '10px 14px', borderBottom: '1px solid var(--line)',
        cursor: 'pointer', transition: 'background .1s',
        borderLeft: `3px solid ${color}`,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
      onClick={onClick}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
          {report.source_name ?? 'Fuente'}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-4)', letterSpacing: '0.06em' }}>
          {relTime(report.published_at)}
        </span>
      </div>

      {/* Title */}
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: 500, color: 'var(--text-2)',
        lineHeight: 1.45, margin: '0 0 6px',
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {report.title}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {report.corruption_types.slice(0, 2).map(t => (
          <span key={t} style={{
            fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: color, background: `${color}10`,
            border: `1px solid ${color}30`, padding: '1px 5px', borderRadius: 3,
          }}>
            {t}
          </span>
        ))}
        <button
          onClick={e => { e.stopPropagation(); onClick() }}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--accent)', padding: 0,
            letterSpacing: '0.06em',
          }}
        >
          ABRIR HILO →
        </button>
      </div>
    </motion.div>
  )
}

type Props = {
  open:         boolean
  onClose:      () => void
  countryFilter?: string | null
}

const CATEGORIES = [
  { id: 'corrupcion', label: 'CORRUPCIÓN', types: ['licitación directa','tráfico de influencias','opacidad financiera','empresa pública','captura estatal','fraude','soborno','contratos públicos'] },
  { id: 'politica',   label: 'POLÍTICA',   types: ['corrupción ejecutiva','impunidad'] },
  { id: 'fiscal',     label: 'FISCAL',     types: ['disciplina fiscal','gasto discrecional','gasto público'] },
  { id: 'judicial',   label: 'JUDICIAL',   types: [] },
]

export default function NewsPanel({ open, onClose, countryFilter }: Props) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  function toggle(id: string) {
    setCollapsed(v => ({ ...v, [id]: !v[id] }))
  }

  const country = countryFilter ? MOCK_COUNTRIES.find(c => c.iso3 === countryFilter) : null

  const reports = countryFilter
    ? MOCK_REPORTS.filter(r => {
        // simple heuristic: Venezuela/Chile/etc in title
        const name = MOCK_COUNTRIES.find(c => c.iso3 === countryFilter)?.name ?? ''
        return r.title.toLowerCase().includes(name.toLowerCase()) ||
               r.source_name?.toLowerCase().includes(name.toLowerCase())
      })
    : MOCK_REPORTS

  function getForCat(cat: typeof CATEGORIES[number]): MockReport[] {
    if (cat.types.length === 0) return []
    return reports.filter(r => r.corruption_types.some(t => cat.types.includes(t)))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: 340, zIndex: 30,
            background: 'rgba(9,18,34,0.97)',
            border: '1px solid var(--line-2)',
            backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 12px', borderBottom: '1px solid var(--line-2)', flexShrink: 0,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text)', fontWeight: 700 }}>
                NOTICIAS
              </div>
              {country && (
                <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--accent)', marginTop: 2 }}>
                  {country.flag} {country.name}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 18, padding: 2 }}
            >×</button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {CATEGORIES.map(cat => {
              const items   = getForCat(cat)
              const allItems = items.length === 0 && cat.types.length === 0
                ? reports.slice(0, 3)
                : items.slice(0, 5)
              if (allItems.length === 0) return null
              const isCollapsed = collapsed[cat.id]

              return (
                <div key={cat.id} style={{ borderBottom: '1px solid var(--line-2)' }}>
                  <button
                    onClick={() => toggle(cat.id)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-2)' }}>
                        {cat.label}
                      </span>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 8,
                        color: 'var(--accent)', background: 'rgba(6,182,212,0.1)',
                        border: '1px solid rgba(6,182,212,0.2)',
                        padding: '1px 5px', borderRadius: 3,
                      }}>
                        {allItems.length}
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-4)', fontSize: 10, transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>▾</span>
                  </button>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {allItems.map(r => (
                          <NewsCard
                            key={r.id}
                            report={r}
                            onClick={() => router.push(`/foro?source=${r.id}`)}
                          />
                        ))}
                        <button
                          onClick={() => router.push('/reportes')}
                          style={{
                            display: 'block', width: '100%', padding: '8px 14px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--accent)', textAlign: 'left',
                            transition: 'background .1s',
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                          Ver todos →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
