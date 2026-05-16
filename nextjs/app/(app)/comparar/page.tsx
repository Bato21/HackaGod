'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line } from 'recharts'

const MOCK: Record<string, { name: string; flag: string; iea: number; pillars: number[] }> = {
  URY: { name: 'Uruguay',   flag: '🇺🇾', iea: 27.4, pillars: [82, 78, 74, 80] },
  CRI: { name: 'Costa Rica',flag: '🇨🇷', iea: 34.1, pillars: [76, 80, 68, 75] },
  CHL: { name: 'Chile',     flag: '🇨🇱', iea: 41.2, pillars: [68, 71, 55, 63] },
  PAN: { name: 'Panamá',    flag: '🇵🇦', iea: 48.8, pillars: [60, 65, 52, 58] },
  BRA: { name: 'Brasil',    flag: '🇧🇷', iea: 54.3, pillars: [55, 62, 48, 50] },
  ARG: { name: 'Argentina', flag: '🇦🇷', iea: 62.1, pillars: [50, 58, 42, 46] },
  PER: { name: 'Perú',      flag: '🇵🇪', iea: 66.4, pillars: [45, 55, 40, 48] },
  MEX: { name: 'México',    flag: '🇲🇽', iea: 69.2, pillars: [42, 48, 38, 44] },
  VEN: { name: 'Venezuela', flag: '🇻🇪', iea: 84.6, pillars: [22, 18, 15, 20] },
}

const COLORS = ['#38bdf8', '#facc15', '#22d3a0', '#fb923c']
const TABS = ['IEA Total', 'Por Pilares', 'Evolución', 'Radar'] as const
const PILLARS = ['Fiscal', 'Social', 'Transparencia', 'Estabilidad']

const tip = { background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 0, color: 'var(--text)', fontSize: 11, fontFamily: 'var(--mono)' }

export default function CompararPage() {
  const [selected, setSelected] = useState<string[]>(['URY', 'CHL'])
  const [tab, setTab]     = useState<typeof TABS[number]>('IEA Total')
  const [addOpen, setAddOpen] = useState(false)

  const add    = (iso: string) => { if (!selected.includes(iso) && selected.length < 4) setSelected(p => [...p, iso]); setAddOpen(false) }
  const remove = (iso: string) => setSelected(p => p.filter(x => x !== iso))
  const data   = selected.map(iso => MOCK[iso]).filter(Boolean)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Selector + tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderBottom: '1px solid var(--line)', flexShrink: 0, background: 'var(--bg-2)' }}>
        {selected.map((iso, i) => {
          const c = MOCK[iso]; if (!c) return null
          return (
            <motion.div key={iso} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 10px', border: `1px solid ${COLORS[i]}44`, background: `${COLORS[i]}11`, cursor: 'default' }}>
              <span>{c.flag}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: COLORS[i] }}>{c.name}</span>
              <button onClick={() => remove(iso)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS[i], opacity: .6, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </motion.div>
          )
        })}

        {selected.length < 4 && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setAddOpen(p => !p)}
              style={{ padding: '4px 10px', background: 'transparent', border: '1px dashed var(--line-2)', color: 'var(--text-3)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em' }}>
              + Agregar
            </button>
            <AnimatePresence>
              {addOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--bg-2)', border: '1px solid var(--line-2)', width: 160, maxHeight: 220, overflowY: 'auto', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,.5)' }}>
                  {Object.entries(MOCK).filter(([iso]) => !selected.includes(iso)).map(([iso, c]) => (
                    <div key={iso} onClick={() => add(iso)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'var(--sans)', fontSize: 12, transition: 'background .1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <span>{c.flag}</span><span>{c.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '5px 12px', background: tab === t ? 'var(--bg-3)' : 'transparent', color: tab === t ? 'var(--text)' : 'var(--text-3)', border: tab === t ? '1px solid var(--line-2)' : '1px solid transparent', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all .15s' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, padding: '20px 24px', minHeight: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              {tab === 'IEA Total' ? (
                <BarChart data={data.map(c => ({ name: c.name, IEA: c.iea }))} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#8fadc8', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#4d6d90', fontSize: 10, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="IEA" fill={COLORS[0]} radius={[2, 2, 0, 0]} maxBarSize={60} />
                </BarChart>
              ) : tab === 'Por Pilares' ? (
                <BarChart data={PILLARS.map((p, i) => ({ name: p, ...Object.fromEntries(data.map(c => [c.name, c.pillars[i]])) }))} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#8fadc8', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#4d6d90', fontSize: 10, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tip} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  {data.map((c, i) => <Bar key={c.name} dataKey={c.name} fill={COLORS[i % COLORS.length]} radius={[2, 2, 0, 0]} maxBarSize={40} />)}
                </BarChart>
              ) : tab === 'Evolución' ? (
                <LineChart data={[2019,2020,2021,2022,2023].map(y => ({ year: y, ...Object.fromEntries(data.map(c => [c.name, Math.max(10, Math.min(95, c.iea + Math.sin(y * c.iea) * 4))]))}))} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="year" tick={{ fill: '#8fadc8', fontSize: 11, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#4d6d90', fontSize: 10, fontFamily: 'var(--mono)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tip} />
                  {data.map((c, i) => <Line key={c.name} type="monotone" dataKey={c.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />)}
                </LineChart>
              ) : (
                <RadarChart data={PILLARS.map((p, i) => ({ pillar: p, ...Object.fromEntries(data.map(c => [c.name, c.pillars[i]])) }))}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="pillar" tick={{ fill: '#8fadc8', fontSize: 10, fontFamily: 'var(--mono)' }} />
                  {data.map((c, i) => <Radar key={c.name} name={c.name} dataKey={c.name} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.1} />)}
                </RadarChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
