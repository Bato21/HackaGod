// Foro — discusión por país. Persistencia local, sincronización entre
// pestañas en tiempo real vía BroadcastChannel + storage event.

(function() {
  const STORAGE_KEY = (iso3) => `alethia.forum.${iso3}`;
  const CHANNEL = "alethia.forum";
  let bc = null;
  try { bc = ("BroadcastChannel" in window) ? new BroadcastChannel(CHANNEL) : null; } catch (_) {}

  // ── PRNG determinístico (mulberry32) ─────────────────────────────────
  function mulberry32(seed) {
    return function() {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function pick(rand, arr) { return arr[Math.floor(rand() * arr.length)]; }

  // ── Usuarios bot (avatares con iniciales) ────────────────────────────
  const BOT_USERS = [
    { name: "Ana Veedor",       handle: "@ana_veedor",     accent: "#f59e0b" },
    { name: "Pancho Rojas",     handle: "@pancho.r",       accent: "#38bdf8" },
    { name: "Julieta Salinas",  handle: "@julieta_s",      accent: "#a78bfa" },
    { name: "Carlos Kohler",    handle: "@ck",             accent: "#10b981" },
    { name: "Nayara Mendes",    handle: "@nayara.m",       accent: "#f472b6" },
    { name: "Diego Mora",       handle: "@dmora",          accent: "#fbbf24" },
    { name: "Sofía Granda",     handle: "@sg.granda",      accent: "#22d3ee" },
    { name: "Tomás Pizarro",    handle: "@tomaspz",        accent: "#fb7185" },
  ];

  // ── Plantillas de mensaje según nivel de corrupción ──────────────────
  const POSTS_HIGH = [
    "¿Alguien más vio el reportaje de anoche? Esto ya es escandaloso.",
    "Llevo meses siguiendo este caso y nadie hace nada. ¿Hasta cuándo?",
    "Lo peor es que los nombres siempre se repiten. Mismas familias, mismos contratos.",
    "La fiscalía debería actuar de oficio, hay evidencia suficiente.",
    "Mientras tanto la gente sigue sin servicios básicos. Una vergüenza.",
    "Recomiendo el informe de la ONG local, está bien documentado.",
    "Cada vez que pienso que tocamos fondo, aparece algo peor.",
    "Y la prensa internacional silenciada por publicidad oficial. Triste.",
  ];
  const POSTS_MID = [
    "Interesante el dato del Top 10. ¿De dónde sale la metodología?",
    "Comparándolo con el año pasado, sí se nota una leve mejora.",
    "Yo creo que el problema no es solo penal, también es cultural.",
    "Lo que necesitamos es transparencia activa, no reactiva.",
    "Si hubiera más datos abiertos sería más fácil contrastar.",
    "Recomiendo ver cómo lo hicieron en otros países de la región.",
    "Pregunta sincera: ¿qué se considera \"reforma estructural\" acá?",
    "La gráfica es clarísima. Toca seguirla mes a mes.",
  ];
  const POSTS_LOW = [
    "Buena noticia, hay que reconocer cuando algo mejora.",
    "Los datos abiertos cambiaron el juego en mi región.",
    "Felicitaciones a las periodistas que destaparon este caso.",
    "Vale la pena leer el último informe de la contraloría.",
    "Si esto sigue así en 5 años podríamos estar en el top 5.",
    "La auditoría ciudadana funciona, lo comprobé en mi comuna.",
    "Buen análisis. ¿Alguien tiene el link al portal?",
    "Lo importante es que la conversación siga abierta y plural.",
  ];

  function generateBotPost(country, year, score, t /* timestamp */, seed) {
    const r = mulberry32(seed);
    const user = pick(r, BOT_USERS);
    let pool;
    if (score >= 65) pool = r() < 0.7 ? POSTS_HIGH : (r() < 0.5 ? POSTS_MID : POSTS_LOW);
    else if (score >= 45) pool = r() < 0.4 ? POSTS_HIGH : (r() < 0.8 ? POSTS_MID : POSTS_LOW);
    else pool = r() < 0.2 ? POSTS_HIGH : (r() < 0.5 ? POSTS_MID : POSTS_LOW);
    return {
      id: `bot-${seed.toString(36)}`,
      user: user.name,
      handle: user.handle,
      accent: user.accent,
      kind: "bot",
      text: pick(r, pool),
      ts: t,
      likes: Math.floor(r() * 12),
    };
  }

  // ── API ──────────────────────────────────────────────────────────────
  window.ForumAPI = {
    // Devuelve lista de posts (cargando o sembrando si está vacío)
    load(country, year) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY(country.iso3));
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (_) {}
      // Sembrar bot posts iniciales
      const seeds = [];
      const score = country.scores[year];
      const baseSeed = hash(country.iso3 + ":forum");
      const now = Date.now();
      const offsets = [
        2 * 24 * 3600 * 1000,
        18 * 3600 * 1000,
        9 * 3600 * 1000,
        3 * 3600 * 1000,
        45 * 60 * 1000,
        12 * 60 * 1000,
      ];
      offsets.forEach((off, i) => {
        seeds.push(generateBotPost(country, year, score, now - off, baseSeed + i * 99));
      });
      this._save(country.iso3, seeds);
      return seeds;
    },
    _save(iso3, posts) {
      localStorage.setItem(STORAGE_KEY(iso3), JSON.stringify(posts));
    },
    add(country, year, user, text) {
      const list = this.load(country, year);
      const post = {
        id: `u-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        user: user?.name || "Anónimo",
        handle: user?.email ? `@${user.email.split("@")[0]}` : (user?.kind === "guest" ? "@invitado" : "@usuario"),
        accent: user?.kind === "guest" ? "#94a3b8" : "#facc15",
        kind: user?.kind === "guest" ? "guest" : "user",
        text: text.trim(),
        ts: Date.now(),
        likes: 0,
      };
      list.push(post);
      this._save(country.iso3, list);
      // Broadcast a otras pestañas
      try { bc && bc.postMessage({ type: "add", iso3: country.iso3, post }); } catch (_) {}
      return post;
    },
    like(iso3, postId, delta = 1) {
      const raw = localStorage.getItem(STORAGE_KEY(iso3));
      if (!raw) return;
      const list = JSON.parse(raw);
      const p = list.find(x => x.id === postId);
      if (!p) return;
      p.likes = Math.max(0, (p.likes || 0) + delta);
      this._save(iso3, list);
      try { bc && bc.postMessage({ type: "like", iso3, postId, likes: p.likes }); } catch (_) {}
    },
    // Suscripción a cambios — devuelve función de unsubscribe
    subscribe(iso3, callback) {
      const onBC = (e) => {
        if (e.data?.iso3 === iso3) callback(e.data);
      };
      const onStorage = (e) => {
        if (e.key === STORAGE_KEY(iso3)) callback({ type: "reload", iso3 });
      };
      bc && bc.addEventListener("message", onBC);
      window.addEventListener("storage", onStorage);
      return () => {
        bc && bc.removeEventListener("message", onBC);
        window.removeEventListener("storage", onStorage);
      };
    },
  };

  // ── Helpers ──────────────────────────────────────────────────────────
  window.formatRelativeTime = function(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "ahora mismo";
    const m = Math.floor(s / 60);
    if (m < 60) return `hace ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `hace ${d} d`;
    return new Date(ts).toLocaleDateString("es", { day: "numeric", month: "short" });
  };
})();
