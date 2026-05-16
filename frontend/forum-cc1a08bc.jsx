// Forum view — takeover de pantalla completa.
// Filtros (búsqueda, región, país, tipo, año) · lista de hilos · detalle.

const FV_SCOPES = [
  { value: "todos",    label: "Todos" },
  { value: "país",     label: "País" },
  { value: "gobierno", label: "Gobierno" },
  { value: "tema",     label: "Tema" },
];

const FV_REGIONS = ["Norteamérica", "Centroamérica", "Caribe", "Sudamérica"];

function FvFilters({ filter, setFilter }) {
  const update = (patch) => setFilter(f => ({ ...f, ...patch }));
  const countries = window.COUNTRIES.slice().sort((a, b) => a.name.localeCompare(b.name));
  const visibleCountries = filter.region
    ? countries.filter(c => c.region === filter.region)
    : countries;

  return (
    <section className="fv-filters">
      <div className="fvf-section">
        <div className="fvf-h">
          <span>Buscar</span>
          {filter.query && (
            <button className="clear-btn" onClick={() => update({ query: "" })}>limpiar</button>
          )}
        </div>
        <input
          className="fvf-search"
          placeholder="Hilo, país, presidente…"
          value={filter.query}
          onChange={(e) => update({ query: e.target.value })}
        />
      </div>

      <div className="fvf-section">
        <div className="fvf-h">
          <span>Tipo de hilo</span>
        </div>
        <div className="fvf-seg">
          {FV_SCOPES.map(s => (
            <button
              key={s.value}
              className={filter.scope === s.value ? "active" : ""}
              onClick={() => update({ scope: s.value })}
            >{s.label}</button>
          ))}
        </div>
      </div>

      <div className="fvf-section">
        <div className="fvf-h">
          <span>Región</span>
          {filter.region && (
            <button className="clear-btn" onClick={() => update({ region: null, iso3: null })}>todas</button>
          )}
        </div>
        <div className="fvf-seg" style={{ flexDirection: "column" }}>
          {FV_REGIONS.map(r => (
            <button
              key={r}
              className={filter.region === r ? "active" : ""}
              onClick={() => update({ region: filter.region === r ? null : r, iso3: null })}
              style={{ flex: "0 0 auto", textAlign: "left" }}
            >{r}</button>
          ))}
        </div>
      </div>

      <div className="fvf-section">
        <div className="fvf-h">
          <span>País</span>
          {filter.iso3 && (
            <button className="clear-btn" onClick={() => update({ iso3: null })}>todos</button>
          )}
        </div>
        <div className="fvf-country-list">
          {visibleCountries.map(c => {
            const active = filter.iso3 === c.iso3;
            return (
              <div
                key={c.iso3}
                className={`fvf-country-row${active ? " active" : ""}`}
                onClick={() => update({ iso3: active ? null : c.iso3 })}
              >
                <span>{c.name}</span>
                <span className="iso">{c.iso3}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fvf-section">
        <div className="fvf-h">
          <span>Año</span>
          {filter.year != null && filter.year !== "todos" && (
            <button className="clear-btn" onClick={() => update({ year: null })}>todos</button>
          )}
        </div>
        <div className="fvf-year-grid">
          {window.YEARS.map(y => (
            <button
              key={y}
              className={filter.year === y ? "active" : ""}
              onClick={() => update({ year: filter.year === y ? null : y })}
            >{String(y).slice(2)}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FvThreadCard({ thread, selected, onSelect }) {
  // chip color por scope
  const chipColor = thread.scope === "país"
    ? "var(--accent)"
    : thread.scope === "gobierno"
      ? "var(--accent-2)"
      : "#f97316";
  const scopeLabel = thread.scope === "país" ? "País" :
    thread.scope === "gobierno" ? "Gobierno" : "Tema";
  return (
    <div
      className={`fv-thread-card${selected ? " selected" : ""}`}
      onClick={() => onSelect(thread.id)}
    >
      <div className="ftc-chip" style={{ background: chipColor }}></div>
      <span className={`ftc-scope ${thread.scope}`}>{scopeLabel}</span>
      <div className="ftc-title">{thread.title}</div>
      <div className="ftc-sub">{thread.subtitle}</div>
      <div className="ftc-foot">
        <span className="country">
          <strong>{thread.iso3}</strong>{thread.country}
          {thread.year != null && <span style={{ marginLeft: 10, color: "var(--text-3)" }}>· {thread.year}</span>}
        </span>
        <span className="replies">
          <span className="num">{thread.replyCount}</span> respuestas · {window.formatRelativeTime(thread.lastTs)}
        </span>
      </div>
    </div>
  );
}

function FvThreadList({ filter, threads, selectedId, onSelect, sort, setSort, onClearAll, detailMode, setDetailMode }) {
  // Construir resumen de filtros activos
  const activePills = [];
  if (filter.query) activePills.push({ k: "query", label: `“${filter.query}”` });
  if (filter.region) activePills.push({ k: "region", label: filter.region });
  if (filter.iso3) {
    const c = window.COUNTRIES.find(x => x.iso3 === filter.iso3);
    if (c) activePills.push({ k: "iso3", label: c.name });
  }
  if (filter.scope && filter.scope !== "todos") activePills.push({ k: "scope", label: filter.scope });
  if (filter.year) activePills.push({ k: "year", label: String(filter.year) });

  return (
    <section className="fv-threads">
      <div className="fvl-head">
        <h2>Hilos</h2>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {detailMode === "closed" && selectedId && (
            <button
              onClick={() => setDetailMode("normal")}
              title="Reabrir el panel de conversación"
              style={{
                background: "transparent", border: "1px solid var(--accent)",
                color: "var(--accent)", padding: "3px 9px", borderRadius: 3,
                fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "var(--sans)"
              }}
            >
              Reabrir hilo →
            </button>
          )}
          <span className="count">{threads.length} {threads.length === 1 ? "hilo" : "hilos"}</span>
        </span>
      </div>
      <div className="fvl-sort">
        <button className={sort === "recent" ? "active" : ""} onClick={() => setSort("recent")}>Reciente</button>
        <button className={sort === "busy" ? "active" : ""} onClick={() => setSort("busy")}>Más activos</button>
        <button className={sort === "country" ? "active" : ""} onClick={() => setSort("country")}>A–Z país</button>
      </div>
      {activePills.length > 0 && (
        <div className="fv-active-filters">
          <span>Filtros</span>
          {activePills.map(p => (
            <span key={p.k} className="pill">
              {p.label}
              <button onClick={() => {
                const patch = { [p.k]: p.k === "query" ? "" : (p.k === "scope" ? "todos" : null) };
                onClearAll(patch);
              }} title="Quitar">✕</button>
            </span>
          ))}
        </div>
      )}
      <div className="fvl-body">
        {threads.length === 0 ? (
          <div className="fvl-empty">
            No hay hilos que cumplan con esta combinación de filtros.
            <br/><br/>
            <em>Prueba quitar alguno o ampliar el rango.</em>
          </div>
        ) : (
          threads.map(t => (
            <FvThreadCard
              key={t.id}
              thread={t}
              selected={t.id === selectedId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </section>
  );
}

function FvPost({ post, user, liked, onLike }) {
  const initials = (n) => n.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const isYou = post.kind !== "bot" && post.user === user?.name;
  const klass = post.kind === "bot" ? "is-bot" : post.kind === "guest" ? "is-guest" : "is-user";
  return (
    <div className={`fv-post ${klass}`}>
      <div className="fv-av" style={{
        background: post.kind === "bot" ? "var(--bg-3)" : (post.accent || "#facc15")
      }}>
        {initials(post.user)}
      </div>
      <div>
        <div className="fv-meta">
          <span className="nm">{post.user}</span>
          <span className="hd">{post.handle}</span>
          {post.kind === "bot" && <span className="tag">Bot · semilla</span>}
          {post.kind === "guest" && <span className="tag">Invitado</span>}
          {isYou && <span className="tag you">Tú</span>}
          <span className="ts">{window.formatRelativeTime(post.ts)}</span>
        </div>
        <div className="fv-text">{post.text}</div>
        <div className="fv-actions">
          <button
            className={`fv-like${liked ? " liked" : ""}`}
            onClick={() => onLike(post.id)}
            title="Me gusta"
          >
            <svg viewBox="0 0 14 14" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
              <path d="M7 12 L1.8 7 a3 3 0 0 1 4.2 -4.2 L7 3.6 L8 2.8 a3 3 0 0 1 4.2 4.2 Z" />
            </svg>
            {post.likes || 0}
          </button>
        </div>
      </div>
    </div>
  );
}

function FvThreadDetail({ threadId, user, detailMode, setDetailMode }) {
  const [bundle, setBundle] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const [liked, setLiked] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("alethia.likes") || "{}"); }
    catch (_) { return {}; }
  });
  const bodyRef = React.useRef(null);
  const composerRef = React.useRef(null);
  const prevCountRef = React.useRef(0);

  // Cargar hilo + suscribirse
  React.useEffect(() => {
    if (!threadId) { setBundle(null); return; }
    setBundle(window.ForumAPI.getThread(threadId));
    const unsub = window.ForumAPI.subscribe(threadId, () => {
      setBundle(window.ForumAPI.getThread(threadId));
    });
    setDraft("");
    return unsub;
  }, [threadId]);

  // Auto-scroll cuando llega un post nuevo
  React.useEffect(() => {
    if (!bundle || !bodyRef.current) return;
    const newCount = bundle.posts.length;
    if (newCount > prevCountRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
    prevCountRef.current = newCount;
  }, [bundle]);

  // Foco en composer cuando cambia de hilo
  React.useEffect(() => {
    if (composerRef.current && threadId) {
      setTimeout(() => composerRef.current?.focus(), 100);
    }
  }, [threadId]);

  const send = () => {
    const text = draft.trim();
    if (!text || !threadId) return;
    window.ForumAPI.addPost(threadId, user, text);
    setDraft("");
    setBundle(window.ForumAPI.getThread(threadId));
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
  };
  const toggleLike = (postId) => {
    const has = !!liked[postId];
    window.ForumAPI.like(threadId, postId, has ? -1 : 1);
    const next = { ...liked };
    if (has) delete next[postId]; else next[postId] = true;
    setLiked(next);
    try { localStorage.setItem("alethia.likes", JSON.stringify(next)); } catch (_) {}
    setBundle(window.ForumAPI.getThread(threadId));
  };

  if (!bundle) {
    return (
      <section className="fv-detail">
        <div className="fvd-empty">
          <div className="h">
            Selecciona un hilo de la lista para abrir la conversación.
          </div>
        </div>
      </section>
    );
  }

  const { thread, posts } = bundle;
  const userInitial = user?.name ? user.name[0].toUpperCase() : "?";
  const country = window.COUNTRIES.find(c => c.iso3 === thread.iso3);
  const scopeLabel = thread.scope === "país" ? "Conversación país" :
    thread.scope === "gobierno" ? "Hilo de gobierno" : "Hilo temático";
  const isFull = detailMode === "full";

  return (
    <section className="fv-detail">
      <div className="fvd-head">
        <div className="fvd-actions">
          {isFull && (
            <button
              className="fvd-back"
              onClick={() => setDetailMode("normal")}
              title="Volver al listado"
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 1 L1 5 M1 5 L5 9 M1 5 L13 5" />
              </svg>
              Volver al listado
            </button>
          )}
          <button
            className={isFull ? "is-full" : ""}
            onClick={() => setDetailMode(isFull ? "normal" : "full")}
            title={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFull ? (
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                <path d="M5 1 L5 5 L1 5 M9 1 L9 5 L13 5 M13 9 L9 9 L9 13 M1 9 L5 9 L5 13" />
              </svg>
            ) : (
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                <path d="M1 5 L1 1 L5 1 M9 1 L13 1 L13 5 M13 9 L13 13 L9 13 M5 13 L1 13 L1 9" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setDetailMode("closed")}
            title="Cerrar conversación (más espacio para la lista)"
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3 L11 11 M11 3 L3 11" />
            </svg>
          </button>
        </div>
        <div className="fvd-kicker">
          <span><span className={`scope ${thread.scope}`}>{scopeLabel}</span></span>
          <span>{posts.length} {posts.length === 1 ? "mensaje" : "mensajes"}</span>
        </div>
        <div className="fvd-title">{thread.title}</div>
        <div className="fvd-sub">
          <span><span className="b">{country?.name}</span> · {country?.region}</span>
          {thread.year != null && <span>Año <span className="b">{thread.year}</span></span>}
          {thread.period && <span>Período <span className="b">{thread.period[0]}–{thread.period[1]}</span></span>}
          {thread.presParty && <span>Partido <span className="b">{thread.presParty}</span></span>}
        </div>
      </div>
      <div className="fvd-body" ref={bodyRef}>
        {posts.length === 0 ? (
          <div style={{ color: "var(--text-3)", textAlign: "center", padding: "40px 20px", fontSize: 13 }}>
            Sé el primero en abrir la conversación.
          </div>
        ) : (
          posts.map(p => (
            <FvPost
              key={p.id}
              post={p}
              user={user}
              liked={!!liked[p.id]}
              onLike={toggleLike}
            />
          ))
        )}
      </div>
      <div className="fvd-composer">
        <div className={`fvd-av${user?.kind === "guest" ? " guest" : ""}`}>
          {user?.kind === "guest" ? "⌀" : userInitial}
        </div>
        <textarea
          ref={composerRef}
          placeholder={`Escribe en ${thread.country}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button className="send" onClick={send} disabled={!draft.trim()}>
          Publicar
        </button>
        <div className="ft">
          Publicando como <strong>{user?.name || "Anónimo"}</strong>
          {user?.kind === "guest" && <span> · invitado, visible para otros</span>}
          <span style={{ color: "var(--text-3)" }}> · ⌘/Ctrl+Enter</span>
        </div>
      </div>
    </section>
  );
}

function Forum({ initialIso3, initialThreadId, user, onClose, theme, onToggleTheme }) {
  const [filter, setFilter] = React.useState({
    query: "",
    region: null,
    iso3: initialIso3 || null,
    scope: "todos",
    year: null,
  });
  const [sort, setSort] = React.useState("recent");
  const [threads, setThreads] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [detailMode, setDetailMode] = React.useState("normal"); // normal | closed | full

  // Al seleccionar un hilo desde la lista, reabrir el detalle si estaba cerrado.
  const handleSelect = React.useCallback((id) => {
    setSelectedId(id);
    if (detailMode === "closed") setDetailMode("normal");
  }, [detailMode]);

  // Recompute lista al cambiar filtros / sort
  React.useEffect(() => {
    const list = window.ForumAPI.listThreads({ ...filter, sort });
    setThreads(list);
  }, [filter.query, filter.region, filter.iso3, filter.scope, filter.year, sort]);

  // Sincronización en tiempo real entre pestañas
  React.useEffect(() => {
    const unsub = window.ForumAPI.subscribe("*", () => {
      setThreads(window.ForumAPI.listThreads({ ...filter, sort }));
    });
    return unsub;
  }, [filter.query, filter.region, filter.iso3, filter.scope, filter.year, sort]);

  // Si nos pasaron un threadId específico (p.ej. al crear un hilo desde una noticia),
  // seleccionarlo en cuanto el componente esté listo.
  React.useEffect(() => {
    if (initialThreadId) {
      setSelectedId(initialThreadId);
      // Refrescar la lista para que el hilo nuevo aparezca
      setThreads(window.ForumAPI.listThreads({ ...filter, sort }));
    }
  }, [initialThreadId]);

  // Auto-seleccionar el primer hilo del país al entrar con preselección,
  // o cuando filtras a un país nuevo.
  React.useEffect(() => {
    if (initialThreadId) return; // no sobreescribir si nos pasaron un hilo explicito
    if (filter.iso3) {
      const first = window.ForumAPI.listThreads({ iso3: filter.iso3, sort })[0];
      if (first) setSelectedId(first.id);
    }
  }, [filter.iso3]);

  // Auto-seleccionar primer hilo si no hay ninguno seleccionado y hay hilos disponibles.
  React.useEffect(() => {
    if (!selectedId && threads.length > 0) {
      setSelectedId(threads[0].id);
    }
  }, [threads, selectedId]);

  // Esc cierra el foro — o, si el detalle está en pantalla completa, primero sale de full.
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (detailMode === "full") { setDetailMode("normal"); return; }
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, detailMode]);

  // Total para el contador del topbar
  const totalAll = React.useMemo(
    () => window.ForumAPI.listThreads({ sort: "recent" }).length,
    []
  );

  return (
    <div className="fv-stage">
      <div className="fv-top">
        <div className="fvt-brand">
          <div className="fvt-logo">Alethia</div>
          <div className="fvt-kicker">Foro · discusión por país, gobierno y tema</div>
        </div>
        <div className="fvt-meta">
          <span><span className="live-dot"></span>En vivo</span>
          <span>{totalAll} hilos · {window.COUNTRIES.length} países</span>
          {onToggleTheme && (
            <button
              className="fvt-close"
              onClick={onToggleTheme}
              title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7" cy="7" r="2.6" />
                  <path d="M7 1 L7 2.6 M7 11.4 L7 13 M1 7 L2.6 7 M11.4 7 L13 7 M2.76 2.76 L3.92 3.92 M10.08 10.08 L11.24 11.24 M2.76 11.24 L3.92 10.08 M10.08 3.92 L11.24 2.76" />
                </svg>
              ) : (
                <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11.2 8.4 a5 5 0 0 1 -5.6 -5.6 a5 5 0 1 0 5.6 5.6 z" />
                </svg>
              )}
              {theme === "dark" ? "Claro" : "Oscuro"}
            </button>
          )}
          <button className="fvt-close" onClick={onClose} title="Volver al mapa (Esc)">
            ✕  Volver al mapa
          </button>
        </div>
      </div>
      <div className={`fv-body${detailMode === "closed" ? " detail-closed" : ""}${detailMode === "full" ? " detail-full" : ""}`}>
        <FvFilters filter={filter} setFilter={setFilter} />
        <FvThreadList
          filter={filter}
          threads={threads}
          selectedId={selectedId}
          onSelect={handleSelect}
          sort={sort}
          setSort={setSort}
          onClearAll={(patch) => setFilter(f => ({ ...f, ...patch }))}
          detailMode={detailMode}
          setDetailMode={setDetailMode}
        />
        <FvThreadDetail
          threadId={selectedId}
          user={user}
          detailMode={detailMode}
          setDetailMode={setDetailMode}
        />
      </div>
    </div>
  );
}

window.Forum = Forum;
