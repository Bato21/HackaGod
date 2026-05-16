'use client'
import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import LeftPanel,      { type CountryRow }  from '@/components/atlas/LeftPanel'
import RightPanel                           from '@/components/atlas/RightPanel'
import Timeline                             from '@/components/atlas/Timeline'
import MapOptions, { DEFAULT_OPTS, type MapOpts } from '@/components/atlas/MapOptions'
import CountryTooltip, { type TooltipInfo } from '@/components/atlas/CountryTooltip'
import NewsPanel                            from '@/components/atlas/NewsPanel'
import { supabase }                         from '@/lib/supabase'
import { MOCK_COUNTRIES }                   from '@/lib/mock-data'

const USE_MOCK = true

const LeafletMap = dynamic(() => import('@/components/atlas/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%', height: '100%', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ width: 20, height: 20, border: '2px solid var(--line-2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        Cargando mapa…
      </span>
    </div>
  ),
})

type Country = { iso3: string; name: string; flag: string; lat: number; lng: number; iea: number | null }

const COLOR_BAR = 'linear-gradient(90deg, #7f1d1d 0%, #dc2626 20%, #f97316 35%, #facc15 50%, #a3e635 65%, #0891b2 80%, #0e7490 100%)'

export default function AtlasPage() {
  const router = useRouter()
  const [countries,  setCountries]  = useState<Country[]>([])
  const [selected,   setSelected]   = useState<string | null>(null)
  const [year,       setYear]       = useState(2024)
  const [loading,    setLoading]    = useState(true)
  const [rangeMin,   setRangeMin]   = useState(0)
  const [rangeMax,   setRangeMax]   = useState(100)
  const [mapOptsOpen, setMapOptsOpen] = useState(false)
  const [mapOpts,    setMapOpts]    = useState<MapOpts>(() => {
    if (typeof window === 'undefined') return DEFAULT_OPTS
    try { return JSON.parse(localStorage.getItem('aletheia.atlas.mapOptions') ?? 'null') ?? DEFAULT_OPTS }
    catch { return DEFAULT_OPTS }
  })
  const [tooltip, setTooltip]       = useState<TooltipInfo | null>(null)
  const [newsPanelOpen, setNewsPanelOpen] = useState(false)

  // Load data
  useEffect(() => {
    if (USE_MOCK) {
      setCountries(MOCK_COUNTRIES)
      setLoading(false)
      return
    }
    ;(async () => {
      const { data: c } = await supabase
        .from('countries').select('id,iso_alpha3,name_es,latitude,longitude,flag_emoji').eq('active', true)
      if (!c?.length) { setLoading(false); return }

      const { data: iea } = await supabase
        .from('iea_scores')
        .select('country_id,iea_score')
        .in('country_id', c.map(x => x.id))
        .eq('period', year)

      const ieaMap: Record<string, number> = {}
      iea?.forEach(r => { ieaMap[r.country_id as string] = r.iea_score as number })

      setCountries(c.map(x => ({
        iso3: x.iso_alpha3 as string,
        name: x.name_es   as string,
        flag: (x.flag_emoji as string) ?? '',
        lat:  (x.latitude  as number)  ?? 0,
        lng:  (x.longitude as number)  ?? 0,
        iea:  ieaMap[x.id as string]   ?? null,
      })))
      setLoading(false)
    })()
  }, [year])

  const rows: CountryRow[] = countries.map((c, i) => ({ ...c, rank: i + 1 }))

  const handleSelect = useCallback((iso3: string) => {
    setSelected(prev => prev === iso3 ? null : iso3)
  }, [])

  const handleHover = useCallback((info: TooltipInfo | null) => {
    setTooltip(info)
  }, [])

  const handleCompare = useCallback((iso3: string) => {
    router.push(`/comparar?c=${iso3}`)
  }, [router])

  const handleRange = useCallback((min: number, max: number) => {
    setRangeMin(min)
    setRangeMax(max)
  }, [])

  function zoomIn()  { const m = (window as unknown as Record<string,unknown>).__aletheiaMap as { zoomIn?: () => void } | undefined; m?.zoomIn?.() }
  function zoomOut() { const m = (window as unknown as Record<string,unknown>).__aletheiaMap as { zoomOut?: () => void } | undefined; m?.zoomOut?.() }
  function zoomReset() { const m = (window as unknown as Record<string,unknown>).__aletheiaMap as { fitBounds?: (b: number[][]) => void } | undefined; m?.fitBounds?.([[-58,-120],[74,-30]]) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Main row ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left panel */}
        <LeftPanel
          countries={rows}
          selected={selected}
          onSelect={handleSelect}
          year={year}
          rangeMin={rangeMin}
          rangeMax={rangeMax}
          onRange={handleRange}
        />

        {/* Map center */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
          {loading ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
              <div style={{ width: 20, height: 20, border: '2px solid var(--line-2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Cargando datos…</span>
            </div>
          ) : (
            <LeafletMap
              scores={countries}
              selected={selected}
              rangeMin={rangeMin}
              rangeMax={rangeMax}
              onSelect={handleSelect}
              onHover={handleHover}
            />
          )}

          {/* ── Map UI overlays ── */}

          {/* Zoom controls — left side, bottom area */}
          <div style={{ position: 'absolute', left: 14, bottom: 100, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { icon: '+', action: zoomIn,    title: 'Acercar'   },
              { icon: '−', action: zoomOut,   title: 'Alejar'    },
              { icon: '⊙', action: zoomReset, title: 'Restablecer' },
            ].map(({ icon, action, title }) => (
              <button
                key={icon}
                onClick={action}
                title={title}
                style={{
                  width: 32, height: 32,
                  background: 'rgba(11,21,38,0.85)', border: '1px solid var(--line-2)',
                  color: 'var(--text-3)', fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(8px)', borderRadius: 6,
                  transition: 'border-color .15s, color .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.color = 'var(--text-3)' }}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* NewsPanel overlay */}
          <NewsPanel
            open={newsPanelOpen}
            onClose={() => setNewsPanelOpen(false)}
            countryFilter={selected}
          />

          {/* News toggle button */}
          <motion.button
            onClick={() => setNewsPanelOpen(v => !v)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              position: 'absolute', top: 14, left: 14, zIndex: 31,
              padding: '6px 12px',
              background: newsPanelOpen ? 'rgba(6,182,212,0.15)' : 'rgba(11,21,38,0.85)',
              border: `1px solid ${newsPanelOpen ? 'rgba(6,182,212,0.6)' : 'var(--line-2)'}`,
              color: newsPanelOpen ? 'var(--accent)' : 'var(--text-3)',
              cursor: 'pointer', borderRadius: 8, backdropFilter: 'blur(8px)',
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all .15s',
            }}
          >
            <span>📰</span>
            <span>NOTICIAS</span>
          </motion.button>

          {/* Gear button (Map Options) */}
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 30, display: 'flex', gap: 6 }}>
            <motion.button
              onClick={() => setMapOptsOpen(v => !v)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '6px 12px',
                background: mapOptsOpen ? 'rgba(6,182,212,0.15)' : 'rgba(11,21,38,0.85)',
                border: `1px solid ${mapOptsOpen ? 'rgba(6,182,212,0.6)' : 'var(--line-2)'}`,
                color: mapOptsOpen ? 'var(--accent)' : 'var(--text-3)',
                cursor: 'pointer', borderRadius: 8, backdropFilter: 'blur(8px)',
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all .15s',
              }}
            >
              <span>⚙</span>
              <span>OPCIONES</span>
            </motion.button>
          </div>

          {/* MapOptions panel */}
          <MapOptions
            open={mapOptsOpen}
            onClose={() => setMapOptsOpen(false)}
            opts={mapOpts}
            onChange={setMapOpts}
          />

          {/* Legend — bottom left */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14, zIndex: 20,
            background: 'rgba(11,21,38,0.88)', border: '1px solid var(--line-2)',
            padding: '10px 14px', backdropFilter: 'blur(8px)', borderRadius: 8,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-3)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
              Índice IEA · {year} · Escala 0–100
            </div>
            <div style={{ width: 160, height: 5, background: COLOR_BAR, borderRadius: 3, marginBottom: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 7, color: 'var(--text-4)' }}>
              <span>0 CORRUPTO</span>
              <span>50</span>
              <span>100 LIMPIO</span>
            </div>
          </div>

          {/* Hint */}
          {!selected && (
            <div style={{
              position: 'absolute', bottom: 14, right: 14, zIndex: 20,
              background: 'rgba(11,21,38,0.8)', border: '1px solid var(--line-2)',
              padding: '6px 12px', backdropFilter: 'blur(8px)', borderRadius: 6,
            }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.1em', color: 'var(--text-3)', textTransform: 'uppercase' }}>
                Haz clic en un país
              </span>
            </div>
          )}
        </div>

        {/* Right panel */}
        <RightPanel
          selected={selected}
          countries={countries}
          onClose={() => setSelected(null)}
          onCompare={handleCompare}
        />
      </div>

      {/* ── Timeline ── */}
      <Timeline year={year} onChange={setYear} />

      {/* Tooltip — fixed overlay */}
      <CountryTooltip info={tooltip} />
    </div>
  )
}
