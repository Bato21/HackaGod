// forum.js — Foro Alethia. API multi-hilo determinística con sincronización
// entre pestañas vía BroadcastChannel + storage events.
//
// Cada país tiene varios hilos:
//   1. Conversación general (sin año)
//   2. Un hilo por período presidencial (2015–18, 2019–22, 2023–24)
//   3. "Año más turbio" (pico del índice)
//   4. "Año más limpio" (mínimo del índice)
//   5. Un hilo basado en el primer evento del año pico
//
// Total ≈ 6 × 29 ≈ 174 hilos.
//
// API:
//   window.ForumAPI.listThreads(filter) → [thread + count + lastTs]
//   window.ForumAPI.getThread(id)       → { thread, posts }
//   window.ForumAPI.addPost(id,u,text)  → post
//   window.ForumAPI.like(id, pid, ±1)
//   window.ForumAPI.subscribe(id|"*", cb)

(function() {
  const STORAGE_THREAD = (id) => `alethia.forum.thread.${id}`;
  const STORAGE_USER_THREADS = "alethia.forum.user_threads";
  const CHANNEL = "alethia.forum.v2";
  let bc = null;
  try { bc = ("BroadcastChannel" in window) ? new BroadcastChannel(CHANNEL) : null; } catch (_) {}

  // ── PRNG / helpers ─────────────────────────────────────────────────
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
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  // ── Usuarios bots ──────────────────────────────────────────────────
  const BOT_USERS = [
    { name: "Ana Veedor",       handle: "@ana_veedor",   accent: "#f59e0b" },
    { name: "Pancho Rojas",     handle: "@pancho.r",     accent: "#38bdf8" },
    { name: "Julieta Salinas",  handle: "@julieta_s",    accent: "#a78bfa" },
    { name: "Carlos Kohler",    handle: "@ck",           accent: "#10b981" },
    { name: "Nayara Mendes",    handle: "@nayara.m",     accent: "#f472b6" },
    { name: "Diego Mora",       handle: "@dmora",        accent: "#fbbf24" },
    { name: "Sofía Granda",     handle: "@sg.granda",    accent: "#22d3ee" },
    { name: "Tomás Pizarro",    handle: "@tomaspz",      accent: "#fb7185" },
    { name: "Lucía Aravena",    handle: "@luciaa",       accent: "#84cc16" },
    { name: "Renata Vidal",     handle: "@rvidal",       accent: "#e879f9" },
    { name: "Mateo Linares",    handle: "@mateoln",      accent: "#06b6d4" },
    { name: "Elena Pacheco",    handle: "@elena.p",      accent: "#fdba74" },
    { name: "Sebastián Henríquez", handle: "@sebahz",   accent: "#a3e635" },
    { name: "Camila Bermúdez",  handle: "@kmilab",       accent: "#f9a8d4" },
    { name: "Esteban Quintana", handle: "@e_quintana",   accent: "#7dd3fc" },
    { name: "Isabel Mansilla",  handle: "@isamn",        accent: "#fcd34d" },
    { name: "Andrés Cisneros",  handle: "@acisn",        accent: "#c4b5fd" },
    { name: "Mercedes Galindo", handle: "@mgalindo",     accent: "#fda4af" },
  ];

  // ── Pools de posts según scope del hilo ────────────────────────────
  const POSTS_PAIS_HIGH = [
    "¿Alguien más vio el reportaje de anoche? Esto ya es escandaloso.",
    "Llevo meses siguiendo este caso y nadie hace nada. ¿Hasta cuándo?",
    "Lo peor es que los nombres siempre se repiten. Mismas familias, mismos contratos.",
    "La fiscalía debería actuar de oficio, hay evidencia suficiente.",
    "Mientras tanto la gente sigue sin servicios básicos. Una vergüenza.",
    "Recomiendo el informe de la ONG local, está bien documentado.",
    "Cada vez que pienso que tocamos fondo, aparece algo peor.",
    "Y la prensa internacional silenciada por publicidad oficial. Triste.",
    "¿Hasta cuándo vamos a aguantar este nivel de cinismo institucional?",
    "Las renuncias ya no son contención, son el paso previo a otra cosa.",
  ];
  const POSTS_PAIS_MID = [
    "Interesante el dato del Top 10. ¿De dónde sale la metodología?",
    "Comparándolo con el año pasado, sí se nota una leve mejora.",
    "Yo creo que el problema no es solo penal, también es cultural.",
    "Lo que necesitamos es transparencia activa, no reactiva.",
    "Si hubiera más datos abiertos sería más fácil contrastar.",
    "Recomiendo ver cómo lo hicieron en otros países de la región.",
    "Pregunta sincera: ¿qué se considera \"reforma estructural\" acá?",
    "La gráfica es clarísima. Toca seguirla mes a mes.",
    "Sin pluralidad en prensa no hay control real.",
    "¿Alguien tiene el link a la última auditoría de la contraloría?",
  ];
  const POSTS_PAIS_LOW = [
    "Buena noticia, hay que reconocer cuando algo mejora.",
    "Los datos abiertos cambiaron el juego en mi región.",
    "Felicitaciones a las periodistas que destaparon este caso.",
    "Vale la pena leer el último informe de la contraloría.",
    "Si esto sigue así en 5 años podríamos estar en el top 5.",
    "La auditoría ciudadana funciona, lo comprobé en mi comuna.",
    "Buen análisis. ¿Alguien tiene el link al portal?",
    "Lo importante es que la conversación siga abierta y plural.",
  ];

  const POSTS_GOB_HIGH = [
    "Este gabinete pasará a la historia por las razones equivocadas.",
    "Tres ministros bajo investigación en menos de un año. Un récord.",
    "La aprobación cae porque ya nadie cree el relato oficial.",
    "Las renuncias en cascada muestran que el círculo cercano se está protegiendo.",
    "Notable cómo el oficialismo desvía la conversación cada vez que sale un caso.",
    "El veto a la ley de transparencia activa fue la gota que rebalsó.",
    "El apoyo legislativo se sostiene por arreglos, no por convicción.",
    "Lo que más sorprende es la falta de autocrítica del entorno presidencial.",
    "Sin reforma de financiamiento de partidos, esto se repite cada gobierno.",
  ];
  const POSTS_GOB_MID = [
    "El presidente tiene buenas intenciones pero el gabinete pesa.",
    "Aprobación 50% es un número alto considerando el contexto.",
    "Habría que separar lo discursivo de las decisiones presupuestarias.",
    "La política exterior salva al gobierno; en lo interno hay problemas.",
    "Es un gobierno de centro tratando de no romper nada. Para bien y para mal.",
    "El nombramiento del ministro de Justicia genera más dudas que certezas.",
    "Buen análisis del período. Falta evaluar qué proyectos quedaron a medio camino.",
    "El apoyo legislativo se construye semana a semana en este Congreso.",
  ];
  const POSTS_GOB_LOW = [
    "Quizás no fue glamoroso, pero entregó las cuentas en orden.",
    "El gobierno que más leyes de transparencia firmó en una década.",
    "Aprobación sostenida, sin escándalos mayores. No es poco.",
    "El gabinete técnico funcionó. Discutible políticamente, eficiente operativamente.",
    "Quedará en la memoria por la reforma del sistema de compras públicas.",
    "Es el caso a estudiar para los próximos gobiernos de la región.",
  ];

  const POSTS_PEAK = [
    "Ese año marcó un antes y después en la conversación pública.",
    "Recuerdo los noticieros: caso tras caso, sin pausa.",
    "Lo peor es que muchas de esas investigaciones quedaron en nada.",
    "Hay que volver a esos meses para entender el cinismo actual.",
    "Tres ministros cayeron en seis meses. Una caída libre institucional.",
    "Documentales internacionales todavía citan esos hechos como caso de estudio.",
    "Quedó claro que sin presión ciudadana la justicia no se mueve.",
    "Lo único bueno: ese año nació la red de fiscalización ciudadana.",
    "Después de ese año el periodismo de datos en la región cambió.",
  ];
  const POSTS_DIP = [
    "Si en ese año se pudo, ¿por qué dejó de hacerse?",
    "Buena referencia para argumentar reformas en otros países.",
    "El contexto internacional ayudó pero también hubo voluntad política real.",
    "Vale la pena estudiar la composición del gabinete de esa época.",
    "Curioso cómo nadie recuerda ese año como bueno, pero las cifras lo dicen.",
    "Es el contraejemplo de que la corrupción no es destino.",
    "Mostraron que con transparencia activa y prensa libre se podía.",
  ];
  const POSTS_EVENT = [
    "Este caso ilustra perfectamente el problema sistémico.",
    "¿Qué pasó al final con los imputados?",
    "Recuerdo el seguimiento que le hizo la prensa local en su momento.",
    "El monto involucrado siempre se queda corto frente al daño institucional.",
    "Le dimos demasiado pronto vuelta a la página en este caso.",
    "El reportaje original es de lectura obligatoria todavía hoy.",
    "Una vergüenza que la audiencia haya sido aplazada tantas veces.",
    "Lo más grave no fue lo evidente, fue lo que después se supo que se ocultó.",
    "¿Alguien tiene un timeline completo de este caso?",
  ];

  // ── Selección de pool por scope + score ─────────────────────────────
  function poolForThread(r, thread, score) {
    const high = score >= 65, mid = score >= 45;
    if (thread.scope === "país") {
      if (high) return r() < 0.7 ? POSTS_PAIS_HIGH : (r() < 0.5 ? POSTS_PAIS_MID : POSTS_PAIS_LOW);
      if (mid)  return r() < 0.35 ? POSTS_PAIS_HIGH : (r() < 0.75 ? POSTS_PAIS_MID : POSTS_PAIS_LOW);
      return r() < 0.15 ? POSTS_PAIS_HIGH : (r() < 0.4 ? POSTS_PAIS_MID : POSTS_PAIS_LOW);
    }
    if (thread.scope === "gobierno") {
      if (high) return r() < 0.7 ? POSTS_GOB_HIGH : (r() < 0.5 ? POSTS_GOB_MID : POSTS_GOB_LOW);
      if (mid)  return r() < 0.35 ? POSTS_GOB_HIGH : (r() < 0.75 ? POSTS_GOB_MID : POSTS_GOB_LOW);
      return r() < 0.15 ? POSTS_GOB_HIGH : (r() < 0.4 ? POSTS_GOB_MID : POSTS_GOB_LOW);
    }
    // scope === "tema"
    if (thread.subtype === "peak") return POSTS_PEAK;
    if (thread.subtype === "dip")  return POSTS_DIP;
    return POSTS_EVENT;
  }

  function generatePost(seed, thread, score, ts) {
    const r = mulberry32(seed);
    const user = pick(r, BOT_USERS);
    const pool = poolForThread(r, thread, score);
    return {
      id: `bot-${seed.toString(36)}`,
      user: user.name,
      handle: user.handle,
      accent: user.accent,
      kind: "bot",
      text: pick(r, pool),
      ts,
      likes: Math.floor(r() * 18),
    };
  }

  function seedPosts(thread) {
    const country = window.COUNTRIES.find(c => c.iso3 === thread.iso3);
    if (!country) return [];
    const score = thread.year != null ? country.scores[thread.year] : country.scores[2024];
    const r = mulberry32(hash(thread.id + ":count"));
    const count = 4 + Math.floor(r() * 7); // 4–10 posts iniciales
    const baseSeed = hash(thread.id + ":seed");
    // Distribuir timestamps: del más antiguo (semanas) al más reciente (minutos)
    const now = Date.now();
    const offsets = [];
    let acc = 5 * 60 * 1000; // empieza ~5 min atrás
    for (let i = 0; i < count; i++) {
      offsets.push(acc);
      acc += (1.5 + r() * 4) * 60 * 60 * 1000; // 1.5–5.5 h adicionales por post
    }
    // Más antiguo primero
    const posts = [];
    for (let i = 0; i < count; i++) {
      const ts = now - offsets[count - 1 - i];
      posts.push(generatePost(baseSeed + i * 257, thread, score, ts));
    }
    return posts;
  }

  function loadPosts(thread) {
    try {
      const raw = localStorage.getItem(STORAGE_THREAD(thread.id));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    const seeded = seedPosts(thread);
    try { localStorage.setItem(STORAGE_THREAD(thread.id), JSON.stringify(seeded)); } catch(_) {}
    return seeded;
  }

  // ── Construcción del índice de hilos ────────────────────────────────
  let _indexCache = null;

  function buildIndex() {
    const list = [];
    if (!window.COUNTRIES) return list;
    const PERIODS = [
      { start: 2015, end: 2018 },
      { start: 2019, end: 2022 },
      { start: 2023, end: 2024 },
    ];

    window.COUNTRIES.forEach(c => {
      // 1. Conversación general
      list.push({
        id: `${c.iso3}-general`,
        iso3: c.iso3, country: c.name, region: c.region,
        scope: "país",
        title: `Conversación abierta · ${c.name}`,
        subtitle: "Hilo permanente del país · sin año",
        year: null,
      });

      // 2. Hilos por gobierno (período presidencial)
      PERIODS.forEach(({ start, end }) => {
        let detail = null;
        if (typeof window.COUNTRY_DETAIL === "function") {
          try { detail = window.COUNTRY_DETAIL(c, start); } catch (_) {}
        }
        const pres = detail?.president;
        list.push({
          id: `${c.iso3}-gov-${start}`,
          iso3: c.iso3, country: c.name, region: c.region,
          scope: "gobierno",
          title: pres ? `Gobierno de ${pres.name}` : `Período ${start}–${end}`,
          subtitle: pres
            ? `${start}–${end} · ${pres.party.short} (${pres.party.tone})`
            : `${start}–${end} · ${c.name}`,
          year: start,
          period: [start, end],
          presName: pres?.name,
          presParty: pres?.party?.short,
        });
      });

      // 3. Peak / dip
      const years = window.YEARS;
      let maxY = years[0], minY = years[0];
      years.forEach(y => {
        if (c.scores[y] > c.scores[maxY]) maxY = y;
        if (c.scores[y] < c.scores[minY]) minY = y;
      });
      list.push({
        id: `${c.iso3}-peak-${maxY}`,
        iso3: c.iso3, country: c.name, region: c.region,
        scope: "tema",
        subtype: "peak",
        title: `${c.name} en ${maxY}: el año más oscuro`,
        subtitle: `Pico del índice · ${c.scores[maxY].toFixed(1)}/100`,
        year: maxY,
        score: c.scores[maxY],
      });
      list.push({
        id: `${c.iso3}-dip-${minY}`,
        iso3: c.iso3, country: c.name, region: c.region,
        scope: "tema",
        subtype: "dip",
        title: `${c.name} en ${minY}: un respiro`,
        subtitle: `Mínimo del índice · ${c.scores[minY].toFixed(1)}/100`,
        year: minY,
        score: c.scores[minY],
      });

      // 4. Evento del año pico (si hay)
      if (typeof window.COUNTRY_DATA === "function") {
        try {
          const data = window.COUNTRY_DATA(c, maxY);
          if (data?.events?.length) {
            const ev = data.events[0];
            const shortTxt = ev.text.length > 88 ? ev.text.slice(0, 86) + "…" : ev.text;
            list.push({
              id: `${c.iso3}-event-${maxY}-0`,
              iso3: c.iso3, country: c.name, region: c.region,
              scope: "tema",
              subtype: "event",
              title: shortTxt,
              subtitle: `${ev.sector} · ${maxY} · ${c.name}`,
              year: maxY,
              eventRef: { year: maxY, idx: 0, sector: ev.sector, date: ev.date },
            });
          }
        } catch (_) {}
      }
    });

    return list;
  }

  function getIndex() {
    if (!_indexCache) _indexCache = buildIndex().concat(loadUserThreads());
    return _indexCache;
  }

  function loadUserThreads() {
    try {
      const raw = localStorage.getItem(STORAGE_USER_THREADS);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) return list;
      }
    } catch (_) {}
    return [];
  }
  function saveUserThreads(list) {
    try { localStorage.setItem(STORAGE_USER_THREADS, JSON.stringify(list)); } catch (_) {}
  }

  function summarize(thread) {
    const posts = loadPosts(thread);
    return {
      ...thread,
      replyCount: posts.length,
      lastTs: posts.length ? posts[posts.length - 1].ts : Date.now() - 7 * 86400000,
    };
  }

  // ── API pública ────────────────────────────────────────────────────
  window.ForumAPI = {
    listThreads(filter = {}) {
      let list = getIndex();
      if (filter.iso3)   list = list.filter(t => t.iso3 === filter.iso3);
      if (filter.region) list = list.filter(t => t.region === filter.region);
      if (filter.scope && filter.scope !== "todos")
        list = list.filter(t => t.scope === filter.scope);
      if (filter.year != null && filter.year !== "todos") {
        const y = Number(filter.year);
        list = list.filter(t =>
          t.year === y ||
          (t.period && y >= t.period[0] && y <= t.period[1])
        );
      }
      if (filter.query && filter.query.trim()) {
        const q = filter.query.trim().toLowerCase();
        list = list.filter(t =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q) ||
          t.country.toLowerCase().includes(q) ||
          t.iso3.toLowerCase().includes(q) ||
          (t.presName && t.presName.toLowerCase().includes(q))
        );
      }
      const out = list.map(summarize);
      const sort = filter.sort || "recent";
      if (sort === "recent")    out.sort((a, b) => b.lastTs - a.lastTs);
      else if (sort === "busy") out.sort((a, b) => b.replyCount - a.replyCount);
      else if (sort === "country") out.sort((a, b) => a.country.localeCompare(b.country));
      return out;
    },
    getThread(id) {
      const thread = getIndex().find(t => t.id === id);
      if (!thread) return null;
      return { thread, posts: loadPosts(thread) };
    },
    addPost(threadId, user, text) {
      const thread = getIndex().find(t => t.id === threadId);
      if (!thread) return null;
      const list = loadPosts(thread);
      const post = {
        id: `u-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        user: user?.name || "Anónimo",
        handle: user?.email
          ? `@${user.email.split("@")[0]}`
          : (user?.kind === "guest" ? "@invitado" : "@usuario"),
        accent: user?.kind === "guest" ? "#94a3b8" : "#facc15",
        kind: user?.kind === "guest" ? "guest" : "user",
        text: text.trim(),
        ts: Date.now(),
        likes: 0,
      };
      list.push(post);
      try { localStorage.setItem(STORAGE_THREAD(threadId), JSON.stringify(list)); } catch(_) {}
      try { bc && bc.postMessage({ type: "add", threadId, post }); } catch(_) {}
      return post;
    },
    like(threadId, postId, delta = 1) {
      const thread = getIndex().find(t => t.id === threadId);
      if (!thread) return;
      const list = loadPosts(thread);
      const p = list.find(x => x.id === postId);
      if (!p) return;
      p.likes = Math.max(0, (p.likes || 0) + delta);
      try { localStorage.setItem(STORAGE_THREAD(threadId), JSON.stringify(list)); } catch(_) {}
      try { bc && bc.postMessage({ type: "like", threadId, postId, likes: p.likes }); } catch(_) {}
    },
    // Crear hilo nuevo desde una noticia / acción del usuario.
    // spec: { iso3, country, region, title, subtitle?, year?, source?, scope?, subtype? }
    createThread(spec) {
      if (!spec || !spec.iso3 || !spec.title) return null;
      const id = `user-${spec.iso3}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
      const thread = {
        id,
        iso3: spec.iso3,
        country: spec.country,
        region: spec.region,
        scope: spec.scope || "tema",
        subtype: spec.subtype || "news",
        title: spec.title.length > 140 ? spec.title.slice(0, 138) + "…" : spec.title,
        subtitle: spec.subtitle || `Hilo abierto por usuario · ${spec.country}`,
        year: spec.year ?? null,
        source: spec.source || null,
        userCreated: true,
        createdAt: Date.now(),
      };
      const list = loadUserThreads();
      list.push(thread);
      saveUserThreads(list);
      _indexCache = null; // forzar reconstrucción en próxima lectura
      // Inicializar posts vacíos para que el detalle abra de inmediato
      try { localStorage.setItem(STORAGE_THREAD(id), JSON.stringify([])); } catch (_) {}
      try { bc && bc.postMessage({ type: "thread_created", threadId: id, thread }); } catch (_) {}
      return thread;
    },
    subscribe(threadId, callback) {
      const onBC = (e) => {
        if (!e?.data) return;
        if (threadId === "*" || e.data.threadId === threadId) callback(e.data);
      };
      const onStorage = (e) => {
        if (!e.key) return;
        const prefix = "alethia.forum.thread.";
        if (e.key.startsWith(prefix)) {
          const id = e.key.slice(prefix.length);
          if (threadId === "*" || id === threadId) callback({ type: "reload", threadId: id });
        }
      };
      bc && bc.addEventListener("message", onBC);
      window.addEventListener("storage", onStorage);
      return () => {
        bc && bc.removeEventListener("message", onBC);
        window.removeEventListener("storage", onStorage);
      };
    },
  };

  // Tiempo relativo en español
  window.formatRelativeTime = function(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "ahora mismo";
    const m = Math.floor(s / 60);
    if (m < 60) return `hace ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h} h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `hace ${d} d`;
    if (d < 30) return `hace ${Math.floor(d / 7)} sem`;
    return new Date(ts).toLocaleDateString("es", { day: "numeric", month: "short" });
  };
})();
