// events.js — Generador determinístico de contenido ilustrativo por país y año.
//
// Expone:
//   window.COUNTRY_DATA(country, year)   → para la ficha lateral (indicators, events, headlines)
//   window.COUNTRY_DETAIL(country, year) → para el dashboard fullscreen (president, cabinet,
//                                          context, indicators, events, headlines)
//
// Todo el contenido es FICTICIO. Las cifras y nombres se generan con mulberry32
// sembrado con `hash(iso3) ^ year`, así que el mismo país/año siempre devuelve
// lo mismo, pero país→país y año→año cambia. No se usan nombres ni
// acontecimientos reales.

(function() {
  // ── PRNG + helpers ─────────────────────────────────────────────────
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
  const pickN = (r, arr, n) => {
    const copy = arr.slice();
    const out = [];
    for (let i = 0; i < n && copy.length; i++) {
      const idx = Math.floor(r() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  };
  const rint = (r, a, b) => Math.floor(a + r() * (b - a + 1));
  const rfloat = (r, a, b, dec = 1) => {
    const v = a + r() * (b - a);
    const p = Math.pow(10, dec);
    return Math.round(v * p) / p;
  };

  // ── Bancos de nombres ───────────────────────────────────────────────
  const FIRST_ES = [
    "María", "Juan", "Carlos", "Ana", "Luis", "Sofía", "Miguel", "Lucía",
    "Diego", "Camila", "Ricardo", "Valentina", "Andrés", "Daniela", "Roberto",
    "Patricia", "Eduardo", "Mónica", "Fernando", "Gabriela", "Sergio", "Isabel",
    "Alejandro", "Mercedes", "Hugo", "Raquel", "Mauricio", "Beatriz", "Javier",
    "Adriana", "Tomás", "Helena", "Federico", "Ximena", "Esteban", "Catalina",
  ];
  const LAST_ES = [
    "Salazar", "Rojas", "Mendoza", "Castillo", "Ortega", "Aguirre", "Cárdenas",
    "Vargas", "Peña", "Cisneros", "Morán", "Quintana", "Bermúdez", "Valdivia",
    "Echeverría", "Pizarro", "Cabrera", "Linares", "Mansilla", "Bustamante",
    "Solar", "Galindo", "Valenzuela", "Pacheco", "Henríquez", "Olivares",
    "Rivera", "Castaño", "Quiroga", "Saavedra", "Beltrán", "Cisterna",
  ];
  const FIRST_BR = ["João", "Lucas", "Marcelo", "Rafael", "Camila", "Letícia",
    "Bruno", "Renata", "Felipe", "Vinicius", "Beatriz", "Mateus", "Larissa"];
  const LAST_BR = ["Andrade", "Cardoso", "Almeida", "Tavares", "Pereira",
    "Vasconcelos", "Macedo", "Sampaio", "Nogueira", "Bittencourt", "Mota", "Resende"];
  const FIRST_EN = ["James", "Linda", "William", "Margaret", "Richard", "Patricia",
    "Thomas", "Susan", "Charles", "Jennifer", "Robert", "Elizabeth", "Stephen", "Karen"];
  const LAST_EN = ["Whitaker", "Hollister", "Pemberton", "Ashford", "Greenway",
    "Quinlan", "Marston", "Holloway", "Sutcliffe", "Ravenscroft", "Carmichael", "Donnelly"];
  const FIRST_FR = ["Jean", "Marie", "Pierre", "Claire", "Antoine", "Sylvie", "Olivier"];
  const LAST_FR = ["Joseph", "Pierre-Louis", "Charles", "Beaumont", "Lafleur", "Toussaint"];

  function namePool(iso3) {
    if (iso3 === "BRA") return { firsts: FIRST_BR, lasts: LAST_BR };
    if (iso3 === "USA" || iso3 === "CAN") return { firsts: FIRST_EN, lasts: LAST_EN };
    if (iso3 === "HTI") return { firsts: FIRST_FR, lasts: LAST_FR };
    if (iso3 === "BHS" || iso3 === "TTO" || iso3 === "JAM" || iso3 === "BLZ" || iso3 === "GUY" || iso3 === "SUR")
      return { firsts: FIRST_EN.concat(FIRST_ES.slice(0, 8)), lasts: LAST_EN.concat(LAST_ES.slice(0, 6)) };
    return { firsts: FIRST_ES, lasts: LAST_ES };
  }

  // ── Bancos de partidos ──────────────────────────────────────────────
  // Pools genéricos por región — el partido se selecciona de forma determinística
  // por el seed; cuando es necesario, se sustituyen tokens con el gentilicio.
  const PARTY_POOLS = {
    Norteamérica: [
      { short: "PCN", name: "Partido del Centro Nacional", tone: "centrista" },
      { short: "AR",  name: "Acción Renovadora", tone: "progresista" },
      { short: "FCT", name: "Frente Conservador Tradicional", tone: "conservador" },
      { short: "MP",  name: "Movimiento Popular", tone: "populista" },
      { short: "AS",  name: "Alianza Social", tone: "socialdemócrata" },
    ],
    Centroamérica: [
      { short: "FN",  name: "Frente Nacional", tone: "conservador" },
      { short: "PRD", name: "Partido Reformista Democrático", tone: "centrista" },
      { short: "MLP", name: "Movimiento Liberación Popular", tone: "progresista" },
      { short: "UP",  name: "Unidad Patriótica", tone: "nacionalista" },
      { short: "ADC", name: "Alianza Democrática Cristiana", tone: "demócratacristiano" },
    ],
    Caribe: [
      { short: "PRL", name: "Partido Reformista Liberal", tone: "liberal" },
      { short: "MIR", name: "Movimiento Independentista Renovado", tone: "izquierda" },
      { short: "FP",  name: "Frente Popular", tone: "populista" },
      { short: "PUN", name: "Partido de la Unidad Nacional", tone: "centrista" },
      { short: "AC",  name: "Alianza Caribeña", tone: "regionalista" },
    ],
    Sudamérica: [
      { short: "FDN", name: "Frente Democrático Nacional", tone: "centroizquierda" },
      { short: "PCS", name: "Partido Conservador del Sur", tone: "conservador" },
      { short: "ARS", name: "Acción Republicana Soberana", tone: "nacionalista" },
      { short: "UCP", name: "Unión Cívica Progresista", tone: "progresista" },
      { short: "MLP", name: "Movimiento Liberal Popular", tone: "liberal" },
      { short: "FIA", name: "Frente de Izquierda Articulada", tone: "izquierda" },
    ],
  };

  // ── Carteras del gabinete ───────────────────────────────────────────
  const PORTFOLIOS = [
    "Interior", "Hacienda", "Economía", "Defensa", "Justicia", "Educación",
    "Salud", "Trabajo", "Energía", "Obras Públicas", "Agricultura", "Exterior",
    "Vivienda", "Medioambiente", "Transporte", "Cultura",
  ];

  // ── Posturas / etiquetas de ministros ───────────────────────────────
  const STANCES_OK = [
    "perfil técnico", "carrera judicial", "ex académica", "ex parlamentario",
    "experiencia regional", "trayectoria diplomática", "perfil financiero",
    "perfil gremial", "ex contralor", "ex auditora",
  ];
  const STANCES_RISK = [
    "imputación pendiente", "comisión investigadora", "auditoría en curso",
    "denuncia de gremio", "investigación parlamentaria",
  ];

  // ── Sectores de eventos ─────────────────────────────────────────────
  const SECTORS = [
    "Obras públicas", "Contratos", "Aduanas", "Compras", "Concesiones",
    "Judicial", "Policía", "Salud", "Energía", "Educación",
    "Subsidios", "Lobby", "Medios", "Aeronáutica", "Minería",
    "Pesca", "Banca pública", "Migración",
  ];

  // ── Plantillas de eventos ───────────────────────────────────────────
  // Tokens: {C} = país (gentilicio), {Y} = año, {MIN} = nombre ministro,
  //         {AMOUNT} = monto en USD (M), {SEC} = sector
  const EVENTS_HIGH = [
    "Fiscalía abre investigación por sobreprecios en {SEC} por {AMOUNT}M USD.",
    "Auditoría revela contratos sin licitación entregados a tres oferentes recurrentes.",
    "Filtración de chats compromete a operadores del gabinete en {SEC}.",
    "Renuncia el ministro de {SEC} tras conocerse pagos a empresa familiar.",
    "Periodistas reciben amenazas tras publicar reportaje sobre {SEC}.",
    "Corte ordena reabrir caso archivado en 2018 sobre {SEC}.",
    "ONG presenta querella por desvío de fondos de emergencia ({AMOUNT}M USD).",
    "Se imputa a tres exviceministros de {SEC} en operativo coordinado.",
    "Suspenden licitación de {SEC} tras hallar pliego \"hecho a medida\".",
    "Audiencia clave aplazada por sexta vez en caso emblemático de {SEC}.",
  ];
  const EVENTS_MID = [
    "Comisión legislativa abre debate sobre transparencia en {SEC}.",
    "Contraloría observa ejecución presupuestaria en {SEC} ({AMOUNT}M USD).",
    "Anuncio de portal de datos abiertos sobre contratos de {SEC}.",
    "Auditoría interna detecta irregularidades menores en compras de {SEC}.",
    "Nueva ley de lobby ingresa al Congreso con respaldo mayoritario.",
    "Reforma a la ley de partidos avanza en primer trámite.",
    "Sindicato de funcionarios denuncia presiones políticas en {SEC}.",
    "Programa piloto de gobierno electrónico se extiende a {SEC}.",
  ];
  const EVENTS_LOW = [
    "{C} sube en ranking regional de gobierno abierto.",
    "Se publica registro completo de beneficiarios finales del Estado.",
    "Operativo conjunto desmantela red de facturación falsa en aduanas.",
    "Fiscalía cierra con condena caso emblemático de {SEC} de hace 6 años.",
    "Ley de protección de denunciantes entra en vigencia plena.",
    "Auditoría externa avala ejecución del presupuesto de {SEC}.",
    "Tribunal confirma sentencia contra red de sobornos en {SEC}.",
    "ONG destaca avances en transparencia activa de {SEC}.",
  ];

  // ── Headlines ───────────────────────────────────────────────────────
  const SOURCES_LATAM = [
    "El País Reg.", "Diario Norte", "Plaza Pública", "Noticentro",
    "Tribuna Sur", "El Heraldo", "Página Plural", "ChequeoMX",
    "Vértice", "La Tercera Vía",
  ];
  const SOURCES_EN = ["The Sentinel", "Capital Wire", "Northern Post", "Standard Daily"];
  const SOURCES_HTI = ["Le Nouvelliste-DEMO", "Haïti Libre-DEMO"];
  const SOURCES_INTL = ["Reuters-DEMO", "AFP-DEMO", "Bloomberg-DEMO", "AP-DEMO"];

  const HEADLINES_HIGH = [
    "Una década perdida: por qué {C} no logra cerrar la brecha de transparencia.",
    "El círculo cercano: cómo se reparten los contratos de {SEC} en {C}.",
    "Las cifras detrás del malestar: 7 de cada 10 desconfían de las instituciones.",
    "Mapa de la corrupción percibida en {Y}: {C} entre los más castigados.",
    "Filtración masiva expone red de pagos en {SEC}.",
    "¿Qué hace falta para que en {C} la justicia actúe a tiempo?",
    "Anatomía de un caso: la ruta del dinero en {SEC}.",
    "{C} {Y}: cuando las renuncias ya no alcanzan.",
  ];
  const HEADLINES_MID = [
    "Reforma o reposo: el debate de transparencia que {C} no termina de dar.",
    "Indicadores mixtos: avances tímidos en {SEC}, retrocesos en aduanas.",
    "El nuevo Congreso de {C} y su agenda anticorrupción de {Y}.",
    "¿Por qué {C} se mueve tan lento? Tres claves de un especialista.",
    "El presupuesto {Y}: las partidas que más alertan a la contraloría.",
    "Mesa de transparencia: lo que se acordó (y lo que no) este {Y}.",
  ];
  const HEADLINES_LOW = [
    "{C} suma puntos: por qué la región mira con atención sus reformas.",
    "El caso {C}: cómo una unidad de inteligencia financiera cambió el juego.",
    "Datos abiertos en {C}: el cambio silencioso de los últimos años.",
    "Reportaje: la generación que decidió no firmar contratos turbios.",
    "Auditoría ciudadana en {C}: la receta que están copiando los vecinos.",
    "{C} {Y}: menos casos, más sentencias firmes.",
  ];

  // ── Adjetivos / gentilicios cortos para insertar en titulares ───────
  const GENTILICIO = {
    CAN: "Canadá", USA: "EE.UU.", MEX: "México", GTM: "Guatemala", BLZ: "Belice",
    HND: "Honduras", SLV: "El Salvador", NIC: "Nicaragua", CRI: "Costa Rica",
    PAN: "Panamá", CUB: "Cuba", JAM: "Jamaica", HTI: "Haití", DOM: "RD",
    BHS: "Bahamas", TTO: "Trinidad", COL: "Colombia", VEN: "Venezuela",
    GUY: "Guyana", SUR: "Surinam", ECU: "Ecuador", PER: "Perú", BOL: "Bolivia",
    BRA: "Brasil", PRY: "Paraguay", URY: "Uruguay", CHL: "Chile", ARG: "Argentina",
  };

  // ── Indicadores ilustrativos ────────────────────────────────────────
  const INDICATOR_DEFS = [
    { label: "Casos abiertos", unit: "", min: 12, max: 320 },
    { label: "Imputaciones", unit: "", min: 3, max: 88 },
    { label: "Sentencias firmes", unit: "", min: 0, max: 42 },
    { label: "Renuncias", unit: "", min: 0, max: 18 },
    { label: "Audiencias", unit: "", min: 4, max: 240 },
    { label: "Allanamientos", unit: "", min: 1, max: 95 },
    { label: "Filtraciones doc.", unit: "", min: 0, max: 24 },
    { label: "Querellas ONG", unit: "", min: 1, max: 48 },
    { label: "Acceso info. neg.", unit: "%", min: 4, max: 62 },
    { label: "Reportes UIF", unit: "K", min: 1, max: 78 },
  ];

  // ── Formatos ────────────────────────────────────────────────────────
  function formatName(r, iso3) {
    const pool = namePool(iso3);
    return `${pick(r, pool.firsts)} ${pick(r, pool.lasts)}`;
  }

  function formatDate(r, year) {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const m = months[rint(r, 0, 11)];
    const d = rint(r, 1, 28);
    return `${d} ${m}`;
  }

  function fillTemplate(tpl, ctx) {
    return tpl
      .replace(/\{C\}/g, ctx.country)
      .replace(/\{Y\}/g, String(ctx.year))
      .replace(/\{SEC\}/g, ctx.sector.toLowerCase())
      .replace(/\{AMOUNT\}/g, ctx.amount)
      .replace(/\{MIN\}/g, ctx.minister || "");
  }

  function pickEventPool(r, score) {
    // Mezcla según severidad de la percepción
    if (score >= 65) return r() < 0.7 ? EVENTS_HIGH : (r() < 0.5 ? EVENTS_MID : EVENTS_LOW);
    if (score >= 45) return r() < 0.35 ? EVENTS_HIGH : (r() < 0.7 ? EVENTS_MID : EVENTS_LOW);
    return r() < 0.15 ? EVENTS_HIGH : (r() < 0.4 ? EVENTS_MID : EVENTS_LOW);
  }
  function pickHeadlinePool(r, score) {
    if (score >= 65) return r() < 0.7 ? HEADLINES_HIGH : (r() < 0.5 ? HEADLINES_MID : HEADLINES_LOW);
    if (score >= 45) return r() < 0.35 ? HEADLINES_HIGH : (r() < 0.7 ? HEADLINES_MID : HEADLINES_LOW);
    return r() < 0.15 ? HEADLINES_HIGH : (r() < 0.4 ? HEADLINES_MID : HEADLINES_LOW);
  }

  function sourcePool(iso3) {
    if (iso3 === "USA" || iso3 === "CAN" || iso3 === "JAM" || iso3 === "BHS" || iso3 === "TTO" || iso3 === "BLZ" || iso3 === "GUY" || iso3 === "SUR") {
      return SOURCES_EN.concat(SOURCES_INTL);
    }
    if (iso3 === "HTI") return SOURCES_HTI.concat(SOURCES_INTL);
    return SOURCES_LATAM.concat(SOURCES_INTL);
  }

  // ── Generador "core" ────────────────────────────────────────────────
  function generateEvents(r, country, year, score, count) {
    const out = [];
    const usedSectors = new Set();
    for (let i = 0; i < count; i++) {
      const sector = pick(r, SECTORS);
      // Permite repetir sectores pero los espacia
      if (usedSectors.has(sector) && r() < 0.5) {
        i--; continue;
      }
      usedSectors.add(sector);
      const pool = pickEventPool(r, score);
      const tpl = pick(r, pool);
      const amount = rint(r, 4, 480);
      const text = fillTemplate(tpl, {
        country: GENTILICIO[country.iso3] || country.name,
        year, sector, amount,
      });
      out.push({
        date: formatDate(r, year),
        sector: sector.toUpperCase(),
        text,
      });
    }
    // Orden cronológico aproximado: por mes
    const monthOrder = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    out.sort((a, b) => {
      const ma = monthOrder.indexOf(a.date.split(" ")[1]);
      const mb = monthOrder.indexOf(b.date.split(" ")[1]);
      if (ma !== mb) return ma - mb;
      return parseInt(a.date) - parseInt(b.date);
    });
    return out;
  }

  function generateHeadlines(r, country, year, score, count) {
    const sources = sourcePool(country.iso3);
    const out = [];
    for (let i = 0; i < count; i++) {
      const pool = pickHeadlinePool(r, score);
      const tpl = pick(r, pool);
      const sector = pick(r, SECTORS);
      const text = fillTemplate(tpl, {
        country: GENTILICIO[country.iso3] || country.name,
        year, sector, amount: rint(r, 5, 250),
      });
      out.push({ source: pick(r, sources), text });
    }
    return out;
  }

  function generateIndicators(r, score, count) {
    // Escala los rangos según severidad: más score → más casos abiertos, imputaciones, etc.
    const factor = 0.4 + (score / 100) * 1.2;
    const chosen = pickN(r, INDICATOR_DEFS, count);
    return chosen.map(def => {
      const range = def.max - def.min;
      const base = def.min + r() * range;
      const value = Math.max(def.min, Math.round(base * (def.label === "Sentencias firmes" ? (2.0 - factor) : factor)));
      return { label: def.label, value, unit: def.unit };
    });
  }

  // ── COUNTRY_DATA (ficha lateral) ────────────────────────────────────
  window.COUNTRY_DATA = function(country, year) {
    const seed = hash(country.iso3 + ":data") ^ (year * 2654435761);
    const r = mulberry32(seed >>> 0);
    const score = country.scores[year];
    return {
      indicators: generateIndicators(r, score, 4),
      events: generateEvents(r, country, year, score, 4),
      headlines: generateHeadlines(r, country, year, score, 3),
    };
  };

  // ── COUNTRY_DETAIL (dashboard fullscreen) ───────────────────────────
  window.COUNTRY_DETAIL = function(country, year) {
    const seed = hash(country.iso3 + ":detail") ^ (year * 0x9E3779B1);
    const r = mulberry32(seed >>> 0);
    const score = country.scores[year];

    // ── Presidente: período de 4 años calculado a partir del año ──
    const periodLen = 4;
    const periodStart = year - ((year - 2015) % periodLen);
    const periodEnd = periodStart + periodLen - 1;
    const presSeed = mulberry32(hash(country.iso3 + ":pres:" + periodStart));
    const presName = formatName(presSeed, country.iso3);
    const partyPool = PARTY_POOLS[country.region] || PARTY_POOLS["Sudamérica"];
    const party = partyPool[Math.floor(presSeed() * partyPool.length)];

    // Aprobación correlaciona inversamente con el score (más corrupto → menos aprobación)
    const approvalBase = Math.max(12, Math.min(82, 95 - score + (presSeed() - 0.5) * 22));
    const supportBase = Math.max(10, Math.min(80, 90 - score + (presSeed() - 0.5) * 30));
    const approval = Math.round(approvalBase);
    const support = Math.round(supportBase);

    // ── Gabinete: 6 carteras, algunas en riesgo según severidad ──
    const cabSize = 6;
    const portfolios = pickN(r, PORTFOLIOS, cabSize);
    const cabinet = portfolios.map(p => {
      const risk = r() < (score / 100) * 0.55;
      return {
        portfolio: p,
        name: formatName(r, country.iso3),
        stance: pick(r, STANCES_OK),
        risk,
      };
    });

    // ── Contexto macro ──
    const ctxR = mulberry32(hash(country.iso3 + ":ctx") ^ (year * 1103515245));
    // Países "estables" tienen menor volatilidad — inverso al score
    const stable = 1 - (score / 100);
    const context = {
      inflation: rfloat(ctxR, 2.5 + (1 - stable) * 4, 9 + (1 - stable) * 40, 1),
      gdp: rfloat(ctxR, -3 + stable * 2, 2 + stable * 4, 1),
      poverty: rfloat(ctxR, 6 + (1 - stable) * 14, 22 + (1 - stable) * 38, 1),
      homicide: rfloat(ctxR, 0.8 + (1 - stable) * 2, 8 + (1 - stable) * 28, 1),
    };

    const detail = {
      president: {
        name: presName,
        periodStart, periodEnd,
        party,
        approval, support,
      },
      cabinet,
      context,
      indicators: generateIndicators(r, score, 6),
      events: generateEvents(r, country, year, score, 8),
      headlines: generateHeadlines(r, country, year, score, 4),
      real: false,
    };

    // ── Superponer datos REALES (Excel → Supabase → localStorage) ──
    // window.PRESIDENT_YEAR[iso3][year] lo expone presidents-override.js.
    try {
      const py = window.PRESIDENT_YEAR
        && window.PRESIDENT_YEAR[country.iso3]
        && window.PRESIDENT_YEAR[country.iso3][year];
      if (py) {
        if (py.president) { detail.president.name = py.president; detail.real = true; }
        if (py.approval != null) { detail.president.approval = Math.round(py.approval); detail.real = true; }
        if (py.political_stance) {
          detail.president.stance = py.political_stance;
          detail.president.party = { short: "·", name: "Postura política", tone: py.political_stance };
          detail.real = true;
        }
        if (py.poverty_pct != null) { detail.context.poverty = py.poverty_pct; detail.real = true; }
        if (py.homicide_rate != null) { detail.context.homicide = py.homicide_rate; detail.real = true; }
        if (py.gdp_growth != null) { detail.context.gdp = py.gdp_growth; detail.real = true; }
        if (py.gdp_comment) detail.gdpComment = py.gdp_comment;
      }
    } catch (_) {}

    // ── Gabinete REAL (Excel → Supabase → window.CABINET) ──
    // Siempre 6 carteras estándar. Si no hay dato respaldado para una cartera
    // NO se muestra un ministro ficticio: se muestra un mensaje.
    try {
      const cab = (window.CABINET
        && window.CABINET[country.iso3]
        && window.CABINET[country.iso3][year]) || [];
      const byPort = {};
      cab.forEach(m => { byPort[m.portfolio] = m; });
      detail.cabinet = CAB_PORTFOLIOS.map(p => {
        const m = byPort[p];
        if (m) return {
          portfolio: p,
          name: m.minister,
          stance: m.role || m.political_stance || "—",
          risk: false,
          color: stanceColor(m.political_stance),
        };
        return {
          portfolio: p,
          name: null,
          noData: true,
          message: "Sin dato respaldado — el perfil de ministro no existe en la base",
        };
      });
      detail.realCabinet = cab.length > 0;
      if (cab.length) detail.real = true;
    } catch (_) {}

    // ── Hitos del año (Excel → Supabase → window.MILESTONES) ──
    try {
      const ms = window.MILESTONES
        && window.MILESTONES[country.iso3]
        && window.MILESTONES[country.iso3][year];
      if (ms && ms.length) {
        detail.milestones = ms;
        detail.real = true;
      }
    } catch (_) {}

    return detail;
  };

  // Carteras estándar del gabinete (coinciden con cabinet_ministers en DB)
  const CAB_PORTFOLIOS = ["Economía", "Salud", "Vivienda", "Transporte", "Trabajo", "Justicia"];

  // Color político por postura (gobierno) — para el gabinete real
  function stanceColor(s) {
    if (!s) return "#94a3b8";
    const t = s.toLowerCase();
    if (t.includes("izquierda")) return "#e2495a";
    if (t.includes("derecha"))   return "#3b82f6";
    if (t.includes("centro"))    return "#a78bfa";
    return "#94a3b8"; // independiente / no ideológico / sin clasificar
  }
  window.stanceColor = stanceColor;

  // ── COUNTRY_NEWS (panel de noticias del país en la rail izquierda) ──
  // Devuelve titulares de noticias clasificados en tres bandejas:
  //   corrupcion · politica · gobierno
  // Cada noticia trae source, ts relativo, sector y category.

  const NEWS_CORRUP = [
    "Fiscalía abre investigación por sobreprecios en {SEC} ({AMOUNT}M USD)",
    "Renuncia el viceministro de {SEC} tras filtración de chats",
    "Tribunal cita a tres exfuncionarios por contratos sin licitación",
    "Auditoría detecta irregularidades por {AMOUNT}M en {SEC}",
    "ONG denuncia desvío de fondos de emergencia en {SEC}",
    "Filtración masiva expone red de cohecho en aduanas",
    "Corte ordena reabrir caso emblemático sobre {SEC} archivado en 2018",
    "Periodistas reciben amenazas tras reportaje sobre {SEC}",
    "Suspenden licitación clave por pliego «hecho a medida»",
    "Imputan a tres exministros en operativo coordinado",
    "Caso {SEC}: defensa pide nulidad por filtración de pruebas",
  ];
  const NEWS_POL = [
    "Congreso debate moción de censura al ministro de {SEC}",
    "Oposición rompe alianza estratégica a meses de las generales",
    "Encuesta: aprobación presidencial cae al {N}%",
    "Reforma electoral avanza sin consenso parlamentario",
    "Partido oficialista pierde fuerza en la interna del {SEC}",
    "Mesa de diálogo no logra acuerdo sobre presupuesto {Y}",
    "Tribunal electoral admite impugnación contra candidatura",
    "Cumbre regional reúne a presidentes en {C}",
    "Bloque opositor presenta proyecto de ley de financiamiento de partidos",
    "Senadores piden interpelación al gabinete económico",
  ];
  const NEWS_GOV = [
    "Gobierno anuncia plan de inversión en {SEC} por {AMOUNT}M USD",
    "Inflación de {Y} se proyecta en {N}% según Banco Central",
    "Inauguran obra clave de infraestructura en {SEC}",
    "Reforma tributaria pasa filtro técnico de Hacienda",
    "Ministerio de {SEC} presenta plan de modernización digital",
    "Crisis hospitalaria cumple tres meses sin resolución",
    "Ejecutivo veta artículo controvertido de ley recientemente aprobada",
    "Nueva contralora general jura ante el presidente",
    "Indicadores macro: el desempleo se mantiene en {N}%",
    "Banco Central interviene mercado cambiario tras presión",
  ];

  const NEWS_CATEGORIES = [
    { key: "corrupcion", label: "Corrupción", pool: NEWS_CORRUP, count: 4,
      sectors: ["Aduanas","Contratos","Compras","Concesiones","Subsidios","Banca pública","Lobby","Judicial"] },
    { key: "politica",   label: "Política",   pool: NEWS_POL,    count: 3,
      sectors: ["Congreso","Electoral","Partidos","Oposición","Diplomacia"] },
    { key: "gobierno",   label: "Gobierno",   pool: NEWS_GOV,    count: 3,
      sectors: ["Obras públicas","Salud","Educación","Hacienda","Energía","Transporte"] },
  ];

  function formatRelTs(r, maxDaysBack) {
    // Distribución sesgada hacia "reciente"
    const x = Math.pow(r(), 1.4);
    const back = x * maxDaysBack * 24 * 60 * 60 * 1000;
    return Date.now() - back;
  }

  window.COUNTRY_NEWS = function(country, year) {
    const seed = hash(country.iso3 + ":news") ^ (year * 0x12345789);
    const r = mulberry32(seed >>> 0);
    const score = country.scores[year];
    const sources = sourcePool(country.iso3);

    const out = {};
    NEWS_CATEGORIES.forEach(cat => {
      const items = [];
      // Sin repetir plantilla ni sector dentro de la misma categoría
      const usedTpl = new Set();
      const usedSec = new Set();
      let attempts = 0;
      while (items.length < cat.count && attempts < cat.count * 6) {
        attempts++;
        const tpl = pick(r, cat.pool);
        const sector = pick(r, cat.sectors);
        if (usedTpl.has(tpl) && usedTpl.size < cat.pool.length) continue;
        if (usedSec.has(sector) && usedSec.size < cat.sectors.length) continue;
        usedTpl.add(tpl); usedSec.add(sector);
        const amount = rint(r, 4, 480);
        const N = cat.key === "politica" ? rint(r, 28, 62) :
                  cat.key === "gobierno" ? rfloat(r, 1.8, 14.5, 1) :
                  rint(r, 4, 380);
        const title = tpl
          .replace(/\{C\}/g, GENTILICIO[country.iso3] || country.name)
          .replace(/\{Y\}/g, String(year))
          .replace(/\{SEC\}/g, sector.toLowerCase())
          .replace(/\{AMOUNT\}/g, amount)
          .replace(/\{N\}/g, N);
        items.push({
          id: `news-${country.iso3}-${year}-${cat.key}-${items.length}-${(seed + items.length * 13) >>> 0}`,
          category: cat.key,
          categoryLabel: cat.label,
          source: pick(r, sources),
          title,
          sector,
          ts: formatRelTs(r, cat.key === "corrupcion" ? 5 : 9),
        });
      }
      items.sort((a, b) => b.ts - a.ts);
      out[cat.key] = items;
    });
    return out;
  };
})();
