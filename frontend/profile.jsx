// profile.jsx — Página de perfil completa de usuario Aletheia

function scoreToColor(s) {
  if (s <= 25) return `rgb(${Math.round(22 + (s/25)*(132-22))},${Math.round(163 + (s/25)*(204-163))},${Math.round(74 + (s/25)*(22-74))})`;
  if (s <= 50) return `rgb(${Math.round(132 + ((s-25)/25)*(250-132))},${Math.round(204 + ((s-25)/25)*(204-204))},${Math.round(22 + ((s-25)/25)*(21-22))})`;
  if (s <= 75) return `rgb(${Math.round(250 + ((s-50)/25)*(249-250))},${Math.round(204 + ((s-50)/25)*(115-204))},${Math.round(21 + ((s-50)/25)*(22-21))})`;
  return `rgb(${Math.round(249 + ((s-75)/25)*(185-249))},${Math.round(115 + ((s-75)/25)*(28-115))},${Math.round(22 + ((s-75)/25)*(28-22))})`;
}

const STORAGE_PROFILE = (email) => `aletheia.profile.${email}`;

const REPUTATION_LEVELS = [
  { min: 50, label: "Referente",     color: "#f59e0b", icon: "★" },
  { min: 30, label: "Editor Cívico", color: "#a78bfa", icon: "◈" },
  { min: 15, label: "Investigador",  color: "#38bdf8", icon: "◉" },
  { min: 5,  label: "Analista",      color: "#10b981", icon: "◎" },
  { min: 1,  label: "Corresponsal",  color: "#7fa3c8", icon: "○" },
  { min: 0,  label: "Observador",    color: "#6b7fa3", icon: "·" },
];

const BANNER_PRESETS = [
  "linear-gradient(135deg, #0b1829 0%, #132035 50%, #0ea5e9 100%)",
  "linear-gradient(135deg, #1a0533 0%, #4c1d95 50%, #7c3aed 100%)",
  "linear-gradient(135deg, #052e16 0%, #065f46 50%, #10b981 100%)",
  "linear-gradient(135deg, #1c1917 0%, #78350f 50%, #f59e0b 100%)",
  "linear-gradient(135deg, #1c0a09 0%, #7f1d1d 50%, #dc2626 100%)",
];

// ── StarAPI ────────────────────────────────────────────────────────────────
window.StarAPI = {
  _key: (email) => `aletheia.stars.${email}`,
  _seenKey: (email) => `aletheia.notif.seen.${email}`,

  get(email) {
    if (!email) return {};
    try { return JSON.parse(localStorage.getItem(this._key(email))) || {}; }
    catch (_) { return {}; }
  },

  toggle(email, country) {
    const stars = this.get(email);
    if (stars[country.iso3]) {
      delete stars[country.iso3];
    } else {
      stars[country.iso3] = {
        iso3: country.iso3,
        name: country.name,
        region: country.region,
        starredAt: Date.now(),
      };
    }
    try { localStorage.setItem(this._key(email), JSON.stringify(stars)); } catch (_) {}
    return { ...stars };
  },

  isStarred(email, iso3) {
    return !!this.get(email)[iso3];
  },

  getLastSeen(email) {
    try { return parseInt(localStorage.getItem(this._seenKey(email))) || 0; }
    catch (_) { return 0; }
  },

  markSeen(email) {
    try { localStorage.setItem(this._seenKey(email), String(Date.now())); } catch (_) {}
  },

  getNotifications(email) {
    const stars = this.get(email);
    const isos = Object.keys(stars);
    if (!isos.length) return [];
    const items = [];

    isos.forEach(iso3 => {
      const star = stars[iso3];
      const country = (window.COUNTRIES || []).find(c => c.iso3 === iso3);
      if (!country) return;

      // Forum threads (most recent first)
      try {
        const threads = window.ForumAPI.listThreads({ iso3 });
        threads.slice(0, 4).forEach(t => {
          items.push({
            id: `t-${t.id}`,
            type: "thread",
            iso3, countryName: star.name,
            title: t.title,
            subtitle: t.replyCount + " respuestas",
            ts: t.lastTs,
            threadId: t.id,
          });
        });
      } catch (_) {}

      // Simulated news from COUNTRY_NEWS
      if (typeof window.COUNTRY_NEWS === "function") {
        try {
          const news = window.COUNTRY_NEWS(country, 2024);
          const all = [
            ...(news.corrupcion || []),
            ...(news.politica  || []),
            ...(news.gobierno  || []),
          ].sort((a, b) => b.ts - a.ts);
          all.slice(0, 3).forEach(item => {
            items.push({
              id: `n-${item.id}`,
              type: "news",
              iso3, countryName: star.name,
              title: item.title,
              subtitle: item.source,
              ts: item.ts,
            });
          });
        } catch (_) {}
      }
    });

    return items.sort((a, b) => b.ts - a.ts).slice(0, 30);
  },
};

function resizeAvatar(dataUrl, cb) {
  const img = new Image();
  img.onload = () => {
    const MAX = 120;
    const scale = Math.min(MAX / img.width, MAX / img.height, 1);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(img, 0, 0, w, h);
    cb(canvas.toDataURL("image/jpeg", 0.78));
  };
  img.onerror = () => cb(dataUrl);
  img.src = dataUrl;
}

window.ProfileAPI = {
  get(email) {
    if (!email) return {};
    try { return JSON.parse(localStorage.getItem(STORAGE_PROFILE(email))) || {}; }
    catch (_) { return {}; }
  },
  save(email, data) {
    if (!email) return;
    try {
      localStorage.setItem(STORAGE_PROFILE(email), JSON.stringify(data));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        // Purge forum caches and retry
        const drop = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("aletheia.forum.thread.")) drop.push(k);
        }
        drop.forEach(k => localStorage.removeItem(k));
        localStorage.removeItem("aletheia.forum.seedv");
        try { localStorage.setItem(STORAGE_PROFILE(email), JSON.stringify(data)); } catch (_) {}
      }
    }
  },
  getPostCount(userName) {
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith("aletheia.forum.thread.")) continue;
        const posts = JSON.parse(localStorage.getItem(k)) || [];
        count += posts.filter(p => p.kind === "user" && p.user === userName).length;
      }
    } catch (_) {}
    return count;
  },
  getReputation(postCount) {
    for (const lvl of REPUTATION_LEVELS) {
      if (postCount >= lvl.min) return lvl;
    }
    return REPUTATION_LEVELS[REPUTATION_LEVELS.length - 1];
  },
  getUserActivity(userName) {
    const threadIndex = {};
    try {
      const threads = window.ForumAPI.listThreads();
      threads.forEach(t => { threadIndex[t.id] = t; });
    } catch (_) {}

    const posts = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith("aletheia.forum.thread.")) continue;
        const threadId = k.replace("aletheia.forum.thread.", "");
        const thread = threadIndex[threadId];
        const raw = JSON.parse(localStorage.getItem(k)) || [];
        raw.filter(p => p.kind === "user" && p.user === userName)
           .forEach(p => posts.push({ ...p, thread }));
      }
    } catch (_) {}

    posts.sort((a, b) => b.ts - a.ts);

    const countryMap = {};
    posts.forEach(p => {
      if (!p.thread?.iso3) return;
      const iso = p.thread.iso3;
      if (!countryMap[iso]) countryMap[iso] = { iso3: iso, name: p.thread.country || iso, count: 0, region: p.thread.region };
      countryMap[iso].count++;
    });
    const countries = Object.values(countryMap).sort((a, b) => b.count - a.count);

    return { recentPosts: posts.slice(0, 8), countries: countries.slice(0, 8) };
  },
};

function ProfilePage({ user, onClose, theme }) {
  const { useState, useRef, useEffect } = React;

  const saved = window.ProfileAPI.get(user.email);

  const [editing, setEditing] = useState(false);
  const [bio,    setBio]    = useState(saved.bio    || "");
  const [avatar, setAvatar] = useState(saved.avatar || null);
  const [banner, setBanner] = useState(saved.banner || BANNER_PRESETS[0]);
  const [score]             = useState(saved.score  ?? 10);

  const [draftBio,    setDraftBio]    = useState(bio);
  const [draftAvatar, setDraftAvatar] = useState(avatar);
  const [draftBanner, setDraftBanner] = useState(banner);

  const fileRef    = useRef(null);
  const postCount  = window.ProfileAPI.getPostCount(user.name);
  const reputation = window.ProfileAPI.getReputation(postCount);
  const activity   = window.ProfileAPI.getUserActivity(user.name);

  const createdAt = (() => {
    try {
      const users = JSON.parse(localStorage.getItem("aletheia.users")) || [];
      const u = users.find(x => x.email === user.email);
      return u?.createdAt ? new Date(u.createdAt) : null;
    } catch (_) { return null; }
  })();

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const initials = (user.name || "?")
    .split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();

  const openEdit = () => {
    setDraftBio(bio); setDraftAvatar(avatar); setDraftBanner(banner);
    setEditing(true);
  };
  const handleCancel = () => setEditing(false);
  const handleSave = () => {
    const newProfile = { bio: draftBio, avatar: draftAvatar, banner: draftBanner, score };
    window.ProfileAPI.save(user.email, newProfile);
    setBio(draftBio); setAvatar(draftAvatar); setBanner(draftBanner);
    setEditing(false);
  };
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => resizeAvatar(ev.target.result, setDraftAvatar);
    reader.readAsDataURL(file);
  };

  const activeBanner = editing ? draftBanner : banner;
  const activeAvatar = editing ? draftAvatar : avatar;

  const scoreColor = score >= 8 ? "#10b981" : score >= 5 ? "#f59e0b" : "#dc2626";

  return (
    <div className="pp-overlay">
      <div className="pp-shell">

        {/* Top nav */}
        <div className="pp-nav">
          <div className="pp-nav-left">
            <button className="pp-back" onClick={onClose}>← Volver</button>
            <span className="pp-nav-title">Perfil de usuario</span>
          </div>
          <div className="pp-nav-right">
            {editing ? (
              <>
                <button className="pp-btn primary" onClick={handleSave}>Guardar cambios</button>
                <button className="pp-btn" onClick={handleCancel}>Cancelar</button>
              </>
            ) : (
              <button className="pp-btn primary" onClick={openEdit}>Editar perfil</button>
            )}
          </div>
        </div>

        <div className="pp-body">

          {/* Banner */}
          <div className="pp-banner" style={{ background: activeBanner }}>
            {editing && (
              <div className="pp-banner-presets">
                <span className="pp-bp-lbl">Elige banner:</span>
                {BANNER_PRESETS.map((b, i) => (
                  <div
                    key={i}
                    className={`pp-bp${draftBanner === b ? " active" : ""}`}
                    style={{ background: b }}
                    onClick={() => setDraftBanner(b)}
                    title={`Banner ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Hero row */}
          <div className="pp-hero">
            <div className="pp-avatar-wrap">
              {activeAvatar
                ? <img className="pp-avatar" src={activeAvatar} alt="avatar" />
                : <div className="pp-avatar pp-avatar-initials">{initials}</div>
              }
              {editing && (
                <>
                  <button className="pp-avatar-edit" onClick={() => fileRef.current?.click()} title="Subir foto">✎</button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarFile} />
                </>
              )}
            </div>

            <div className="pp-identity">
              <div className="pp-name">{user.name}</div>
              {user.email && <div className="pp-email mono">{user.email}</div>}
              {createdAt && (
                <div className="pp-since">
                  Miembro desde {createdAt.toLocaleDateString("es", { month: "long", year: "numeric" })}
                </div>
              )}
              <div className="pp-rep-badge" style={{ color: reputation.color, borderColor: reputation.color + "55" }}>
                <span>{reputation.icon}</span>
                <span>{reputation.label}</span>
              </div>
            </div>

            {/* Score */}
            <div className="pp-score-card">
              <div className="pp-score-label">Puntuación</div>
              <div className="pp-score-big" style={{ color: scoreColor }}>
                {score}
                <span className="pp-score-of">/10</span>
              </div>
              <div className="pp-score-stars">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="pp-star" style={{ color: i < score ? scoreColor : "var(--line-2)" }}>★</span>
                ))}
              </div>
              <div className="pp-score-sub">{postCount} publicaciones</div>
            </div>
          </div>

          {/* Bio */}
          <div className="pp-section">
            <div className="pp-section-lbl">Sobre mí</div>
            {editing ? (
              <div className="pp-bio-edit">
                <textarea
                  className="pp-bio-input"
                  placeholder="Periodista, analista, ciudadano… cuéntanos quién eres."
                  value={draftBio}
                  maxLength={280}
                  onChange={e => setDraftBio(e.target.value)}
                  rows={3}
                />
                <div className="pp-bio-counter">{draftBio.length}/280</div>
              </div>
            ) : (
              <div className="pp-bio-text">
                {bio || <span className="pp-empty">Sin descripción — edita tu perfil para agregar una.</span>}
              </div>
            )}
          </div>

          {/* Países seguidos */}
          {(() => {
            const starData = window.StarAPI.get(user.email);
            const starred = Object.values(starData).sort((a, b) => b.starredAt - a.starredAt);
            return (
              <div className="pp-section pp-starred-section">
                <div className="pp-section-lbl">
                  Países seguidos
                  <span className="pp-starred-count">{starred.length}</span>
                </div>
                {starred.length === 0 ? (
                  <div style={{ color: "var(--text-3)", fontSize: 12, fontStyle: "italic" }}>
                    Ningún país seguido. Haz clic en ★ en la ficha de un país para seguirlo.
                  </div>
                ) : (
                  <div className="pp-starred-grid">
                    {starred.map(s => {
                      const c = (window.COUNTRIES || []).find(x => x.iso3 === s.iso3);
                      const _yr = window.YEARS ? window.YEARS[window.YEARS.length - 1] : 2025;
                      const score = c ? c.scores[_yr] : null;
                      return (
                        <div key={s.iso3} className="pp-starred-chip">
                          <span className="pp-sc-star">★</span>
                          <div className="pp-sc-info">
                            <div className="pp-sc-name">{s.name}</div>
                            <div className="pp-sc-region">{s.region}</div>
                          </div>
                          {score != null && (
                            <div className="pp-sc-score" style={{ color: scoreToColor(score) }}>
                              {score.toFixed(1)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Grid: interacciones + países */}
          <div className="pp-grid">

            {/* Últimas interacciones */}
            <div className="pp-card">
              <div className="pp-card-h">
                <span>Últimas interacciones</span>
                <span className="mono" style={{ color: "var(--text-3)", fontSize: 10 }}>{activity.recentPosts.length} registros</span>
              </div>
              {activity.recentPosts.length === 0 ? (
                <div className="pp-empty-state">
                  <div className="pp-empty-icon">💬</div>
                  <div>Aún no has publicado en el foro.</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>
                    Explora el mapa, selecciona un país y abre un hilo.
                  </div>
                </div>
              ) : activity.recentPosts.map((post, i) => (
                <div key={post.id || i} className="pp-interaction">
                  <div className="pp-int-top">
                    <span className="pp-int-country">
                      {post.thread?.country || "Hilo"}
                    </span>
                    <span className="pp-int-ts mono">{window.formatRelativeTime ? window.formatRelativeTime(post.ts) : ""}</span>
                  </div>
                  {post.thread?.title && (
                    <div className="pp-int-thread">{post.thread.title}</div>
                  )}
                  <div className="pp-int-text">«{post.text.length > 100 ? post.text.slice(0, 98) + "…" : post.text}»</div>
                  {post.likes > 0 && (
                    <div className="pp-int-likes">♥ {post.likes}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Países de interés */}
            <div className="pp-card">
              <div className="pp-card-h">
                <span>Países de interés</span>
                <span className="mono" style={{ color: "var(--text-3)", fontSize: 10 }}>{activity.countries.length} países</span>
              </div>
              {activity.countries.length === 0 ? (
                <div className="pp-empty-state">
                  <div className="pp-empty-icon">🗺</div>
                  <div>Ningún país registrado aún.</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>
                    Tus publicaciones en el foro determinarán tus países de interés.
                  </div>
                </div>
              ) : activity.countries.map((c, i) => {
                const country = window.COUNTRIES ? window.COUNTRIES.find(x => x.iso3 === c.iso3) : null;
                const _latestYr = window.YEARS ? window.YEARS[window.YEARS.length - 1] : 2025;
                const score2024 = country ? country.scores[_latestYr] : null;
                const maxCount = activity.countries[0].count;
                return (
                  <div key={c.iso3} className="pp-country-row">
                    <div className="pp-cr-left">
                      <span className="pp-cr-rank mono">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="pp-cr-name">{c.name}</div>
                        <div className="pp-cr-region">{c.region}</div>
                      </div>
                    </div>
                    <div className="pp-cr-right">
                      <div className="pp-cr-bar-wrap">
                        <div
                          className="pp-cr-bar"
                          style={{ width: `${(c.count / maxCount) * 100}%` }}
                        />
                      </div>
                      <span className="pp-cr-count mono">{c.count} post{c.count !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Reputation track */}
          <div className="pp-section pp-rep-track-section">
            <div className="pp-section-lbl">Camino de reputación</div>
            <div className="pp-rep-track">
              {REPUTATION_LEVELS.slice().reverse().map((lvl) => {
                const reached = postCount >= lvl.min;
                const isCurrent = reputation.label === lvl.label;
                return (
                  <div key={lvl.label} className={`pp-rep-step${reached ? " reached" : ""}${isCurrent ? " current" : ""}`}>
                    <div className="pp-rep-step-icon" style={reached ? { color: lvl.color, borderColor: lvl.color } : {}}>
                      {lvl.icon}
                    </div>
                    <div className="pp-rep-step-label">{lvl.label}</div>
                    <div className="pp-rep-step-min">{lvl.min}+ posts</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

window.ProfileModal = ProfilePage;
