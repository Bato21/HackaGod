'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const REGIONS = ['Norteamérica', 'Centroamérica', 'Caribe', 'Sudamérica']
const YEARS   = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
const CATS    = [
  { id: 'pais',     label: 'País',     color: '#06b6d4' },
  { id: 'gobierno', label: 'Gobierno', color: '#a855f7' },
  { id: 'tema',     label: 'Tema',     color: '#f59e0b' },
]
const ESTADOS = ['Abierto', 'Movimiento', 'Resuelto']

import { MOCK_COUNTRIES } from '@/lib/mock-data'

export type ForumFilters = {
  regions:    string[]
  countries:  string[]
  categories: string[]
  years:      number[]
  estados:    string[]
}

type Props = {
  open:     boolean
  onClose:  () => void
  filters:  ForumFilters
  onChange: (f: ForumFilters) => void
  onApply:  () => void
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

export const EMPTY_FILTERS: ForumFilters = {
  regions: [], countries: [], categories: [], years: [], estados: [],
}

export default function FilterSidebar({ open, onClose, filters, onChange, onApply }: Props) {
  const [countrySearch, setCountrySearch] = useState('')

  const activeCount =
    filters.regions.length + filters.countries.length +
    filters.categories.length + filters.years.length + filters.estados.length

  const filteredCountries = MOCK_COUNTRIES.filter(c =>
    !countrySearch || c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.iso3.toLowerCase().includes(countrySearch.toLowerCase())
  )

  function chip(label: string, active: boolean, onClick: () => void, color?: string) {
    return (
      <button
        key={label}
        onClick={onClick}
        style={{
          padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase',
          border: active ? `1px solid ${color ?? '#06b6d4'}` : '1px solid #e2e8f0',
          background: active ? `${color ?? '#06b6d4'}15` : 'transparent',
          color: active ? (color ?? '#06b6d4') : '#64748b',
          transition: 'all .12s',
        }}
      >
        {label}
      </button>
    )
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#64748b', marginBottom: 10,
        }}>
          {title}
        </div>
        {children}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 380, zIndex: 900,
              background: '#fff', color: '#0f172a',
              display: 'flex', flexDirection: 'column',
              boxShadow: '-24px 0 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px 14px',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Filtros</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {activeCount > 0 && (
                  <button
                    onClick={() => onChange(EMPTY_FILTERS)}
                    style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#06b6d4', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Limpiar todo
                  </button>
                )}
                <button
                  onClick={onClose}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20 }}
                >×</button>
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

              <Section title="Región">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {REGIONS.map(r => (
                    <button
                      key={r}
                      onClick={() => onChange({ ...filters, regions: toggle(filters.regions, r) })}
                      style={{
                        padding: '10px 14px', borderRadius: 8,
                        border: filters.regions.includes(r) ? '2px solid #06b6d4' : '1px solid #f1f5f9',
                        background: filters.regions.includes(r) ? '#ecfeff' : '#f8fafc',
                        cursor: 'pointer', textAlign: 'left',
                        fontFamily: 'var(--sans)', fontSize: 12, color: '#334155',
                        transition: 'all .12s',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      {r}
                      {filters.regions.includes(r) && <span style={{ color: '#06b6d4' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="País">
                <input
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  placeholder="Buscar país…"
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 6,
                    border: '1px solid #e2e8f0', background: '#f8fafc',
                    fontFamily: 'var(--mono)', fontSize: 11, color: '#0f172a',
                    outline: 'none', marginBottom: 8, boxSizing: 'border-box',
                  }}
                />
                <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredCountries.map(c => (
                    <button
                      key={c.iso3}
                      onClick={() => onChange({ ...filters, countries: toggle(filters.countries, c.iso3) })}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 10px', borderRadius: 6, cursor: 'pointer',
                        background: filters.countries.includes(c.iso3) ? '#ecfeff' : 'transparent',
                        border: 'none', transition: 'background .1s', textAlign: 'left',
                      }}
                      onMouseEnter={e => { if (!filters.countries.includes(c.iso3)) e.currentTarget.style.background = '#f8fafc' }}
                      onMouseLeave={e => { if (!filters.countries.includes(c.iso3)) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#334155' }}>
                        {c.flag} {c.name}
                      </span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#94a3b8' }}>{c.iso3}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Categoría">
                <div style={{ display: 'flex', gap: 6 }}>
                  {CATS.map(cat => chip(cat.label, filters.categories.includes(cat.id), () => onChange({ ...filters, categories: toggle(filters.categories, cat.id) }), cat.color))}
                </div>
              </Section>

              <Section title="Año">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                  {YEARS.map(y => (
                    <button
                      key={y}
                      onClick={() => onChange({ ...filters, years: toggle(filters.years, y) })}
                      style={{
                        padding: '7px', borderRadius: 6, cursor: 'pointer',
                        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600,
                        border: 'none',
                        background: filters.years.includes(y)
                          ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)'
                          : '#f1f5f9',
                        color: filters.years.includes(y) ? '#fff' : '#64748b',
                        transition: 'all .12s',
                      }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Estado">
                <div style={{ display: 'flex', gap: 6 }}>
                  {ESTADOS.map(e => chip(e, filters.estados.includes(e), () => onChange({ ...filters, estados: toggle(filters.estados, e) })))}
                </div>
              </Section>
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 20px', borderTop: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <button
                onClick={() => { onApply(); onClose() }}
                disabled={activeCount === 0}
                style={{
                  padding: '10px 24px',
                  background: activeCount > 0 ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : '#e2e8f0',
                  border: 'none', borderRadius: 8,
                  cursor: activeCount > 0 ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em',
                  color: activeCount > 0 ? '#fff' : '#94a3b8',
                }}
              >
                Aplicar ({activeCount})
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
