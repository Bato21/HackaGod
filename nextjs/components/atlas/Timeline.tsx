'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

type Props = {
  year: number
  onChange: (year: number) => void
}

export default function Timeline({ year, onChange }: Props) {
  const [playing, setPlaying]   = useState(false)
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    timerRef.current = setTimeout(() => {
      const idx = YEARS.indexOf(year)
      if (idx < YEARS.length - 1) {
        onChange(YEARS[idx + 1])
      } else {
        setPlaying(false)
      }
    }, 1500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [playing, year, onChange])

  return (
    <div style={{
      height: 64, background: 'var(--bg-2)',
      borderTop: '1px solid var(--line-2)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 16, flexShrink: 0,
      position: 'relative', zIndex: 10,
    }}>
      {/* Play/Pause */}
      <motion.button
        onClick={() => setPlaying(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, flexShrink: 0,
          boxShadow: '0 0 16px rgba(14,165,233,0.35)',
        }}
      >
        {playing ? '⏸' : '▶'}
      </motion.button>

      {/* Track */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        position: 'relative', padding: '0 4px',
      }}>
        {/* Base line */}
        <div style={{
          position: 'absolute', left: 4, right: 4, top: '50%',
          height: 1, background: 'var(--line-2)', transform: 'translateY(-50%)',
        }} />
        {/* Filled line (progress) */}
        <div style={{
          position: 'absolute', left: 4, top: '50%',
          height: 1.5,
          background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
          transform: 'translateY(-50%)',
          width: `${(YEARS.indexOf(year) / (YEARS.length - 1)) * 100}%`,
          transition: 'width .6s var(--ease)',
          borderRadius: 1,
        }} />

        {YEARS.map(y => {
          const active = y === year
          return (
            <button
              key={y}
              onClick={() => { setPlaying(false); onChange(y) }}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                position: 'relative', zIndex: 1,
              }}
            >
              <motion.div
                animate={active
                  ? { scale: 1.5, backgroundColor: '#06b6d4', boxShadow: '0 0 10px rgba(6,182,212,0.8)' }
                  : { scale: 1,   backgroundColor: '#1e3050', boxShadow: '0 0 0px rgba(6,182,212,0)' }
                }
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  border: active ? '1.5px solid #06b6d4' : '1px solid rgba(148,163,184,0.2)',
                }}
              />
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 7.5,
                color: active ? 'var(--text)' : 'var(--text-4)',
                fontWeight: active ? 700 : 400,
                letterSpacing: '0.04em',
                transition: 'color .2s',
              }}>
                {y}
              </span>
            </button>
          )
        })}
      </div>

      {/* Large year display */}
      <motion.div
        key={year}
        initial={{ opacity: 0.4, y: 4 }}
        animate={{ opacity: 1,   y: 0  }}
        transition={{ duration: 0.25 }}
        style={{
          fontFamily: 'var(--mono)', fontSize: 38, fontWeight: 700,
          color: 'var(--accent)', letterSpacing: '-0.03em',
          minWidth: 88, textAlign: 'right', flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {year}
      </motion.div>
    </div>
  )
}
