// news-override.js — Noticias reales desde Supabase (RPC get_news).
//
// Patrón idéntico a cpi-override / milestones-override:
//   • Script SÍNCRONO cargado tras events.js y ANTES de app.jsx.
//   • Lee el cache `localStorage aletheia.news` (poblado por cloud-sync.js
//     en el load anterior) y construye window.ALETHEIA_NEWS / *_RECENT.
//   • Sobrescribe window.COUNTRY_NEWS para que la rail de noticias del país
//     muestre titulares REALES en vez del placeholder vacío.
//   • cloud-sync.js llama window.applyNewsCache(rows) tras el fetch y
//     dispara `aletheia:news:loaded` para que React re-renderice.
//
// El contenido es real (feed InSight Crime clasificado por país en la BD).

(function () {
  "use strict";

  // ── Limpieza de texto ──────────────────────────────────────────────
  function stripTags(s) {
    return String(s || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;| /g, " ")
      .replace(/&amp;/g, "&").replace(/&#8217;|&rsquo;/g, "’")
      .replace(/&quot;/g, '"').replace(/&hellip;/g, "…")
      .replace(/\s+/g, " ")
      .trim();
  }

  // De un cuerpo HTML extrae el párrafo-resumen real:
  // descarta el <p> que es el titular-enlace y el "The post … appeared first on …".
  function cleanSummary(html, headline) {
    var paras = [];
    var re = /<p[^>]*>([\s\S]*?)<\/p>/gi, m;
    while ((m = re.exec(html || ""))) {
      var t = stripTags(m[1]);
      if (t) paras.push(t);
    }
    if (!paras.length) {
      var flat = stripTags(html);
      return flat.length > 240 ? flat.slice(0, 237) + "…" : flat;
    }
    var hl = stripTags(headline).toLowerCase();
    var best = paras.filter(function (p) {
      var lp = p.toLowerCase();
      if (lp.indexOf("appeared first on") !== -1) return false;
      if (lp === hl) return false;
      if (p.length < 24) return false;
      return true;
    });
    var pick = (best[0] || paras[0] || "").trim();
    return pick.length > 280 ? pick.slice(0, 277) + "…" : pick;
  }

  // Fuente legible a partir del dominio (source_name viene basura: "CL").
  var SOURCE_MAP = {
    "insightcrime.org": "InSight Crime",
    "ojo-publico.com": "Ojo Público",
    "elpais.com": "El País",
    "reuters.com": "Reuters",
    "bbc.com": "BBC",
    "bloomberg.com": "Bloomberg",
  };
  function sourceFromUrl(url, fallback) {
    try {
      var h = new URL(url).hostname.replace(/^www\./, "");
      if (SOURCE_MAP[h]) return SOURCE_MAP[h];
      var base = h.split(".")[0];
      return base.charAt(0).toUpperCase() + base.slice(1);
    } catch (_) {
      return fallback && fallback.length > 2 ? fallback : "Fuente";
    }
  }

  function parseTopics(arr) {
    if (!arr || !arr.length) return [];
    var raw = Array.isArray(arr) ? arr.join(",") : String(arr);
    return raw
      .split(",")
      .map(function (s) { return s.replace(/ /g, " ").trim(); })
      .filter(Boolean)
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .slice(0, 3);
  }

  // Bandeja de la rail: corrupción · política · gobierno.
  var POL = /\b(petro|presidente?|elec|electoral|congreso|parlament|oposici|peace|paz total|polít|gobierno de|gabinete|ministr)\b/i;
  var GOV = /\b(reforma|plan |inversi|presupuesto|ley |decreto|polic[ií]a|fuerza p[uú]blica|operativo|extradi)\b/i;
  function classify(headline, topicsStr) {
    var s = (headline + " " + topicsStr).toLowerCase();
    if (POL.test(s)) return "politica";
    if (GOV.test(s)) return "gobierno";
    return "corrupcion"; // feed de crimen organizado → corrupción por defecto
  }

  var CAT_LABEL = { corrupcion: "Corrupción", politica: "Política", gobierno: "Gobierno" };

  // ── Normaliza filas del RPC a items de UI ──────────────────────────
  function toItem(row) {
    var topics = parseTopics(row.topics);
    var topicsStr = topics.join(" ");
    var cat = classify(row.headline || "", topicsStr);
    var ts = row.published_at ? new Date(row.published_at).getTime() : Date.now();
    return {
      id: row.id,
      iso3: (row.iso3 || "").trim(),
      country: row.country_name || "",
      title: stripTags(row.headline),
      summary: cleanSummary(row.body_text, row.headline),
      source: sourceFromUrl(row.source_url, row.source_name),
      url: row.source_url || null,
      ts: ts,
      cat: cat,
      categoryLabel: CAT_LABEL[cat],
      sector: topics[0] || CAT_LABEL[cat],
      tag: row.country_name || (row.iso3 || "").trim(),
    };
  }

  // ── Construye índices globales desde filas crudas ──────────────────
  function build(rows) {
    var byIso = {}, recent = [];
    (rows || []).forEach(function (r) {
      var it = toItem(r);
      if (!it.iso3) return;
      (byIso[it.iso3] = byIso[it.iso3] || []).push(it);
      recent.push(it);
    });
    Object.keys(byIso).forEach(function (k) {
      byIso[k].sort(function (a, b) { return b.ts - a.ts; });
    });
    recent.sort(function (a, b) { return b.ts - a.ts; });
    window.ALETHEIA_NEWS = byIso;
    window.ALETHEIA_NEWS_RECENT = recent;
    return recent.length;
  }

  // Llamado por cloud-sync.js tras el fetch del RPC.
  window.applyNewsCache = function (rows) {
    var n = build(rows);
    try { localStorage.setItem("aletheia.news", JSON.stringify(rows || [])); } catch (_) {}
    return n;
  };

  // Carga síncrona inicial desde el cache del load previo.
  (function bootstrapFromCache() {
    try {
      var raw = localStorage.getItem("aletheia.news");
      if (raw) build(JSON.parse(raw));
    } catch (_) {}
    if (!window.ALETHEIA_NEWS) { window.ALETHEIA_NEWS = {}; window.ALETHEIA_NEWS_RECENT = []; }
  })();

  // ── Override de window.COUNTRY_NEWS ────────────────────────────────
  // La rail del país agrupa en corrupcion/politica/gobierno. Ignoramos el
  // año (solo tenemos cobertura reciente real).
  //
  // Además: si hay una señal en window.ALETHEIA_RISK[iso3], la inyectamos
  // como primer item de "corrupcion" — el usuario debe ver siempre las
  // señales de riesgo al abrir las noticias del país.
  window.COUNTRY_NEWS = function (country, _year) {
    var out = { corrupcion: [], politica: [], gobierno: [] };
    if (!country) return out;
    var iso = (country.iso3 || "").trim();

    // 1) Señal de riesgo (si existe) → primero en corrupcion
    var risk = (window.ALETHEIA_RISK || {})[iso];
    if (risk && risk.strength >= 0.5) {
      var lvl = (typeof window.riskLabel === "function") ? window.riskLabel(risk.strength) : "RIESGO";
      var pct = Math.round(risk.strength * 100);
      out.corrupcion.push({
        id: "risk-" + iso,
        source: "Aletheia · risk_signals",
        ts: risk.ts || Date.now(),
        title: "▲ " + lvl + " (" + pct + "%) — " + (risk.pattern || "Señal de riesgo"),
        summary: risk.summary || "Señal de riesgo detectada por el pipeline analítico de Aletheia.",
        url: null,
        sector: risk.pattern || "Señal de riesgo",
        categoryLabel: "Corrupción · Señal",
        isRisk: true,
        riskStrength: risk.strength,
      });
    }

    // 2) Noticias reales del país
    var items = (window.ALETHEIA_NEWS || {})[iso] || [];
    items.forEach(function (it) {
      (out[it.cat] || out.corrupcion).push({
        id: it.id,
        source: it.source,
        ts: it.ts,
        title: it.title,
        summary: it.summary,
        url: it.url,
        sector: it.sector,
        categoryLabel: it.categoryLabel,
      });
    });
    return out;
  };
})();
