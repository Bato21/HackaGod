// milestones-override.js — expone window.MILESTONES (hitos por país-año)
// desde localStorage antes de que React monte. Script síncrono tras data.js.
// Forma: window.MILESTONES = { ISO3: { 2017: ["hito1","hito2",...], ... } }

(function () {
  window.MILESTONES = window.MILESTONES || {};
  try {
    var raw = localStorage.getItem("aletheia.milestones");
    if (!raw) return;
    var data = JSON.parse(raw);
    var n = 0;
    Object.keys(data).forEach(function (iso3) {
      window.MILESTONES[iso3] = data[iso3];
      n++;
    });
    if (n > 0) console.info("[milestones-override] " + n + " países con hitos.");
  } catch (_) {}
})();
