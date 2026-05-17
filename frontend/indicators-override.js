// indicators-override.js — expone window.INDICATORS (indicadores numéricos
// por país-año) desde localStorage antes de que React monte. Script
// síncrono tras data.js, mismo patrón que milestones-override.
// Forma: window.INDICATORS = { ISO3: { 2022: { reportes_uif, ... }, ... } }

(function () {
  window.INDICATORS = window.INDICATORS || {};
  try {
    var raw = localStorage.getItem("aletheia.indicators");
    if (!raw) return;
    var data = JSON.parse(raw);
    var n = 0;
    Object.keys(data).forEach(function (iso3) {
      window.INDICATORS[iso3] = data[iso3];
      n++;
    });
    if (n > 0) console.info("[indicators-override] " + n + " países con indicadores.");
  } catch (_) {}
})();
