// risk-override.js — Señales de riesgo institucional desde Supabase.
//
// Patrón idéntico a news-override / cpi-override:
//   • Script SÍNCRONO cargado tras data.js y ANTES de app.jsx.
//   • Lee cache `localStorage aletheia.risk` (poblado por cloud-sync.js
//     en el load anterior) → window.ALETHEIA_RISK (iso3 → señal).
//   • cloud-sync.js llama window.applyRiskCache(rows) tras el fetch del
//     RPC get_risk_signals y dispara `aletheia:risk:loaded`.
//
// Las "pelotitas" del mapa (News POI en app.jsx) se colorean por
// signal_strength real:  0.5–0.7 amarillo · 0.7–0.9 naranjo · 0.9+ rojo.

(function () {
  "use strict";

  // ── Limpia claude_summary (viene en 2 formatos sucios) ─────────────
  //  a) cerca de ```json { ... "justification": "..." } ```
  //  b) markdown "# Resumen ejecutivo\n texto..."
  function cleanRiskSummary(raw) {
    var s = String(raw || "").trim();
    if (!s) return "";

    // Quita fences ```json ... ```  o  `` ... ``
    s = s.replace(/^`+\s*json/i, "").replace(/^`+/, "").replace(/`+$/g, "").trim();

    // Caso JSON: extrae "justification"
    if (s[0] === "{") {
      try {
        var j = JSON.parse(s);
        if (j.justification) return String(j.justification).trim();
      } catch (_) {
        var m = s.match(/"justification"\s*:\s*"([^"]+)"/);
        if (m) return m[1].trim();
      }
    }

    // Caso markdown: quita encabezados, toma primer párrafo con contenido
    var lines = s.split(/\r?\n/).map(function (l) {
      return l.replace(/^#+\s*/, "").replace(/^\d+\.\s*/, "").trim();
    }).filter(Boolean);
    var skip = /^(resumen ejecutivo|hechos verificables|análisis|conclusión)$/i;
    for (var i = 0; i < lines.length; i++) {
      if (!skip.test(lines[i]) && lines[i].length > 30) {
        var t = lines[i];
        return t.length > 240 ? t.slice(0, 237) + "…" : t;
      }
    }
    return s.length > 240 ? s.slice(0, 237) + "…" : s;
  }

  var PATTERN_ES = {
    IMPUNIDAD_PROCESAL: "Impunidad procesal",
    CAPTURA_REGULATORIA: "Captura regulatoria",
    CONFLICTO_INTERES: "Conflicto de interés",
    CONTRATACION_IRREGULAR: "Contratación irregular",
    DESVIO_FONDOS: "Desvío de fondos",
    LOBBYING_OPACO: "Lobby opaco",
  };

  function build(rows) {
    var byIso = {};
    (rows || []).forEach(function (r) {
      var iso = (r.iso3 || "").trim();
      if (!iso) return;
      var strength = parseFloat(r.strength) || 0;
      byIso[iso] = {
        iso3: iso,
        country: r.country_name || iso,
        strength: strength,
        count: parseInt(r.signal_count, 10) || 0,
        pattern: PATTERN_ES[r.pattern_code] || r.pattern_code || "Señal de riesgo",
        summary: cleanRiskSummary(r.claude_summary),
        ts: r.detected_at ? new Date(r.detected_at).getTime() : Date.now(),
        threadId: r.forum_thread_id || null,
      };
    });
    window.ALETHEIA_RISK = byIso;
    return Object.keys(byIso).length;
  }

  // Color por intensidad (umbrales pedidos por el usuario).
  window.riskColor = function (s) {
    if (s >= 0.9) return "#dc2626"; // rojo — crítico
    if (s >= 0.7) return "#f97316"; // naranjo — alto
    if (s >= 0.5) return "#eab308"; // amarillo — medio
    return null;                    // <0.5 → no se pinta
  };
  window.riskLabel = function (s) {
    if (s >= 0.9) return "RIESGO CRÍTICO";
    if (s >= 0.7) return "RIESGO ALTO";
    if (s >= 0.5) return "RIESGO MEDIO";
    return "";
  };

  window.applyRiskCache = function (rows) {
    var n = build(rows);
    try { localStorage.setItem("aletheia.risk", JSON.stringify(rows || [])); } catch (_) {}
    return n;
  };

  (function bootstrapFromCache() {
    try {
      var raw = localStorage.getItem("aletheia.risk");
      if (raw) build(JSON.parse(raw));
    } catch (_) {}
    if (!window.ALETHEIA_RISK) window.ALETHEIA_RISK = {};
  })();
})();
