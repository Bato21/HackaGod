'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type TooltipInfo = {
  iso3: string
  name: string
  iea: number | null
  year: number
  delta: number | null
  x: number
  y: number
}

type Props = {
  info: TooltipInfo | null
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

export default function CountryTooltip({ info }: Props) {
  const [visible, setVisible]   = useState(false)
  const [current, setCurrent]   = useState<TooltipInfo | null>(null)
  const showTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (info) {
      if (hideTimer.current) clearTimeout(hideTimer.current)
      showTimer.current = setTimeout(() => { setCurrent(info); setVisible(true) }, 80)
    } else {
      if (showTimer.current) clearTimeout(showTimer.current)
      hideTimer.current = setTimeout(() => setVisible(false), 100)
    }
  }, [info])

  if (!current) return null

  const color = ieaColor(current.iea)
  const hasDelta = current.delta !== null
  const deltaUp  = hasDelta && current.delta! > 0
  const deltaEq  = hasDelta && current.delta === 0

  // Clamp to viewport
  const x = Math.min(current.x + 14, (typeof window !== 'undefined' ? window.innerWidth : 800) - 210)
  const y = Math.min(current.y + 10, (typeof window !== 'undefined' ? window.innerHeight : 600) - 120)

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1    }}
            exit={{   opacity: 0, scale: 0.95  }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: x, top: y,
              width: 200,
              background: 'rgba(9,18,34,0.96)',
              border: `1px solid ${color}40`,
              borderRadius: 10,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${color}20`,
              backdropFilter: 'blur(12px)',
              padding: '10px 12px',
              pointerEvents: 'none',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>
                {current.name}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--text-3)', letterSpacing: '0.06em' }}>
                {current.iso3}
              </span>
            </div>

            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>
                {current.iea !== null ? current.iea.toFixed(1) : '—'}
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--text-3)' }}>/100</span>
            </div>

            {/* Bottom row: year + delta */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--text-3)',
            }}>
              <span>{current.year}</span>
              {hasDelta && !deltaEq && (
                <span style={{ color: deltaUp ? '#22d3a0' : '#f43f5e' }}>
                  {deltaUp ? '▲' : '▼'} {Math.abs(current.delta!).toFixed(1)} vs {current.year - 1}
                </span>
              )}
              {deltaEq && <span style={{ color: 'var(--text-4)' }}>= sin cambio</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
