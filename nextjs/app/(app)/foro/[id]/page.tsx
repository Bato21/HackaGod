'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, type ForumThread, type ForumReply } from '@/lib/supabase'
import { MOCK_THREAD, MOCK_REPLIES } from '@/lib/mock-data'

const USE_MOCK = true // set false to fetch from Supabase

const ALERT_COLOR: Record<string, string> = {
  watch:  'var(--gold)',
  alert:  'var(--warn)',
  urgent: 'var(--bad)',
}

export default function ThreadPage() {
  const { id }    = useParams<{ id: string }>()
  const router    = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [thread,  setThread]  = useState<ForumThread | null>(null)
  const [replies, setReplies] = useState<ForumReply[]>([])
  const [draft,   setDraft]   = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    if (USE_MOCK) { setThread(MOCK_THREAD); setReplies(MOCK_REPLIES); setLoading(false); return }
    Promise.all([
      supabase.from('forum_threads').select('*').eq('id', id).single(),
      supabase.from('forum_replies').select('*').eq('thread_id', id).order('created_at', { ascending: true }),
    ]).then(([{ data: t }, { data: r }]) => { setThread(t as ForumThread|null); setReplies((r??[]) as ForumReply[]); setLoading(false) })

    const sub = supabase.channel(`thread-${id}`)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'forum_replies', filter:`thread_id=eq.${id}` }, p => {
        setReplies(prev => [...prev, p.new as ForumReply])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 100)
      }).subscribe()
    return () => { sub.unsubscribe() }
  }, [id])

  async function sendReply() {
    if (!draft.trim() || !id) return
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('forum_replies').insert({ thread_id:id, body:draft.trim(), created_by: user?.user_metadata?.name??user?.email??'Anónimo' })
    setDraft(''); setSending(false)
  }

  const alertColor = thread ? (ALERT_COLOR[thread.alert_level] ?? 'var(--accent)') : 'var(--accent)'

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.3 }}
      style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', background:'var(--bg)' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'0 24px', borderBottom:'1px solid var(--line-2)', flexShrink:0, background:'var(--bg-2)', position:'relative', minHeight: 72 }}>
        {/* Gradient top edge */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg, var(--accent), rgba(56,189,248,.1))', pointerEvents:'none' }} />

        <button onClick={() => router.back()}
          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', fontSize:18, lineHeight:1, paddingTop:20, transition:'color .15s', flexShrink:0 }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
        >←</button>

        <div style={{ flex:1, padding:'14px 0 16px' }}>
          {thread && (
            <div style={{ fontFamily:'var(--mono)', fontSize:8, letterSpacing:'.12em', textTransform:'uppercase', color:alertColor, marginBottom:10, opacity:.85 }}>
              {thread.country_id ? `${thread.alert_level}` : thread.alert_level}
            </div>
          )}
          <h1 style={{ fontFamily:'var(--serif)', fontSize:22, fontWeight:700, lineHeight:1.25, color:'var(--text)', margin:'0 0 10px' }}>
            {loading ? '…' : thread?.title ?? 'No encontrado'}
          </h1>
          {thread && (
            <div style={{ display:'flex', gap:14, fontFamily:'var(--mono)', fontSize:8.5, color:'var(--text-4)' }}>
              <span>{thread.reply_count} respuestas</span>
              <span>{new Date(thread.created_at).toLocaleDateString('es')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 30px' }}>
        {loading ? (
          Array.from({length:3}).map((_,i) => (
            <div key={i} style={{ height:90, margin:'14px 0', background:'var(--bg-2)', backgroundImage:'linear-gradient(90deg,transparent 25%,var(--bg-3) 50%,transparent 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }}/>
          ))
        ) : replies.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:10 }}>
            <span style={{ fontSize:28 }}>💬</span>
            <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--text-3)', letterSpacing:'.1em', textTransform:'uppercase' }}>Sé el primero en responder</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {replies.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i < 5 ? i*.04 : 0, duration:.25 }}
                style={{
                  display:'grid', gridTemplateColumns:'36px 1fr', gap:12,
                  padding:'18px 0', borderBottom:'1px solid var(--line)',
                  ...(r.is_analyst ? {
                    borderLeft:'2px solid rgba(56,189,248,.3)',
                    paddingLeft:12, marginLeft:-12,
                    background:'rgba(56,189,248,.03)',
                  } : {}),
                }}>
                <div style={{
                  width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--serif)', fontSize:14, fontWeight:700, flexShrink:0, marginTop:2,
                  background: r.is_analyst ? 'rgba(56,189,248,.1)' : 'var(--bg-4)',
                  color: r.is_analyst ? 'var(--accent)' : 'var(--text-2)',
                  border: `1px solid ${r.is_analyst ? 'rgba(56,189,248,.3)' : 'var(--line-2)'}`,
                  boxShadow: r.is_analyst ? '0 0 12px rgba(56,189,248,.15)' : 'none',
                  animation: r.is_analyst ? 'pulse 2s ease-in-out infinite' : 'none',
                }}>
                  {r.created_by[0]?.toUpperCase() ?? 'A'}
                </div>
                <div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:7, marginBottom:6 }}>
                    <span style={{ fontFamily:'var(--sans)', fontSize:13, fontWeight:500, color:'var(--text)' }}>{r.created_by}</span>
                    {r.is_analyst && (
                      <span style={{ fontFamily:'var(--mono)', fontSize:7.5, padding:'1px 6px', background:'rgba(56,189,248,.1)', color:'var(--accent)', border:'1px solid rgba(56,189,248,.2)', textTransform:'uppercase', letterSpacing:'.1em' }}>
                        análisis automatizado
                      </span>
                    )}
                    <span style={{ fontFamily:'var(--mono)', fontSize:8.5, color:'var(--text-4)', marginLeft:'auto' }}>
                      {new Date(r.created_at).toLocaleString('es')}
                    </span>
                  </div>
                  <p style={{ fontFamily:'var(--sans)', fontSize:13.5, lineHeight:1.65, color:'var(--text-2)', margin:0 }}>{r.body}</p>
                  <div style={{ display:'flex', gap:12, marginTop:8 }}>
                    {['▲ ' + r.upvotes, 'Responder', 'Citar'].map(label => (
                      <button key={label}
                        style={{ fontFamily:'var(--mono)', fontSize:8.5, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--text-4)', background:'none', border:'none', cursor:'pointer', transition:'color .15s', padding:0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-4)')}
                      >{label}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div style={{ display:'flex', gap:10, padding:'14px 30px', borderTop:'1px solid var(--line-2)', flexShrink:0, background:'var(--bg-2)' }}>
        <textarea value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key==='Enter' && (e.metaKey||e.ctrlKey)) sendReply() }}
          placeholder="Añade tu análisis o hallazgo… (⌘+Enter para enviar)"
          rows={2}
          style={{ flex:1, background:'var(--bg-3)', border:'1px solid var(--line-2)', color:'var(--text)', fontFamily:'var(--sans)', fontSize:13, padding:'9px 13px', resize:'none', outline:'none', height:54, transition:'border-color .18s, box-shadow .18s' }}
          onFocus={e  => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56,189,248,.08)' }}
          onBlur={e   => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
        />
        <button onClick={sendReply} disabled={sending || !draft.trim()}
          style={{
            width:80, alignSelf:'flex-end', height:54,
            background:'var(--accent)', color:'#020c18', border:'none',
            cursor: sending||!draft.trim() ? 'not-allowed' : 'pointer',
            opacity: sending||!draft.trim() ? .4 : 1,
            fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.15em', textTransform:'uppercase',
            fontWeight:500, transition:'opacity .15s, background .15s',
          }}
          onMouseEnter={e => { if (!sending && draft.trim()) e.currentTarget.style.background = '#0ea5e9' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
        >
          Publicar →
        </button>
      </div>
    </motion.div>
  )
}
