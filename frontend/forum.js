// forum.js — Foro Aletheia. API multi-hilo determinística con sincronización
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
  const STORAGE_THREAD = (id) => `aletheia.forum.thread.${id}`;
  const STORAGE_USER_THREADS = "aletheia.forum.user_threads";
  const CHANNEL = "aletheia.forum.v2";
  const SEED_VERSION = "5-rich"; // bump to force re-seed with curated threads
  const SEED_VER_KEY = "aletheia.forum.seedv";

  // Force re-seed if seed version changed
  (function migrate() {
    if (localStorage.getItem(SEED_VER_KEY) !== SEED_VERSION) {
      const drop = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("aletheia.forum.thread.")) drop.push(k);
      }
      drop.forEach(k => localStorage.removeItem(k));
      localStorage.setItem(SEED_VER_KEY, SEED_VERSION);
    }
  })();

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

  const POSTS_REPLY = [
    "Totalmente de acuerdo. Llevamos años viendo lo mismo sin que nadie rinda cuentas.",
    "Eso es exactamente lo que ocurre: hay captura del aparato judicial.",
    "La clave está en quién nombra a los fiscales. Hasta que eso no cambie, nada cambia.",
    "Añadiría que la presión ciudadana es lo único que ha funcionado históricamente.",
    "Exacto. Y los medios internacionales ayudan cuando los locales están amordazados.",
    "El problema es estructural. No hay reforma cosmética que lo resuelva.",
    "Comparto el análisis, aunque creo que el contexto regional importa más de lo que pensamos.",
    "Sí, pero ¿qué mecanismo concreto propones? El diagnóstico ya lo tenemos claro.",
    "Este tipo de conversaciones son las que faltan en los espacios institucionales.",
    "Justo lo que señalaba el informe de transparencia del año pasado. Nadie lo leyó.",
    "Gracias por sacar este punto. Muchos lo piensan pero no lo dicen públicamente.",
    "No estoy del todo de acuerdo: hay matices importantes que no estamos considerando.",
    "El ciclo se repite: denuncia, escándalo, olvido. Necesitamos memoria institucional.",
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
    if (thread.subtype === "peak")  return POSTS_PEAK;
    if (thread.subtype === "dip")   return POSTS_DIP;
    if (thread.subtype === "reply") return POSTS_REPLY;
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
    const score = thread.year != null ? country.scores[thread.year] : country.scores[window.YEARS[window.YEARS.length - 1]];
    const r = mulberry32(hash(thread.id + ":count"));
    const opening = Array.isArray(thread.openingPosts) ? thread.openingPosts : [];
    const baseSeed = hash(thread.id + ":seed");
    const now = Date.now();

    // Modo diálogo rico: si el hilo trae ≥4 openingPosts (con o sin replyToIdx),
    // se usa como conversación completa sin relleno genérico.
    const rich = opening.length >= 4;

    // Cuenta raíces (no-replies) para calcular timestamps escalonados.
    const rootOpenings = opening.filter(p => typeof p.replyToIdx !== "number").length;
    const extraRoots = rich ? 0 : (3 + Math.floor(r() * 4));
    const rootCount = rootOpenings + extraRoots;

    const spacing = [];
    let acc = 4 * 60 * 1000;
    for (let i = 0; i < rootCount + 4; i++) {
      spacing.push(acc);
      acc += (1.5 + r() * 4) * 60 * 60 * 1000;
    }

    const posts = [];
    const idByIdx = {};      // opening idx → post id (para resolver replyToIdx)
    const tsByIdx = {};      // opening idx → ts (para replies encadenadas)
    let rootPtr = 0;

    opening.forEach((op, i) => {
      const isReply = typeof op.replyToIdx === "number";
      const id = `op-${baseSeed}-${i}`;
      idByIdx[i] = id;
      let ts, parentId = null;
      if (isReply) {
        parentId = idByIdx[op.replyToIdx] || null;
        const parentTs = tsByIdx[op.replyToIdx] != null ? tsByIdx[op.replyToIdx] : now;
        ts = parentTs + (15 + Math.floor(r() * 90)) * 60 * 1000;
      } else {
        // Root: primeros openings = más antiguos (arriba en la conversación).
        ts = now - spacing[rootCount - 1 - rootPtr];
        rootPtr++;
      }
      tsByIdx[i] = ts;
      posts.push({
        id, parentId,
        user: op.user, handle: op.handle, accent: op.accent,
        kind: "user",
        text: op.text,
        ts,
        likes: op.likes != null ? op.likes : 5 + Math.floor(r() * 22),
      });
    });

    // Modo legacy: rellenar con posts genéricos + replies aleatorias.
    if (!rich) {
      for (let i = 0; i < extraRoots; i++) {
        const ts = now - spacing[rootCount - 1 - rootPtr];
        rootPtr++;
        posts.push(generatePost(baseSeed + i * 257, thread, score, ts));
      }
      const replyPool = [
        "Totalmente de acuerdo. Llevamos años viendo lo mismo.",
        "La clave está en quién nombra a los fiscales. Hasta que eso no cambie, nada cambia.",
        "Añadiría que la presión ciudadana es lo único que ha funcionado históricamente.",
        "Exacto. Y los medios internacionales ayudan cuando los locales están amordazados.",
        "El problema es estructural. No hay reforma cosmética que lo resuelva.",
        "Comparto el análisis, aunque creo que el contexto regional importa más.",
        "Sí, pero ¿qué mecanismo concreto propones? El diagnóstico ya lo tenemos.",
        "Gracias por sacar este punto. Muchos lo piensan pero no lo dicen públicamente.",
        "No estoy del todo de acuerdo: hay matices que no estamos considerando.",
        "El ciclo se repite: denuncia, escándalo, olvido. Necesitamos memoria institucional.",
      ];
      if (posts.length >= 2) {
        const rng = mulberry32(baseSeed + 9999);
        [0, 1].forEach((ri, ii) => {
          const bot = pick(rng, BOT_USERS);
          posts.push({
            id: `bot-r-${baseSeed}-${ii}`,
            parentId: posts[0].id,
            user: bot.name, handle: bot.handle, accent: bot.accent,
            kind: "bot",
            text: replyPool[Math.floor(rng() * replyPool.length)],
            ts: posts[0].ts + (20 + ii * 35) * 60 * 1000,
            likes: Math.floor(rng() * 12),
          });
        });
        const bot2 = pick(rng, BOT_USERS);
        posts.push({
          id: `bot-r-${baseSeed}-2`,
          parentId: posts[1].id,
          user: bot2.name, handle: bot2.handle, accent: bot2.accent,
          kind: "bot",
          text: replyPool[Math.floor(rng() * replyPool.length)],
          ts: posts[1].ts + 45 * 60 * 1000,
          likes: Math.floor(rng() * 8),
        });
      }
    }

    return posts.sort((a, b) => a.ts - b.ts);
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

  // ── Hilos curados de demo (gobiernos + países LATAM) ────────────────
  // Cada hilo enriquece su country/region desde window.COUNTRIES.
  // openingPosts[]: primeros posts deliberados (en lugar del generador
  // generatePost). El resto se rellena con seedPosts (4-10 posts + replies).
  const CURATED_THREADS = [
    // ═══════════════════════════════════════════════════════════════════
    // ARGENTINA
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "ARG", scope: "gobierno", year: 2024, period: [2023, 2027],
      presName: "Javier Milei", presParty: "LLA",
      title: "Gobierno de Milei: motosierra y dolarización · ¿es sostenible?",
      subtitle: "2023–2027 · La Libertad Avanza (extrema derecha)",
      openingPosts: [
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 42,
          text: "El ajuste fiscal bajó la inflación mensual, sí, pero el costo en pobreza es brutal. ¿Vale la pena el shock si la recuperación no llega antes del 2025?" },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 28, replyToIdx: 0,
          text: "El superávit fiscal es real, pero se financia con licuación de jubilaciones y freno total de obra pública. Es contabilidad creativa disfrazada de ortodoxia." },
        { user: "Esteban Quintana", handle: "@e_quintana", accent: "#7dd3fc", likes: 19, replyToIdx: 1,
          text: "Punto justo. Y el discurso 'no hay plata' no aplica cuando hay reducción de retenciones al agro por 800M USD. La motosierra tiene destinatarios." },
        { user: "Lucía Aravena", handle: "@luciaa", accent: "#84cc16", likes: 51,
          text: "Lo que más me preocupa no es el ajuste, es el desmantelamiento de organismos de control. INDEC, AFIP, Oficina Anticorrupción: todos intervenidos. La transparencia se mide a largo plazo." },
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 24,
          text: "Contexto que se olvida: la inflación heredada era 25% mensual. Cualquier estabilización dolía. La pregunta real es si el rebote llega antes de las legislativas 2025." },
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 36,
          text: "La dolarización quedó en el cajón. Cepo sigue, BCRA sigue emitiendo (aunque menos). Es más un ajuste heterodoxo con marketing libertario que un plan Cavallo 2.0." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 15,
          text: "El RIGI para grandes inversiones: 30 años de estabilidad fiscal para proyectos +200M USD. Es competencia a la baja con Chile/Uruguay. Puede funcionar o ser la próxima Camisea." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 11, replyToIdx: 5,
          text: "Coincido. Sin acumulación real de reservas ni acuerdo cerrado con el FMI, la sostenibilidad depende de una cosecha 2025 excelente y que no haya shock externo." },
      ],
    },
    {
      iso3: "ARG", scope: "tema", year: 2018,
      title: "Cuadernos de las Coimas: ¿qué pasó realmente con la causa?",
      subtitle: "2018 · Investigación judicial · Argentina",
      openingPosts: [
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 47,
          text: "Más de 30 empresarios confesaron pagos al kirchnerismo. Seis años después la causa avanza a paso de tortuga. ¿Justicia selectiva o complejidad real?" },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 32,
          text: "El problema técnico: los cuadernos originales del chofer Centeno se destruyeron. La causa se sostiene en fotocopias y arrepentidos. En cualquier juicio serio eso pesa." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 29, replyToIdx: 1,
          text: "Pero los arrepentidos empresariales aportaron trazabilidad bancaria en varios casos. No es solo palabra contra palabra." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 21,
          text: "Comparen con Lava Jato: Brasil movió 3.000 imputados en 3 años. Argentina en 6 tiene 5 condenas firmes. La diferencia no es solo la evidencia, es la voluntad institucional." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 18,
          text: "El otro dato: los empresarios que 'confesaron' siguen operando y cobrando obra pública. La justicia empresarial en Argentina es un chiste amargo." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 14, replyToIdx: 3,
          text: "Y sumale que la Corte Suprema tiene 4 vacantes desde 2022. Sin árbitro final, la causa se dilata en instancias." },
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 22,
          text: "Lo que dejó la causa, más allá del avance judicial: mostró la mecánica del sistema de retornos en obra pública. Eso es memoria institucional aunque nadie vaya preso." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // CHILE
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "CHL", scope: "gobierno", year: 2022, period: [2022, 2026],
      presName: "Gabriel Boric", presParty: "FA",
      title: "Boric y el Frente Amplio: ¿gobierno reformista o continuidad?",
      subtitle: "2022–2026 · Convergencia Social / FA",
      openingPosts: [
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 44,
          text: "Llegó con un programa de cambio profundo y terminó negociando con la centro-izquierda tradicional. La reforma tributaria fracasó dos veces. ¿Realismo o capitulación?" },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 33,
          text: "El rechazo a la nueva constitución (en 2022 y 2023) marcó el techo de su capital político. Igual mantiene aprobación decente comparado con vecinos." },
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 26, replyToIdx: 0,
          text: "'Realismo' es la excusa más usada cuando el programa original era ambicioso. Nombrar a Marcel en Hacienda ya era la señal. Todo lo demás fue consecuencia." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 19, replyToIdx: 2,
          text: "Marcel garantizó que no hubiera crisis cambiaria en la transición. Eso también cuenta. La izquierda latinoamericana suele pagar caro la ortodoxia y más caro la heterodoxia." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 17,
          text: "Punto a favor: transparencia procedimental. Es el gobierno con más data pública abierta en la región. Los reveses son políticos, no institucionales." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 28,
          text: "Lo que casi no se comenta: la reforma de pensiones sigue trabada tras 2 años. Es EL tema de fondo y no hay mayoría parlamentaria. El próximo gobierno hereda el mismo problema." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 15,
          text: "El gabinete inicial era 14 mujeres. Hoy sigue paritario. Eso no cambia números macro pero sí la conversación pública sobre representación." },
      ],
    },
    {
      iso3: "CHL", scope: "tema", year: 2019,
      title: "Estallido social 2019: ¿qué cambió en transparencia institucional?",
      subtitle: "2019 · Crisis social · Chile",
      openingPosts: [
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 52,
          text: "5 años después del estallido — ¿la pregunta es si hubo reformas concretas o solo cambios cosméticos? El proceso constitucional dio dos derrotas. ¿Y ahora qué?" },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 34,
          text: "Lo concreto: se aprobó ley de royalty minero, se subió salario mínimo 40% real, hubo reforma de pensiones parcial. No es la refundación que gritaban en las calles, pero tampoco es 'nada'." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 29, replyToIdx: 1,
          text: "Discrepo en el énfasis. Lo que se pedía era cambio de modelo económico, no ajustes al margen. La brecha entre demanda y resultado es lo que dejó a la gente desmovilizada." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 41,
          text: "El costo humano: 34 muertos, +400 con lesiones oculares graves. Ninguna condena firme a mandos de Carabineros. La impunidad sigue siendo la parte más oscura del proceso." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 19, replyToIdx: 3,
          text: "Y la doctrina institucional de Carabineros no se modificó estructuralmente. Se cambiaron generales, no protocolos." },
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 23,
          text: "Lo más subestimado del post-estallido: la Convención Constitucional produjo el borrador más ambicioso en materia de género y ambiental de la región. Perdió, pero es material de estudio." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 16,
          text: "Y quedó una lección importante: el 'octubrismo' asumió que su agenda era mayoritaria por el ruido en las calles. Los referéndums mostraron que no. Riesgo de eco-cámara." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // VENEZUELA
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "VEN", scope: "gobierno", year: 2024, period: [2013, 2025],
      presName: "Nicolás Maduro", presParty: "PSUV",
      title: "Elecciones 2024: el régimen no presenta actas · ¿y qué hacemos los ciudadanos?",
      subtitle: "Julio 2024 · Crisis institucional · Venezuela",
      openingPosts: [
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 89,
          text: "El CNE proclamó ganador sin mostrar actas mesa por mesa. La oposición publicó 80%+ de las actas que muestran triunfo claro de González. Matemáticamente la elección más documentada de la historia… y la peor reportada oficialmente." },
        { user: "Esteban Quintana", handle: "@e_quintana", accent: "#7dd3fc", likes: 57,
          text: "Más de 25 países exigen verificación. Lo que viene: presión internacional + diáspora movilizada. La situación es insostenible pero el régimen tiene tiempo para resistir." },
        { user: "Carlos Kohler", handle: "@ck", accent: "#10b981", likes: 44, replyToIdx: 0,
          text: "El detalle técnico que casi no se explica: el sistema Smartmatic emite comprobantes verificables. Que 'no puedan' mostrar las actas es imposible técnicamente. Es decisión política pura." },
        { user: "Mercedes Galindo", handle: "@mgalindo", accent: "#fda4af", likes: 31, replyToIdx: 1,
          text: "El problema con la 'presión internacional': Colombia, Brasil y México se mantienen tibios. Sin eso, EE.UU. solo puede hacer sanciones que ya probamos que no derriban al régimen." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 38,
          text: "La represión post-electoral: +2.000 detenidos en semanas, Machado y González en clandestinidad/exilio. Es el manual clásico: cerrar todo espacio hasta que la gente se agote." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 26,
          text: "Lo que aprendimos con Nicaragua 2018 y Bielorrusia 2020: sin fractura militar interna, un régimen puede resistir presión externa indefinidamente. Venezuela va por ese camino." },
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 19,
          text: "El costo humano acumulado: 8 millones de venezolanos migrados. Es la mayor crisis migratoria del hemisferio occidental. Y sigue creciendo." },
      ],
    },
    {
      iso3: "VEN", scope: "país",
      title: "¿Por qué Venezuela sigue cayendo en el ranking de transparencia?",
      subtitle: "Análisis multi-año · Venezuela",
      openingPosts: [
        { user: "Carlos Kohler", handle: "@ck", accent: "#10b981", likes: 41,
          text: "PDVSA en quiebra técnica con producción de 1990. Casi todo el aparato del estado opera sin auditoría externa. Es difícil saber qué es corrupción y qué es simplemente colapso institucional." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 33,
          text: "La red de sanciones perversamente contribuye a opacidad: sin transferencias bancarias formales, todo se mueve en efectivo, cripto o comercio con países no alineados. Trazabilidad cero." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 27, replyToIdx: 0,
          text: "Sumemos el Arco Minero: 111.000 km² sin control ambiental ni fiscal, operado por sindicatos armados. Es Estado paralelo dentro del territorio." },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 22,
          text: "El caso Tareck El Aissami (2023): oficialmente 'anti-corrupción' interno, sacaron a 60+ funcionarios. Fue purga política más que institucional. Los reemplazos son igual o peor." },
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 17,
          text: "Un dato para dimensionar: la deuda externa vs PIB ronda 200%. Es Argentina 2001 en cámara lenta pero sin FMI." },
        { user: "Lucía Aravena", handle: "@luciaa", accent: "#84cc16", likes: 24, replyToIdx: 3,
          text: "Y sin embargo la clase política venezolana se sostiene con una economía que se estabilizó vía dolarización de facto + remesas. La 'crisis' se volvió estado permanente." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // BRASIL
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "BRA", scope: "gobierno", year: 2023, period: [2023, 2026],
      presName: "Luiz Inácio Lula da Silva", presParty: "PT",
      title: "Lula 3.0: regreso del PT y el legado de Lava Jato",
      subtitle: "2023–2026 · Partido dos Trabalhadores",
      openingPosts: [
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 49,
          text: "Lula volvió tras condena anulada por el STF. La pregunta no es si fue procesado injustamente — es si las reformas institucionales que prometió en 2022 están avanzando. Spoiler: poco." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 37,
          text: "Lo más rescatable: PIB creciendo, hambre bajando del mapa de la FAO otra vez. Lo más preocupante: gasto público en máximo histórico sin reforma fiscal creíble." },
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 25, replyToIdx: 0,
          text: "Reformas institucionales pendientes: modificar la Ley de Improbidad (que Bolsonaro suavizó), fortalecer al COAF, restaurar el poder investigativo del MP Federal. Nada de eso está en agenda real." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 30, replyToIdx: 1,
          text: "El nuevo 'arcabouço fiscal' es más flexible que el techo de gastos anterior. Se llama 'sostenible' pero es cuestión de tiempo antes que las cuentas se prendan fuego." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 34,
          text: "Punto clave que se pasa por alto: Lula tiene 68% de aprobación externa (Sudamérica, África, UE) pero 45% interna. Es el presidente global de LATAM sin capital político local para grandes reformas." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 21,
          text: "La política ambiental sí muestra resultados reales: deforestación en Amazonia -50% en 2023. Es política de Marina Silva y funciona. Falta ver si se sostiene sin escándalos internos del ministerio." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 18,
          text: "El congreso brasileño es lo que es: 40% de imputados o investigados por algo. Cualquier reforma anticorrupción real necesita mayoría… que se autoperjudica. Círculo vicioso." },
      ],
    },
    {
      iso3: "BRA", scope: "tema", year: 2014,
      title: "Lava Jato: balance 10 años después · ¿logro o sobreactuación?",
      subtitle: "2014–2024 · Operação Lava Jato · Brasil",
      openingPosts: [
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 62,
          text: "10 años después: ~280 condenados, R$ 5.000M recuperados, pero también anulaciones masivas por parcialidad de Moro. La Lava Jato es el mayor caso de corrupción global y también el mayor caso de justicia politizada. Ambas cosas." },
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 45,
          text: "La 'sobreactuación' es real: filtraciones selectivas de Vaza Jato mostraron coordinación Moro-Dallagnol. Eso deslegitimó todo, incluso lo bien hecho. Un desastre para la anti-corrupción global." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 38, replyToIdx: 0,
          text: "Contexto que se olvida: la Lava Jato inspiró operaciones en Perú, Colombia, Argentina, Ecuador y hasta Suiza. Es el mayor efecto contagio institucional de la historia regional." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 27,
          text: "Lo que Brasil tiene y falta en el resto: sistema de delación premiada regulado por ley (2013), COAF operativo desde 1998, MP Federal con autonomía real. La Lava Jato usó herramientas que ya existían." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 22, replyToIdx: 1,
          text: "Y la Constitución de 1988 previó todo esto. El problema fue de aplicación selectiva, no de vacío legal. Diferencia importante para no perder foco." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 31,
          text: "El legado más contundente: cambió la percepción global de riesgo de LATAM. Odebrecht ya no existe. Petrobras hace 6 años que no pierde dinero en corrupción documentada. Eso es reforma estructural." },
        { user: "Mercedes Galindo", handle: "@mgalindo", accent: "#fda4af", likes: 16,
          text: "Balance honesto: sin Lava Jato, Odebrecht seguiría operando y Bolsonaro no habría sido posible. Con Lava Jato, Bolsonaro fue posible y Odebrecht no. Ambas son verdaderas." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // MÉXICO
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "MEX", scope: "gobierno", year: 2024, period: [2024, 2030],
      presName: "Claudia Sheinbaum", presParty: "Morena",
      title: "Sheinbaum: continuidad de la 4T o etapa propia",
      subtitle: "2024–2030 · Morena · primera presidenta mujer",
      openingPosts: [
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 55,
          text: "Hereda el bloque más fuerte del Congreso desde el PRI hegemónico + reforma judicial recién aprobada. Tiene poder casi absoluto. La pregunta es qué hace con eso." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 41,
          text: "El primer test: la extinción de organismos autónomos (INAI, IFT, COFECE). Si los liquida, se cierra el ciclo de la transición democrática de 1997-2018. Es un cambio de régimen sin cambio de constitución." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 33, replyToIdx: 0,
          text: "'Poder absoluto' es exagerado: hereda un déficit del 5,9% del PIB y una Pemex con deuda de $105mil M USD. AMLO le dejó la fiesta pagada por 20 años sin colateral." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 29,
          text: "Diferencias reales con AMLO: es científica, no comunicadora. Habla el idioma de organismos multilaterales. Puede negociar con FMI sin las bravatas de las mañaneras. Es una jugada distinta." },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 24, replyToIdx: 3,
          text: "Ojalá. Pero el poder real sigue con AMLO desde Palenque. Sheinbaum es la ejecutora, no la autora del programa. Al menos los primeros 2 años." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 18,
          text: "Un cambio simbólico enorme: primera presidenta de un país tradicionalmente machista, judía en país mayoritariamente católico. Eso cuesta mucho más de lo que se reconoce y sí importa." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 26,
          text: "La agenda ambiental es la incógnita. AMLO fue el peor presidente ambiental de la democracia mexicana (Dos Bocas, refinerías, tren maya). Sheinbaum viene del ambientalismo. Contradicción para resolver." },
      ],
    },
    {
      iso3: "MEX", scope: "tema", year: 2024,
      title: "Reforma judicial: ¿democratización o concentración?",
      subtitle: "Septiembre 2024 · Reforma constitucional · México",
      openingPosts: [
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 61,
          text: "Elegir jueces por voto popular suena democrático pero hay 0 países donde haya funcionado. Bolivia lo intentó en 2011 y fue un desastre. ¿Por qué replicar eso?" },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 43,
          text: "El contraargumento real: el sistema actual era opaco y capturado políticamente igual. Pero saltar de un extremo al otro sin transición… veremos." },
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 38, replyToIdx: 0,
          text: "Detalle: en Bolivia post-2011 el 60% de las boletas iban en blanco porque la gente no conocía a los candidatos. Se eligió por color de partido, no por trayectoria. Va a pasar igual en México." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 34,
          text: "El riesgo geopolítico es real: el T-MEC tiene cláusula de 'protección al inversionista' que asume tribunales independientes. Si hay inversores demandando, tenemos disputa internacional." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 21, replyToIdx: 1,
          text: "El PJF pre-reforma también tenía críticas serias: nepotismo (30% de jueces con familiares en el mismo poder), procesos internos opacos. El diagnóstico era correcto, la solución es la duda." },
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 27,
          text: "Lo que casi no se discute: se eliminan 7 salas especializadas del Consejo de la Judicatura. Los perjudicados directos no son los ministros de la Corte, son los jueces de distrito." },
        { user: "Mercedes Galindo", handle: "@mgalindo", accent: "#fda4af", likes: 19,
          text: "El precedente peligroso: si esto funciona políticamente para Morena, otros países LATAM lo van a copiar. Es exportar un modelo cuyo test empírico dura 6 años." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // COLOMBIA
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "COL", scope: "gobierno", year: 2022, period: [2022, 2026],
      presName: "Gustavo Petro", presParty: "PH",
      title: "Petro: primera izquierda en el Palacio · 2 años después",
      subtitle: "2022–2026 · Pacto Histórico · Colombia",
      openingPosts: [
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 48,
          text: "Llegó con una agenda de paz total, reforma agraria, transición energética. Resultado mixto: ELN sigue activo, las reformas no pasan en Congreso, su hijo está procesado por financiación irregular." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 32,
          text: "El error táctico más costoso: rompió con el Partido Liberal en 2023 y se quedó sin puentes en el Congreso. Sin coalición ampliada, cualquier reforma progresista está muerta." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 39,
          text: "Lo que sí avanza: reforma tributaria 2022 aumentó recaudo 4pp del PIB. Es el mayor cambio fiscal en décadas. Se olvida rápido porque no tuvo el impacto simbólico de otras batallas." },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 26, replyToIdx: 0,
          text: "'Paz total' es el diagnóstico correcto (no se puede pacificar por partes) pero la ejecución fue caótica: cese al fuego sin condiciones, luego rupturas, disidencias creciendo. Petro es mejor teórico que ejecutor." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 22,
          text: "El caso Nicolás Petro es serio: financiación electoral irregular confesada por él mismo, involucrando a la campaña presidencial. Si esto fuera Uribe o Duque, Petro habría pedido su renuncia hace meses." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 18, replyToIdx: 4,
          text: "Y sin embargo el CNE avanza lento, la Fiscalía se toma su tiempo. El doble estándar es institucional, no solo mediático." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 24,
          text: "La política exterior sí ha sido coherente: reactivar relación con Venezuela, liderazgo climático, mediación en Gaza. Es el primer presidente colombiano con perfil global no-alineado. Eso vale." },
      ],
    },
    {
      iso3: "COL", scope: "tema", year: 2016,
      title: "Acuerdo de paz con FARC · ¿qué quedó 8 años después?",
      subtitle: "2016 · Acuerdo histórico · Colombia",
      openingPosts: [
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 58,
          text: "8 años después del acuerdo: 12.000 excombatientes reintegrados, 400 exguerrilleros asesinados desde la firma, ELN y disidencias controlan territorio que antes tenía FARC. Balance ambivalente en el mejor caso." },
        { user: "Carlos Kohler", handle: "@ck", accent: "#10b981", likes: 42,
          text: "Lo estructural que faltó: reforma agraria. Se prometió redistribuir 3M de hectáreas. Se entregaron menos de 500.000. Sin cambio en el modelo rural, la violencia vuelve porque el conflicto es económico, no ideológico." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 35, replyToIdx: 0,
          text: "El dato brutal: los líderes sociales asesinados desde 2016 superan las 1.500 personas. La guerra terminó en el papel; en el territorio la disputa por rentas ilegales (coca, minería) recrudeció." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 28,
          text: "Éxitos que se olvidan: la JEP funciona (con problemas), la Comisión de la Verdad entregó un informe monumental, el Tribunal Especial para la Paz sentó precedentes globales sobre justicia transicional." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 21, replyToIdx: 1,
          text: "Reforma agraria sin catastro rural actualizado es imposible. Y el catastro sigue teniendo 30 años de rezago. El problema es de infraestructura institucional básica, no de voluntad." },
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 33,
          text: "El voto del 'No' en el plebiscito de 2016 fue por 50.000 votos. Uribismo capitalizó con desinformación (\"ideología de género\", \"impunidad\"). Sin ese margen mínimo, hoy tendríamos otro país." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 19,
          text: "Lección para la región: los acuerdos de paz no son puntos finales, son procesos de 20-30 años. Colombia va en el año 8. Es prematuro cerrar el balance en cualquier dirección." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // PERÚ
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "PER", scope: "país",
      title: "Perú · 6 presidentes en 8 años · ¿república sin presidencia?",
      subtitle: "2016–2024 · Crisis institucional crónica · Perú",
      openingPosts: [
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 67,
          text: "PPK, Vizcarra, Merino, Sagasti, Castillo, Boluarte. Y los expresidentes vivos: 4 procesados, 1 en cárcel, 1 prófugo, 1 que se suicidó. El sistema institucional no resiste un sexenio." },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 45,
          text: "El 'cierre del Congreso vs vacancia' se convirtió en mecanismo normal. El Tribunal Constitucional debería ser el árbitro y también está politizado. ¿Cómo se sale de esto?" },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 38, replyToIdx: 0,
          text: "El origen: la Constitución del 93 diseñó un presidencialismo con Congreso unicameral que puede tumbar al Ejecutivo por 'incapacidad moral'. Es diseño institucional para el bloqueo permanente." },
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 26,
          text: "Boluarte tiene 4% de aprobación y sigue. La razón: al Congreso le conviene tenerla débil. Cualquier reemplazo sería más independiente. Están sosteniendo a alguien que odian por conveniencia." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 31,
          text: "Costo económico real: Perú fue de las mejores economías de la región 2005-2015. Desde 2018 crece por debajo del promedio LATAM. La incertidumbre política mata inversión, especialmente en minería." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 22, replyToIdx: 4,
          text: "Y la protesta post-Castillo (dic 2022 - marzo 2023) dejó 50 muertos, mayoría en regiones andinas. La conversación política de Lima ignoró completamente eso." },
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 29,
          text: "La salida realista: reforma constitucional que restablezca bicameralismo y regule la 'incapacidad moral'. Existe hace años como propuesta. Ningún gobierno la impulsa porque a todos les conviene el chaos." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // EL SALVADOR
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "SLV", scope: "gobierno", year: 2024, period: [2019, 2029],
      presName: "Nayib Bukele", presParty: "Nuevas Ideas",
      title: "Bukele · seguridad récord y democracia en duda",
      subtitle: "2019–2029 · Nuevas Ideas · El Salvador",
      openingPosts: [
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 71,
          text: "Las cifras de seguridad son reales. Pero también es real que hay 80.000 detenidos sin juicio, régimen de excepción renovado cada mes, y la reelección consecutiva está prohibida en la Constitución que él mismo respeta… selectivamente." },
        { user: "Lucía Aravena", handle: "@luciaa", accent: "#84cc16", likes: 54,
          text: "El dilema clásico: ¿es legítimo sacrificar libertades civiles para reducir homicidios? El 85% de salvadoreños dice que sí. La pregunta es qué pasa cuando el modelo se quiere exportar." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 39, replyToIdx: 0,
          text: "Cristosal documentó +250 muertes en custodia, casos de torturas, familias de detenidos sin información por meses. No es 'sacrificio de libertades', es política de terror con marketing profesional." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 43, replyToIdx: 1,
          text: "El componente cultural: en países con Estado ausente y violencia extrema, la gente prefiere autoritarismo eficaz a democracia disfuncional. Es honesto reconocerlo, aunque duela." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 32,
          text: "Lo económico también cuenta: 24% del PIB salvadoreño viene de remesas. Sin la diáspora en EE.UU., el 'milagro Bukele' no existe. Es un modelo estructuralmente subsidiado del exterior." },
        { user: "Esteban Quintana", handle: "@e_quintana", accent: "#7dd3fc", likes: 26,
          text: "El caso Bitcoin: adopción legal en 2021, promesa de bonos volcán, ciudad Bitcoin. 3 años después: <10% de la población lo usa, el bono nunca se emitió, la ciudad no existe. El marketing es superior a la ejecución." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 21,
          text: "Lo geopolítico: Bukele consiguió lo que Kirchner no logró — desalinear a un país centroamericano de EE.UU. sin sanciones. Habla con China, Israel, El Salvador vota independiente en la OEA. Nueva escuela." },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 17, replyToIdx: 5,
          text: "Y el balance real del Bitcoin: pérdidas nominales de $30-40M USD del Estado. En términos de PIB es marginal, pero simbólicamente es la mayor cagada financiera de un gobierno LATAM reciente." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // BOLIVIA
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "BOL", scope: "gobierno", year: 2020, period: [2020, 2025],
      presName: "Luis Arce", presParty: "MAS",
      title: "Bolivia: la división del MAS y la guerra Evo vs Arce",
      subtitle: "2020–2025 · Movimiento al Socialismo (interno fracturado)",
      openingPosts: [
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 46,
          text: "El MAS gobernó con disciplina férrea durante 14 años con Evo. Ahora el partido está partido en dos facciones que se demandan en tribunales. Las primarias de 2025 van a ser bizarras." },
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 32,
          text: "Lo económico es dramático: reservas internacionales bajaron de $15.000M USD (2014) a $1.500M (2024). El modelo estatista que Arce diseñó como ministro ya no funciona sin gas para exportar." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 28, replyToIdx: 0,
          text: "El intento de golpe de junio 2024 fue extraño: 3 horas, el general Zúñiga terminó preso, Arce salió fortalecido internamente. Muchos analistas creen que fue autogolpe. Sin certezas todavía." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 24,
          text: "El giro clave fue 2019: Evo perdió el referéndum de reelección en 2016 y aún así se lanzó en 2019 amparado en el TCP. Ese fue el pecado original que agrieta al MAS hasta hoy." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 19,
          text: "Bolivia sigue siendo el 4to país con mayor reserva de litio del mundo. Y sin embargo no logra convertirlo en industria. La captura estatal del sector puede ser la razón. Sin capital privado no hay tecnología." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 15, replyToIdx: 3,
          text: "El TCP validó ese fallo con el argumento del 'derecho humano a ser reelegido'. Fue el peor precedente jurídico de la región reciente. Ecuador y Nicaragua replicaron el argumento después." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 22,
          text: "Y hay un elefante en la sala: el 65% del PIB boliviano es economía informal. Cualquier proyecto de país serio arranca por regularizar eso. Nadie tiene voluntad porque es también su base electoral." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // ECUADOR
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "ECU", scope: "tema", year: 2023,
      title: "Asesinato de Fernando Villavicencio · ¿qué cambió?",
      subtitle: "Agosto 2023 · Crimen organizado · Ecuador",
      openingPosts: [
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 63,
          text: "Candidato presidencial asesinado a 10 días de la primera vuelta. 7 sicarios colombianos capturados, todos murieron en prisión en los meses siguientes. El caso quedó cerrado oficialmente pero las preguntas siguen." },
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 44,
          text: "Contexto brutal: Ecuador pasó de 6 homicidios cada 100k hab (2018) a 47 (2023). Es el crecimiento más rápido del hemisferio. Se convirtió en país de tránsito de cocaína colombiana hacia Europa." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 37, replyToIdx: 0,
          text: "Los intelectuales del crimen nunca fueron identificados. Villavicencio investigaba corrupción petrolera y links Correa-Chevron. Cualquiera de esas líneas es explosiva y ninguna se persiguió." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 29,
          text: "Noboa llegó al poder gracias en parte a este vacío. Es hijo del empresario más rico del país (bananera), tiene 36 años, y gobierna con populismo de seguridad estilo Bukele-light. El 'presidente mall'." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 25, replyToIdx: 1,
          text: "El problema estructural: los puertos de Guayaquil son operados por concesionarias privadas con controles laxos. El 40% de la cocaína que llega a España sale de Ecuador. Y sigue sin haber reforma portuaria." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 20,
          text: "Los Choneros, Lobos, Tiguerones: 3 organizaciones que en 2018 no eran noticia. Hoy tienen presencia en 20 países. Su crecimiento coincide exactamente con la reducción del gasto en inteligencia policial de Correa." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 18,
          text: "Villavicencio también denunciaba a las bandas antes de ser candidato. Su asesinato tuvo un efecto conocido en LATAM: reforzó el silencio de otros periodistas. Ese es el crimen mayor de largo plazo." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // URUGUAY
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "URY", scope: "país",
      title: "Uruguay · ¿por qué somos el menos corrupto de LATAM?",
      subtitle: "Análisis estructural · Uruguay",
      openingPosts: [
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 56,
          text: "No es magia: servicio civil profesional desde 1934, alternancia pacífica desde 1985, Banco Central independiente real, prensa libre fuerte. Receta lenta pero funcional. Lástima que no se exporta fácil." },
        { user: "Carlos Kohler", handle: "@ck", accent: "#10b981", likes: 41,
          text: "También hay que reconocer la escala: 3.5 millones de habitantes y cultura cívica de pueblo chico. ¿Funciona el modelo en países de 50M+?" },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 33, replyToIdx: 1,
          text: "La escala importa pero no es todo. Costa Rica (5M) es #1 de Centroamérica. Nueva Zelanda (5M) es #1 global. Hay un patrón: sociedades homogéneas + Estado presente temprano + educación pública fuerte." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 28,
          text: "Punto que se subestima: en Uruguay la política es carrera profesional. No hay outsiders millonarios comprando elecciones. Los presidentes empezaron en concejos departamentales. Filtro brutal." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 24,
          text: "El caso Astesiano (2022) fue el mayor escándalo en años y aún así: renuncia inmediata, investigación abierta, condena firme en 8 meses. En otros países eso tarda una década." },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 19,
          text: "Nota crítica: hay opacidad en 'Cabildo Abierto' con financiación electoral, y ANV con contratos irregulares. Uruguay no es santo, es competente en corregir rápido. Diferencia importante." },
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 22, replyToIdx: 3,
          text: "Y el sistema de partidos estables (Colorado, Nacional, Frente Amplio con historia real): reduce el clientelismo porque los partidos sobreviven a los caudillos. Argentina y Perú son lo opuesto." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // CUBA
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "CUB", scope: "país",
      title: "Cuba · 65 años · ¿qué sigue después de Díaz-Canel?",
      subtitle: "Sucesión histórica · Cuba",
      openingPosts: [
        { user: "Mercedes Galindo", handle: "@mgalindo", accent: "#fda4af", likes: 51,
          text: "Es la primera vez desde 1959 que Cuba no tiene un Castro en el poder ni en la sombra. Raúl salió del Buró Político en 2021. Díaz-Canel es tecnócrata sin carisma. La transición es real aunque nadie la nombre." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 38,
          text: "La economía es dramática: inflación 45%, apagones diarios de 8-16 horas, dolarización parcial de la economía (MLC). Sin subsidio ruso ni venezolano, el modelo se sostiene por remesas ($3.500M/año) e inercia." },
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 29, replyToIdx: 0,
          text: "Lo que se pasa por alto: las protestas del 11-J 2021 rompieron un tabú de 60 años. Miles en la calle sin liderazgo opositor visible. La juventud cubana ya no cree en el relato revolucionario." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 26,
          text: "El éxodo actual: >1 millón salieron entre 2022-2024. Es proporcionalmente peor que Venezuela en el mismo período. Cuba está perdiendo su capital humano más productivo aceleradamente." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 21,
          text: "Sin embargo el aparato de seguridad se sostiene. El G2 (MININT) sigue efectivo, los CDR funcionan barrio por barrio. Es difícil imaginar transición sin ruptura interna del régimen y no hay señales." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 18, replyToIdx: 2,
          text: "Y esa juventud tiene VPN, TikTok, contacto directo con familia en Miami. La censura ya no es total. Ese cambio informacional es el mayor riesgo estructural para el régimen." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 17,
          text: "El escenario Corea del Norte: sin apertura política pero con relajación económica selectiva. Es probablemente hacia donde va Cuba. No transición democrática, sí normalización autoritaria." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // NICARAGUA
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "NIC", scope: "gobierno", year: 2024, period: [2007, 2026],
      presName: "Daniel Ortega", presParty: "FSLN",
      title: "Ortega-Murillo: copresidencia oficializada · ¿modelo único?",
      subtitle: "2007–presente · FSLN · Nicaragua",
      openingPosts: [
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 58,
          text: "Reforma constitucional de 2024 oficializa a Rosario Murillo como copresidenta. 200+ opositores expulsados con quita de nacionalidad. Es un experimento autoritario sin paralelo reciente en la región." },
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 42,
          text: "El detalle no menor: la Iglesia Católica también está en la mira. Obispo Álvarez encarcelado y luego exiliado. Rezar ya es acto político. Nicaragua es hoy el país con más restricciones religiosas de LATAM." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 34, replyToIdx: 0,
          text: "'Sin paralelo' no del todo: Bielorrusia con Lukashenko-Kolésnikova (esposa) es escenario similar. El modelo dinástico-copresidencial parece ser la nueva franquicia autoritaria del siglo XXI." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 27,
          text: "El origen sandinista lo hace único: es la primera vez que un movimiento revolucionario latinoamericano deviene abiertamente en dictadura familiar. Otros lo insinuaron; Ortega lo escribe en la Constitución." },
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 22,
          text: "Lo económico: Nicaragua sigue creciendo 3-4% al año. Zona franca textil, remesas ($4.500M), exportación agrícola. La represión política no ha destrozado la economía como en Venezuela. Coexisten." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 19, replyToIdx: 1,
          text: "La respuesta vaticana ha sido notable: Francisco recibió al obispo Álvarez, denunció la persecución. Nicaragua rompió relaciones con la Santa Sede en 2022. Otro tabú roto para el imaginario católico latinoamericano." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 16,
          text: "El punto que me obsesiona: la comunidad internacional aprendió a coexistir con esto. OEA sacó tímidamente resoluciones, EE.UU. sancionó a funcionarios individuales, y el régimen ganó tiempo. Manual replicable." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // GUATEMALA
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "GTM", scope: "gobierno", year: 2024, period: [2024, 2028],
      presName: "Bernardo Arévalo", presParty: "Movimiento Semilla",
      title: "Arévalo en Guatemala: ¿puede gobernar sin Congreso ni Fiscalía?",
      subtitle: "2024–2028 · Movimiento Semilla",
      openingPosts: [
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 49,
          text: "Asumió en enero 2024 tras 8 meses de intentos por anular la elección. La Fiscalía sigue acusándolo, el Congreso lo bloquea, su partido fue cancelado legalmente. Y aún así gobierna. Es un caso de estudio." },
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 36,
          text: "Consuelo Porras (Fiscal General) es intocable hasta 2026. Es la mayor amenaza al gobierno. EE.UU. le quitó visa pero eso no la mueve. Sin cambio ahí, cualquier reforma es papel mojado." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 28, replyToIdx: 0,
          text: "El apoyo internacional fue decisivo. Sin la OEA + EE.UU. + UE presionando en tiempo real, el 'Pacto de Corruptos' (jueces + Fiscalía + Congreso) habría consumado el golpe institucional." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 24,
          text: "El legado CICIG sigue pesando: la comisión anticorrupción de la ONU (2007-2019) capacitó a una generación de fiscales que ahora están en el exilio. Semilla es en parte producto de esa memoria." },
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 21,
          text: "Arévalo tiene aprobación 65% mientras el Congreso 8%. El gobierno se legitima por afuera del sistema. Cuando pasen los meses y no haya resultados concretos, ese margen se puede evaporar rápido." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 17, replyToIdx: 4,
          text: "Y sin embargo aprobó presupuestos, negocia con organismos internacionales, mantiene el orden. La gobernabilidad mínima es posible. El techo es la reforma estructural, no el día a día." },
        { user: "Tomás Pizarro", handle: "@tomaspz", accent: "#fb7185", likes: 19,
          text: "El precedente para la región: mostrar que se puede resistir un intento de golpe institucional con presión internacional coordinada. Bolivia 2019 no tuvo eso, Perú 2022 tampoco. Guatemala sí." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // PARAGUAY
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "PRY", scope: "país",
      title: "Paraguay · 70+ años de ANR · ¿cómo se rompe ese monopolio?",
      subtitle: "Hegemonía partidaria histórica · Paraguay",
      openingPosts: [
        { user: "Esteban Quintana", handle: "@e_quintana", accent: "#7dd3fc", likes: 44,
          text: "La ANR (Colorado) gobierna Paraguay casi ininterrumpidamente desde 1947. Es el partido más longevo en el poder del continente. Incluye la dictadura de Stroessner (35 años). La 'democracia' post-1989 nunca alternó fuera del partido salvo Lugo (2008-2012)." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 33,
          text: "El modelo funciona como clientelismo territorial: seccionales coloradas en cada barrio distribuyen bienes públicos como si fueran favores privados. Cambiarlo requiere romper esa red, no solo ganar una elección." },
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 27, replyToIdx: 0,
          text: "Y Lugo cayó en juicio político express (menos de 48 horas) en 2012. El sistema mostró sus dientes cuando lo desafiaron. No es solo cultura, es maquinaria activamente defendida." },
        { user: "Mercedes Galindo", handle: "@mgalindo", accent: "#fda4af", likes: 22,
          text: "El caso Cartes: sancionado por EE.UU. como 'significativamente corrupto', y aún así fue candidato presidencial en 2023 y sigue como jefe del Partido Colorado. La sanción internacional no mueve el sistema local." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 18,
          text: "Lo económico es interesante: crecimiento sostenido, moneda estable, endeudamiento bajo. El colorado moderno modernizó lo suficiente para no colapsar. Es corrupción con macro-orden, algo raro en LATAM." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 15, replyToIdx: 1,
          text: "Y sin embargo el 25% de paraguayos vive fuera del país (Argentina, España). Silenciosamente Paraguay exporta su descontento. Si esos volvieran a votar, el mapa cambiaría." },
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 19,
          text: "Peña heredó el aparato y también los conflictos internos (facción Cartes vs Abdo). Es probable que 2028 muestre fisuras reales. Pero incluso si pierden, la ANR sigue controlando el aparato del Estado." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // HONDURAS
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "HND", scope: "tema", year: 2024,
      title: "Extradición de JOH · ¿precedente o caso aislado?",
      subtitle: "2024 · Justicia transnacional · Honduras",
      openingPosts: [
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 54,
          text: "Expresidente condenado en EE.UU. por narcotráfico. La justicia local no podía/quería tocarlo. ¿Esto se convierte en mecanismo o queda como anomalía?" },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 41,
          text: "El precedente es peligroso también: cuando la justicia local falla, ¿aceptamos que EE.UU. sea el árbitro? Es efectivo pero abre problemas de soberanía. Panamá lo vivió con Noriega en 1989 y todavía duele." },
        { user: "Elena Pacheco", handle: "@elena.p", accent: "#fdba74", likes: 33, replyToIdx: 0,
          text: "Es 100% caso aislado por diseño. EE.UU. actuó porque JOH movía drogas hacia allá. Si un expresidente robara sin salir del país, EE.UU. no haría nada. Es selectividad geopolítica, no justicia global." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 26,
          text: "El dato subestimado: JOH fue socio estratégico de EE.UU. hasta 2019. Combatió pandillas, cerró rutas migratorias, votó alineado en OEA. La misma administración que lo protegió luego lo procesó. Realpolitik pura." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 22,
          text: "Xiomara Castro llegó al poder con promesa de una CICIH (CICIG hondureña). Aún no se firma. Sin ese mecanismo local, todo caso serio depende de si conviene o no a EE.UU. investigarlo desde el norte." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 17, replyToIdx: 2,
          text: "Y sin embargo: es la primera condena firme contra un expresidente centroamericano en cualquier jurisdicción del mundo. Cambia lo simbólico aunque no reforme el sistema." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 15,
          text: "El detalle procesal: JOH cumple 45 años en cárcel federal. Es el tipo de condena que en Honduras habría sido 15 años con excarcelación en 5. La diferencia sistema es abismal." },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // TEMAS REGIONALES
    // ═══════════════════════════════════════════════════════════════════
    {
      iso3: "URY", scope: "tema", year: 2024,
      title: "¿Por qué LATAM no logra bajar del 60 en Aletheia Score?",
      subtitle: "Análisis regional · ¿límite estructural o falta de voluntad?",
      openingPosts: [
        { user: "Renata Vidal", handle: "@rvidal", accent: "#e879f9", likes: 68,
          text: "Uruguay (mejor) tiene Aletheia score ~27. Venezuela (peor) ~89. Pero la mediana regional está cerca de 65. Es un techo de cristal. ¿Falta voluntad política o hay algo estructural en cómo nos organizamos como repúblicas?" },
        { user: "Esteban Quintana", handle: "@e_quintana", accent: "#7dd3fc", likes: 47,
          text: "Mi hipótesis: las élites económicas y políticas son las mismas familias hace 100 años. No es corrupción individual, es captura de Estado normalizada. Cambiar eso requiere 2-3 generaciones." },
        { user: "Sofía Granda", handle: "@sg.granda", accent: "#22d3ee", likes: 39, replyToIdx: 0,
          text: "Hay un factor institucional que se subestima: los sistemas presidencialistas fuertes concentran poder. Uruguay, Costa Rica, Chile funcionan mejor porque tienen presidencialismos acotados por costumbre y partidos estables." },
        { user: "Carlos Kohler", handle: "@ck", accent: "#10b981", likes: 34, replyToIdx: 1,
          text: "'2-3 generaciones' es la respuesta cómoda para no actuar. Corea del Sur pasó de dictadura corrupta a democracia OECD en 25 años (1987-2012). No es imposible, es cuestión de coaliciones concretas." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 29,
          text: "El factor recursos naturales: los países ricos en commodities primarios (petróleo, minerales, coca) sufren la 'maldición'. Estado captura rentas fáciles, no necesita al ciudadano-contribuyente. Uruguay no tiene eso." },
        { user: "Mateo Linares", handle: "@mateoln", accent: "#06b6d4", likes: 22,
          text: "Un dato que impacta: LATAM gasta 3.5% del PIB en corrupción según BID. Es más que salud pública en la mayoría de países. Cambiar eso no requiere reformas mayores, requiere cumplir leyes que ya existen." },
        { user: "Isabel Mansilla", handle: "@isamn", accent: "#fcd34d", likes: 25, replyToIdx: 3,
          text: "Corea del Sur tuvo aliado externo (EE.UU.), guerra fría a favor, cultura de trabajo cohesionada. Copiar el modelo sin ese contexto es voluntarismo. Cada región tiene su ruta." },
        { user: "Pancho Rojas", handle: "@pancho.r", accent: "#38bdf8", likes: 18,
          text: "Lo que sí es exportable: transparencia procedimental (compras públicas online, catastros abiertos, presupuestos ciudadanos). Son cambios técnicos con impacto medible. Menos glamorosos que 'refundar la república'." },
      ],
    },
    {
      iso3: "BRA", scope: "tema", year: 2025,
      title: "Crimen organizado transnacional · ¿qué tan unidos están los mercados ilegales?",
      subtitle: "Análisis regional · LATAM",
      openingPosts: [
        { user: "Sebastián Henríquez", handle: "@sebahz", accent: "#a3e635", likes: 51,
          text: "El PCC brasileño, el Tren de Aragua venezolano, los carteles mexicanos, el Clan del Golfo colombiano. Cada vez hay más evidencia de operaciones conjuntas. La cooperación entre estados va MUY por detrás." },
        { user: "Nayara Mendes", handle: "@nayara.m", accent: "#f472b6", likes: 38,
          text: "El Tren de Aragua es caso de estudio: en 5 años pasó de cárcel de Aragua a operar en 13 países. Su expansión coincide con la ola migratoria venezolana. Las rutas de la crisis humanitaria y la crisis criminal son la misma." },
        { user: "Diego Mora", handle: "@dmora", accent: "#fbbf24", likes: 32, replyToIdx: 0,
          text: "El PCC lleva 30 años perfeccionando estructura. Es como una multinacional con protocolos internos, arbitraje de disputas, expansión franquicia. Es más profesional que muchos gobiernos con los que compite." },
        { user: "Julieta Salinas", handle: "@julieta_s", accent: "#a78bfa", likes: 26,
          text: "El paradigma que falta: los organismos regionales (OEA, UNASUR, Prosur) no tienen unidad anti-crimen equivalente al Europol. Ningún estado quiere ceder soberanía policial, ni siquiera para lo evidente." },
        { user: "Camila Bermúdez", handle: "@kmilab", accent: "#f9a8d4", likes: 23, replyToIdx: 1,
          text: "Sumemos que EE.UU. usa la DEA como su brazo regional. Es efectivo pero deforma prioridades: la agenda es 'la cocaína que llega a Miami', no 'la violencia de mi barrio'. Modelo desalineado." },
        { user: "Andrés Cisneros", handle: "@acisn", accent: "#c4b5fd", likes: 19,
          text: "Lo económico: se estima que la economía criminal LATAM mueve $200.000M/año. Es más que el PIB de Ecuador. Nadie logra reducir eso porque su ciclo de reinversión es más rápido que el ciclo político." },
        { user: "Ana Veedor", handle: "@ana_veedor", accent: "#f59e0b", likes: 15,
          text: "Y el eslabón débil: los sistemas penitenciarios. En casi todos los países las cárceles funcionan como sedes operativas del crimen. Sin reforma carcelaria seria, cualquier golpe policial es cosmético." },
      ],
    },
  ];

  function buildIndex() {
    if (!window.COUNTRIES) return [];
    const list = [];
    const byIso = {};
    window.COUNTRIES.forEach(c => { byIso[c.iso3] = c; });

    CURATED_THREADS.forEach((t, idx) => {
      const c = byIso[t.iso3];
      if (!c) return;
      const id = `curated-${t.iso3}-${idx}-${(t.title || "x").slice(0, 30).replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
      list.push({
        id,
        iso3: c.iso3,
        country: c.name,
        region: c.region,
        scope: t.scope,
        title: t.title,
        subtitle: t.subtitle,
        year: t.year || null,
        period: t.period || null,
        presName: t.presName || null,
        presParty: t.presParty || null,
        openingPosts: t.openingPosts || null,
      });
    });
    return list;
  }

  // Marker for legacy fallback path below — never executed.
  function _legacyBuildIndex() {
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

    // ── Replies anidados de ejemplo (seed) ─────────────────────────────
    // Genera 2-3 respuestas anidadas en los primeros posts de cada hilo
    // para mostrar cómo se ve el formato Reddit desde el primer uso.
    // Se guardan en localStorage junto al resto de posts del hilo.

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
    // Read only if already stored — never trigger seeding here.
    // Seeding happens lazily in getThread() when a thread is actually opened.
    const raw = localStorage.getItem(STORAGE_THREAD(thread.id));
    if (raw) {
      try {
        const posts = JSON.parse(raw);
        return {
          ...thread,
          replyCount: posts.length,
          lastTs: posts.length ? posts[posts.length - 1].ts : Date.now() - 7 * 86400000,
        };
      } catch (_) {}
    }
    // Estimate count deterministically without writing to storage.
    const r = mulberry32(hash(thread.id + ":count"));
    const rootCount = 4 + Math.floor(r() * 7);
    const replyCount = rootCount + 4; // matches seedPosts reply count
    const r2 = mulberry32(hash(thread.id + ":ts"));
    const lastTs = Date.now() - Math.floor((1 + r2() * 20) * 86400000);
    return { ...thread, replyCount, lastTs };
  }

  // ── API pública ────────────────────────────────────────────────────
  window.ForumAPI = {
    invalidateIndex() { _indexCache = null; },
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
    addPost(threadId, user, text, parentId = null) {
      const thread = getIndex().find(t => t.id === threadId);
      if (!thread) return null;
      const list = loadPosts(thread);
      const post = {
        id: `u-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        parentId: parentId || null,
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
        const prefix = "aletheia.forum.thread.";
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
