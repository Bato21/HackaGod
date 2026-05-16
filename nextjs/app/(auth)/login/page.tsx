'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import WorldMapBg from '@/components/auth/WorldMapBg'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router  = useRouter()
  const [tab, setTab]           = useState<'login' | 'register'>('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [exiting, setExiting]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (tab === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) { setError(err.message); setLoading(false); return }
      } else {
        if (name.trim().length < 2) { setError('Ingresa tu nombre.'); setLoading(false); return }
        if (password.length < 6)   { setError('La contraseña debe tener al menos 6 caracteres.'); setLoading(false); return }
        const { data, error: err } = await supabase.auth.signUp({
          email, password, options: { data: { name: name.trim() } },
        })
        if (err) { setError(err.message); setLoading(false); return }
        if (data.user && !data.session) {
          setError('Revisa tu correo para confirmar la cuenta antes de iniciar sesión.')
          setLoading(false); return
        }
      }
      triggerTransition()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado.')
      setLoading(false)
    }
  }

  function handleGuest() {
    // Store guest flag in sessionStorage
    sessionStorage.setItem('aletheia_guest', '1')
    triggerTransition()
  }

  function triggerTransition() {
    setExiting(true)
    // Navigate after cinematic exit completes
    setTimeout(() => router.push('/atlas'), 900)
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #071221 0%, #0f2237 45%, #0a1d30 100%)',
      }}
    >
      {/* Radial glow overlays + grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 18% 30%, rgba(14,165,233,0.22), transparent 48%),
            radial-gradient(circle at 80% 68%, rgba(124,58,237,0.14), transparent 48%),
            radial-gradient(circle at 55% 10%, rgba(13,148,136,0.10), transparent 38%),
            repeating-linear-gradient(0deg, transparent 0 39px, rgba(255,255,255,0.022) 39px 40px),
            repeating-linear-gradient(90deg, transparent 0 39px, rgba(255,255,255,0.022) 39px 40px)
          `,
        }}
      />

      {/* Animated world map canvas */}
      <WorldMapBg />

      {/* Hero — left */}
      <motion.div
        className="relative z-10 flex-1 max-w-[560px] flex flex-col gap-8 select-none"
        animate={exiting ? { x: '-100%', opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        initial={{ opacity: 0, x: -24 }}
      >
        {/* Brand */}
        <div>
          <div
            className="text-[28px] font-medium tracking-tight"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', color: '#eef4fc', letterSpacing: '-0.02em' }}
          >
            <span style={{ color: '#38bdf8', marginRight: 10, fontSize: 12, verticalAlign: 'middle' }}>◆</span>
            Aletheia
          </div>
          <div
            className="mt-1.5 text-[11px] uppercase tracking-[0.14em]"
            style={{ color: '#7fa3c8' }}
          >
            Índice ilustrativo · Periodismo de datos
          </div>
        </div>

        {/* Headline */}
        <div>
          <h2
            className="text-[54px] font-medium leading-[1.05] m-0"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', color: '#eef4fc', letterSpacing: '-0.02em' }}
          >
            La corrupción no es una cifra.
          </h2>
          <h2
            className="text-[54px] font-medium leading-[1.05] m-0 mb-5"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', color: '#5a7fa8', letterSpacing: '-0.02em' }}
          >
            Es una conversación que empieza aquí.
          </h2>
          <p className="text-[14px] leading-[1.65] m-0 max-w-[460px]" style={{ color: '#7fa3c8' }}>
            Explora el mapa interactivo de América con datos ilustrativos: rankings, comparativas, evolución temporal,
            fichas de país con presidente, gabinete y titulares de prensa. Pensado para investigar, contrastar y entender.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-10 pt-7 border-t border-white/10">
          {[['Países', '29'], ['Años', '10'], ['Regiones', '4']].map(([label, value]) => (
            <div key={label}>
              <div className="text-[10px] uppercase tracking-[0.12em]" style={{ color: '#7fa3c8' }}>{label}</div>
              <div
                className="text-[26px] font-medium mt-1"
                style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#38bdf8' }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] tracking-[0.06em]" style={{ color: '#4a6a8a' }}>
          © Aletheia · Datos ficticios con fines demostrativos
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="w-16 hidden lg:block" />

      {/* Form card — right */}
      <motion.div
        className="relative z-10 w-[420px] rounded-xl shadow-2xl p-8 flex-shrink-0"
        style={{ background: '#ffffff', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
        animate={exiting ? { x: '120%', opacity: 0 } : { x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        initial={{ opacity: 0, x: 24 }}
      >
        <div className="text-[10px] uppercase tracking-[0.16em] mb-2" style={{ color: '#0ea5e9' }}>
          Acceso
        </div>
        <AnimatePresence mode="wait">
          <motion.h1
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-[32px] font-medium mb-7 leading-tight"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', color: '#0d1b2a', letterSpacing: '-0.02em' }}
          >
            {tab === 'login' ? 'Bienvenido de vuelta.' : 'Crea tu cuenta.'}
          </motion.h1>
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex rounded-lg p-1 mb-6" style={{ background: '#f4f6fb', border: '1px solid #d4dded' }}>
          {(['login', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className="flex-1 py-2 rounded-md text-[13px] font-medium transition-all duration-150"
              style={tab === t ? {
                background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                color: '#fff',
              } : { color: '#64748b' }}
            >
              {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label className="block text-[11px] mb-1.5 font-medium" style={{ color: '#475569' }}>Nombre</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Tu nombre completo" autoComplete="name"
                className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all"
                style={{ border: '1px solid #d4dded', color: '#0d1b2a', background: '#fff' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#0ea5e9')}
                onBlur={e  => (e.currentTarget.style.borderColor = '#d4dded')}
              />
            </div>
          )}
          <div>
            <label className="block text-[11px] mb-1.5 font-medium" style={{ color: '#475569' }}>Correo electrónico</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com" autoComplete="email" required
              className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all"
              style={{ border: '1px solid #d4dded', color: '#0d1b2a', background: '#fff' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#0ea5e9')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#d4dded')}
            />
          </div>
          <div>
            <label className="block text-[11px] mb-1.5 font-medium" style={{ color: '#475569' }}>Contraseña</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '•••••••••'}
              autoComplete={tab === 'register' ? 'new-password' : 'current-password'} required
              className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none transition-all"
              style={{ border: '1px solid #d4dded', color: '#0d1b2a', background: '#fff' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#0ea5e9')}
              onBlur={e  => (e.currentTarget.style.borderColor = '#d4dded')}
            />
          </div>

          {error && (
            <div className="text-[11px] px-3 py-2 rounded-md" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
              ⚠ {error}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px]" style={{ color: '#64748b' }}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                className="accent-[#0ea5e9]"
              />
              Mantener sesión
            </label>
            {tab === 'login' && (
              <a href="#" onClick={e => e.preventDefault()} className="hover:underline" style={{ color: '#0ea5e9' }}>
                ¿Olvidaste la contraseña?
              </a>
            )}
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-lg text-[13px] font-semibold text-white uppercase tracking-wider transition-opacity disabled:opacity-60 active:translate-y-px"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)' }}
          >
            {loading ? 'Cargando…' : tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: '#d4dded' }} />
          <span className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>o bien</span>
          <div className="flex-1 h-px" style={{ background: '#d4dded' }} />
        </div>

        <button
          onClick={handleGuest}
          className="w-full py-2.5 rounded-lg text-[13px] font-medium uppercase tracking-wide transition-all"
          style={{ border: '1px dashed #bec9de', color: '#475569', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderStyle = 'solid'; e.currentTarget.style.borderColor = '#0ea5e9' }}
          onMouseLeave={e => { e.currentTarget.style.borderStyle = 'dashed'; e.currentTarget.style.borderColor = '#bec9de' }}
        >
          Continuar como invitado
        </button>

        <div className="mt-5 text-[10px] leading-relaxed" style={{ color: '#6b7fa3' }}>
          <span className="font-mono font-medium">PROTOTIPO</span><br />
          Las credenciales se guardan localmente en este navegador. No envíes datos reales.
        </div>
      </motion.div>
    </div>
  )
}
