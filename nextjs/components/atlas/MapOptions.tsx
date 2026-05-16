'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type MapOpts = {
  vizType:    'coropleta' | 'burbujas'
  projection: 'mercator'  | 'equalearth' | 'globe'
  palette:    'divergente' | 'editorial' | 'riesgo' | 'vibrante' | 'monocromo'
  theme:      'oscuro' | 'claro' | 'corporativo'
  isoLabels:        boolean
  patternLinks:     boolean
  activeSignals:    boolean
}

const DEFAULT_OPTS: MapOpts = {
  vizType:    'coropleta',
  projection: 'mercator',
  palette:    'divergente',
  theme:      'oscuro',
  isoLabels:        false,
  patternLinks:     false,
  activeSignals:    true,
}

const PALETTES: { id: MapOpts['palette']; label: string; gradient: string }[] = [
  { id: 'divergente', label: 'Divergente',  gradient: 'linear-gradient(90deg, #0e7490, #facc15, #7f1d1d)' },
  { id: 'editorial',  label: 'Editorial',   gradient: 'linear-gradient(90deg, #16a34a, #fbbf24, #dc2626)' },
  { id: 'riesgo',     label: 'Riesgo',      gradient: 'linear-gradient(90deg, #facc15, #f97316, #dc2626)' },
  { id: 'vibrante',   label: 'Vibrante',    gradient: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #ef4444)' },
  { id: 'monocromo',  label: 'Monocromo',   gradient: 'linear-gradient(90deg, #1e293b, #94a3b8, #f1f5f9)' },
]

const COLOR_BAR = 'linear-gradient(90deg, #7f1d1d 0%, #dc2626 20%, #f97316 35%, #facc15 50%, #a3e635 65%, #0891b2 80%, #0e7490 100%)'

type Props = {
  open:     boolean
  onClose:  () => void
  opts:     MapOpts
  onChange: (o: MapOpts) => void
}

function Toggle({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0' }}>
      <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
      <button
        onClick={onToggle}
        style={{
          width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: checked
            ? 'linear-gradient(135deg, #0ea5e9, #7c3aed)'
            : 'rgba(148,163,184,0.15)',
          position: 'relative', transition: 'background .2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          transition: 'left .2s',
        }} />
      </button>
    </div>
  )
}

function PillGroup<T extends string>({
  options, active, onChange,
}: { options: { id: T; label: string }[]; active: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding: '5px 12px', borderRadius: 999,
            fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all .15s',
            border: active === o.id ? '1px solid rgba(6,182,212,0.7)' : '1px solid rgba(148,163,184,0.2)',
            background: active === o.id ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : 'rgba(148,163,184,0.06)',
            color: active === o.id ? '#fff' : 'var(--text-3)',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--text-3)', marginBottom: 10,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default function MapOptions({ open, onClose, opts, onChange }: Props) {
  function set<K extends keyof MapOpts>(key: K, val: MapOpts[K]) {
    const next = { ...opts, [key]: val }
    onChange(next)
    try { localStorage.setItem('aletheia.atlas.mapOptions', JSON.stringify(next)) } catch {}
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1,    y: 0   }}
          exit={{   opacity: 0, scale: 0.96, y: -8  }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 40,
            width: 340,
            background: 'rgba(9,18,34,0.97)',
            border: '1px solid rgba(148,163,184,0.15)',
            borderRadius: 16,
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px 12px',
            borderBottom: '1px solid rgba(148,163,184,0.1)',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text)' }}>
              OPCIONES DEL MAPA
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, padding: 2 }}
            >×</button>
          </div>

          <div style={{ padding: '16px 18px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

            <Section title="Tipo de visualización">
              <PillGroup
                options={[{ id: 'coropleta', label: 'Coropleta' }, { id: 'burbujas', label: 'Burbujas' }]}
                active={opts.vizType}
                onChange={v => set('vizType', v)}
              />
            </Section>

            <Section title="Proyección">
              <PillGroup
                options={[
                  { id: 'mercator',   label: 'Mercator'    },
                  { id: 'equalearth', label: 'Equal Earth' },
                  { id: 'globe',      label: 'Globo'       },
                ]}
                active={opts.projection}
                onChange={v => set('projection', v)}
              />
            </Section>

            <Section title="Paleta de colores">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {PALETTES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => set('palette', p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                      border: opts.palette === p.id
                        ? '2px solid rgba(6,182,212,0.8)'
                        : '1px solid rgba(148,163,184,0.12)',
                      background: 'rgba(148,163,184,0.04)',
                      boxShadow: opts.palette === p.id ? '0 0 10px rgba(6,182,212,0.2)' : 'none',
                      transition: 'all .15s', textAlign: 'left',
                    }}
                  >
                    <div style={{ width: 60, height: 14, borderRadius: 4, background: p.gradient, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-2)', letterSpacing: '0.06em' }}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Tema">
              <PillGroup
                options={[
                  { id: 'oscuro',       label: 'Oscuro'      },
                  { id: 'claro',        label: 'Claro'       },
                  { id: 'corporativo',  label: 'Corporativo' },
                ]}
                active={opts.theme}
                onChange={v => set('theme', v)}
              />
            </Section>

            <Section title="Opciones">
              <Toggle label="Etiquetas ISO"          checked={opts.isoLabels}     onToggle={() => set('isoLabels',     !opts.isoLabels)}     />
              <Toggle label="Mostrar enlaces de patrón" checked={opts.patternLinks} onToggle={() => set('patternLinks',  !opts.patternLinks)}  />
              <Toggle label="Mostrar señales activas"  checked={opts.activeSignals} onToggle={() => set('activeSignals', !opts.activeSignals)} />
            </Section>

            {/* Scale legend */}
            <div style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 14 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.14em', color: 'var(--text-3)', marginBottom: 8 }}>
                ESCALA · 0 LIMPIO → 100 CORRUPTO
              </div>
              <div style={{ height: 8, borderRadius: 4, background: COLOR_BAR, marginBottom: 4 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-4)' }}>
                {[0, 25, 50, 75, 100].map(n => <span key={n}>{n}</span>)}
              </div>
              <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-4)' }}>
                Los países atenuados están fuera del rango filtrado
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { DEFAULT_OPTS }
