// cabinet-override.js — expone window.CABINET (gabinete real por país-año)
// desde localStorage antes de que React monte. Script síncrono tras data.js.
// Forma: window.CABINET = { ISO3: { 2017: [{portfolio,minister,role,political_stance}], ... } }

(function () {
  window.CABINET = window.CABINET || {};
  try {
    var raw = localStorage.getItem("aletheia.cabinet");
    if (!raw) return;
    var data = JSON.parse(raw);
    var n = 0;
    Object.keys(data).forEach(function (iso3) {
      window.CABINET[iso3] = data[iso3];
      n++;
    });
    if (n > 0) console.info("[cabinet-override] " + n + " países con gabinete real.");
  } catch (_) {}
})();
