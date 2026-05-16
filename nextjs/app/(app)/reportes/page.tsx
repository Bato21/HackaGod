'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { severityColor } from '@/lib/design-tokens'
import { MOCK_REPORTS, type MockReport } from '@/lib/mock-data'

const USE_MOCK = true // set false to fetch from Supabase

type Report = { id:string; title:string; excerpt:string|null; corruption_types:string[]; severity:number; published_at:string; source_name:string|null; url:string|null }

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

export default function ReportesPage() {
  const [reports, setReports] = useState<Report[] | MockReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    if (USE_MOCK) { setReports(MOCK_REPORTS); setLoading(false); return }
    supabase.from('news_events')
      .select('id,title,summary,corruption_types,severity,published_at,source_name,url')
      .eq('verified', true).order('published_at', { ascending: false }).limit(60)
      .then(({ data }) => {
        setReports((data ?? []).map(d => ({ id:d.id, title:d.title, excerpt:d.summary??null, corruption_types:d.corruption_types??[], severity:d.severity??1, published_at:d.published_at, source_name:d.source_name??null, url:d.url??null })))
        setLoading(false)
      })
  }, [])

  const filtered = reports.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
      style={{ display: 'flex', height: '100%', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--line-2)', padding: '14px', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--accent)', opacity: 0.25 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>Filtros</span>
          <div style={{ flex: 1, height: 1, background: 'var(--accent)', opacity: 0.25 }} />
        </div>

        <input
          value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar…"
          style={{ width:'100%', background:'rgba(56,189,248,.04)', border:'1px solid var(--line-2)', color:'var(--text)', fontFamily:'var(--mono)', fontSize:12, padding:'7px 10px', outline:'none', transition:'border-color .18s, background .18s, box-shadow .18s' }}
          onFocus={e  => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(56,189,248,.08)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(56,189,248,.1)' }}
          onBlur={e   => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.background = 'rgba(56,189,248,.04)'; e.currentTarget.style.boxShadow = 'none' }}
        />
        {search && (
          <button onClick={() => setSearch('')}
            style={{ background:'none', border:'none', color:'var(--accent)', fontFamily:'var(--mono)', fontSize:9, cursor:'pointer', textAlign:'left', letterSpacing:'.08em', textTransform:'uppercase' }}>
            Limpiar ×
          </button>
        )}
        <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text-4)' }}>{filtered.length} resultados</div>
      </div>

      {/* Grid */}
      <div style={{ flex:1, overflowY:'auto', padding:18 }}>
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {Array.from({length:9}).map((_,i) => (
              <div key={i} style={{ height:180, background:'var(--bg-2)', backgroundImage:'linear-gradient(90deg,transparent 25%,var(--bg-3) 50%,transparent 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }}/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:10 }}>
            <span style={{ fontSize:32 }}>📭</span>
            <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', letterSpacing:'.1em', textTransform:'uppercase' }}>Sin reportes</span>
          </div>
        ) : (
          <motion.div variants={{ hidden:{}, show:{ transition:{ staggerChildren:.04 } } }} initial="hidden" animate="show"
            style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {filtered.map(r => {
              const sc = severityColor(r.severity * 20)
              return (
                <motion.article key={r.id} variants={item}
                  style={{ background:'var(--bg-2)', border:'1px solid var(--line-2)', display:'flex', flexDirection:'column', overflow:'hidden', cursor:'pointer', transition:'transform .15s, box-shadow .15s' }}
                  whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,.5)' }}>
                  {/* Severity top strip */}
                  <div style={{ height:2, background:`linear-gradient(90deg, ${sc}, rgba(56,189,248,.2))` }}/>
                  <div style={{ padding:'12px 14px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:'var(--mono)', fontSize:8, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--accent)', opacity:.8 }}>{r.source_name ?? '—'}</span>
                      <span style={{ fontFamily:'var(--mono)', fontSize:8, color:'var(--text-4)' }}>{new Date(r.published_at).toLocaleDateString('es')}</span>
                    </div>
                    <h3 style={{ fontFamily:'var(--sans)', fontSize:13, fontWeight:500, lineHeight:1.35, color:'var(--text-2)', margin:0, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p style={{ fontFamily:'var(--sans)', fontSize:11, lineHeight:1.55, color:'var(--text-3)', margin:0, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                        {r.excerpt}
                      </p>
                    )}
                    {r.corruption_types.length > 0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:'auto' }}>
                        {r.corruption_types.slice(0,3).map(t => (
                          <span key={t} style={{ fontFamily:'var(--mono)', fontSize:7.5, padding:'1px 5px', background:'var(--bg-3)', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'.06em', border:'1px solid var(--line)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ borderTop:'1px solid var(--line)', paddingTop:8, marginTop:'auto' }}>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                          style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--accent)', textDecoration:'none', letterSpacing:'.08em', textTransform:'uppercase', transition:'opacity .15s' }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '.7')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                          Leer fuente →
                        </a>
                      ) : (
                        <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--text-4)' }}>Sin enlace</span>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
