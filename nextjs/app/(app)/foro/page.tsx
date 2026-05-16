'use client'
import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, type ForumThread, type ForumReply } from '@/lib/supabase'
import { MOCK_COUNTRIES, MOCK_THREADS, MOCK_THREAD, MOCK_REPLIES } from '@/lib/mock-data'
import NewThreadModal from '@/components/forum/NewThreadModal'
import FilterSidebar, { EMPTY_FILTERS, type ForumFilters } from '@/components/forum/FilterSidebar'

const USE_MOCK = true

type Tab = 'todos' | 'pais' | 'gobierno' | 'tema'

// Map country_id → {name, flag}
const COUNTRY_MAP = Object.fromEntries(MOCK_COUNTRIES.map(c => [c.iso3, c]))

// Derive visual category from alert_level for mock data
function threadCat(t: ForumThread): Tab {
  if (t.alert_level === 'urgent') return 'gobierno'
  if (t.alert_level === 'alert')  return 'pais'
  return 'tema'
}

const CAT_META: Record<Tab, { label: string; color: string }> = {
  todos:    { label: 'Todos',    color: 'var(--text-3)' },
  pais:     { label: 'País',     color: '#06b6d4'       },
  gobierno: { label: 'Gobierno', color: '#a855f7'       },
  tema:     { label: 'Tema',     color: '#f59e0b'       },
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m    = Math.floor(diff / 60000)
  if (m < 1)   return 'ahora mismo'
  if (m < 60)  return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24)  return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}

function Avatar({ name, size = 32, analyst = false }: { name: string; size?: number; analyst?: boolean }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: analyst
        ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
        : 'linear-gradient(135deg, #334155, #475569)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--mono)', fontSize: size * 0.35, color: '#fff', fontWeight: 700,
      border: analyst ? '2px solid rgba(6,182,212,0.4)' : 'none',
    }}>
      {initials}
    </div>
  )
}

function MessageCard({ reply, currentUser }: { reply: ForumReply; currentUser?: string }) {
  const isMe    = reply.created_by === currentUser
  const [liked, setLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--line)',
        transition: 'background .1s',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(16,30,52,0.5)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Avatar name={reply.created_by} size={30} analyst={reply.is_analyst} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>
              {reply.created_by}
            </span>
            {reply.is_analyst && (
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.12em',
                color: '#06b6d4', background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                padding: '1px 5px', borderRadius: 3,
              }}>INSIGHT ENGINE</span>
            )}
            {isMe && (
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.12em',
                color: '#06b6d4', background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.3)',
                padding: '1px 5px', borderRadius: 3,
              }}>TÚ</span>
            )}
          </div>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--text-4)' }}>
          {relTime(reply.created_at)}
        </span>
      </div>

      {/* Body */}
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-2)',
        lineHeight: 1.6, paddingLeft: 38,
      }}>
        {reply.body}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, paddingLeft: 38 }}>
        <button
          onClick={() => setLiked(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: 9, color: liked ? '#f43f5e' : 'var(--text-4)',
            padding: 0, transition: 'color .15s',
          }}
        >
          {liked ? '♥' : '♡'} {reply.upvotes + (liked ? 1 : 0)}
        </button>
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-4)',
            padding: 0, transition: 'color .15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-4)'}
        >
          Responder
        </button>
        {reply.is_analyst && (
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-4)',
            background: 'var(--bg-3)', padding: '2px 7px', borderRadius: 3,
          }}>
            fuente: AletheiaPath
          </span>
        )}
      </div>
    </motion.div>
  )
}

function ThreadView({ thread, replies, loading, onSend }: {
  thread: ForumThread
  replies: ForumReply[]
  loading: boolean
  onSend: (body: string) => void
}) {
  const [msg, setMsg] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const country = thread.country_id ? COUNTRY_MAP[thread.country_id] : null

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [replies.length])

  function send() {
    if (!msg.trim()) return
    onSend(msg.trim())
    setMsg('')
  }

  const cat = threadCat(thread)
  const { color } = CAT_META[cat]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Thread header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--line-2)',
        flexShrink: 0, background: 'var(--bg-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 7.5, letterSpacing: '0.1em', textTransform: 'uppercase',
            color, border: `1px solid ${color}50`, padding: '2px 7px', borderRadius: 3,
            background: `${color}10`,
          }}>
            {CAT_META[cat].label}
          </span>
          {country && <span style={{ fontSize: 14 }}>{country.flag}</span>}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--text-3)' }}>
            {country?.name} · 2024
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--text-3)' }}>
            {replies.length} mensajes
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 900,
          color: 'var(--text)', lineHeight: 1.25, margin: 0,
        }}>
          {thread.title}
        </h2>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 80, background: 'var(--bg-3)', backgroundImage: 'linear-gradient(90deg,transparent 25%,var(--bg-4) 50%,transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 6 }} />
            ))}
          </div>
        ) : replies.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
            <span style={{ fontSize: 32 }}>💬</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>
              SIN MENSAJES — SÉ EL PRIMERO
            </span>
          </div>
        ) : (
          <>
            {replies.map(r => <MessageCard key={r.id} reply={r} />)}
          </>
        )}
        <div ref={endRef} />
      </div>

      {/* Composer — always visible */}
      <div style={{
        flexShrink: 0, borderTop: '1px solid var(--line-2)',
        background: 'var(--bg-2)', padding: '12px 16px',
      }}>
        <div style={{
          background: 'var(--bg-3)', border: '1px solid var(--line-2)',
          borderRadius: 10, overflow: 'hidden',
          transition: 'border-color .15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px' }}>
            <Avatar name="U" size={24} />
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
              placeholder={`Añade un comentario en ${country?.name ?? 'este hilo'}…`}
              rows={3}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)',
                resize: 'none', lineHeight: 1.5,
              }}
            />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 12px', borderTop: '1px solid var(--line)',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-4)', letterSpacing: '0.06em' }}>
              Como invitado · ⌘+Enter para publicar
            </span>
            <button
              onClick={send}
              disabled={!msg.trim()}
              style={{
                padding: '6px 16px',
                background: msg.trim() ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : 'rgba(148,163,184,0.1)',
                border: 'none', borderRadius: 6, cursor: msg.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em',
                color: msg.trim() ? '#fff' : 'var(--text-4)',
                transition: 'all .15s',
              }}
            >
              Comentar →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyThreadState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 12, color: 'var(--text-3)',
      background: 'var(--bg)',
    }}>
      <div style={{ fontSize: 40, opacity: 0.3 }}>💬</div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>
        Selecciona un hilo para ver la conversación
      </span>
    </div>
  )
}

function ForoInner() {
  const router       = useRouter()
  const params       = useSearchParams()
  const countryParam = params.get('country')

  const [threads,     setThreads]    = useState<ForumThread[]>([])
  const [replies,     setReplies]    = useState<ForumReply[]>([])
  const [activeId,    setActiveId]   = useState<string | null>(null)
  const [tab,         setTab]        = useState<Tab>('todos')
  const [search,      setSearch]     = useState('')
  const [loading,     setLoading]    = useState(true)
  const [replLoading, setReplLoading] = useState(false)
  const [newModal,    setNewModal]   = useState(false)
  const [filterOpen,  setFilterOpen] = useState(false)
  const [filters,     setFilters]    = useState<ForumFilters>(EMPTY_FILTERS)

  // Load threads
  useEffect(() => {
    setLoading(true)
    if (USE_MOCK) {
      let t = MOCK_THREADS
      if (countryParam) t = t.filter(x => x.country_id === countryParam)
      setThreads(t)
      setLoading(false)
      return
    }
    supabase.from('forum_threads').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => { setThreads((data ?? []) as ForumThread[]); setLoading(false) })
  }, [countryParam])

  // Load replies when thread selected
  useEffect(() => {
    if (!activeId) { setReplies([]); return }
    setReplLoading(true)
    if (USE_MOCK && activeId === 'th2') {
      setReplies(MOCK_REPLIES); setReplLoading(false); return
    }
    supabase.from('forum_replies').select('*').eq('thread_id', activeId).order('created_at')
      .then(({ data }) => { setReplies((data ?? []) as ForumReply[]); setReplLoading(false) })

    // Realtime subscription
    const sub = supabase.channel(`forum:${activeId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_replies', filter: `thread_id=eq.${activeId}` },
        payload => {
          setReplies(prev => [...prev, payload.new as ForumReply])
        })
      .subscribe()
    return () => { supabase.removeChannel(sub) }
  }, [activeId])

  const activeThread = threads.find(t => t.id === activeId)

  // Filter threads by tab + search
  const visibleThreads = threads.filter(t => {
    if (tab !== 'todos' && threadCat(t) !== tab) return false
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.countries.length && !filters.countries.includes(t.country_id ?? '')) return false
    return true
  })

  async function handleSend(body: string) {
    if (!activeId) return
    const mock: ForumReply = {
      id:         `r_${Date.now()}`,
      thread_id:  activeId,
      created_by: 'Invitado',
      is_analyst: false,
      upvotes:    0,
      created_at: new Date().toISOString(),
      body,
    }
    setReplies(prev => [...prev, mock])
    if (!USE_MOCK) {
      await supabase.from('forum_replies').insert({ thread_id: activeId, body, created_by: 'Invitado', is_analyst: false, upvotes: 0 })
    }
  }

  const activeCount =
    filters.regions.length + filters.countries.length +
    filters.categories.length + filters.years.length + filters.estados.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Forum top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 52,
        borderBottom: '1px solid var(--line-2)', flexShrink: 0,
        background: 'var(--bg-2)', position: 'relative',
      }}>
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,var(--accent),transparent 60%)', opacity: 0.4, pointerEvents: 'none' }} />

        {/* Thread count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--good)', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--text-3)', letterSpacing: '0.1em' }}>
            {threads.length} HILOS ACTIVOS
          </span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', fontSize: 12 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar hilos, país, presidente…"
            style={{
              width: '100%', padding: '7px 10px 7px 30px',
              background: 'rgba(56,189,248,.04)', border: '1px solid var(--line-2)',
              color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11,
              outline: 'none', borderRadius: 6, boxSizing: 'border-box',
              transition: 'border-color .15s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--line-2)'}
          />
        </div>

        {/* Right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              padding: '6px 12px', background: 'transparent',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; e.currentTarget.style.color = 'var(--text-3)' }}
          >
            ⊞ Filtrar
            {activeCount > 0 && (
              <span style={{ background: '#06b6d4', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700 }}>
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setNewModal(true)}
            style={{
              padding: '6px 14px',
              background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fff', whiteSpace: 'nowrap',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            + Nuevo hilo
          </button>

          <button
            onClick={() => router.push('/atlas')}
            style={{
              padding: '6px 12px', background: 'transparent',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.08em',
              color: 'var(--text-3)', transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; e.currentTarget.style.color = 'var(--text-3)' }}
          >
            × Volver
          </button>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        borderBottom: '1px solid var(--line-2)',
        flexShrink: 0, background: 'var(--bg-2)',
        padding: '0 16px',
      }}>
        {(['todos','pais','gobierno','tema'] as Tab[]).map(t => {
          const active = tab === t
          const meta   = CAT_META[t]
          const count  = t === 'todos' ? threads.length : threads.filter(x => threadCat(x) === t).length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 14px', background: 'transparent',
                border: 'none', borderBottom: `2px solid ${active ? (meta.color ?? 'var(--accent)') : 'transparent'}`,
                cursor: 'pointer', transition: 'border-color .15s, color .15s',
                fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: active ? (meta.color ?? 'var(--text)') : 'var(--text-3)',
                whiteSpace: 'nowrap',
              }}
            >
              {meta.label} {count}
            </button>
          )
        })}

        {/* Active country filter chip */}
        {countryParam && (
          <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: '0.1em',
              color: 'var(--accent)', background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.3)',
              padding: '2px 8px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {COUNTRY_MAP[countryParam]?.flag} {COUNTRY_MAP[countryParam]?.name}
              <button
                onClick={() => router.push('/foro')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, padding: 0, lineHeight: 1 }}
              >×</button>
            </span>
          </div>
        )}
      </div>

      {/* ── Main 2-col layout ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Thread list */}
        <div style={{
          width: 340, flexShrink: 0,
          background: 'var(--bg-2)', borderRight: '1px solid var(--line-2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ height: 70, background: 'var(--bg-3)', backgroundImage: 'linear-gradient(90deg,transparent 25%,var(--bg-4) 50%,transparent 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 4 }} />
                ))}
              </div>
            ) : visibleThreads.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
                <span style={{ fontSize: 28 }}>🔍</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sin resultados</span>
              </div>
            ) : (
              <motion.div
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
                initial="hidden" animate="show"
              >
                {visibleThreads.map(t => {
                  const active    = t.id === activeId
                  const cat       = threadCat(t)
                  const { color } = CAT_META[cat]
                  const country   = t.country_id ? COUNTRY_MAP[t.country_id] : null
                  return (
                    <motion.div
                      key={t.id}
                      variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0, transition: { duration: 0.2 } } }}
                      onClick={() => setActiveId(active ? null : t.id)}
                      style={{
                        padding: '12px 14px', cursor: 'pointer',
                        borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                        background: active ? 'rgba(56,189,248,0.04)' : 'transparent',
                        borderBottom: '1px solid var(--line)',
                        transition: 'background .12s, border-left-color .12s',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-3)' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase',
                          color, border: `1px solid ${color}40`, padding: '1px 5px', borderRadius: 3,
                          background: `${color}0d`, flexShrink: 0,
                        }}>
                          {CAT_META[cat].label}
                        </span>
                        {country && <span style={{ fontSize: 11 }}>{country.flag}</span>}
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-4)' }}>
                          {country?.name} · 2024
                        </span>
                      </div>
                      <p style={{
                        fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
                        color: active ? 'var(--text)' : 'var(--text-2)',
                        lineHeight: 1.4, margin: '0 0 6px',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {t.pinned && '📌 '}{t.title}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--mono)', fontSize: 7.5, color: 'var(--text-4)' }}>
                        <span>💬 {t.reply_count}</span>
                        <span>{relTime(t.created_at)}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Thread detail */}
        <div style={{ flex: 1, overflow: 'hidden', background: 'var(--bg)' }}>
          <AnimatePresence mode="wait">
            {activeThread ? (
              <motion.div
                key={activeThread.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ height: '100%' }}
              >
                <ThreadView
                  thread={activeThread}
                  replies={replies}
                  loading={replLoading}
                  onSend={handleSend}
                />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100%' }}>
                <EmptyThreadState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {newModal && (
          <NewThreadModal
            open={newModal}
            onClose={() => setNewModal(false)}
            defaultCountry={countryParam ?? ''}
          />
        )}
      </AnimatePresence>

      <FilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onApply={() => {}}
      />
    </div>
  )
}

export default function ForoPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: 10 }}>Cargando foro…</div>}>
      <ForoInner />
    </Suspense>
  )
}
