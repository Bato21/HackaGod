'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, type Country, type IeaScore, type RiskSignal } from '@/lib/supabase'
import { severityColor, severityLabel } from '@/lib/design-tokens'
import { getMockPanel } from '@/lib/mock-data'

const USE_MOCK = true // set false to fetch from Supabase

type Props = { iso3: string; onClose: () => void }

type PanelData = {
  country: Country
  score: IeaScore | null
  signals: RiskSignal[]
  threads: Array<{ id: string; title: string; alert_level: string; reply_count: number }>
}

const PILLAR_LABELS: Record<string, string> = {
  fiscal_discipline: 'Disciplina Fiscal',
  social_investment: 'Inversión Social',
  transparency:      'Transparencia',
  sector_stability:  'Estabilidad Sectorial',
}

const ALERT_COLOR: Record<string, string> = {
  watch:  'var(--accent)',
  alert:  'var(--warn)',
  urgent: 'var(--bad)',
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', whiteSpace: 'nowrap', opacity: 0.85 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--accent)', opacity: 0.2 }} />
    </div>
  )
}

function pillarFillColor(v: number) {
  if (v >= 60) return 'var(--accent)'
  if (v >= 40) return 'var(--warn)'
  return 'var(--bad)'
}

export default function CountryPanel({ iso3, onClose }: Props) {
  const [data,    setData]    = useState<PanelData | null>(null)
  const [loading, setLoading] = useState(true)
  const scoreRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setLoading(true); setData(null)
    if (USE_MOCK) { setData(getMockPanel(iso3)); setLoading(false); return }
    ;(async () => {
      const { data: country } = await supabase.from('countries').select('*').eq('iso_alpha3', iso3).single()
      if (!country) { setLoading(false); return }
      const [{ data: score }, { data: signals }, { data: threads }] = await Promise.all([
        supabase.from('iea_scores').select('*').eq('country_id', country.id).order('period', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('risk_signals').select('*').eq('country_id', country.id).eq('active', true).order('severity', { ascending: false }).limit(5),
        supabase.from('forum_threads').select('id,title,alert_level,reply_count').eq('country_id', country.id).order('created_at', { ascending: false }).limit(3),
      ])
      setData({ country: country as Country, score: score as IeaScore | null, signals: (signals ?? []) as RiskSignal[], threads: (threads ?? []) as PanelData['threads'] })
      setLoading(false)
    })()
  }, [iso3])

  useEffect(() => {
    if (!data?.score?.iea_score || !scoreRef.current) return
    const target  = data.score.iea_score
    const el      = scoreRef.current
    const dur     = 800
    const start   = performance.now()
    const ease    = (t: number) => 1 - Math.pow(1 - t, 3)
    const tick    = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      el.textContent = Math.round(target * ease(t)).toString()
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [data?.score?.iea_score])

  const iea   = data?.score?.iea_score ?? null
  const color = severityColor(iea)

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-2)' }}>
      {/* Blue gradient top edge */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, var(--accent), rgba(56,189,248,.2))', flexShrink: 0 }} />

      {/* Panel header */}
      <div style={{ padding: '20px 26px 14px', borderBottom: '1px solid var(--line-2)', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={onClose}>
          ← {iso3}
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: 4 }}>
          {loading ? '…' : data?.country?.flag_emoji ? `${data.country.flag_emoji} ${data.country.name_es}` : (data?.country?.name_es ?? iso3)}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--text-3)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
          {iso3}{data?.country?.region ? ` · ${data.country.region}` : ''}
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '16px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[80, 120, 100].map((h, i) => (
              <div key={i} style={{ height: h, background: 'var(--bg-3)', backgroundImage: 'linear-gradient(90deg, transparent 25%, var(--bg-4) 50%, transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">

            {/* IEA Score block */}
            <motion.div variants={item} style={{
              padding: '18px 26px', borderBottom: '1px solid var(--line)',
              display: 'flex', alignItems: 'flex-start', gap: 18, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--bg-3), var(--bg-2))',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <span
                    ref={scoreRef}
                    style={{ fontFamily: 'var(--mono)', fontSize: 62, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--gold)', textShadow: '0 0 30px rgba(250,204,21,.2)' }}
                  >
                    0
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-3)', marginBottom: 8, marginLeft: 4 }}>/100</span>
                </div>
                <div style={{
                  display: 'inline-block', fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.15em',
                  textTransform: 'uppercase', padding: '3px 8px', marginTop: 4,
                  background: `${color}18`, color: color, border: `1px solid ${color}44`,
                }}>
                  {severityLabel(iea)}
                </div>
              </div>

              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Índice IEA
                </div>

                {/* BIC band */}
                {data?.score?.bic_low != null && data.score.bic_high != null && (
                  <div>
                    <div style={{ height: 3, background: 'var(--line-2)', position: 'relative', overflow: 'hidden', marginBottom: 4 }}>
                      <div style={{
                        position: 'absolute', top: 0, bottom: 0,
                        left: `${data.score.bic_low}%`,
                        width: `${data.score.bic_high - data.score.bic_low}%`,
                        background: `linear-gradient(90deg, ${color}88, ${color})`,
                      }} />
                      {iea !== null && (
                        <div style={{
                          position: 'absolute', top: -1, bottom: -1, width: 2,
                          left: `${iea}%`, background: '#fff',
                          transform: 'translateX(-50%)',
                        }} />
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-4)' }}>
                      BIC {data.score.bic_low.toFixed(0)}–{data.score.bic_high.toFixed(0)} ·{' '}
                      <span style={{ color: data.score.bic_volatility === 'low' ? 'var(--good)' : data.score.bic_volatility === 'medium' ? 'var(--gold)' : 'var(--bad)' }}>
                        {data.score.bic_volatility ?? '—'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pillar bars */}
            {data?.score?.pillar_scores && Object.keys(data.score.pillar_scores).length > 0 && (
              <motion.div variants={item} style={{ padding: '14px 26px', borderBottom: '1px solid var(--line)' }}>
                <SectionHeader label="Pilares IEA" />
                {Object.entries(data.score.pillar_scores).map(([key, val]) => {
                  const v = val as number
                  const fc = pillarFillColor(v)
                  return (
                    <div key={key} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                          {PILLAR_LABELS[key] ?? key}
                        </span>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 500, color: 'var(--text-2)' }}>{v.toFixed(0)}/100</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--line-2)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${v}%`,
                          background: fc,
                          transformOrigin: 'left',
                          animation: 'expand .8s var(--ease) .3s both',
                        }} />
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}

            {/* Active signals */}
            <AnimatePresence>
              {data?.signals && data.signals.length > 0 && (
                <motion.div variants={item} style={{ padding: '14px 26px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.85 }}>
                      Señales activas
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 9, padding: '1px 6px', background: 'rgba(244,63,94,.15)', color: 'var(--bad)', border: '1px solid rgba(244,63,94,.3)' }}>
                      {data.signals.length}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'var(--accent)', opacity: 0.2 }} />
                  </div>
                  {data.signals.map((sig, i) => {
                    const sc = severityColor(sig.severity * 20)
                    return (
                      <motion.div
                        key={sig.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ padding: '8px 10px', marginBottom: 6, background: 'var(--bg-3)', borderLeft: `2px solid ${sc}` }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: 'var(--mono)', fontSize: 8, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--bg-4)', color: 'var(--text-3)' }}>
                            {sig.pattern_type}
                          </span>
                          <span style={{ color: sc, fontSize: 10 }}>{'●'.repeat(sig.severity)}{'○'.repeat(5 - sig.severity)}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--sans)', fontSize: 11, lineHeight: 1.55, color: 'var(--text-2)', margin: 0 }}>{sig.description}</p>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forum threads */}
            {data?.threads && data.threads.length > 0 && (
              <motion.div variants={item} style={{ padding: '14px 26px 18px' }}>
                <SectionHeader label="Conversación" />
                {data.threads.map(t => (
                  <div key={t.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--line)', cursor: 'pointer' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: ALERT_COLOR[t.alert_level] ?? 'var(--accent)', marginBottom: 3, opacity: 0.9 }}>
                      {t.alert_level}
                    </div>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, color: 'var(--text-2)', margin: '0 0 3px', lineHeight: 1.35 }}>{t.title}</p>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-4)' }}>{t.reply_count} respuestas</span>
                  </div>
                ))}
                <button
                  style={{
                    width: '100%', marginTop: 12, padding: '11px 0',
                    background: 'var(--accent)', color: '#020c18', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                    fontWeight: 500, transition: 'background .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#0ea5e9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                >
                  Ver foro completo →
                </button>
              </motion.div>
            )}

            {data && !data.signals.length && !data.threads.length && (
              <motion.div variants={item} style={{ padding: '24px 26px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Sin señales activas
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
