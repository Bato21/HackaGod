// Datos ILUSTRATIVOS — no son cifras oficiales.
// Métrica: 0 = muy limpio, 100 = muy corrupto.
// Los valores base se inspiran libremente en la percepción pública internacional,
// pero las cifras año a año son generadas con un PRNG determinístico para esta demo.

window.YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// [isoNumeric, iso3, nombre, region, base, lat, lng]
window.COUNTRIES_RAW = [
  ["124","CAN","Canadá","Norteamérica",24, 60.0, -95.0],
  ["840","USA","Estados Unidos","Norteamérica",31, 39.5, -98.5],
  ["484","MEX","México","Norteamérica",69, 23.6, -102.5],
  ["320","GTM","Guatemala","Centroamérica",76, 15.5, -90.2],
  ["084","BLZ","Belice","Centroamérica",60, 17.2, -88.5],
  ["340","HND","Honduras","Centroamérica",77, 15.2, -86.2],
  ["222","SLV","El Salvador","Centroamérica",69, 13.8, -88.9],
  ["558","NIC","Nicaragua","Centroamérica",83, 12.8, -85.2],
  ["188","CRI","Costa Rica","Centroamérica",45, 9.7, -83.7],
  ["591","PAN","Panamá","Centroamérica",63, 8.5, -80.7],
  ["192","CUB","Cuba","Caribe",58, 21.5, -77.8],
  ["388","JAM","Jamaica","Caribe",56, 18.1, -77.3],
  ["332","HTI","Haití","Caribe",83, 18.9, -72.3],
  ["214","DOM","Rep. Dominicana","Caribe",65, 18.7, -70.2],
  ["044","BHS","Bahamas","Caribe",36, 25.0, -77.4],
  ["780","TTO","Trinidad y Tobago","Caribe",58, 10.7, -61.2],
  ["170","COL","Colombia","Sudamérica",61, 4.6, -74.0],
  ["862","VEN","Venezuela","Sudamérica",87, 6.4, -66.6],
  ["328","GUY","Guyana","Sudamérica",60, 4.8, -58.9],
  ["740","SUR","Surinam","Sudamérica",64, 4.0, -56.0],
  ["218","ECU","Ecuador","Sudamérica",64, -1.8, -78.1],
  ["604","PER","Perú","Sudamérica",67, -9.2, -75.0],
  ["068","BOL","Bolivia","Sudamérica",71, -16.3, -63.6],
  ["076","BRA","Brasil","Sudamérica",64, -14.2, -51.9],
  ["600","PRY","Paraguay","Sudamérica",72, -23.4, -58.4],
  ["858","URY","Uruguay","Sudamérica",27, -32.5, -55.8],
  ["152","CHL","Chile","Sudamérica",34, -35.7, -71.5],
  ["032","ARG","Argentina","Sudamérica",63, -34.4, -63.6],
];

// PRNG determinístico (mulberry32) para series temporales reproducibles
function mulberry32(a) {
  return function() {
    a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

window.COUNTRIES = window.COUNTRIES_RAW.map(([id, iso3, name, region, base, lat, lng], idx) => {
  const rand = mulberry32(parseInt(id, 10) * 7 + idx * 13 + 42);
  // Drift suave alrededor del base, con tendencias macro
  const trend = (rand() - 0.5) * 0.6; // tendencia neta a 10 años
  const scores = {};
  let v = base + (rand() - 0.5) * 4;
  window.YEARS.forEach((y, i) => {
    const noise = (rand() - 0.5) * 6;
    v = v + trend + noise * 0.5;
    // suavizado leve hacia el base para evitar drift extremo
    v = v * 0.85 + base * 0.15 + (rand() - 0.5) * 2;
    scores[y] = Math.max(2, Math.min(98, Math.round(v * 10) / 10));
  });
  return { id, iso3, name, region, base, lat, lng, scores };
});

window.SCORE_OF = function(country, year) { return country.scores[year]; };
window.REGIONS = ["Norteamérica", "Centroamérica", "Caribe", "Sudamérica"];
