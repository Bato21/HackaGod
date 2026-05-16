// Forum component — modal de discusión por país.
// Carga posts iniciales, escucha BroadcastChannel + storage events
// para sincronizar entre pestañas, y permite componer nuevos.

function Forum({ country, year, user, onClose }) {
  const [posts, setPosts] = React.useState([]);
  const [draft, setDraft] = React.useState("");
  const [liked, setLiked] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("alethia.likes") || "{}"); }
    catch (_) { return {}; }
  });
  const bodyRef = React.useRef(null);
  const composerRef = React.useRef(null);

  // Cargar y suscribirse a cambios
  React.useEffect(() => {
    if (!country) return;
    setPosts(window.ForumAPI.load(country, year));
    const unsub = window.ForumAPI.subscribe(country.iso3, (msg) => {
      if (msg.type === "add" || msg.type === "reload" || msg.type === "like") {
        setPosts(window.ForumAPI.load(country, year));
      }
    });
    return unsub;
  }, [country?.iso3, year]);

  // Auto-scroll al final cuando llega un post nuevo
  React.useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [posts.length]);

  // Foco en composer al abrir
  React.useEffect(() => {
    if (composerRef.current) {
      setTimeout(() => composerRef.current.focus(), 80);
    }
  }, []);

  // Esc cierra
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    window.ForumAPI.add(country, year, user, text);
    setDraft("");
    // re-cargar
    setPosts(window.ForumAPI.load(country, year));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
  };

  const toggleLike = (postId) => {
    const has = !!liked[postId];
    window.ForumAPI.like(country.iso3, postId, has ? -1 : 1);
    const next = { ...liked };
    if (has) delete next[postId]; else next[postId] = true;
    setLiked(next);
    localStorage.setItem("alethia.likes", JSON.stringify(next));
    setPosts(window.ForumAPI.load(country, year));
  };

  if (!country) return null;

  const initials = (n) => n.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const userInitial = user?.name ? user.name[0].toUpperCase() : "?";

  return (
    <div className="forum-backdrop" onClick={onClose}>
      <div className="forum-shell" onClick={e => e.stopPropagation()}>
        <div className="forum-head">
          <div>
            <div className="fh-kicker">Foro de discusión</div>
            <div className="fh-title">{country.name}</div>
            <div className="fh-meta">
              <span><span className="live-dot"></span>En vivo</span>
              <span>{posts.length} mensajes</span>
              <span>·</span>
              <span>{country.iso3} · {year}</span>
            </div>
          </div>
          <button className="fh-close" onClick={onClose} title="Cerrar (Esc)">✕</button>
        </div>

        <div className="forum-body" ref={bodyRef}>
          {posts.length === 0 && (
            <div className="forum-empty">Sé el primero en abrir la conversación sobre <em>{country.name}</em>.</div>
          )}
          {posts.map((p) => {
            const isYou = p.kind !== "bot" && p.user === (user?.name);
            const klass = p.kind === "bot" ? "is-bot" : p.kind === "guest" ? "is-guest" : "is-user";
            const isLiked = !!liked[p.id];
            return (
              <div key={p.id} className={`forum-post ${klass}`}>
                <div className="fp-avatar" style={{
                  background: p.kind === "bot" ? "var(--bg-3)" : (p.accent || "#facc15")
                }}>
                  {initials(p.user)}
                </div>
                <div>
                  <div className="fp-meta">
                    <span className="nm">{p.user}</span>
                    <span className="hd">{p.handle}</span>
                    {p.kind === "bot" && <span className="tag">Bot · semilla</span>}
                    {p.kind === "guest" && <span className="tag">Invitado</span>}
                    {isYou && <span className="tag you">Tú</span>}
                    <span className="ts">{window.formatRelativeTime(p.ts)}</span>
                  </div>
                  <div className="fp-text">{p.text}</div>
                  <div className="fp-actions">
                    <button className={`fp-like${isLiked ? " liked" : ""}`} onClick={() => toggleLike(p.id)} title="Me gusta">
                      <svg viewBox="0 0 14 14" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                        <path d="M7 12 L1.8 7 a3 3 0 0 1 4.2 -4.2 L7 3.6 L8 2.8 a3 3 0 0 1 4.2 4.2 Z" />
                      </svg>
                      {p.likes || 0}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="forum-composer">
          <div className={`fc-av${user?.kind === "guest" ? " guest" : ""}`}>
            {user?.kind === "guest" ? "⌀" : userInitial}
          </div>
          <textarea
            ref={composerRef}
            placeholder={`Escribe sobre ${country.name}…`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button className="fc-send" onClick={send} disabled={!draft.trim()}>
            Publicar
          </button>
          <div className="fc-foot">
            Publicando como <strong style={{ color: "var(--text)" }}>{user?.name || "Anónimo"}</strong>
            {user?.kind === "guest" && <span> · invitado, visible para otros usuarios</span>}
            <span style={{ color: "var(--text-3)" }}> · ⌘/Ctrl+Enter para publicar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Forum = Forum;
