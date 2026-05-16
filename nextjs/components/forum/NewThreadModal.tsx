'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { MOCK_COUNTRIES } from '@/lib/mock-data'

type Category = 'pais' | 'gobierno' | 'tema'

const CAT_META: Record<Category, { label: string; desc: string; color: string }> = {
  pais:     { label: 'País',     desc: 'Conversación general del país',         color: '#06b6d4' },
  gobierno: { label: 'Gobierno', desc: 'Análisis de un período o gobierno',     color: '#a855f7' },
  tema:     { label: 'Tema',     desc: 'Caso, noticia o análisis específico',   color: '#f59e0b' },
}

type Props = {
  open:         boolean
  onClose:      () => void
  defaultCountry?: string
}

export default function NewThreadModal({ open, onClose, defaultCountry }: Props) {
  const router = useRouter()
  const [country,  setCountry]  = useState(defaultCountry ?? '')
  const [category, setCategory] = useState<Category | null>(null)
  const [title,    setTitle]    = useState('')
  const [body,     setBody]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const canSubmit = country && category && title.trim().length > 0 && !loading

  async function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase.from('forum_threads').insert({
        country_iso3:   country,
        category:       category,
        title:          title.trim(),
        body:           body.trim() || null,
        alert_level:    'watch',
        reply_count:    0,
        pinned:         false,
      }).select('id').single()

      if (err) throw err
      onClose()
      router.push(`/foro/${data.id}`)
    } catch {
      setError('No se pudo crear el hilo. Inicia sesión para publicar.')
      setLoading(false)
    }
  }

  const countries = MOCK_COUNTRIES.slice().sort((a, b) => a.name.localeCompare(b.name, 'es'))

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0   }}
        exit={{   opacity: 0, scale: 0.95, y: 20  }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: '#fff', borderRadius: 16,
          width: '100%', maxWidth: 640, padding: 32,
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          color: '#0f172a', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 900, color: '#0f172a' }}>
            Nuevo hilo
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 22, padding: 4 }}
          >×</button>
        </div>

        {/* PAÍS */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            PAÍS
          </label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#f8fafc',
              fontFamily: 'var(--sans)', fontSize: 13, color: '#0f172a',
              outline: 'none', cursor: 'pointer',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
            onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <option value="">Selecciona un país…</option>
            {countries.map(c => (
              <option key={c.iso3} value={c.iso3}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>

        {/* CATEGORÍA */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>
            CATEGORÍA
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {(Object.entries(CAT_META) as [Category, typeof CAT_META[Category]][]).map(([id, meta]) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                style={{
                  padding: '12px 10px',
                  border: `2px solid ${category === id ? meta.color : '#e2e8f0'}`,
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  background: category === id ? `${meta.color}10` : '#f8fafc',
                  transition: 'all .15s',
                }}
              >
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: category === id ? meta.color : '#475569', marginBottom: 4 }}>
                  {meta.label}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: '#94a3b8', lineHeight: 1.4 }}>
                  {meta.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* TÍTULO */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>
              TÍTULO
            </label>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: title.length > 120 ? '#ef4444' : '#94a3b8' }}>
              {title.length}/140
            </span>
          </div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value.slice(0, 140))}
            placeholder="¿Qué quieres discutir?"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#f8fafc',
              fontFamily: 'var(--sans)', fontSize: 13, color: '#0f172a',
              outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
            onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* PRIMER MENSAJE */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            PRIMER MENSAJE (opcional)
          </label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Abre la conversación con tu perspectiva…"
            rows={4}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #e2e8f0', background: '#f8fafc',
              fontFamily: 'var(--sans)', fontSize: 13, color: '#0f172a',
              outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#06b6d4'}
            onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
          />
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, fontFamily: 'var(--sans)', fontSize: 11, color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 20px', background: 'transparent',
              border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em', color: '#64748b',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              padding: '9px 22px',
              background: canSubmit ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : '#e2e8f0',
              border: 'none', borderRadius: 8, cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em',
              color: canSubmit ? '#fff' : '#94a3b8',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Publicando…' : 'Publicar hilo →'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
