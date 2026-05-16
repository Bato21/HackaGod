// Datos ILUSTRATIVOS — no son cifras oficiales.
// Métrica: 0 = muy limpio, 100 = muy corrupto.
// Los valores base se inspiran libremente en la percepción pública internacional,
// pero las cifras año a año son generadas con un PRNG determinístico para esta demo.

window.YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// [isoNumeric, iso3, nombre, region, base, lat, lng]
window.COUNTRIES_RAW = [
  // ── Norteamérica ──────────────────────────────────────────────
  ["124","CAN","Canadá",          "Norteamérica", 24,  60.0, -95.0],
  ["840","USA","Estados Unidos",  "Norteamérica", 31,  39.5, -98.5],
  ["484","MEX","México",          "Norteamérica", 69,  23.6,-102.5],

  // ── Centroamérica ─────────────────────────────────────────────
  ["320","GTM","Guatemala",       "Centroamérica",76,  15.5, -90.2],
  ["084","BLZ","Belice",          "Centroamérica",60,  17.2, -88.5],
  ["340","HND","Honduras",        "Centroamérica",77,  15.2, -86.2],
  ["222","SLV","El Salvador",     "Centroamérica",69,  13.8, -88.9],
  ["558","NIC","Nicaragua",       "Centroamérica",83,  12.8, -85.2],
  ["188","CRI","Costa Rica",      "Centroamérica",45,   9.7, -83.7],
  ["591","PAN","Panamá",          "Centroamérica",63,   8.5, -80.7],

  // ── Caribe ────────────────────────────────────────────────────
  ["192","CUB","Cuba",            "Caribe",       58,  21.5, -77.8],
  ["388","JAM","Jamaica",         "Caribe",       56,  18.1, -77.3],
  ["332","HTI","Haití",           "Caribe",       83,  18.9, -72.3],
  ["214","DOM","Rep. Dominicana", "Caribe",       65,  18.7, -70.2],
  ["044","BHS","Bahamas",         "Caribe",       36,  25.0, -77.4],
  ["780","TTO","Trinidad y Tobago","Caribe",      58,  10.7, -61.2],
  ["052","BRB","Barbados",        "Caribe",       38,  13.2, -59.6],
  ["662","LCA","Santa Lucía",     "Caribe",       44,  13.9, -60.9],
  ["308","GRD","Granada",         "Caribe",       46,  12.1, -61.7],
  ["659","KNA","San Cristóbal y Nieves","Caribe", 42,  17.3, -62.7],
  ["670","VCT","San Vicente y las Granadinas","Caribe",48,13.3,-61.2],
  ["028","ATG","Antigua y Barbuda","Caribe",      44,  17.1, -61.8],
  ["212","DMA","Dominica",        "Caribe",       46,  15.4, -61.4],

  // ── Sudamérica ────────────────────────────────────────────────
  ["170","COL","Colombia",        "Sudamérica",   61,   4.6, -74.0],
  ["862","VEN","Venezuela",       "Sudamérica",   87,   6.4, -66.6],
  ["328","GUY","Guyana",          "Sudamérica",   60,   4.8, -58.9],
  ["740","SUR","Surinam",         "Sudamérica",   64,   4.0, -56.0],
  ["218","ECU","Ecuador",         "Sudamérica",   64,  -1.8, -78.1],
  ["604","PER","Perú",            "Sudamérica",   67,  -9.2, -75.0],
  ["068","BOL","Bolivia",         "Sudamérica",   71, -16.3, -63.6],
  ["076","BRA","Brasil",          "Sudamérica",   64, -14.2, -51.9],
  ["600","PRY","Paraguay",        "Sudamérica",   72, -23.4, -58.4],
  ["858","URY","Uruguay",         "Sudamérica",   27, -32.5, -55.8],
  ["152","CHL","Chile",           "Sudamérica",   34, -35.7, -71.5],
  ["032","ARG","Argentina",       "Sudamérica",   63, -34.4, -63.6],

  // ── Europa Occidental ────────────────────────────────────────
  ["020","AND","Andorra",         "Europa",       28,  42.5,   1.5],
  ["040","AUT","Austria",         "Europa",       18,  47.5,  14.5],
  ["056","BEL","Bélgica",         "Europa",       22,  50.5,   4.5],
  ["208","DNK","Dinamarca",       "Europa",       12,  56.3,   9.5],
  ["246","FIN","Finlandia",       "Europa",       10,  64.0,  26.0],
  ["250","FRA","Francia",         "Europa",       28,  46.2,   2.2],
  ["276","DEU","Alemania",        "Europa",       18,  51.2,  10.5],
  ["300","GRC","Grecia",          "Europa",       45,  39.1,  22.0],
  ["352","ISL","Islandia",        "Europa",        8,  65.0, -18.5],
  ["372","IRL","Irlanda",         "Europa",       22,  53.1,  -8.2],
  ["380","ITA","Italia",          "Europa",       40,  42.8,  12.8],
  ["438","LIE","Liechtenstein",   "Europa",       18,  47.1,   9.6],
  ["442","LUX","Luxemburgo",      "Europa",       15,  49.8,   6.1],
  ["470","MLT","Malta",           "Europa",       40,  35.9,  14.5],
  ["492","MCO","Mónaco",          "Europa",       20,  43.7,   7.4],
  ["528","NLD","Países Bajos",    "Europa",       16,  52.3,   5.3],
  ["578","NOR","Noruega",         "Europa",        9,  64.5,  17.5],
  ["620","PRT","Portugal",        "Europa",       28,  39.6,  -8.0],
  ["674","SMR","San Marino",      "Europa",       22,  43.9,  12.5],
  ["724","ESP","España",          "Europa",       30,  40.5,  -3.7],
  ["752","SWE","Suecia",          "Europa",       10,  63.0,  16.5],
  ["756","CHE","Suiza",           "Europa",       14,  46.8,   8.2],
  ["826","GBR","Reino Unido",     "Europa",       18,  55.4,  -3.4],

  // ── Europa Central y del Este ────────────────────────────────
  ["008","ALB","Albania",         "Europa",       50,  41.2,  20.2],
  ["070","BIH","Bosnia y Herz.",  "Europa",       54,  44.2,  17.9],
  ["100","BGR","Bulgaria",        "Europa",       48,  42.7,  25.5],
  ["191","HRV","Croacia",         "Europa",       38,  45.1,  16.4],
  ["196","CYP","Chipre",          "Europa",       42,  35.1,  33.4],
  ["203","CZE","Rep. Checa",      "Europa",       38,  49.8,  15.5],
  ["233","EST","Estonia",         "Europa",       22,  58.6,  25.0],
  ["348","HUN","Hungría",         "Europa",       48,  47.2,  19.5],
  ["428","LVA","Letonia",         "Europa",       38,  56.9,  24.6],
  ["440","LTU","Lituania",        "Europa",       36,  55.2,  23.9],
  ["807","MKD","Macedonia del N.","Europa",       52,  41.6,  21.7],
  ["498","MDA","Moldavia",        "Europa",       66,  47.4,  28.4],
  ["499","MNE","Montenegro",      "Europa",       50,  42.7,  19.4],
  ["616","POL","Polonia",         "Europa",       38,  51.9,  19.4],
  ["642","ROU","Rumanía",         "Europa",       50,  45.9,  24.9],
  ["643","RUS","Rusia",           "Europa",       70,  64.0,  96.0],
  ["688","SRB","Serbia",          "Europa",       52,  44.0,  21.0],
  ["703","SVK","Eslovaquia",      "Europa",       42,  48.7,  19.7],
  ["705","SVN","Eslovenia",       "Europa",       28,  46.1,  14.8],
  ["804","UKR","Ucrania",         "Europa",       62,  48.4,  31.2],
  ["112","BLR","Bielorrusia",     "Europa",       60,  53.5,  28.0],
  ["051","ARM","Armenia",         "Europa",       52,  40.1,  45.0],
  ["031","AZE","Azerbaiyán",      "Asia",         60,  40.3,  47.6],
  ["268","GEO","Georgia",         "Europa",       50,  42.3,  43.4],
  ["792","TUR","Turquía",         "Europa",       55,  39.1,  35.0],

  // ── África del Norte ─────────────────────────────────────────
  ["012","DZA","Argelia",         "África",       68,  28.0,   2.6],
  ["818","EGY","Egipto",          "África",       66,  26.8,  30.8],
  ["434","LBY","Libia",           "África",       78,  26.3,  17.2],
  ["504","MAR","Marruecos",       "África",       56,  31.8,  -7.1],
  ["729","SDN","Sudán",           "África",       80,  15.6,  32.5],
  ["788","TUN","Túnez",           "África",       56,  33.9,   9.6],

  // ── África Subsahariana Occidental ───────────────────────────
  ["204","BEN","Benín",           "África",       72,   9.3,   2.3],
  ["854","BFA","Burkina Faso",    "África",       78,  12.4,  -1.6],
  ["132","CPV","Cabo Verde",      "África",       42,  16.0, -24.0],
  ["384","CIV","Costa de Marfil","África",        70,   7.5,  -5.6],
  ["270","GMB","Gambia",          "África",       68,  13.5, -15.3],
  ["288","GHA","Ghana",           "África",       60,   7.9,  -1.0],
  ["324","GIN","Guinea",          "África",       78,  11.0, -10.9],
  ["624","GNB","Guinea-Bisáu",    "África",       80,  11.8, -15.2],
  ["430","LBR","Liberia",         "África",       76,   6.4,  -9.4],
  ["466","MLI","Malí",            "África",       80,  17.6,  -2.0],
  ["478","MRT","Mauritania",      "África",       70,  20.3, -10.9],
  ["562","NER","Níger",           "África",       80,  17.6,   8.1],
  ["566","NGA","Nigeria",         "África",       78,   9.0,   8.7],
  ["686","SEN","Senegal",         "África",       58,  14.5, -14.5],
  ["694","SLE","Sierra Leona",    "África",       74,   8.5, -11.8],
  ["768","TGO","Togo",            "África",       72,   8.6,   1.2],

  // ── África Central ───────────────────────────────────────────
  ["120","CMR","Camerún",         "África",       76,   5.7,  12.4],
  ["140","CAF","Rep. Centroafricana","África",    88,   6.6,  20.5],
  ["148","TCD","Chad",            "África",       86,  15.5,  18.7],
  ["174","COM","Comoras",         "África",       70, -11.7,  43.3],
  ["178","COG","Congo",           "África",       72,  -0.2,  15.8],
  ["180","COD","R.D. del Congo",  "África",       84,  -4.0,  21.8],
  ["266","GAB","Gabón",           "África",       70,  -0.8,  11.6],
  ["226","GNQ","Guinea Ecuatorial","África",      78,   1.7,  10.3],
  ["678","STP","Santo Tomé y P.", "África",       58,   0.2,   6.6],

  // ── África Oriental ──────────────────────────────────────────
  ["108","BDI","Burundi",         "África",       82,  -3.4,  29.9],
  ["262","DJI","Yibuti",          "África",       68,  11.8,  42.6],
  ["232","ERI","Eritrea",         "África",       76,  15.2,  39.8],
  ["231","ETH","Etiopía",         "África",       72,   8.6,  39.6],
  ["404","KEN","Kenia",           "África",       68,   0.0,  37.9],
  ["450","MDG","Madagascar",      "África",       70, -18.8,  46.9],
  ["454","MWI","Malaui",          "África",       72, -13.2,  33.8],
  ["480","MUS","Mauricio",        "África",       42, -20.3,  57.5],
  ["508","MOZ","Mozambique",      "África",       74, -18.7,  35.5],
  ["646","RWA","Ruanda",          "África",       54,  -1.9,  29.9],
  ["706","SOM","Somalia",         "África",       90,   5.2,  46.2],
  ["728","SSD","Sudán del Sur",   "África",       88,   7.0,  30.3],
  ["834","TZA","Tanzania",        "África",       65,  -6.4,  34.9],
  ["800","UGA","Uganda",          "África",       70,   1.4,  32.4],

  // ── África Meridional ────────────────────────────────────────
  ["072","BWA","Botsuana",        "África",       48, -22.3,  24.7],
  ["426","LSO","Lesoto",          "África",       60, -29.6,  28.2],
  ["516","NAM","Namibia",         "África",       48, -22.9,  18.5],
  ["710","ZAF","Sudáfrica",       "África",       58, -29.0,  25.1],
  ["748","SWZ","Suazilandia",     "África",       60, -26.5,  31.5],
  ["894","ZMB","Zambia",          "África",       66, -13.1,  27.8],
  ["716","ZWE","Zimbabue",        "África",       72, -20.0,  30.0],
  ["024","AGO","Angola",          "África",       75, -11.2,  17.9],

  // ── Oriente Medio ────────────────────────────────────────────
  ["048","BHR","Baréin",          "Oriente Medio",52,  26.1,  50.5],
  ["368","IRQ","Irak",            "Oriente Medio",76,  33.2,  43.7],
  ["376","ISR","Israel",          "Oriente Medio",38,  31.5,  35.0],
  ["400","JOR","Jordania",        "Oriente Medio",50,  31.2,  36.5],
  ["414","KWT","Kuwait",          "Oriente Medio",52,  29.3,  47.7],
  ["422","LBN","Líbano",          "Oriente Medio",72,  33.9,  35.9],
  ["512","OMN","Omán",            "Oriente Medio",48,  22.0,  57.0],
  ["634","QAT","Catar",           "Oriente Medio",52,  25.4,  51.2],
  ["682","SAU","Arabia Saudita",  "Oriente Medio",60,  24.7,  45.0],
  ["760","SYR","Siria",           "Oriente Medio",82,  34.8,  38.9],
  ["784","ARE","Emiratos Árabes", "Oriente Medio",42,  24.2,  54.0],
  ["887","YEM","Yemen",           "Oriente Medio",80,  15.6,  48.0],
  ["364","IRN","Irán",            "Oriente Medio",65,  32.4,  53.7],
  ["275","PSE","Palestina",       "Oriente Medio",70,  31.9,  35.2],

  // ── Asia Central ─────────────────────────────────────────────
  ["398","KAZ","Kazajistán",      "Asia",         65,  48.0,  67.0],
  ["417","KGZ","Kirguistán",      "Asia",         68,  41.5,  74.6],
  ["762","TJK","Tayikistán",      "Asia",         72,  38.9,  71.0],
  ["795","TKM","Turkmenistán",    "Asia",         80,  40.0,  59.0],
  ["860","UZB","Uzbekistán",      "Asia",         70,  41.4,  63.9],
  ["004","AFG","Afganistán",      "Asia",         85,  33.9,  67.7],

  // ── Asia del Sur ─────────────────────────────────────────────
  ["050","BGD","Bangladés",       "Asia",         68,  23.7,  90.4],
  ["064","BTN","Bután",           "Asia",         40,  27.5,  90.4],
  ["356","IND","India",           "Asia",         58,  20.6,  79.0],
  ["462","MDV","Maldivas",        "Asia",         50,   3.2,  73.2],
  ["524","NPL","Nepal",           "Asia",         65,  28.4,  84.1],
  ["586","PAK","Pakistán",        "Asia",         72,  29.9,  70.0],
  ["144","LKA","Sri Lanka",       "Asia",         55,   7.9,  80.7],

  // ── Asia Oriental ────────────────────────────────────────────
  ["156","CHN","China",           "Asia",         62,  35.9, 104.2],
  ["392","JPN","Japón",           "Asia",         20,  36.2, 138.3],
  ["408","PRK","Corea del Norte", "Asia",         82,  40.4, 127.5],
  ["410","KOR","Corea del Sur",   "Asia",         28,  36.5, 127.9],
  ["496","MNG","Mongolia",        "Asia",         55,  46.8, 103.8],
  ["158","TWN","Taiwán",          "Asia",         30,  23.7, 121.0],

  // ── Asia del Sudeste ─────────────────────────────────────────
  ["096","BRN","Brunéi",          "Asia",         48,   4.5, 114.7],
  ["116","KHM","Camboya",         "Asia",         74,  12.6, 104.9],
  ["626","TLS","Timor Oriental",  "Asia",         62,  -8.8, 125.7],
  ["360","IDN","Indonesia",       "Asia",         64,  -2.5, 118.0],
  ["418","LAO","Laos",            "Asia",         72,  18.2, 103.9],
  ["458","MYS","Malasia",         "Asia",         50,   3.8, 109.7],
  ["104","MMR","Myanmar",         "Asia",         76,  18.0,  97.0],
  ["608","PHL","Filipinas",       "Asia",         64,  12.9, 122.0],
  ["702","SGP","Singapur",        "Asia",         12,   1.4, 103.8],
  ["764","THA","Tailandia",       "Asia",         54,  15.9, 101.0],
  ["704","VNM","Vietnam",         "Asia",         62,  16.6, 107.7],

  // ── Oceanía ──────────────────────────────────────────────────
  ["036","AUS","Australia",       "Oceanía",      20, -25.3, 133.8],
  ["242","FJI","Fiyi",            "Oceanía",      45, -17.7, 178.1],
  ["296","KIR","Kiribati",        "Oceanía",      55,   1.4, 173.0],
  ["584","MHL","Islas Marshall",  "Oceanía",      52,   7.1, 171.2],
  ["583","FSM","Micronesia",      "Oceanía",      55,   7.4, 150.6],
  ["520","NRU","Nauru",           "Oceanía",      52,  -0.5, 166.9],
  ["554","NZL","Nueva Zelanda",   "Oceanía",      14, -41.5, 172.8],
  ["585","PLW","Palaos",          "Oceanía",      50,   7.5, 134.6],
  ["598","PNG","Papúa N. Guinea", "Oceanía",      65,  -6.3, 147.1],
  ["882","WSM","Samoa",           "Oceanía",      48, -13.8,-172.1],
  ["090","SLB","Islas Salomón",   "Oceanía",      60,  -9.4, 160.2],
  ["776","TON","Tonga",           "Oceanía",      44, -20.0,-175.2],
  ["548","VUT","Vanuatu",         "Oceanía",      55, -16.0, 167.0],
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
  const trend = (rand() - 0.5) * 0.6;
  const scores = {};
  let v = base + (rand() - 0.5) * 4;
  window.YEARS.forEach((y, i) => {
    const noise = (rand() - 0.5) * 6;
    v = v + trend + noise * 0.5;
    v = v * 0.85 + base * 0.15 + (rand() - 0.5) * 2;
    scores[y] = Math.max(2, Math.min(98, Math.round(v * 10) / 10));
  });
  return { id, iso3, name, region, base, lat, lng, scores };
});

window.SCORE_OF = function(country, year) { return country.scores[year]; };
window.REGIONS = [
  "Norteamérica", "Centroamérica", "Caribe", "Sudamérica",
  "Europa", "África", "Asia", "Oriente Medio", "Oceanía"
];
