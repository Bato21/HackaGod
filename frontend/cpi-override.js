// cpi-override.js — aplica scores CPI reales (de Supabase, cacheados en localStorage)
// sobre window.COUNTRIES antes de que React monte. Cargado como script síncrono
// después de data.js. En primera carga no hay datos (usa PRNG); desde la segunda
// carga (post-reload de cloud-sync) usa CPI real.
//
// Escala: aletheia_score = 100 - cpi_original (0=transparente, 100=muy corrupto).

(function () {
  try {
    var raw = localStorage.getItem("aletheia.cpi");
    if (!raw || !window.COUNTRIES) return;
    var cpi = JSON.parse(raw);
    var updated = 0;
    window.COUNTRIES.forEach(function (c) {
      var scores = cpi[c.iso3];
      if (!scores) return;
      Object.keys(scores).forEach(function (yr) {
        c.scores[parseInt(yr, 10)] = scores[yr];
      });
      updated++;
    });
    if (updated > 0) {
      console.info("[cpi-override] " + updated + " países con scores CPI reales aplicados.");
    }
  } catch (_) {}
})();
