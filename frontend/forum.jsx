// forum.jsx — Foro Aletheia · rediseño UX
// Layout: topbar + scope-tabs + 2 columnas (lista | detalle)
// Filtros en drawer lateral. Nuevo hilo en modal centrado.

// ── Filter Drawer ────────────────────────────────────────────────────
function FvFilterDrawer({ filter, setFilter, onClose }) {
  const update = (patch) => setFilter(f => ({ ...f, ...patch }));
  const countries = window.COUNTRIES.slice().sort((a, b) => a.name.localeCompare(b.name));
  const visible = filter.region ? countries.filter(c => c.region === filter.region) : countries;
  const hasActive = !!(filter.region || filter.iso3 || filter.year);

  return (
    <>
      <div className="fv-drawer-backdrop" onClick={onClose} />
      <div className="fv-drawer">
        <div className="fv-drawer-head">
          <span className="fv-drawer-title">Filtros</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {hasActive && (
              <button className="fv-drawer-clear" onClick={() =>
                setFilter(f => ({ ...f, region:null, iso3:null, year:null }))
              }>Limpiar todo</button>
            )}
            <button className="fv-drawer-x" onClick={onClose}>
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 2 L10 10 M10 2 L2 10" />
              </svg>
            </button>
          </div>
        </div>

        <div className="fv-drawer-body">
          {/* Región */}
          <div className="fvd-sec">
            <div className="fvd-sec-h">
              <span>Región</span>
              {filter.region && <button className="fvd-clear-lnk" onClick={() => update({ region:null, iso3:null })}>ver todas</button>}
            </div>
            {["Norteamérica","Centroamérica","Caribe","Sudamérica"].map(r => (
              <button key={r}
                className={`fvd-region-btn${filter.region === r ? " active" : ""}`}
                onClick={() => update({ region: filter.region===r ? null : r, iso3:null })}
              >{r}</button>
            ))}
          </div>

          {/* País */}
          <div className="fvd-sec">
            <div className="fvd-sec-h">
              <span>País</span>
              {filter.iso3 && <button className="fvd-clear-lnk" onClick={() => update({ iso3:null })}>ver todos</button>}
            </div>
            <div className="fvd-country-list">
              {visible.map(c => (
                <div key={c.iso3}
                  className={`fvd-country-row${filter.iso3===c.iso3 ? " active" : ""}`}
                  onClick={() => update({ iso3: filter.iso3===c.iso3 ? null : c.iso3 })}
                >
                  <span>{c.name}</span>
                  <span className="fvd-iso">{c.iso3}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Año */}
          <div className="fvd-sec">
            <div className="fvd-sec-h">
              <span>Año</span>
              {filter.year && <button className="fvd-clear-lnk" onClick={() => update({ year:null })}>ver todos</button>}
            </div>
            <div className="fvd-year-grid">
              {window.YEARS.map(y => (
                <button key={y}
                  className={`fvd-year-btn${filter.year===y ? " active" : ""}`}
                  onClick={() => update({ year: filter.year===y ? null : y })}
                >{y}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── New Thread Modal ─────────────────────────────────────────────────
function FvNewThreadModal({ user, onClose, onCreated }) {
  const [iso3, setIso3]       = React.useState("");
  const [scope, setScope]     = React.useState("tema");
  const [title, setTitle]     = React.useState("");
  const [firstMsg, setFirstMsg] = React.useState("");
  const [error, setError]     = React.useState("");

  const countries = window.COUNTRIES.slice().sort((a,b) => a.name.localeCompare(b.name));

  const SCOPES = [
    { v:"país",     l:"País",     d:"Conversación general del país" },
    { v:"gobierno", l:"Gobierno", d:"Análisis de un período o gobierno" },
    { v:"tema",     l:"Tema",     d:"Caso, noticia o análisis específico" },
  ];

  const handleCreate = () => {
    if (!iso3)          return setError("Selecciona un país.");
    if (!title.trim())  return setError("Escribe un título para el hilo.");
    const country = window.COUNTRIES.find(c => c.iso3 === iso3);
    const thread = window.ForumAPI.createThread({
      iso3, country: country.name, region: country.region, scope,
      title: title.trim(),
      subtitle: `Hilo creado por ${user?.name || "usuario"} · ${country.name}`,
    });
    if (thread && firstMsg.trim()) window.ForumAPI.addPost(thread.id, user, firstMsg.trim());
    onCreated(thread?.id || null);
    onClose();
  };

  return (
    <>
      <div className="fv-modal-backdrop" onClick={onClose} />
      <div className="fv-modal" role="dialog" aria-modal="true">
        <div className="fv-modal-head">
          <div className="fv-modal-title">Nuevo hilo</div>
          <button className="fv-modal-x" onClick={onClose}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 2 L10 10 M10 2 L2 10" />
            </svg>
          </button>
        </div>
        <div className="fv-modal-body">
          <div className="fv-mf">
            <label htmlFor="nt-country">País</label>
            <select id="nt-country" className={`fv-mf-select${!iso3&&error?" err":""}`}
              value={iso3} onChange={e => { setIso3(e.target.value); setError(""); }}>
              <option value="">Selecciona un país…</option>
              {countries.map(c => <option key={c.iso3} value={c.iso3}>{c.name}</option>)}
            </select>
          </div>
          <div className="fv-mf">
            <label>Categoría</label>
            <div className="fv-mf-scope-grid">
              {SCOPES.map(s => (
                <button key={s.v}
                  className={`fv-mf-scope-btn${scope===s.v ? " active" : ""}`}
                  onClick={() => setScope(s.v)}
                >
                  <span className="fv-mf-scope-name">{s.l}</span>
                  <span className="fv-mf-scope-desc">{s.d}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="fv-mf">
            <label htmlFor="nt-title">Título</label>
            <input id="nt-title" type="text"
              className={`fv-mf-input${!title.trim()&&error?" err":""}`}
              placeholder="¿Qué quieres discutir?"
              value={title}
              onChange={e => { setTitle(e.target.value.slice(0,140)); setError(""); }}
            />
            <span className="fv-mf-char">{title.length}/140</span>
          </div>
          <div className="fv-mf">
            <label htmlFor="nt-msg">Primer mensaje <span className="fv-mf-opt">(opcional)</span></label>
            <textarea id="nt-msg" rows={3}
              className="fv-mf-textarea"
              placeholder="Abre la conversación con tu perspectiva…"
              value={firstMsg}
              onChange={e => setFirstMsg(e.target.value)}
            />
          </div>
          {error && (
            <div className="fv-modal-error">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="7" cy="7" r="6"/><path d="M7 4 L7 8"/>
              </svg>
              {error}
            </div>
          )}
        </div>
        <div className="fv-modal-foot">
          <button className="fv-modal-cancel" onClick={onClose}>Cancelar</button>
          <button className="fv-modal-submit" onClick={handleCreate}>
            Publicar hilo
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7 L12 7 M8 3 L12 7 L8 11" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Reply Modal ──────────────────────────────────────────────────────
// Abre un hilo nuevo citando el post original
function FvReplyModal({ post, thread, user, onClose, onCreated }) {
  const country = window.COUNTRIES.find(c => c.iso3 === thread.iso3);
  const snippet = post.text.length > 120 ? post.text.slice(0, 118) + "…" : post.text;
  const [msg, setMsg] = React.useState("");
  const [error, setError] = React.useState("");
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 80);
  }, []);

  const handleCreate = () => {
    if (!msg.trim()) return setError("Escribe algo antes de publicar.");
    const title = `↩ ${post.user}: "${post.text.slice(0, 60)}${post.text.length > 60 ? "…" : ""}"`;
    const newThread = window.ForumAPI.createThread({
      iso3: thread.iso3,
      country: thread.country,
      region: thread.region,
      scope: "tema",
      subtype: "reply",
      title,
      subtitle: `Respuesta a ${post.user} · ${thread.country}`,
      year: thread.year ?? null,
    });
    if (newThread) {
      // Primer post: cita del original
      const quote = `"${snippet}"\n— ${post.user}\n\n${msg.trim()}`;
      window.ForumAPI.addPost(newThread.id, user, quote);
    }
    onCreated(newThread?.id || null);
    onClose();
  };

  const onKeyDown = e => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleCreate(); }
  };

  return (
    <>
      <div className="fv-modal-backdrop" onClick={onClose} />
      <div className="fv-modal fv-reply-modal" role="dialog" aria-modal="true">
        <div className="fv-modal-head">
          <div>
            <div className="fv-modal-title">Responder a {post.user}</div>
            <div className="fv-reply-sub">Esto creará un nuevo hilo en <strong>{thread.country}</strong></div>
          </div>
          <button className="fv-modal-x" onClick={onClose}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 2 L10 10 M10 2 L2 10" />
            </svg>
          </button>
        </div>

        <div className="fv-modal-body">
          {/* Cita del post original */}
          <div className="fv-reply-quote">
            <div className="fv-reply-quote-meta">
              <div className="fv-reply-quote-av" style={{ background: post.accent || "#facc15" }}>
                {post.user.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()}
              </div>
              <span className="fv-reply-quote-name">{post.user}</span>
              <span className="fv-reply-quote-handle">{post.handle}</span>
            </div>
            <div className="fv-reply-quote-text">"{snippet}"</div>
          </div>

          <div className="fv-mf">
            <label>Tu respuesta</label>
            <textarea
              ref={textareaRef}
              rows={4}
              className="fv-mf-textarea"
              placeholder={`Escribe tu respuesta a ${post.user}…`}
              value={msg}
              onChange={e => { setMsg(e.target.value); setError(""); }}
              onKeyDown={onKeyDown}
            />
            <span className="fv-mf-char fv-reply-hint">⌘+Enter para publicar</span>
          </div>

          {error && (
            <div className="fv-modal-error">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="7" cy="7" r="6"/><path d="M7 4 L7 8"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        <div className="fv-modal-foot">
          <button className="fv-modal-cancel" onClick={onClose}>Cancelar</button>
          <button className="fv-modal-submit" onClick={handleCreate}>
            Abrir hilo
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7 L12 7 M8 3 L12 7 L8 11" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Thread Card ──────────────────────────────────────────────────────
function FvThreadCard({ thread, selected, onSelect }) {
  const clr = { "país":"var(--accent)", "gobierno":"var(--accent-2)", "tema":"#f97316" }[thread.scope] || "var(--text-3)";
  const lbl = { "país":"País", "gobierno":"Gobierno", "tema":"Tema" }[thread.scope] || thread.scope;
  return (
    <div
      className={`fv-card${selected ? " selected" : ""}${thread.subtype === "reply" ? " is-reply" : ""}`}
      onClick={() => onSelect(thread.id)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key==="Enter" && onSelect(thread.id)}
    >
      <div className="fv-card-bar" style={{ background: clr }} />
      <div className="fv-card-body">
        <div className="fv-card-top">
          <span className="fv-card-scope" style={{ color:clr, borderColor: clr+"44" }}>{lbl}</span>
          <span className="fv-card-country">{thread.country}</span>
          {thread.year != null && <span className="fv-card-year">· {thread.year}</span>}
        </div>
        <div className="fv-card-title">{thread.title}</div>
        <div className="fv-card-foot">
          <span className="fv-card-replies">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 7.5 a1 1 0 0 1 -1 1 H3 L1 11 V3.5 a1 1 0 0 1 1-1 h8.5 a1 1 0 0 1 1 1Z" />
            </svg>
            {thread.replyCount}
          </span>
          <span className="fv-card-time">{window.formatRelativeTime(thread.lastTs)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Post (with inline reply + nested children) ───────────────────────
function FvPost({ post, user, likedMap, onLike, onSubmitReply, onGuestClick, depth, replies }) {
  const [showReplyBox, setShowReplyBox] = React.useState(false);
  const [replyText, setReplyText]       = React.useState("");
  const [collapsed, setCollapsed]       = React.useState(false);
  const textareaRef = React.useRef(null);

  const initials = n => n.split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const isLiked = !!(likedMap && likedMap[post.id]);
  const isYou = post.kind !== "bot" && post.user === user?.name;
  const cls   = post.kind==="bot" ? "is-bot" : post.kind==="guest" ? "is-guest" : "is-user";
  const d     = Math.min(depth || 0, 3);

  React.useEffect(() => {
    if (showReplyBox && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }, [showReplyBox]);

  const handleReplySubmit = () => {
    const t = replyText.trim();
    if (!t) return;
    onSubmitReply(post.id, t);
    setReplyText("");
    setShowReplyBox(false);
  };

  const onKeyDown = e => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleReplySubmit(); }
    if (e.key === "Escape") { setShowReplyBox(false); setReplyText(""); }
  };

  return (
    <div className={`fv-post-wrap depth-${d}`}>
      {/* Thread connector line */}
      {d > 0 && <div className="fv-thread-line" />}

      <div className={`fv-post ${cls}`}>
        {/* Avatar — clicking collapses the thread */}
        <button className="fv-av-btn" onClick={() => replies?.length && setCollapsed(c => !c)} title={replies?.length ? "Colapsar hilo" : undefined}>
          <div className="fv-av" style={{
            background: post.kind==="bot" ? "var(--bg-3)" : (post.accent||"#facc15"),
            color: post.kind==="bot" ? "var(--text-2)" : "#1a1a1a",
          }}>
            {initials(post.user)}
          </div>
        </button>

        <div className="fv-post-body">
          <div className="fv-meta">
            <span className="nm">{post.user}</span>
            <span className="hd">{post.handle}</span>
            {post.kind==="bot"   && <span className="tag">Bot</span>}
            {post.kind==="guest" && <span className="tag">Invitado</span>}
            {isYou               && <span className="tag you">Tú</span>}
            <span className="ts">{window.formatRelativeTime(post.ts)}</span>
          </div>

          {!collapsed && (
            <>
              <div className="fv-text">{post.text}</div>
              <div className="fv-actions">
                <button className={`fv-like${isLiked?" liked":""}`} onClick={() => {
                  if (user?.kind === 'guest') { onGuestClick && onGuestClick(); return; }
                  onLike(post.id);
                }}>
                  <svg viewBox="0 0 14 14" fill={isLiked?"currentColor":"none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M7 12 L1.8 7 a3 3 0 0 1 4.2-4.2 L7 3.6 L8 2.8 a3 3 0 0 1 4.2 4.2Z" />
                  </svg>
                  {post.likes || 0}
                </button>
                <button
                  className={`fv-reply-btn${showReplyBox?" active":""}`}
                  onClick={() => {
                    if (user?.kind === 'guest') { onGuestClick && onGuestClick(); return; }
                    setShowReplyBox(o => !o);
                  }}
                >
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 3 L1 7 L5 11 M1 7 L9 7 a4 4 0 0 1 4 4 v0.5" />
                  </svg>
                  Responder
                </button>
                {replies?.length > 0 && (
                  <button className="fv-collapse-btn" onClick={() => setCollapsed(c => !c)}>
                    {collapsed
                      ? `▶ ${replies.length} ${replies.length===1?"respuesta":"respuestas"}`
                      : `▼ Colapsar`}
                  </button>
                )}
              </div>

              {/* Inline reply composer */}
              {showReplyBox && (
                <div className="fv-inline-composer">
                  <div className={`fv-inline-av${user?.kind==="guest"?" guest":""}`}>
                    {user?.kind==="guest" ? "?" : (user?.name?.[0]||"?").toUpperCase()}
                  </div>
                  <div className="fv-inline-composer-right">
                    <textarea
                      ref={textareaRef}
                      placeholder={`Responde a ${post.user}…`}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={onKeyDown}
                      rows={2}
                    />
                    <div className="fv-inline-composer-bar">
                      <span className="fv-inline-hint">⌘+Enter · Esc para cancelar</span>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="fv-inline-cancel" onClick={() => { setShowReplyBox(false); setReplyText(""); }}>
                          Cancelar
                        </button>
                        <button className="fv-inline-send" onClick={handleReplySubmit} disabled={!replyText.trim()}>
                          Responder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {collapsed && replies?.length > 0 && (
            <button className="fv-expand-btn" onClick={() => setCollapsed(false)}>
              ▶ {replies.length} {replies.length===1?"respuesta oculta":"respuestas ocultas"} — clic para expandir
            </button>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {!collapsed && replies?.length > 0 && (
        <div className="fv-nested">
          {replies.map(r => (
            <FvPost
              key={r.id}
              post={r}
              user={user}
              likedMap={likedMap}
              onLike={onLike}
              onSubmitReply={onSubmitReply}
              onGuestClick={onGuestClick}
              depth={d + 1}
              replies={r.replies || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Thread Detail ────────────────────────────────────────────────────
function buildPostTree(posts) {
  const byId = {};
  const roots = [];
  posts.forEach(p => { byId[p.id] = { ...p, replies: [] }; });
  posts.forEach(p => {
    if (p.parentId && byId[p.parentId]) {
      byId[p.parentId].replies.push(byId[p.id]);
    } else {
      roots.push(byId[p.id]);
    }
  });
  return roots;
}

function FvThreadDetail({ threadId, user, onMobileBack, onGuestAction, onThreadCreated }) {
  const [bundle, setBundle]   = React.useState(null);
  const [draft, setDraft]     = React.useState("");
  const [liked, setLiked]     = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("aletheia.likes") || "{}"); } catch(_){ return {}; }
  });
  const bodyRef    = React.useRef(null);
  const textareaRef= React.useRef(null);
  const prevCount  = React.useRef(0);

  React.useEffect(() => {
    if (!threadId) { setBundle(null); return; }
    setBundle(window.ForumAPI.getThread(threadId));
    const unsub = window.ForumAPI.subscribe(threadId, () =>
      setBundle(window.ForumAPI.getThread(threadId))
    );
    setDraft("");
    return unsub;
  }, [threadId]);

  React.useEffect(() => {
    if (!bundle || !bodyRef.current) return;
    if (bundle.posts.length > prevCount.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
    prevCount.current = bundle.posts.length;
  }, [bundle]);

  const send = () => {
    const t = draft.trim();
    if (!t || !threadId) return;
    window.ForumAPI.addPost(threadId, user, t, null);
    setDraft("");
    setBundle(window.ForumAPI.getThread(threadId));
  };

  const onSubmitReply = (parentId, text) => {
    if (!text || !threadId) return;
    window.ForumAPI.addPost(threadId, user, text, parentId);
    setBundle(window.ForumAPI.getThread(threadId));
  };

  const onKeyDown = e => {
    if (e.key==="Enter" && (e.metaKey||e.ctrlKey)) { e.preventDefault(); send(); }
  };

  const toggleLike = (postId) => {
    const has = !!(liked && liked[postId]);
    window.ForumAPI.like(threadId, postId, has ? -1 : 1);
    const next = { ...liked };
    if (has) delete next[postId]; else next[postId] = true;
    setLiked(next);
    try { localStorage.setItem("aletheia.likes", JSON.stringify(next)); } catch(_){}
    setBundle(window.ForumAPI.getThread(threadId));
  };

  // ── Placeholder ──────────────────────────────────────────────────
  if (!bundle) {
    return (
      <div className="fv-detail">
        <div className="fvd-placeholder">
          <div className="fvd-placeholder-icon">
            <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="6" width="48" height="34" rx="4" />
              <path d="M16 52 L28 40 L40 52" />
              <path d="M16 20 h24 M16 27 h16" />
            </svg>
          </div>
          <p>Elige un hilo para leer la conversación</p>
          <span>Hay {window.ForumAPI.listThreads({}).length} conversaciones activas sobre América</span>
        </div>
      </div>
    );
  }

  const { thread, posts } = bundle;
  const country = window.COUNTRIES.find(c => c.iso3 === thread.iso3);
  const lbl = { "país":"País", "gobierno":"Gobierno", "tema":"Tema" }[thread.scope] || thread.scope;
  const clr = { "país":"var(--accent)", "gobierno":"var(--accent-2)", "tema":"#f97316" }[thread.scope] || "var(--text-3)";

  return (
    <div className="fv-detail">
      {/* Head */}
      <div className="fvd-head" style={{ borderTopColor: clr }}>
        {onMobileBack && (
          <button className="fvd-mobile-back" onClick={onMobileBack}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 1 L1 5 M1 5 L5 9 M1 5 L13 5" />
            </svg>
            Volver a hilos
          </button>
        )}
        <div className="fvd-head-meta">
          <span className="fvd-scope-tag" style={{ color:clr, borderColor:clr+"44" }}>{lbl}</span>
          {country && <span className="fvd-country">{country.name}<span className="fvd-region"> · {country.region}</span></span>}
          {thread.year != null && <span className="fvd-year-tag">{thread.year}</span>}
          <span className="fvd-count">{posts.length} {posts.length===1?"mensaje":"mensajes"}</span>
        </div>
        <div className="fvd-title">{thread.title}</div>
        {thread.subtitle && <div className="fvd-subtitle">{thread.subtitle}</div>}
      </div>

      {/* Posts */}
      <div className="fvd-body" ref={bodyRef}>
        {posts.length === 0 ? (
          <div className="fvd-empty-posts">
            <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <circle cx="20" cy="20" r="15" strokeDasharray="4 2.5" />
              <path d="M13 20 h14 M13 26 h9" />
            </svg>
            <p>Sé el primero en escribir aquí.</p>
          </div>
        ) : buildPostTree(posts).map(p => (
          <FvPost
            key={p.id}
            post={p}
            user={user}
            likedMap={liked}
            onLike={toggleLike}
            onSubmitReply={onSubmitReply}
            onGuestClick={onGuestAction}
            depth={0}
            replies={p.replies || []}
          />
        ))}
      </div>

      {/* Composer — nuevo post raíz */}
      {user?.kind === 'guest' ? (
        <div className="fvd-guest-wall">
          <span>Solo puedes leer el foro como invitado.</span>
          <button onClick={() => onGuestAction && onGuestAction()}>Inicia sesión →</button>
        </div>
      ) : (
        <div className="fvd-composer">
          <div className="fvd-composer-av">
            {(user?.name?.[0]||"?").toUpperCase()}
          </div>
          <div className="fvd-composer-inner">
            <textarea
              ref={textareaRef}
              placeholder={`Añade un comentario en ${thread.country}…`}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
            />
            <div className="fvd-composer-bar">
              <span className="fvd-composer-hint">⌘+Enter para publicar</span>
              <button className="fvd-send" onClick={send} disabled={!draft.trim()}>
                Comentar
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 7 L12 7 M8 3 L12 7 L8 11" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Login Wall Modal ────────────────────────────────────────────────
function FvLoginWall({ onClose, onLogin }) {
  return (
    <>
      <div className="fv-modal-backdrop" onClick={onClose} />
      <div className="fv-modal fv-login-wall" role="dialog" aria-modal="true">
        <div className="fv-modal-head">
          <div className="fv-modal-title">Acceso requerido</div>
          <button className="fv-modal-x" onClick={onClose}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 2 L10 10 M10 2 L2 10" />
            </svg>
          </button>
        </div>
        <div className="fv-modal-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>◆</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
            Crea una cuenta para participar
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 24 }}>
            Como invitado puedes explorar el foro, pero necesitas una cuenta para crear hilos, comentar y dar likes.
          </div>
        </div>
        <div className="fv-modal-foot">
          <button className="fv-modal-cancel" onClick={onClose}>Seguir explorando</button>
          <button className="fv-modal-submit" onClick={onLogin}>
            Iniciar sesión / Registrarse
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7 L12 7 M8 3 L12 7 L8 11" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Forum Root ───────────────────────────────────────────────────────
function Forum({ initialIso3, initialThreadId, user, onClose, theme, onToggleTheme }) {
  const [filter, setFilter] = React.useState({
    query: "", region: null,
    iso3: initialIso3 || null,
    scope: "todos", year: null,
  });
  const [sort, setSort]           = React.useState("recent");
  const [threads, setThreads]     = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [showFilters, setShowFilters]     = React.useState(false);
  const [showNewThread, setShowNewThread] = React.useState(false);
  const [showLoginWall, setShowLoginWall] = React.useState(false);
  const [mobileView, setMobileView]       = React.useState("list");

  const activeFilterCount = [filter.region, filter.iso3, filter.year].filter(Boolean).length;

  const refresh = React.useCallback(() => {
    setThreads(window.ForumAPI.listThreads({ ...filter, sort }));
  }, [filter.query, filter.region, filter.iso3, filter.scope, filter.year, sort]);

  React.useEffect(() => { refresh(); }, [refresh]);

  React.useEffect(() => {
    const unsub = window.ForumAPI.subscribe("*", refresh);
    return unsub;
  }, [refresh]);

  React.useEffect(() => {
    const onRefresh = () => refresh();
    window.addEventListener("aletheia:forum:refresh", onRefresh);
    return () => window.removeEventListener("aletheia:forum:refresh", onRefresh);
  }, [refresh]);

  React.useEffect(() => {
    if (initialThreadId) { setSelectedId(initialThreadId); refresh(); }
  }, [initialThreadId]);

  React.useEffect(() => {
    if (initialThreadId) return;
    if (filter.iso3) {
      const first = window.ForumAPI.listThreads({ iso3: filter.iso3, sort })[0];
      if (first) setSelectedId(first.id);
    }
  }, [filter.iso3]);

  React.useEffect(() => {
    const onKey = e => {
      if (e.key !== "Escape") return;
      if (showFilters)          { setShowFilters(false); return; }
      if (showNewThread)        { setShowNewThread(false); return; }
      if (mobileView==="detail"){ setMobileView("list"); return; }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showFilters, showNewThread, mobileView]);

  // Auto-select first thread so the right panel is never empty on desktop
  React.useEffect(() => {
    if (!selectedId && threads.length > 0) {
      setSelectedId(threads[0].id);
    }
  }, [threads]);

  const handleSelect = id => { setSelectedId(id); setMobileView("detail"); };
  const totalAll = React.useMemo(() => window.ForumAPI.listThreads({ sort:"recent" }).length, []);

  const SCOPE_TABS = [
    { v:"todos",    l:"Todos" },
    { v:"país",     l:"País" },
    { v:"gobierno", l:"Gobierno" },
    { v:"tema",     l:"Tema" },
  ];

  const scopeCount = v => v==="todos" ? threads.length : threads.filter(t=>t.scope===v).length;

  return (
    <div className="fv-stage">

      {/* ── Topbar ── */}
      <div className="fv-topbar">
        <div className="fvt-brand">
          <span className="fvt-logo">Aletheia</span>
          <span className="fvt-slash">/</span>
          <span className="fvt-name">Foro</span>
          <span className="fvt-live">
            <span className="fvt-live-dot" />
            {totalAll} hilos
          </span>
        </div>

        <div className="fvt-search-group">
          <div className="fvt-search-wrap">
            <svg className="fvt-search-ico" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9 L13 13"/>
            </svg>
            <input className="fvt-search-input"
              placeholder="Buscar hilos, país, presidente…"
              value={filter.query}
              onChange={e => setFilter(f => ({ ...f, query:e.target.value }))}
              autoComplete="off"
            />
            {filter.query && (
              <button className="fvt-search-clear" onClick={() => setFilter(f => ({ ...f, query:"" }))}>
                <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M2 2 L8 8 M8 2 L2 8"/>
                </svg>
              </button>
            )}
          </div>
          <button
            className={`fvt-filter-btn${showFilters?" is-open":""}${activeFilterCount>0?" has-active":""}`}
            onClick={() => setShowFilters(o=>!o)}
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 3 h12 M3 7 h8 M5 11 h4"/>
            </svg>
            Filtrar
            {activeFilterCount > 0 && <span className="fvt-filter-badge">{activeFilterCount}</span>}
          </button>
        </div>

        <div className="fvt-right">
          <button className="fvt-new-btn" onClick={() => {
            if (user?.kind === 'guest') { setShowLoginWall(true); return; }
            setShowNewThread(true);
          }}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 2 L7 12 M2 7 L12 7"/>
            </svg>
            Nuevo hilo
          </button>
          {onToggleTheme && (
            <button className="fvt-icon-btn" onClick={onToggleTheme} title="Cambiar tema">
              {theme==="dark" ? (
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <circle cx="7" cy="7" r="2.6"/>
                  <path d="M7 1 L7 2.6 M7 11.4 L7 13 M1 7 L2.6 7 M11.4 7 L13 7 M2.76 2.76 L3.92 3.92 M10.08 10.08 L11.24 11.24 M2.76 11.24 L3.92 10.08 M10.08 3.92 L11.24 2.76"/>
                </svg>
              ) : (
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M11.2 8.4 a5 5 0 0 1 -5.6-5.6 a5 5 0 1 0 5.6 5.6z"/>
                </svg>
              )}
            </button>
          )}
          <button className="fvt-close-btn" onClick={onClose} title="Volver al mapa (Esc)">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2 L12 12 M12 2 L2 12"/>
            </svg>
            Volver
          </button>
        </div>
      </div>

      {/* ── Scope tabs + sort ── */}
      <div className="fv-scope-bar">
        <div className="fv-scope-tabs">
          {SCOPE_TABS.map(s => (
            <button key={s.v}
              className={`fv-scope-tab${filter.scope===s.v?" active":""} scope-${s.v}`}
              onClick={() => setFilter(f => ({ ...f, scope:s.v }))}
            >
              {s.l}
              <span className="fv-scope-count">{scopeCount(s.v)}</span>
            </button>
          ))}
        </div>
        <div className="fv-sort-group">
          <span className="fv-sort-lbl">Ordenar</span>
          {[{v:"recent",l:"Reciente"},{v:"busy",l:"Activos"},{v:"country",l:"A–Z"}].map(s => (
            <button key={s.v}
              className={`fv-sort-btn${sort===s.v?" active":""}`}
              onClick={() => setSort(s.v)}
            >{s.l}</button>
          ))}
        </div>
      </div>

      {/* ── Main 2-col body ── */}
      <div className="fv-body">

        {/* List pane */}
        <div className={`fv-list-pane${mobileView==="detail"?" mobile-hide":""}`}>
          {/* Active filter chips */}
          {(filter.region || filter.iso3 || filter.year) && (
            <div className="fv-chips">
              {filter.region && (
                <button className="fv-chip" onClick={() => setFilter(f => ({ ...f, region:null, iso3:null }))}>
                  {filter.region} <span>✕</span>
                </button>
              )}
              {filter.iso3 && (
                <button className="fv-chip" onClick={() => setFilter(f => ({ ...f, iso3:null }))}>
                  {window.COUNTRIES.find(c=>c.iso3===filter.iso3)?.name} <span>✕</span>
                </button>
              )}
              {filter.year && (
                <button className="fv-chip" onClick={() => setFilter(f => ({ ...f, year:null }))}>
                  {filter.year} <span>✕</span>
                </button>
              )}
              <button className="fv-chips-clear"
                onClick={() => setFilter(f => ({ ...f, region:null, iso3:null, year:null }))}>
                Limpiar
              </button>
            </div>
          )}

          <div className="fvl-scroll">
            {threads.length === 0 ? (
              <div className="fvl-empty">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <circle cx="24" cy="24" r="18" strokeDasharray="4 2.5"/>
                  <path d="M16 22 h16 M16 29 h10"/>
                </svg>
                <p>Sin resultados</p>
                <button onClick={() => setFilter(f => ({ ...f, query:"", region:null, iso3:null, year:null, scope:"todos" }))}>
                  Limpiar todos los filtros
                </button>
              </div>
            ) : threads.map(t => (
              <FvThreadCard key={t.id} thread={t} selected={t.id===selectedId} onSelect={handleSelect} />
            ))}
          </div>
        </div>

        {/* Detail pane */}
        <div className={`fv-detail-pane${mobileView==="list"?" mobile-hide":""}`}>
          <FvThreadDetail
            threadId={selectedId}
            user={user}
            onMobileBack={mobileView==="detail" ? ()=>setMobileView("list") : null}
            onGuestAction={() => setShowLoginWall(true)}
            onThreadCreated={id => {
              refresh();
              if (id) { setSelectedId(id); setMobileView("detail"); }
            }}
          />
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <FvFilterDrawer filter={filter} setFilter={setFilter} onClose={() => setShowFilters(false)} />
      )}

      {/* New Thread Modal */}
      {showNewThread && (
        <FvNewThreadModal
          user={user}
          onClose={() => setShowNewThread(false)}
          onCreated={id => {
            refresh();
            if (id) { setSelectedId(id); setMobileView("detail"); }
          }}
        />
      )}

      {/* Login Wall */}
      {showLoginWall && (
        <FvLoginWall
          onClose={() => setShowLoginWall(false)}
          onLogin={() => {
            setShowLoginWall(false);
            onClose();
            window.AuthAPI.logout();
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

window.Forum = Forum;
