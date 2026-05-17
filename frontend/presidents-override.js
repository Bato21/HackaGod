// presidents-override.js — expone datos reales de presidentes/indicadores
// (Supabase, cacheados en localStorage por cloud-sync) como window.PRESIDENT_YEAR
// antes de que React monte. Cargado como script síncrono después de data.js.
// En primera carga no hay datos (events.js usa PRNG); desde la segunda carga
// (post-reload de cloud-sync) COUNTRY_DETAIL los superpone.
//
// Forma: window.PRESIDENT_YEAR = { ISO3: { 2017: {president, approval, ...}, ... } }

(function () {
  window.PRESIDENT_YEAR = window.PRESIDENT_YEAR || {};
  try {
    var raw = localStorage.getItem("aletheia.presidents");
    if (!raw) return;
    var data = JSON.parse(raw);
    var n = 0;
    Object.keys(data).forEach(function (iso3) {
      window.PRESIDENT_YEAR[iso3] = data[iso3];
      n++;
    });
    if (n > 0) {
      console.info("[presidents-override] " + n + " países con datos reales de presidentes.");
    }
  } catch (_) {}
})();
