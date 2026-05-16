'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import AccountDropdown from './AccountDropdown'

const NAV_PILLS = [
  { href: '/foro',        label: 'FORO'        },
  { href: '/metodologia', label: 'METODOLOGÍA' },
]

export default function TopNav() {
  const path = usePathname()
  const [user, setUser]       = useState<{ email?: string; username?: string; role?: string } | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    const guest = typeof window !== 'undefined' && sessionStorage.getItem('aletheia_guest') === '1'
    setIsGuest(guest)
    if (!guest) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUser({
            email:    data.user.email,
            username: data.user.user_metadata?.username,
            role:     data.user.user_metadata?.role,
          })
        }
      })
    }
  }, [])

  function pillStyle(active: boolean) {
    return {
      fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
      color: active ? 'var(--text)' : 'var(--text-3)',
      textDecoration: 'none',
      padding: '4px 11px', borderRadius: 999,
      border: `1px solid ${active ? 'rgba(6,182,212,0.6)' : 'rgba(148,163,184,0.2)'}`,
      background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
      transition: 'color .15s, border-color .15s, background .15s',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center',
    }
  }

  return (
    <motion.nav
      initial={{ y: -46, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: 46, background: 'var(--bg-2)',
        borderBottom: '1px solid var(--line-2)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', flexShrink: 0,
        position: 'relative', zIndex: 50, gap: 10,
      }}
    >
      {/* Gradient accent bottom */}
      <div style={{
        position: 'absolute', bottom: -1, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, var(--accent), transparent 60%)',
        opacity: 0.5, pointerEvents: 'none',
      }} />

      {/* Logo block → /atlas */}
      <Link
        href="/atlas"
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
      >
        {/* Cyan diamond */}
        <div style={{
          width: 9, height: 9,
          background: 'var(--accent)', transform: 'rotate(45deg)', flexShrink: 0,
          boxShadow: '0 0 8px rgba(56,189,248,0.5)',
        }} />
        <span style={{
          fontFamily: 'var(--serif)', fontWeight: 900,
          fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text)',
        }}>
          Aletheia
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 7, color: 'var(--text-3)',
          letterSpacing: '0.13em', textTransform: 'uppercase',
          borderLeft: '1px solid var(--line-2)', paddingLeft: 8,
          whiteSpace: 'nowrap',
        }}>
          ÍNDICE ILUSTRATIVO · AMÉRICA · 2015–2024
        </span>
      </Link>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Center-right: chips + nav pills + theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* DATOS FICTICIOS informational chip */}
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'var(--text-4)', border: '1px solid rgba(148,163,184,0.15)',
          padding: '3px 8px', borderRadius: 999,
          background: 'rgba(148,163,184,0.03)',
          userSelect: 'none',
        }}>
          DATOS · FICTICIOS
        </span>

        {NAV_PILLS.map(({ href, label }) => {
          const active = path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={pillStyle(active)}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.5)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.2)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--text-3)'
                }
              }}
            >
              {label}
            </Link>
          )
        })}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(v => !v)}
          style={pillStyle(false)}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.5)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.2)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-3)'
          }}
        >
          {darkMode ? '◑ OSCURO' : '◐ CLARO'}
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 18, background: 'var(--line-2)' }} />

        {/* Account */}
        <AccountDropdown user={user} isGuest={isGuest} />
      </div>
    </motion.nav>
  )
}
