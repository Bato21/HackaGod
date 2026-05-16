'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type UserInfo = { email?: string; username?: string; role?: string } | null

type Props = {
  user: UserInfo
  isGuest: boolean
}

const ROLE_COLORS: Record<string, string> = {
  PERIODISTA:   '#06b6d4',
  ACTIVISTA:    '#a855f7',
  INVESTIGADOR: '#3b82f6',
  CIUDADANO:    '#94a3b8',
}

const MENU_ITEMS = [
  { label: 'Mi perfil',          href: '/perfil',                icon: '◎' },
  { label: 'Mis suscripciones',  href: '/perfil/suscripciones',  icon: '◉' },
  { label: 'Mis hilos',          href: '/perfil/hilos',          icon: '◈' },
  { label: 'Configuración',      href: '/configuracion',         icon: '⚙' },
]

export default function AccountDropdown({ user, isGuest }: Props) {
  const [open, setOpen] = useState(false)
  const ref            = useRef<HTMLDivElement>(null)
  const router         = useRouter()

  const username = isGuest
    ? 'INVITADO'
    : (user?.username ?? user?.email?.split('@')[0]?.toUpperCase() ?? 'USUARIO')
  const role = (user?.role ?? 'CIUDADANO').toUpperCase()
  const roleColor = ROLE_COLORS[role] ?? '#94a3b8'

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  async function handleSignOut() {
    setOpen(false)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const avatarStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--mono)', color: '#fff', fontWeight: 700,
    background: isGuest
      ? 'rgba(6,182,212,0.25)'
      : 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)',
    border: `1.5px solid ${isGuest ? 'rgba(6,182,212,0.4)' : 'rgba(124,58,237,0.5)'}`,
    borderRadius: '50%',
    flexShrink: 0,
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: open ? 'rgba(15,23,42,0.5)' : 'transparent',
          border: `1px solid ${open ? 'rgba(148,163,184,0.25)' : 'transparent'}`,
          padding: '4px 8px 4px 6px', cursor: 'pointer',
          borderRadius: 8, transition: 'all .15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(15,23,42,0.4)'
          e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
          }
        }}
      >
        <div style={{ ...avatarStyle, width: 28, height: 28, fontSize: 11 }}>
          {username.charAt(0)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text)', letterSpacing: '0.07em', lineHeight: 1 }}>
            {username}
          </span>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.12em',
            color: isGuest ? '#06b6d4' : roleColor,
            background: isGuest ? 'rgba(6,182,212,0.1)' : `${roleColor}18`,
            border: `1px solid ${isGuest ? 'rgba(6,182,212,0.3)' : `${roleColor}35`}`,
            padding: '0 4px', borderRadius: 2, lineHeight: 1.6,
          }}>
            {isGuest ? 'INVITADO' : role}
          </span>
        </div>

        <span style={{
          color: 'var(--text-3)', fontSize: 9, marginLeft: 2,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform .2s',
          display: 'inline-block',
        }}>▾</span>
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{   opacity: 0, scale: 0.96, y: -6  }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 260, zIndex: 200,
              background: 'rgba(9,18,34,0.97)',
              border: '1px solid rgba(148,163,184,0.15)',
              borderRadius: 12,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.04)',
              backdropFilter: 'blur(20px)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ ...avatarStyle, width: 44, height: 44, fontSize: 17 }}>
                  {username.charAt(0)}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {username}
                  </div>
                  {!isGuest && user?.email && (
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)', marginTop: 1 }}>
                      {user.email}
                    </div>
                  )}
                  <span style={{
                    display: 'inline-block', marginTop: 4,
                    fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.12em',
                    color: isGuest ? '#06b6d4' : roleColor,
                    background: isGuest ? 'rgba(6,182,212,0.1)' : `${roleColor}18`,
                    border: `1px solid ${isGuest ? 'rgba(6,182,212,0.3)' : `${roleColor}35`}`,
                    padding: '1px 6px', borderRadius: 3,
                  }}>
                    {isGuest ? 'INVITADO' : role}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '6px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
              {isGuest ? (
                <div style={{ padding: '10px 12px' }}>
                  <div style={{
                    background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)',
                    borderRadius: 8, padding: '10px 12px', marginBottom: 10,
                  }}>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5, margin: 0 }}>
                      Estás navegando como invitado. Crea una cuenta para participar en el foro y suscribirte a países.
                    </p>
                  </div>
                  <button
                    onClick={() => { setOpen(false); router.push('/login') }}
                    style={{
                      width: '100%', padding: '9px',
                      background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                      border: 'none', borderRadius: 8, cursor: 'pointer',
                      fontFamily: 'var(--mono)', fontSize: 10, color: '#fff',
                      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      marginBottom: 6,
                    }}
                  >
                    Crear cuenta
                  </button>
                  <button
                    onClick={() => { setOpen(false); router.push('/login') }}
                    style={{
                      width: '100%', padding: '6px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)',
                    }}
                  >
                    Iniciar sesión
                  </button>
                </div>
              ) : (
                MENU_ITEMS.map(item => (
                  <button
                    key={item.href}
                    onClick={() => { setOpen(false); router.push(item.href) }}
                    style={{
                      width: '100%', padding: '9px 14px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      textAlign: 'left', transition: 'background .1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(148,163,184,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: 'var(--text-4)', fontSize: 12, width: 16, textAlign: 'center' }}>{item.icon}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-2)' }}>{item.label}</span>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '6px 0' }}>
              {isGuest ? (
                <button
                  onClick={() => { setOpen(false); router.push('/login') }}
                  style={{
                    width: '100%', padding: '9px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left', transition: 'background .1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(148,163,184,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: 'var(--text-4)', fontSize: 12, width: 16, textAlign: 'center' }}>←</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-2)' }}>Volver al inicio</span>
                </button>
              ) : (
                <button
                  onClick={handleSignOut}
                  style={{
                    width: '100%', padding: '9px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    textAlign: 'left', transition: 'background .1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ color: '#ef4444', fontSize: 12, width: 16, textAlign: 'center' }}>⏻</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#ef4444' }}>Cerrar sesión</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
