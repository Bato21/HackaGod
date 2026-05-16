// Aletheia — App principal
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ───────────────────────────────────────────────────────────
// Utilidades
// ───────────────────────────────────────────────────────────
// Paletas disponibles para el mapa
const PALETTES = {
  navy: {
    name: "Índigo (defecto)",
    stops: [
      [0,   [228, 238, 250]],  // near-white pale blue — limpio
      [25,  [148, 186, 222]],  // light steel blue
      [50,  [72,  126, 180]],  // medium blue
      [75,  [26,  66,  128]],  // deep navy
      [100, [6,   16,  52 ]],  // near-black navy — corrupto
    ],
  },
  editorial: {
    name: "Editorial",
    stops: [
      [0,  [52, 153, 110]],
      [25, [142, 168, 64]],
      [50, [206, 178, 78]],
      [75, [200, 110, 60]],
      [100,[178, 60, 60]],
    ],
  },
  riesgo: {
    name: "Riesgo",
    stops: [
      [0,  [22, 163, 74]],
      [25, [132, 204, 22]],
      [50, [250, 204, 21]],
      [75, [249, 115, 22]],
      [100,[185, 28, 28]],
    ],
  },
  diverging: {
    name: "Divergente",
    stops: [
      [0,  [40, 100, 160]],
      [25, [110, 160, 200]],
      [50, [220, 215, 200]],
      [75, [220, 140, 80]],
      [100,[180, 60, 50]],
    ],
  },
  mono: {
    name: "Monocromo",
    stops: [
      [0,  [230, 220, 200]],
      [25, [200, 150, 130]],
      [50, [170, 95, 90]],
      [75, [120, 50, 60]],
      [100,[70, 20, 40]],
    ],
  },
};
const PALETTE_KEYS = Object.keys(PALETTES);
let ACTIVE_PALETTE = "navy";

function colorFor(score, paletteKey) {
  const key = paletteKey || ACTIVE_PALETTE;
  const stops = (PALETTES[key] || PALETTES.editorial).stops;
  const s = Math.max(0, Math.min(100, score));
  for (let i = 1; i < stops.length; i++) {
    const [t1, c1] = stops[i - 1];
    const [t2, c2] = stops[i];
    if (s <= t2) {
      const t = (s - t1) / (t2 - t1);
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  const last = stops[stops.length - 1][1];
  return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
}
function paletteCss(key) {
  const stops = (PALETTES[key] || PALETTES.editorial).stops;
  return "linear-gradient(to right, " +
    stops.map(([t, c]) => `rgb(${c[0]},${c[1]},${c[2]}) ${t}%`).join(", ") + ")";
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "projection": "equalEarth",
  "viewMode": "choropleth",
  "showLabels": false,
  "theme": "corporate",
  "palette": "navy"
}/*EDITMODE-END*/;

const COUNTRIES_BY_ID = {};
window.COUNTRIES.forEach(c => {
  COUNTRIES_BY_ID[c.id] = c;
  COUNTRIES_BY_ID[+c.id] = c; // cover IDs without leading zeros (e.g. 76 → "076")
});

const GEOJSON_URL = "countries-110m.json";

// ───────────────────────────────────────────────────────────
// Componentes
// ───────────────────────────────────────────────────────────

function Tooltip({ data }) {
  if (!data) return null;
  const { country, year, x, y, delta } = data;
  const score = country.scores[year];
  return (
    <div className="tooltip" style={{ left: x, top: y }}>
      <div className="tn">{country.name}</div>
      <div className="tr mono">{country.iso3} · {country.region}</div>
      <div className="tv">
        <span className="num" style={{ color: colorFor(score) }}>{score.toFixed(1)}</span>
        <span className="of">/100</span>
      </div>
      <div className="delta">
        {year} ·{" "}
        {delta != null && (
          <span className={delta > 0 ? "up" : delta < 0 ? "dn" : ""}>
            {delta > 0 ? "▲" : delta < 0 ? "▼" : "·"} {Math.abs(delta).toFixed(1)} vs {year - 1}
          </span>
        )}
      </div>
    </div>
  );
}

function MapView({
  topology, year, viewMode, showLabels,
  selectedId, comparedId,
  onHover, onLeave, onSelect, filterRange, apiRef, onZoomChange, theme
}) {
  const containerRef  = useRef(null);
  const mapInst       = useRef(null);
  const geoLayer      = useRef(null);
  const bubbleGroup   = useRef(null);
  const labelGroup    = useRef(null);
  const nameGroupRef  = useRef(null);
  const layersById    = useRef({});
  const tileLayerRef  = useRef(null);
  const liveProps     = useRef({});
  liveProps.current   = { year, viewMode, showLabels, selectedId, comparedId, filterRange, onHover, onLeave, onSelect, theme };

  const [mapZoom, setMapZoom] = useState(3);


  const { allFeatures, americasFeatures } = useMemo(() => {
    if (!topology) return { allFeatures: [], americasFeatures: [] };
    const raw = topojson.feature(topology, topology.objects.countries).features;
    function fixRing(ring) {
      const fixed = [ring[0].slice()];
      for (let i = 1; i < ring.length; i++) {
        let lng = ring[i][0];
        const diff = lng - fixed[fixed.length - 1][0];
        if (diff > 180) lng -= 360;
        else if (diff < -180) lng += 360;
        fixed.push([lng, ring[i][1]]);
      }
      const lngs = fixed.map(p => p[0]);
      const span = Math.max(...lngs) - Math.min(...lngs);
      if (span > 270) return null; // genuine render artifact
      return fixed;
    }
    const all = raw.map(f => {
      const geom = f.geometry;
      if (!geom) return f;
      if (geom.type === 'Polygon') {
        const coords = geom.coordinates.map(fixRing).filter(Boolean);
        if (!coords.length) return f;
        return { ...f, geometry: { ...geom, coordinates: coords } };
      } else if (geom.type === 'MultiPolygon') {
        const coords = geom.coordinates
          .map(p => p.map(fixRing).filter(Boolean))
          .filter(p => p.length > 0);
        return { ...f, geometry: { ...geom, coordinates: coords } };
      }
      return f;
    });
    return { allFeatures: all, americasFeatures: all.filter(f => COUNTRIES_BY_ID[f.id]) };
  }, [topology]);

  const getStyle = useCallback((feature) => {
    const { year: y, filterRange: fr, selectedId: sid, comparedId: cid, theme: th } = liveProps.current;
    const country = COUNTRIES_BY_ID[feature.id];
    const isLight = ['light','corporate'].includes(th);
    if (!country) return {
      fillColor: isLight ? '#d8dce4' : '#1a1f2a',
      fillOpacity: 1,
      color: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.3)',
      weight: 0.5,
    };
    const score = country.scores[y];
    const dim   = score < fr[0] || score > fr[1];
    const isSel = sid === feature.id;
    const isCmp = cid === feature.id;
    return {
      fillColor:   colorFor(score),
      fillOpacity: dim ? 0.15 : 1,
      color:  isSel ? '#facc15' : isCmp ? '#38bdf8' : 'rgba(0,0,0,0.5)',
      weight: isSel ? 2.5       : isCmp ? 2          : 0.6,
    };
  }, []);

  // ── Init Leaflet (once) ─────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapInst.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false, attributionControl: true,
      minZoom: 2, maxZoom: 14,
      worldCopyJump: false,
      maxBoundsViscosity: 1.0,
    });

    const isDark = !liveProps.current || !['light','corporate'].includes(liveProps.current.theme);
    const TILE_OPTS = { subdomains: 'abcd', maxZoom: 19 };
    tileLayerRef.current = L.tileLayer(
      isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
      { ...TILE_OPTS, attribution: '© <a href="https://carto.com">CARTO</a>', opacity: isDark ? 0.5 : 0.9 }
    ).addTo(map);

    // Custom labels pane above GeoJSON overlay (400)
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';

    map.setMaxBounds([[-80, -180], [85, 180]]);
    map.fitBounds([[-58, -120], [74, -32]]);
    map.on('zoomend', () => {
      const z = map.getZoom();
      onZoomChange && onZoomChange(z);
      setMapZoom(z);
    });
    mapInst.current = map;
    setTimeout(() => { map.invalidateSize(); map.fitBounds([[-58, -120], [74, -32]]); }, 100);

    return () => {
      map.remove();
      mapInst.current = null;
      geoLayer.current = null;
      bubbleGroup.current = null;
      labelGroup.current = null;
      layersById.current = {};
    };
  }, []);

  // ── Zoom-aware Spanish labels: continents at low zoom, all countries when zoomed in ──
  const ZOOM_BREAK = 4;
  useEffect(() => {
    const map = mapInst.current;
    if (!map || !allFeatures.length) return;
    if (nameGroupRef.current) { map.removeLayer(nameGroupRef.current); nameGroupRef.current = null; }
    const grp = L.layerGroup();

    if (mapZoom < ZOOM_BREAK) {
      // World continent labels
      (window.WORLD_CONTINENTS || []).forEach(({ name, lat, lng }) => {
        L.marker([lat, lng], {
          icon: L.divIcon({ className: 'map-region-name', html: `<span>${name}</span>`, iconSize: null }),
          interactive: false,
          pane: 'labels',
        }).addTo(grp);
      });
    } else {
      // All world country names in Spanish
      allFeatures.forEach(f => {
        const name = (window.COUNTRY_NAMES_ES || {})[String(f.id)] ||
                     (COUNTRIES_BY_ID[f.id] && COUNTRIES_BY_ID[f.id].name);
        if (!name) return;
        // Compute centroid from geometry bounds as fallback
        const c = COUNTRIES_BY_ID[f.id];
        let lat, lng;
        if (c) { lat = c.lat; lng = c.lng; }
        else {
          try {
            const coords = f.geometry.type === 'Polygon'
              ? f.geometry.coordinates[0]
              : f.geometry.coordinates.reduce((a, b) => a[0].length >= b[0].length ? a : b)[0];
            lat = coords.reduce((s, p) => s + p[1], 0) / coords.length;
            lng = coords.reduce((s, p) => s + p[0], 0) / coords.length;
          } catch { return; }
        }
        L.marker([lat, lng], {
          icon: L.divIcon({ className: 'map-country-name', html: `<span>${name}</span>`, iconSize: null }),
          interactive: false,
          pane: 'labels',
        }).addTo(grp);
      });
    }

    grp.addTo(map);
    nameGroupRef.current = grp;
    return () => {
      if (nameGroupRef.current) { map.removeLayer(nameGroupRef.current); nameGroupRef.current = null; }
    };
  }, [allFeatures, mapZoom]);

  // ── API ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      zoomIn:  () => mapInst.current?.zoomIn(),
      zoomOut: () => mapInst.current?.zoomOut(),
      reset:   () => mapInst.current?.fitBounds([[-58, -120], [74, -32]], { animate: true, duration: 0.7 }),
      zoomToFeature: (feature, panelOpen) => {
        const map = mapInst.current;
        if (!map || !feature) return;
        const lyr = layersById.current[feature.id];
        if (!lyr?.getBounds) return;
        const b = lyr.getBounds();
        if (!b.isValid()) return;

        map.invalidateSize({ animate: false });

        const lp = panelOpen ? 380 : 60;
        const rp = panelOpen ? 460 : 60;
        const vp = 60;

        const zoom = map.getBoundsZoom(b, false, L.point(lp + rp, vp * 2));
        const sw = map.project(b.getSouthWest(), zoom);
        const ne = map.project(b.getNorthEast(), zoom);
        const bCtr = sw.add(ne).divideBy(2);

        // shift map center so bounds center lands at the visible-strip center
        const dx = (rp - lp) / 2;  // positive → shift right if right panel wider
        const center = map.unproject(bCtr.add(L.point(dx, 0)), zoom);

        map.setView(center, zoom, { animate: true, duration: 0.7 });
      },
      getFeatureById: (id) => americasFeatures.find(f => f.id === id),
    };
  }, [americasFeatures]);

  // ── GeoJSON layer ───────────────────────────────────────────────
  useEffect(() => {
    const map = mapInst.current;
    if (!map || !allFeatures.length) return;
    if (geoLayer.current) { map.removeLayer(geoLayer.current); geoLayer.current = null; layersById.current = {}; }

    const layer = L.geoJSON({ type: 'FeatureCollection', features: allFeatures }, {
      style: getStyle,
      smoothFactor: 1.5,
      onEachFeature: (feature, lyr) => {
        const country = COUNTRIES_BY_ID[feature.id];
        if (!country) return;
        layersById.current[feature.id] = lyr;
        lyr.on('mousemove', (e) => {
          const { year: y, onHover: oh } = liveProps.current;
          const score = country.scores[y];
          const idx   = window.YEARS.indexOf(y);
          const prev  = idx > 0 ? country.scores[window.YEARS[idx - 1]] : null;
          oh?.({ country, year: y, delta: prev != null ? score - prev : null,
            x: e.originalEvent.clientX, y: e.originalEvent.clientY });
          lyr.setStyle({ fillOpacity: 0.94, weight: 1.4 });
        });
        lyr.on('mouseout', () => {
          liveProps.current.onLeave?.();
          lyr.setStyle(getStyle(feature));
        });
        lyr.on('click', () => liveProps.current.onSelect(feature.id));
      },
    }).addTo(map);

    geoLayer.current = layer;
  }, [allFeatures]);

  // ── Update choropleth styles ─────────────────────────────────────
  useEffect(() => {
    if (!geoLayer.current) return;
    geoLayer.current.setStyle(getStyle);
  }, [year, filterRange, selectedId, comparedId, theme]);

  // ── Swap tile layer on theme change ──────────────────────────────
  useEffect(() => {
    const map = mapInst.current;
    const tile = tileLayerRef.current;
    if (!map || !tile) return;
    const isDark = !['light', 'corporate'].includes(theme);
    const url = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png';
    tile.setUrl(url);
    tile.setOpacity(isDark ? 0.5 : 0.9);
  }, [theme]);

  // ── Bubble layer ────────────────────────────────────────────────
  useEffect(() => {
    const map = mapInst.current;
    if (!map) return;
    if (bubbleGroup.current) { map.removeLayer(bubbleGroup.current); bubbleGroup.current = null; }

    if (viewMode === 'bubbles' && americasFeatures.length) {
      geoLayer.current?.setStyle({ fillColor: '#23272e', fillOpacity: 0.5, color: 'rgba(0,0,0,0.2)', weight: 0.4 });
      const grp = L.layerGroup();
      americasFeatures.forEach(f => {
        const country = COUNTRIES_BY_ID[f.id];
        if (!country) return;
        const score = country.scores[year];
        const dim   = score < filterRange[0] || score > filterRange[1];
        const c = L.circleMarker([country.lat, country.lng], {
          radius: 4 + (score / 100) * 22,
          fillColor: colorFor(score), fillOpacity: dim ? 0.12 : 0.8,
          color: selectedId === f.id ? '#facc15' : comparedId === f.id ? '#38bdf8' : 'rgba(255,255,255,0.28)',
          weight: (selectedId === f.id || comparedId === f.id) ? 2 : 1,
        });
        c.on('mousemove', (e) => {
          const idx  = window.YEARS.indexOf(year);
          const prev = idx > 0 ? country.scores[window.YEARS[idx - 1]] : null;
          onHover?.({ country, year, delta: prev != null ? score - prev : null,
            x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        });
        c.on('mouseout',  () => onLeave?.());
        c.on('click',     () => onSelect(f.id));
        grp.addLayer(c);
      });
      grp.addTo(map);
      bubbleGroup.current = grp;
    } else {
      geoLayer.current?.setStyle(getStyle);
    }
  }, [viewMode, year, filterRange, selectedId, comparedId, americasFeatures]);

  // ── ISO label layer ─────────────────────────────────────────────
  useEffect(() => {
    const map = mapInst.current;
    if (!map) return;
    if (labelGroup.current) { map.removeLayer(labelGroup.current); labelGroup.current = null; }
    if (!showLabels || !americasFeatures.length) return;
    const grp = L.layerGroup();
    americasFeatures.forEach(f => {
      const c = COUNTRIES_BY_ID[f.id];
      if (!c) return;
      L.marker([c.lat, c.lng], {
        icon: L.divIcon({ className: 'map-iso-label', html: c.iso3, iconSize: [36, 14], iconAnchor: [18, 7] }),
        interactive: false,
      }).addTo(grp);
    });
    grp.addTo(map);
    labelGroup.current = grp;
  }, [showLabels, americasFeatures]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />;
}


function NewsRail({ country, year, onBack, onDiscuss }) {
  const news = window.COUNTRY_NEWS(country, year);
  const CATS = [
    { key: "corrupcion", label: "Corrupción" },
    { key: "politica",   label: "Política" },
    { key: "gobierno",   label: "Gobierno" },
  ];
  return (
    <div className="news-rail">
      <div className="news-rail-head">
        <button className="news-rail-back" onClick={onBack}>← Volver al ranking</button>
        <div className="news-rail-country">{country.name}</div>
        <div className="news-rail-meta">
          <span>{country.region}</span><span>{year}</span><span>Cobertura reciente</span>
        </div>
      </div>
      <div className="news-rail-body">
        {CATS.map(cat => {
          const items = news[cat.key] || [];
          return (
            <div key={cat.key} className={`news-section ${cat.key}`}>
              <div className="news-section-h">
                <span className="dot"></span>
                <span>{cat.label}</span>
                <span className="count">{items.length}</span>
              </div>
              {items.length === 0 ? (
                <div style={{ fontSize: 11, color: "var(--text-3)" }}>Sin coberturas este periodo.</div>
              ) : items.map(item => (
                <div key={item.id} className="news-item">
                  <div className="ni-meta">
                    <span className="ni-source">{item.source}</span>
                    <span>{window.formatRelativeTime(item.ts)}</span>
                  </div>
                  <div className="ni-title">{item.title}</div>
                  <div className="ni-foot">
                    <span className="ni-sector">{item.sector}</span>
                    <button className="ni-discuss" onClick={() => onDiscuss(item)}>
                      Abrir hilo →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sparkline({ country, year, onYearChange }) {
  const W = 280, H = 60, PAD = 6;
  const years = window.YEARS;
  const xs = years.map((y, i) => PAD + (i * (W - PAD * 2)) / (years.length - 1));
  const ys = years.map(y => {
    const s = country.scores[y];
    return PAD + ((100 - s) / 100) * (H - PAD * 2);
  });
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const areaPath = `${linePath} L${xs[xs.length - 1]},${H - PAD} L${xs[0]},${H - PAD} Z`;
  return (
    <div>
      <div className="st">
        <span>Serie 2015–2024</span>
        <span className="mono">Δ {(country.scores[2024] - country.scores[2015]).toFixed(1)}</span>
      </div>
      <svg className="spark-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path d={areaPath} className="spark-area" />
        <path d={linePath} className="spark-line" />
        {years.map((y, i) => (
          <g key={y} style={{ cursor: "pointer" }} onClick={() => onYearChange(y)}>
            <circle cx={xs[i]} cy={ys[i]} r={year === y ? 3.5 : 2} className={`spark-dot${year === y ? " year" : ""}`} />
            <rect x={xs[i] - 14} y={0} width={28} height={H} fill="transparent" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function App({ user: authUser, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Cerrar menú de usuario al clickear fuera
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDoc = (e) => {
      if (!e.target.closest(".user-chip")) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [userMenuOpen]);

  // ── Tweaks
  const [tweaks, setTweak] = (window.useTweaks || ((d) => [d, () => {}]))(TWEAK_DEFAULTS);
  // Palette activa para colorFor() (módulo-scope, actualizado en render)
  ACTIVE_PALETTE = tweaks.palette || "editorial";

  // Force navy palette on first load (clears stale localStorage value)
  useEffect(() => {
    if (tweaks.palette === "riesgo" || tweaks.palette === "editorial") {
      setTweak("palette", "navy");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "dark");
  }, [tweaks.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--palette-gradient", paletteCss(tweaks.palette || "editorial"));
  }, [tweaks.palette]);

  // ── Estado
  const [topology, setTopology] = useState(null);
  const [year, setYear] = useState(2024);

  // Americas features for CountryLoop silhouettes
  const americasFeatures = useMemo(() => {
    if (!topology) return [];
    try {
      const raw = topojson.feature(topology, topology.objects.countries).features;
      return raw.filter(f => COUNTRIES_BY_ID[f.id]);
    } catch (e) { return []; }
  }, [topology]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc"); // desc | asc | name
  const [filterRange, setFilterRange] = useState([0, 100]);
  const [selectedId, setSelectedId] = useState(null);
  const [comparedId, setComparedId] = useState(null);
  const [hoverData, setHoverData] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapSettingsOpen, setMapSettingsOpen] = useState(false);
  const [countryFocus, setCountryFocus] = useState(null);
  const [cdRightTab, setCdRightTab] = useState('events');
  const [countryDashboard, setCountryDashboard] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [forumOpen, setForumOpen] = useState(null); // null | { iso3?, threadId?, _global? }
  const [profileOpen, setProfileOpen] = useState(false);

  // ── Estrellas y notificaciones
  const [stars, setStars] = useState(() =>
    authUser.kind !== "guest" && window.StarAPI ? window.StarAPI.get(authUser.email) : {}
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState(() =>
    authUser.kind !== "guest" && window.StarAPI ? window.StarAPI.getLastSeen(authUser.email) : 0
  );

  const handleToggleStar = useCallback((country) => {
    if (!window.StarAPI || authUser.kind === "guest") return;
    const updated = window.StarAPI.toggle(authUser.email, country);
    setStars(updated);
  }, [authUser]);

  const notifications = useMemo(() => {
    if (!window.StarAPI || authUser.kind === "guest") return [];
    return window.StarAPI.getNotifications(authUser.email);
  }, [stars]);

  const unreadCount = useMemo(() =>
    notifications.filter(n => n.ts > lastSeen).length,
  [notifications, lastSeen]);

  const openNotif = () => {
    setNotifOpen(o => !o);
  };
  const markNotifSeen = useCallback(() => {
    if (!window.StarAPI || authUser.kind === "guest") return;
    window.StarAPI.markSeen(authUser.email);
    setLastSeen(Date.now());
  }, [authUser]);

  // Cerrar panel notif al click fuera
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => {
      if (!e.target.closest(".notif-bell-wrap")) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);
  const mapApi = useRef({
    zoomIn: () => {}, zoomOut: () => {}, reset: () => {},
    zoomToFeature: () => {}, getFeatureById: () => null
  });

  // Cargar topojson
  useEffect(() => {
    fetch(GEOJSON_URL).then(r => r.json()).then(setTopology).catch(err => console.error(err));
  }, []);

  // Autoplay timeline
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setYear(y => {
        const i = window.YEARS.indexOf(y);
        const next = (i + 1) % window.YEARS.length;
        return window.YEARS[next];
      });
    }, 900);
    return () => clearInterval(id);
  }, [playing]);

  // Esc para salir de pantalla completa
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (compareMode) { setCompareMode(false); return; }
        if (countryDashboard) { setCountryDashboard(null); return; }
        if (countryFocus) { closeCountryFocus(); return; }
        if (mapSettingsOpen) { setMapSettingsOpen(false); return; }
        if (mapFullscreen) setMapFullscreen(false);
      }
      // Atajos de zoom (cuando no estás escribiendo en un input)
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "+" || e.key === "=") { e.preventDefault(); mapApi.current?.zoomIn(); }
      else if (e.key === "-" || e.key === "_") { e.preventDefault(); mapApi.current?.zoomOut(); }
      else if (e.key === "0") { e.preventDefault(); mapApi.current?.reset(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mapFullscreen, mapSettingsOpen, countryFocus, countryDashboard, compareMode]);

  // Lista filtrada y ordenada
  const sortedList = useMemo(() => {
    let list = window.COUNTRIES.slice();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.iso3.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      );
    }
    if (sortBy === "desc") list.sort((a, b) => b.scores[year] - a.scores[year]);
    else if (sortBy === "asc") list.sort((a, b) => a.scores[year] - b.scores[year]);
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, sortBy, year]);

  // Regional averages
  const regionAvgs = useMemo(() => {
    const groups = {};
    window.REGIONS.forEach(r => groups[r] = []);
    window.COUNTRIES.forEach(c => groups[c.region].push(c.scores[year]));
    return window.REGIONS.map(r => ({
      region: r,
      avg: groups[r].length ? groups[r].reduce((a, b) => a + b, 0) / groups[r].length : 0
    })).sort((a, b) => b.avg - a.avg);
  }, [year]);

  const topMost = useMemo(() =>
    window.COUNTRIES.slice().sort((a, b) => b.scores[year] - a.scores[year]).slice(0, 10),
  [year]);
  const topLeast = useMemo(() =>
    window.COUNTRIES.slice().sort((a, b) => a.scores[year] - b.scores[year]).slice(0, 10),
  [year]);

  const globalAvg = useMemo(() => {
    const arr = window.COUNTRIES.map(c => c.scores[year]);
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }, [year]);

  const handleSelect = (id) => {
    // Modo comparar: el siguiente click agrega el país como comparado
    if (compareMode) {
      if (id !== selectedId) {
        setComparedId(id);
      }
      setCompareMode(false);
      return;
    }
    // Re-click sobre el seleccionado: cierra focus
    if (id === selectedId) {
      setSelectedId(null);
      setComparedId(null);
      setCountryFocus(null);
      mapApi.current?.reset();
      return;
    }
    // Re-click sobre el comparado: lo deselecciona
    if (id === comparedId) {
      setComparedId(null);
      return;
    }
    // Cambio de país: limpia comparación y enfoca el nuevo
    setSelectedId(id);
    setComparedId(null);
    setCountryFocus(id);
    setCdRightTab('events');
    setTimeout(() => {
      const feat = mapApi.current?.getFeatureById?.(id);
      if (feat) mapApi.current?.zoomToFeature(feat, true);
    }, 380);
  };

  const closeCountryFocus = () => {
    setSelectedId(null);
    setCountryFocus(null);
    setComparedId(null);
    setCompareMode(false);
    mapApi.current?.reset();
  };

  const selected = selectedId ? COUNTRIES_BY_ID[selectedId] : null;
  const compared = comparedId ? COUNTRIES_BY_ID[comparedId] : null;

  const pillNavItems = [
    { label: 'Foro',        href: '#foro',       onClick: () => setForumOpen({}) },
    { label: 'Metodología', href: '#metod',      onClick: () => setShowNotes(true) },
    { label: 'Comparar',    href: '#comparar',   onClick: () => {} },
    {
      label: tweaks.theme === "dark" ? "☀ Claro" : tweaks.theme === "light" ? "◑ Corp." : "● Oscuro",
      href: '#theme',
      onClick: () => {
        const next = tweaks.theme === "dark" ? "light" : tweaks.theme === "light" ? "corporate" : "dark";
        setTweak("theme", next);
      }
    },
  ];

  return (
    <>
      <div className="app">
        {/* Topbar */}
        <div className="topbar" style={{ position: 'relative' }}>
          <div className="brand">
            <div className="logo">Aletheia</div>
            <div className="tagline">Índice ilustrativo · América · 2015–2024</div>
          </div>

          {/* Centered PillNav */}
          <div className="topbar-center">
            {window.PillNav && (
              <window.PillNav
                items={pillNavItems}
                baseColor="#0e0c13"
                pillColor="#1d1a2d"
                hoveredPillTextColor="#e6b840"
              />
            )}
          </div>

          <div className="meta">
            <span className="pill pill--tag">DATOS ILUSTRATIVOS</span>
            {authUser.kind !== "guest" && (
              <div className="notif-bell-wrap">
                <button
                  className={`notif-bell${notifOpen ? " open" : ""}`}
                  onClick={() => { openNotif(); if (!notifOpen) markNotifSeen(); }}
                  title="Notificaciones de países seguidos"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2a5 5 0 0 0-5 5v2.5L2 11h12l-1-1.5V7a5 5 0 0 0-5-5z"/>
                    <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="notif-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="notif-panel" onClick={e => e.stopPropagation()}>
                    <div className="np-head">
                      <span className="np-title">Notificaciones</span>
                      {Object.keys(stars).length > 0 && (
                        <span className="np-sub">{Object.keys(stars).length} país{Object.keys(stars).length !== 1 ? "es" : ""} seguido{Object.keys(stars).length !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                    {Object.keys(stars).length === 0 ? (
                      <div className="np-empty">
                        <div className="np-empty-icon">★</div>
                        <div>Sigue un país para recibir alertas.</div>
                        <div className="np-empty-sub">Haz clic en ★ en cualquier ficha de país.</div>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="np-empty">
                        <div>Sin actividad reciente.</div>
                      </div>
                    ) : (
                      <div className="np-list">
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            className={`np-item${n.ts > lastSeen ? " unread" : ""}`}
                            onClick={() => {
                              setNotifOpen(false);
                              if (n.type === "thread" && n.threadId) setForumOpen({ iso3: n.iso3, threadId: n.threadId });
                              else if (n.type === "news") setForumOpen({ iso3: n.iso3 });
                            }}
                          >
                            <div className="np-item-type">
                              {n.type === "thread" ? "💬" : "📰"}
                            </div>
                            <div className="np-item-body">
                              <div className="np-item-country">{n.countryName}</div>
                              <div className="np-item-title">{n.title}</div>
                              {n.subtitle && <div className="np-item-sub">{n.subtitle}</div>}
                            </div>
                            <div className="np-item-ts mono">{window.formatRelativeTime ? window.formatRelativeTime(n.ts) : ""}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div
              className={`user-chip${authUser.kind === "guest" ? " guest" : ""}`}
              onClick={() => setUserMenuOpen(o => !o)}
            >
              <div className="uc-avatar">
                {authUser.kind === "guest" ? "␀" : (authUser.name?.[0] || "?").toUpperCase()}
              </div>
              <span className="uc-name">{authUser.name}</span>
              {authUser.kind === "guest" && <span className="uc-tag">Invitado</span>}
              {userMenuOpen && (
                <div className="user-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="um-head">
                    <div className="nm">{authUser.name}</div>
                    <div className="em">{authUser.email || "Sesión sin cuenta"}</div>
                  </div>
                  {authUser.kind !== "guest" && (
                    <button className="um-item" onClick={() => { setUserMenuOpen(false); setProfileOpen(true); }}>
                      Mi perfil
                    </button>
                  )}
                  {authUser.kind === "guest" && (
                    <button className="um-item" onClick={onLogout}>
                      Crear cuenta o ingresar
                    </button>
                  )}
                  <button className="um-item danger" onClick={onLogout}>
                    {authUser.kind === "guest" ? "Salir" : "Cerrar sesión"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main */}
        <div className={`main${mapFullscreen ? " fullscreen" : ""}`}>
          {/* Left rail */}
          <div className="col">
            {selected ? (
              <NewsRail
                country={selected}
                year={year}
                onBack={closeCountryFocus}
                onDiscuss={(item) => {
                  const t = window.ForumAPI.createThread({
                    iso3: selected.iso3,
                    country: selected.name,
                    region: selected.region,
                    scope: "tema",
                    subtype: "news",
                    title: item.title,
                    subtitle: `Noticia · ${item.source} · ${item.categoryLabel} · ${year}`,
                    year,
                    source: item.source,
                  });
                  if (t) setForumOpen({ iso3: selected.iso3, threadId: t.id });
                }}
              />
            ) : (
            <React.Fragment>
            <div className="search-wrap">
              <input
                className="search"
                placeholder="Buscar país, código o región…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="filter-block">
              <div className="label">
                <span>Filtro por rango</span>
                <span className="mono">{filterRange[0]}–{filterRange[1]}</span>
              </div>
              <div className="range-row">
                <span className="val">{filterRange[0]}</span>
                <input
                  type="range" min="0" max="100" value={filterRange[0]}
                  onChange={e => setFilterRange([Math.min(+e.target.value, filterRange[1]), filterRange[1]])}
                />
              </div>
              <div className="range-row">
                <span className="val">{filterRange[1]}</span>
                <input
                  type="range" min="0" max="100" value={filterRange[1]}
                  onChange={e => setFilterRange([filterRange[0], Math.max(+e.target.value, filterRange[0])])}
                />
              </div>
            </div>
            <div className="filter-block">
              <div className="label"><span>Orden</span></div>
              <div className="sort-tabs">
                <button className={sortBy === "desc" ? "active" : ""} onClick={() => setSortBy("desc")}>+ Corruptos</button>
                <button className={sortBy === "asc" ? "active" : ""} onClick={() => setSortBy("asc")}>+ Limpios</button>
                <button className={sortBy === "name" ? "active" : ""} onClick={() => setSortBy("name")}>A–Z</button>
              </div>
            </div>
            <div className="col header">
              <h2>Ranking · {sortedList.length}</h2>
              <span className="mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{year}</span>
            </div>
            <div className="body">
              <div className="ranking-list">
                {sortedList.map((c, i) => {
                  const s = c.scores[year];
                  const inFilter = s >= filterRange[0] && s <= filterRange[1];
                  const isSel = selectedId === c.id;
                  const isCmp = comparedId === c.id;
                  return (
                    <div
                      key={c.id}
                      className={`rank-row${isSel ? " selected" : ""}${isCmp ? " compared" : ""}`}
                      style={{ opacity: inFilter ? 1 : 0.35 }}
                      onClick={() => handleSelect(c.id)}
                    >
                      <span className="pos">{String(i + 1).padStart(2, "0")}</span>
                      <span className="name">{c.name}</span>
                      <span className="chip" style={{ background: colorFor(s) }}></span>
                      <span className="score">{s.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            </React.Fragment>
            )}
          </div>

          {/* Map */}
          <div className="col" style={{ borderRight: "none", borderLeft: "none" }}>
            <div className="map-wrap">
              <div className={`map-frame${countryFocus ? ' cd-active' : ''}`}>
                {!topology && <div className="loading">Cargando geometría</div>}
                {topology && (
                  <MapView
                    topology={topology}
                    year={year}
                    viewMode={tweaks.viewMode}
                    showLabels={tweaks.showLabels}
                    theme={tweaks.theme}
                    selectedId={selectedId}
                    comparedId={comparedId}
                    hoveredId={hoverData?.country?.id}
                    filterRange={filterRange}
                    onHover={setHoverData}
                    onLeave={() => setHoverData(null)}
                    onSelect={handleSelect}
                    apiRef={mapApi}
                    onZoomChange={setZoomLevel}
                  />
                )}
                {/* Water cursor effect — ripples over ocean areas */}
                {window.WaterCanvas && (
                  <window.WaterCanvas isOverCountry={!!hoverData?.country} />
                )}
                <div className="map-zoom-controls">
                  <button className="map-zoom-btn" onClick={() => mapApi.current?.zoomIn()} title="Acercar (+)">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M7 3 L7 11 M3 7 L11 7" />
                    </svg>
                  </button>
                  <div className="zoom-level">z{zoomLevel}</div>
                  <button className="map-zoom-btn" onClick={() => mapApi.current?.zoomOut()} title="Alejar (−)">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M3 7 L11 7" />
                    </svg>
                  </button>
                  <button className="map-zoom-btn" onClick={() => mapApi.current?.reset()} title="Restablecer vista">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="7" cy="7" r="4.5" />
                      <path d="M7 2.5 L7 4.5 M7 9.5 L7 11.5 M2.5 7 L4.5 7 M9.5 7 L11.5 7" />
                    </svg>
                  </button>
                </div>
                <div className="map-overlay map-actions">
                  <button
                    className={`map-action-btn${mapSettingsOpen ? " active" : ""}`}
                    onClick={() => setMapSettingsOpen(o => !o)}
                    title="Opciones del mapa"
                  >
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="7" cy="7" r="2" />
                      <path d="M7 1 L7 2.5 M7 11.5 L7 13 M1 7 L2.5 7 M11.5 7 L13 7 M2.76 2.76 L3.82 3.82 M10.18 10.18 L11.24 11.24 M2.76 11.24 L3.82 10.18 M10.18 3.82 L11.24 2.76" />
                    </svg>
                  </button>
                  <button
                    className={`map-action-btn${tweaks.showLabels ? " active" : ""}`}
                    onClick={() => setTweak("showLabels", !tweaks.showLabels)}
                    title={tweaks.showLabels ? "Ocultar etiquetas (ISO)" : "Mostrar etiquetas (ISO)"}
                  >
                    {tweaks.showLabels ? (
                      <span className="lbl-glyph">Aa</span>
                    ) : (
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M3 11 L5 4 L7 9 M3.7 8 L6.3 8" />
                        <path d="M2 2 L12 12" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                  {mapFullscreen ? (
                    <button
                      className="map-action-btn expanded"
                      onClick={() => setMapFullscreen(false)}
                      title="Volver al dashboard"
                    >
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 1 L1 5 M1 5 L5 9 M1 5 L13 5" strokeLinecap="round" />
                      </svg>
                      <span>Abrir panel</span>
                    </button>
                  ) : (
                    <button
                      className="map-action-btn"
                      onClick={() => setMapFullscreen(true)}
                      title="Pantalla completa"
                    >
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
                        <path d="M1 5 L1 1 L5 1 M9 1 L13 1 L13 5 M13 9 L13 13 L9 13 M5 13 L1 13 L1 9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
                {mapSettingsOpen && (
                  <div className="map-settings-pop">
                    <div className="mp-head">
                      <h3>Opciones del mapa</h3>
                      <button className="mp-close" onClick={() => setMapSettingsOpen(false)}>✕</button>
                    </div>
                    <div className="mp-body">
                      <div className="mp-section">
                        <div className="mp-lbl">Tipo de visualización</div>
                        <div className="mp-seg cols-2">
                          <button
                            className={tweaks.viewMode === "choropleth" ? "active" : ""}
                            onClick={() => setTweak("viewMode", "choropleth")}
                          >Coropleta</button>
                          <button
                            className={tweaks.viewMode === "bubbles" ? "active" : ""}
                            onClick={() => setTweak("viewMode", "bubbles")}
                          >Burbujas</button>
                        </div>
                      </div>
                      <div className="mp-section">
                        <div className="mp-lbl">Proyección</div>
                        <div className="mp-seg cols-3">
                          <button
                            className={tweaks.projection === "equalEarth" ? "active" : ""}
                            onClick={() => setTweak("projection", "equalEarth")}
                          >Equal&nbsp;Earth</button>
                          <button
                            className={tweaks.projection === "mercator" ? "active" : ""}
                            onClick={() => setTweak("projection", "mercator")}
                          >Mercator</button>
                          <button
                            className={tweaks.projection === "orthographic" ? "active" : ""}
                            onClick={() => setTweak("projection", "orthographic")}
                          >Globo</button>
                        </div>
                      </div>
                      <div className="mp-section">
                        <div className="mp-lbl">Paleta de colores</div>
                        <div className="mp-palette-grid">
                          {PALETTE_KEYS.map(k => (
                            <div
                              key={k}
                              className={`mp-palette${tweaks.palette === k ? " active" : ""}`}
                              onClick={() => setTweak("palette", k)}
                            >
                              <div className="pal-name">{PALETTES[k].name}</div>
                              <div className="pal-bar" style={{ background: paletteCss(k) }}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mp-section">
                        <div className="mp-lbl">Tema</div>
                        <div className="mp-seg cols-3">
                          <button
                            className={tweaks.theme === "dark" ? "active" : ""}
                            onClick={() => setTweak("theme", "dark")}
                          >Oscuro</button>
                          <button
                            className={tweaks.theme === "light" ? "active" : ""}
                            onClick={() => setTweak("theme", "light")}
                          >Claro</button>
                          <button
                            className={tweaks.theme === "corporate" ? "active" : ""}
                            onClick={() => setTweak("theme", "corporate")}
                          >Corporativo</button>
                        </div>
                      </div>
                      <div className="mp-section">
                        <div className="mp-toggle">
                          <span className="lab">Etiquetas ISO</span>
                          <div
                            className={`sw${tweaks.showLabels ? " on" : ""}`}
                            onClick={() => setTweak("showLabels", !tweaks.showLabels)}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className={`map-overlay map-title${mapFullscreen ? ' slide-out' : ''}`}>
                  <div className="kicker">Índice IEA · {window.COUNTRIES.length} países · América</div>
                  <div className="h">
                    ¿Dónde se siente<br/>
                    la corrupción<br/>
                    <span className="h-year">en {year}?</span>
                  </div>
                  <div className="sub">
                    Percepción estructural de corrupción basada en indicadores fiscales,
                    institucionales y de transparencia. Datos ilustrativos.
                  </div>
                </div>
                <div className="map-overlay map-stats">
                  <div className="stat">
                    <div className="lb">Promedio América</div>
                    <div className="vl">{globalAvg.toFixed(1)}</div>
                  </div>
                  <div className="stat">
                    <div className="lb">Año</div>
                    <div className="vl">{year}</div>
                  </div>
                  <div className="stat">
                    <div className="lb">Visibles</div>
                    <div className="vl">{window.COUNTRIES.filter(c => {
                      const s = c.scores[year]; return s >= filterRange[0] && s <= filterRange[1];
                    }).length}</div>
                  </div>
                </div>
                <div className="map-overlay map-legend">
                  <div className="lt">Escala · 0 limpio → 100 corrupto</div>
                  <div className="legend-bar"></div>
                  <div className="legend-scale">
                    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                  </div>
                  <div className="legend-foot">
                    Los países atenuados están fuera del rango filtrado.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right rail */}
          <div className="col">
            <div className="header">
              <h2>{selected ? "Detalle" : "Resumen continental"}</h2>
              {selected && (
                <button
                  onClick={() => { setSelectedId(null); setComparedId(null); }}
                  style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: 11 }}
                >Cerrar ✕</button>
              )}
            </div>
            <div className="body">
              {selected ? (
                <>
                  <div className="detail-panel">
                    <div className="dn">{selected.name}</div>
                    <div className="dr">
                      <span>{selected.iso3}</span>
                      <span>{selected.region}</span>
                    </div>
                    <div className="big-score">
                      <span className="bn" style={{ color: colorFor(selected.scores[year]) }}>
                        {selected.scores[year].toFixed(1)}
                      </span>
                      <span className="bo">/100</span>
                      <span className="bl">
                        Ranking<br/>
                        <span className="mono" style={{ fontSize: 16, color: "var(--text)" }}>
                          #{window.COUNTRIES.slice().sort((a,b) => b.scores[year] - a.scores[year]).findIndex(c => c.id === selected.id) + 1}
                        </span>
                      </span>
                    </div>
                    <div className="detail-bar">
                      <div className="marker" style={{ left: `${selected.scores[year]}%` }}></div>
                    </div>
                  </div>
                  <div className="spark-block">
                    <Sparkline country={selected} year={year} onYearChange={setYear} />
                  </div>
                  <div className="compare-block">
                    <div className="st" style={{
                      fontSize: 10, letterSpacing: "0.12em", color: "var(--text-3)",
                      textTransform: "uppercase", marginBottom: 8
                    }}>Comparar</div>
                    {compared ? (
                      <>
                        <div className="compare-pair">
                          <div className="cp-card" style={{ borderColor: "var(--accent)" }}>
                            <div className="cpn">{selected.iso3}</div>
                            <div className="cpv" style={{ color: colorFor(selected.scores[year]) }}>
                              {selected.scores[year].toFixed(1)}
                            </div>
                          </div>
                          <div className="vs">VS</div>
                          <div className="cp-card" style={{ borderColor: "var(--accent-2)" }}>
                            <div className="cpn">{compared.iso3}</div>
                            <div className="cpv" style={{ color: colorFor(compared.scores[year]) }}>
                              {compared.scores[year].toFixed(1)}
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 }}>
                          <span className="mono">{selected.iso3}</span> está{" "}
                          <strong style={{ color: selected.scores[year] > compared.scores[year] ? "var(--bad)" : "var(--good)" }}>
                            {Math.abs(selected.scores[year] - compared.scores[year]).toFixed(1)} puntos{" "}
                            {selected.scores[year] > compared.scores[year] ? "más corrupto" : "más limpio"}
                          </strong>
                          {" "}que <span className="mono">{compared.iso3}</span>.
                        </div>
                        <button className="compare-clear" onClick={() => setComparedId(null)}>Quitar comparación</button>
                      </>
                    ) : (
                      <>
                        <div className="cb-empty">
                          Selecciona otro país en el mapa o ranking para comparar.
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-empty">
                    <div className="h editorial">
                      Haz clic en un país en el mapa o en el ranking para abrir su detalle, ver
                      su evolución y compararlo con otro.
                    </div>
                  </div>

                  {/* Country silhouette loop */}
                  {window.CountryLoop && (
                    <window.CountryLoop
                      countries={americasFeatures.map(f => ({
                        id:       f.id,
                        iso3:     COUNTRIES_BY_ID[f.id]?.iso3,
                        name:     COUNTRIES_BY_ID[f.id]?.name,
                        scores:   COUNTRIES_BY_ID[f.id]?.scores,
                        geometry: f.geometry,
                      })).filter(c => c.name)}
                      year={year}
                      onSelect={handleSelect}
                      onForumOpen={setForumOpen}
                    />
                  )}

                  <div className="top-block">
                    <div className="tb-title">
                      <span>Top 10 · más corruptos</span>
                      <span className="note">{year}</span>
                    </div>
                    {topMost.map((c, i) => (
                      <div key={c.id} className="top-row" onClick={() => handleSelect(c.id)} style={{ cursor: "pointer" }}>
                        <span className="pos">{String(i + 1).padStart(2, "0")}</span>
                        <div className="bar-wrap">
                          <span className="name">{c.name}</span>
                          <div className="bar">
                            <div className="fill" style={{ width: `${c.scores[year]}%`, background: colorFor(c.scores[year]) }}></div>
                          </div>
                        </div>
                        <span className="score" style={{ color: colorFor(c.scores[year]) }}>{c.scores[year].toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="top-block">
                    <div className="tb-title">
                      <span>Top 10 · más limpios</span>
                      <span className="note">{year}</span>
                    </div>
                    {topLeast.map((c, i) => (
                      <div key={c.id} className="top-row" onClick={() => handleSelect(c.id)} style={{ cursor: "pointer" }}>
                        <span className="pos">{String(i + 1).padStart(2, "0")}</span>
                        <div className="bar-wrap">
                          <span className="name">{c.name}</span>
                          <div className="bar">
                            <div className="fill" style={{ width: `${c.scores[year]}%`, background: colorFor(c.scores[year]) }}></div>
                          </div>
                        </div>
                        <span className="score" style={{ color: colorFor(c.scores[year]) }}>{c.scores[year].toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="regional-block">
                    <div className="tb-title"><span>Promedio regional</span><span className="note">{year}</span></div>
                    {regionAvgs.map(r => (
                      <div key={r.region} className="regional-row">
                        <span className="rn">{r.region}</span>
                        <div className="rb">
                          <div className="rf" style={{ width: `${r.avg}%`, background: colorFor(r.avg) }}></div>
                        </div>
                        <span className="rv" style={{ color: colorFor(r.avg) }}>{r.avg.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Timeline — global footer, 3rd row of .app grid */}
        <div className="timeline">
          <button className="play-btn" onClick={() => setPlaying(p => !p)} title={playing ? "Pausar" : "Reproducir"}>
            {playing ? (
              <svg viewBox="0 0 12 12"><rect x="2" y="2" width="3" height="8" fill="currentColor"/><rect x="7" y="2" width="3" height="8" fill="currentColor"/></svg>
            ) : (
              <svg viewBox="0 0 12 12"><path d="M2 1 L10 6 L2 11 Z" fill="currentColor"/></svg>
            )}
          </button>
          <div className="timeline-track">
            <div className="axis"></div>
            <div className="ticks">
              {window.YEARS.map(y => (
                <div key={y} className={`tick${year === y ? " active" : ""}`} onClick={() => setYear(y)}>
                  <div className="dot"></div>
                  <div className="lb">{y}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="year-display">{year}</div>
        </div>
      </div>

      <Tooltip data={hoverData} />

      {/* Hint banner: modo comparar activo */}
      {compareMode && (
        <div className="compare-hint">
          <span className="ch-dot"></span>
          <span className="ch-text">
            <strong>Modo comparar</strong> · Selecciona otro país en el mapa
          </span>
          <button className="ch-cancel" onClick={() => setCompareMode(false)}>Cancelar</button>
        </div>
      )}

      {/* News Focus Panel — slide-in desde la izquierda */}
      <div className={`news-focus${selected && mapFullscreen && !countryFocus ? " open" : ""}`}>
        {selected && (
          <>
            <div className="nf-header">
              <div className="nf-header-top">
                <span className="nf-dot"></span>
                <button className="nf-close" onClick={closeCountryFocus}>✕</button>
              </div>
              <div className="nf-country">Noticias</div>
            </div>
            <NewsRail
            country={selected}
            year={year}
            onBack={closeCountryFocus}
            onDiscuss={(item) => {
              const t = window.ForumAPI.createThread({
                iso3: selected.iso3,
                country: selected.name,
                region: selected.region,
                scope: "tema",
                subtype: "news",
                title: item.title,
                subtitle: `Noticia · ${item.source} · ${item.categoryLabel} · ${year}`,
                year,
                source: item.source,
              });
              if (t) setForumOpen({ iso3: selected.iso3, threadId: t.id });
            }}
          />
          </>
        )}
      </div>

      {/* ── Country Dashboard Overlay ── */}
      {countryFocus && (() => {
        const c = COUNTRIES_BY_ID[countryFocus];
        if (!c) return null;
        const data  = window.COUNTRY_DATA ? window.COUNTRY_DATA(c, year) : { indicators: [], events: [], headlines: [] };
        const rank  = window.COUNTRIES.slice().sort((a, b) => b.scores[year] - a.scores[year]).findIndex(x => x.id === c.id) + 1;
        const score = c.scores[year];
        const scoreColor = score < 25 ? '#4aad88' : score < 50 ? '#e6b840' : score < 75 ? '#d4822e' : '#c94545';

        // Get silhouette from americasFeatures
        const feat = americasFeatures.find(f => f.id === countryFocus || +f.id === +countryFocus);
        function geoToPath(geometry, w, h) {
          if (!geometry) return '';
          const rings = geometry.type === 'Polygon'
            ? geometry.coordinates
            : geometry.type === 'MultiPolygon'
              ? geometry.coordinates.flat()
              : [];
          let minLng=Infinity, maxLng=-Infinity, minLat=Infinity, maxLat=-Infinity;
          rings.forEach(ring => ring.forEach(([lng, lat]) => {
            if (lng < minLng) minLng = lng; if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
          }));
          const lngSpan = maxLng - minLng || 1, latSpan = maxLat - minLat || 1;
          const scale = Math.min(w / lngSpan, h / latSpan) * 0.82;
          const offX = (w - lngSpan * scale) / 2, offY = (h - latSpan * scale) / 2;
          let d = '';
          rings.forEach(ring => {
            ring.forEach(([lng, lat], i) => {
              const x = (lng - minLng) * scale + offX;
              const y = h - ((lat - minLat) * scale + offY);
              d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
            });
            d += 'Z';
          });
          return d;
        }

        const scorePct = Math.max(0, Math.min(100, score));
        const trendDelta = c.scores[2024] - c.scores[2015];

        return (
          <div className="cd-overlay">
            {/* Pure blur backdrop — no dark color */}
            <div className="cd-blur" onClick={closeCountryFocus} />

            {/* Close */}
            <button className="cd-x" onClick={closeCountryFocus}>✕</button>

            {/* Center — silhouette + score overlay */}
            <div className="cd-center" style={{ '--cd-score-color': scoreColor }}>
              <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0 }}>
                {feat && feat.geometry && (
                  <svg
                    className="cd-center-sil"
                    viewBox="0 0 320 320"
                    style={{ overflow: 'visible', width: '90%', height: 'auto', maxWidth: 400, maxHeight: '52vh', display: 'block' }}
                  >
                    <path
                      d={geoToPath(feat.geometry, 320, 320)}
                      fill={scoreColor}
                      fillOpacity={0.22}
                      stroke={scoreColor}
                      strokeWidth={1.0}
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {/* Score overlaid on top of silhouette */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <div className="cd-center-score" style={{ color: scoreColor }}>{score.toFixed(1)}</div>
                  <div className="cd-center-denom">/ 100</div>
                </div>
              </div>
              <div className="cd-center-name">{c.name.toUpperCase()} · #{rank} DE {window.COUNTRIES.length}</div>
            </div>

            {/* Left panel — Country stats */}
            <div className="cd-left" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="cdl-head">
                <div className="cdl-kicker">FICHA DE PAÍS · {year}</div>
                <div className="cdl-name">{c.name}</div>
                <div className="cdl-meta">{c.iso3} · {c.region} · #{rank} de {window.COUNTRIES.length}</div>
              </div>

              {/* Score block */}
              <div className="cdl-score-wrap">
                <div className="cdl-score" style={{ color: scoreColor }}>{score.toFixed(1)}</div>
                <div className="cdl-score-of">/100</div>
                <div className="cdl-trend" style={{ color: trendDelta > 0 ? '#c94545' : '#4aad88' }}>
                  {trendDelta > 0 ? '▲' : '▼'} {Math.abs(trendDelta).toFixed(1)} pts desde 2015
                </div>
              </div>

              {/* Scale bar */}
              <div style={{ padding:'0 22px 16px' }}>
                <div style={{ height:4, background:'linear-gradient(to right, #4aad88 0%, #e6b840 50%, #c94545 100%)', borderRadius:2, position:'relative' }}>
                  <div style={{ position:'absolute', top:-4, left:`${scorePct}%`, transform:'translateX(-50%)', width:3, height:12, background:'#fff', borderRadius:2, boxShadow:'0 0 6px rgba(255,255,255,0.8)' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:7.5, color:'rgba(237,233,224,0.3)', marginTop:5 }}>
                  <span>0 limpio</span><span>50</span><span>100 corrupto</span>
                </div>
              </div>

              {/* Sparkline */}
              <div style={{ padding:'0 22px 16px' }}>
                <div style={{ fontFamily:'var(--mono)', fontSize:7.5, letterSpacing:'0.18em', color:'rgba(230,184,64,0.6)', textTransform:'uppercase', marginBottom:8 }}>TENDENCIA 2015–2024</div>
                <svg viewBox="0 0 240 48" width="100%" height={48} style={{ overflow:'visible' }}>
                  <polyline
                    points={(window.YEARS||[]).map((y, i) => `${(i/9)*240},${48-(c.scores[y]/100)*40}`).join(' ')}
                    fill="none" stroke="#e6b840" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                  />
                  {window.YEARS && (
                    <circle
                      cx={(window.YEARS.indexOf(year)/9)*240}
                      cy={48-(c.scores[year]/100)*40}
                      r={3.5} fill="#e6b840"
                      style={{ filter:'drop-shadow(0 0 4px #e6b840)' }}
                    />
                  )}
                </svg>
              </div>

              {/* Indicators */}
              <div style={{ flex:1, overflowY:'auto', padding:'0 22px 16px' }}>
                <div style={{ fontFamily:'var(--mono)', fontSize:7.5, letterSpacing:'0.18em', color:'rgba(230,184,64,0.6)', textTransform:'uppercase', marginBottom:10 }}>INDICADORES</div>
                {(data.indicators || []).map((ind, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(237,233,224,0.06)' }}>
                    <span style={{ fontFamily:'var(--mono)', fontSize:8.5, letterSpacing:'0.08em', color:'rgba(237,233,224,0.45)', textTransform:'uppercase' }}>{ind.label}</span>
                    <span style={{ fontFamily:'var(--mono)', fontSize:16, fontWeight:700, color:'rgba(237,233,224,0.9)' }}>
                      {ind.value}<span style={{ fontSize:10, color:'rgba(237,233,224,0.35)', marginLeft:2 }}>{ind.unit}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="cdl-footer">
                <button className="cd-btn" onClick={() => setForumOpen({ iso3: c.iso3 })}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 2h10v7H7l-3 2V9H1z"/></svg>
                  Foro
                </button>
                <button className="cd-btn" onClick={() => setCompareMode(true)}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
                  Comparar
                </button>
                <button className="cd-btn cd-btn-primary" onClick={() => setCountryDashboard(countryFocus)}>
                  Expandir ficha →
                </button>
              </div>
            </div>

            {/* Right panel — Context tabs */}
            <div className="cd-right" onClick={e => e.stopPropagation()}>
              <div className="cdl-head" style={{ paddingBottom: 0 }}>
                <div className="cdl-kicker">CONTEXTO · {year}</div>
                <div className="cdl-name" style={{ fontSize:18, marginBottom:14 }}>{c.name}</div>
                {/* Tab bar */}
                <div className="cd-tabs">
                  {[['events','Actividad'],['news','Noticias']].map(([key, label]) => (
                    <button
                      key={key}
                      className={`cd-tab${cdRightTab === key ? ' cd-tab--active' : ''}`}
                      onClick={() => setCdRightTab(key)}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {/* Events tab */}
              {cdRightTab === 'events' && (
                <div style={{ flex:1, overflowY:'auto', padding:'16px 22px' }}>
                  {(data.events || []).slice(0, 4).map((ev, i) => (
                    <div key={i} style={{ padding:'12px 0', borderBottom:'1px solid rgba(237,233,224,0.06)' }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:5 }}>
                        <span style={{ fontFamily:'var(--mono)', fontSize:7.5, color:'rgba(237,233,224,0.35)', letterSpacing:'0.1em' }}>{ev.date}</span>
                        <span style={{ fontFamily:'var(--mono)', fontSize:7, letterSpacing:'0.12em', textTransform:'uppercase', color:scoreColor, background:`${scoreColor}18`, border:`1px solid ${scoreColor}30`, padding:'1px 7px', borderRadius:99 }}>{ev.sector}</span>
                      </div>
                      <div style={{ fontFamily:'var(--sans)', fontSize:12.5, color:'rgba(237,233,224,0.8)', lineHeight:1.55 }}>{ev.text}</div>
                    </div>
                  ))}
                  {(data.headlines||[]).length > 0 && (
                    <div style={{ fontFamily:'var(--mono)', fontSize:7.5, letterSpacing:'0.18em', color:'rgba(230,184,64,0.6)', textTransform:'uppercase', margin:'20px 0 10px' }}>TITULARES DE PRENSA</div>
                  )}
                  {(data.headlines || []).slice(0, 3).map((h, i) => (
                    <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid rgba(237,233,224,0.06)' }}>
                      <div style={{ fontFamily:'var(--mono)', fontSize:7.5, color:'rgba(237,233,224,0.3)', letterSpacing:'0.08em', marginBottom:4 }}>{h.source}</div>
                      <div style={{ fontFamily:'var(--sans)', fontSize:12, color:'rgba(237,233,224,0.75)', lineHeight:1.55, fontStyle:'italic' }}>«{h.text}»</div>
                    </div>
                  ))}
                </div>
              )}

              {/* News tab — embedded NewsRail */}
              {cdRightTab === 'news' && (
                <div style={{ flex:1, overflowY:'auto', minHeight:0 }}>
                  <NewsRail
                    country={c}
                    year={year}
                    onBack={() => setCdRightTab('events')}
                    onDiscuss={(item) => {
                      const t = window.ForumAPI.createThread({
                        iso3: c.iso3,
                        country: c.name,
                        region: c.region,
                        scope: 'tema',
                        subtype: 'news',
                        title: item.title,
                        subtitle: `Noticia · ${item.source} · ${item.categoryLabel} · ${year}`,
                        year,
                        source: item.source,
                      });
                      if (t) setForumOpen({ iso3: c.iso3, threadId: t.id });
                    }}
                  />
                </div>
              )}

              <div style={{ padding:'10px 22px', borderTop:'1px solid rgba(237,233,224,0.06)', flexShrink:0 }}>
                <div style={{ fontFamily:'var(--mono)', fontSize:8, color:'rgba(237,233,224,0.2)', lineHeight:1.5, letterSpacing:'0.04em' }}>
                  DATOS ILUSTRATIVOS — no corresponden a hechos reales.
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Country Focus Panel — slide-in desde la derecha */}
      {(() => {
        const c = countryFocus ? COUNTRIES_BY_ID[countryFocus] : null;
        const data = c ? window.COUNTRY_DATA(c, year) : null;
        const rank = c ? window.COUNTRIES.slice()
          .sort((a, b) => b.scores[year] - a.scores[year])
          .findIndex(x => x.id === c.id) + 1 : null;
        return (
          <div className={`country-focus${countryFocus ? " open country-focus--behind" : ""}`}>
            {c && (
              <>
                <div className="cf-head">
                  <div className="cf-kicker">
                    <span>Ficha de país · {year}</span>
                    <button className="cf-close" onClick={closeCountryFocus} title="Cerrar (Esc)">✕</button>
                  </div>
                  <div className="cf-name-row">
                    <div className="cf-name">{c.name}</div>
                    {authUser.kind !== "guest" && (
                      <button
                        className={`cf-follow-btn${stars[c.iso3] ? " starred" : ""}`}
                        onClick={() => handleToggleStar(c)}
                        title={stars[c.iso3] ? "Dejar de seguir" : "Seguir país"}
                      >
                        <span>★</span>
                        {stars[c.iso3] ? "Siguiendo" : "Seguir"}
                      </button>
                    )}
                  </div>
                  <div className="cf-meta">
                    <span>{c.iso3}</span>
                    <span>{c.region}</span>
                    <span>Rank #{rank} de {window.COUNTRIES.length}</span>
                  </div>
                </div>
                <div className="cf-body">
                  {comparedId && comparedId !== c.id && (() => {
                    const b = COUNTRIES_BY_ID[comparedId];
                    const sa = c.scores[year], sb = b.scores[year];
                    const diff = sa - sb;
                    return (
                      <div className="cf-compare">
                        <div className="cb-lbl" style={{ marginBottom: 10 }}>
                          <span>Comparación directa</span>
                          <span className="mono" style={{ color: "var(--accent-2)" }}>{year}</span>
                        </div>
                        <div className="cmp-grid">
                          <div className="cmp-card a">
                            <div className="cn">{c.iso3} · {c.name}</div>
                            <div className="cv" style={{ color: colorFor(sa) }}>{sa.toFixed(1)}</div>
                          </div>
                          <div className="cmp-vs">VS</div>
                          <div className="cmp-card b">
                            <div className="cn">{b.iso3} · {b.name}</div>
                            <div className="cv" style={{ color: colorFor(sb) }}>{sb.toFixed(1)}</div>
                          </div>
                        </div>
                        <div className="cmp-conclusion">
                          <span className="mono">{c.iso3}</span> está{" "}
                          <strong style={{ color: diff > 0 ? "var(--bad)" : diff < 0 ? "var(--good)" : "var(--text)" }}>
                            {Math.abs(diff).toFixed(1)} pts {diff > 0 ? "más corrupto" : diff < 0 ? "más limpio" : "al mismo nivel"}
                          </strong>{" "}que <span className="mono">{b.iso3}</span>.
                        </div>
                        <button className="cmp-clear" onClick={() => setComparedId(null)}>Quitar comparación</button>
                      </div>
                    );
                  })()}
                  <div className="cf-block">
                    <div className="cb-lbl">
                      <span>Índice de corrupción</span>
                      <span className="mono" style={{ color: "var(--text-3)" }}>0 limpio → 100 corrupto</span>
                    </div>
                    <div className="cf-score">
                      <span className="cs-big" style={{ color: colorFor(c.scores[year]) }}>
                        {c.scores[year].toFixed(1)}
                      </span>
                      <span className="cs-of">/ 100</span>
                      <span className="cs-rank">
                        Posición América
                        <span className="rk">#{rank}</span>
                      </span>
                    </div>
                    <div className="cf-bar">
                      <div className="cf-marker" style={{ left: `${c.scores[year]}%` }}></div>
                    </div>
                    <div className="cf-bar-scale">
                      <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                    </div>
                  </div>

                  <div className="cf-block">
                    <div className="cb-lbl"><span>Tendencia 2015–2024</span>
                      <span className="mono" style={{ color: c.scores[2024] > c.scores[2015] ? "var(--bad)" : "var(--good)" }}>
                        {c.scores[2024] > c.scores[2015] ? "▲" : "▼"} {Math.abs(c.scores[2024] - c.scores[2015]).toFixed(1)} pts
                      </span>
                    </div>
                    <Sparkline country={c} year={year} onYearChange={setYear} />
                  </div>

                  <div className="cf-block">
                    <div className="cb-lbl"><span>Indicadores asociados</span><span style={{ color: "var(--text-3)", fontSize: 9 }}>ILUSTRATIVOS</span></div>
                    <div className="cf-indicators">
                      {data.indicators.map((ind, i) => (
                        <div key={i} className="cf-indicator">
                          <div className="ind-lb">{ind.label}</div>
                          <div className="ind-val">
                            {ind.value}<span className="ind-unit">{ind.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cf-block">
                    <div className="cb-lbl"><span>Acontecimientos del año</span><span className="mono" style={{ color: "var(--text-3)" }}>{year}</span></div>
                    {data.events.map((ev, i) => (
                      <div key={i} className="cf-event">
                        <div>
                          <div className="ev-date">{ev.date}</div>
                          <div className="ev-sector">{ev.sector}</div>
                        </div>
                        <div className="ev-text">{ev.text}</div>
                      </div>
                    ))}
                  </div>

                  <div className="cf-block">
                    <div className="cb-lbl"><span>Titulares de prensa</span><span className="mono" style={{ color: "var(--text-3)" }}>{year}</span></div>
                    {data.headlines.map((h, i) => (
                      <div key={i} className="cf-headline">
                        <div className="hl-src">{h.source}</div>
                        <div className="hl-text">«{h.text}»</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cf-disclaimer">
                  <span className="mono">DATOS·ILUSTRATIVOS</span> — acontecimientos, titulares e indicadores son ejemplos generados con plantillas determinísticas para demostrar el formato. No corresponden a hechos reales.
                </div>
                <div className="cf-actions">
                  <button
                    className={`cf-action-btn compare${compareMode ? " on" : ""}`}
                    onClick={() => setCompareMode(m => !m)}
                    title={compareMode ? "Cancelar modo comparar" : "Comparar con otro país"}
                  >
                    <span className="dot"></span>
                    {compareMode ? "Comparando…" : (comparedId ? "Comparar otro" : "Comparar")}
                  </button>
                  <button className="cf-action-btn" onClick={() => setForumOpen({ iso3: c.iso3 })}>Foro</button>
                  <button className="cf-action-btn primary" onClick={() => setCountryDashboard(countryFocus)}>Expandir ficha</button>
                  <button className="cf-action-btn" onClick={closeCountryFocus}>Cerrar</button>
                </div>
              </>
            )}
          </div>
        );
      })()}

      {showNotes && (
        <div className="notes-modal" onClick={() => setShowNotes(false)}>
          <div className="notes-card" onClick={e => e.stopPropagation()}>
            <h3>Nota metodológica</h3>
            <p>
              <strong>Aletheia</strong> es una pieza de <em>periodismo de datos ilustrativo</em>.
              Las cifras presentadas <strong>no son oficiales</strong> ni provienen de un organismo
              de medición. Se construyeron como demostración del formato visual y de las
              interacciones de comparación.
            </p>
            <div className="nh">Métrica</div>
            <p>
              Cada país recibe un valor entre <span className="mono">0</span> y <span className="mono">100</span>,
              donde <span className="mono">0</span> representa una percepción de país muy limpio y
              <span className="mono"> 100</span> una percepción de país muy corrupto. La escala es
              <em> inversa</em> al CPI de Transparencia Internacional.
            </p>
            <div className="nh">Cobertura</div>
            <p>
              Se incluyen 29 países del continente americano agrupados en cuatro regiones:
              Norteamérica, Centroamérica, Caribe y Sudamérica. La serie temporal cubre 2015–2024.
            </p>
            <div className="nh">Diseño</div>
            <p>
              Geometría base: <span className="mono">world-atlas / Natural Earth</span>.
              Proyección por defecto: Equal Earth. Escala cromática secuencial verde→rojo
              para reforzar la dirección semántica del indicador.
            </p>
            <button className="notes-close" onClick={() => setShowNotes(false)}>Entendido</button>
          </div>
        </div>
      )}

      {/* Country Dashboard — modal fullscreen con backdrop blureado */}
      {countryDashboard && (() => {
        const c = COUNTRIES_BY_ID[countryDashboard];
        const detail = window.COUNTRY_DETAIL(c, year);
        const rank = window.COUNTRIES.slice()
          .sort((a, b) => b.scores[year] - a.scores[year])
          .findIndex(x => x.id === c.id) + 1;
        const initials = c.name.split(" ").filter(Boolean).slice(0,2).map(w => w[0]).join("").toUpperCase();
        const presInitials = detail.president.name.split(" ").map(w => w[0]).join("").slice(0, 2);
        return (
          <div className="cd-backdrop" onClick={() => setCountryDashboard(null)}>
            <div className="cd-shell" onClick={e => e.stopPropagation()}>
              <div className="cd-head">
                <div>
                  <div className="cd-kicker">Dashboard de país · {year}</div>
                  <div className="cd-name">{c.name}</div>
                  <div className="cd-sub">
                    <span>{c.iso3}</span>
                    <span>{c.region}</span>
                    <span>Rank #{rank} de {window.COUNTRIES.length}</span>
                  </div>
                </div>
                <div className="cd-head-right">
                  <div className="cd-score-big">
                    <span className="vn" style={{ color: colorFor(c.scores[year]) }}>{c.scores[year].toFixed(1)}</span>
                    <span className="vo">/100 índice</span>
                  </div>
                  <div className="cd-head-actions">
                    <button className="cd-btn" onClick={() => {
                      const i = window.YEARS.indexOf(year);
                      if (i > 0) setYear(window.YEARS[i - 1]);
                    }}>← {year - 1}</button>
                    <button className="cd-btn" onClick={() => {
                      const i = window.YEARS.indexOf(year);
                      if (i < window.YEARS.length - 1) setYear(window.YEARS[i + 1]);
                    }}>{year + 1} →</button>
                    <button className="cd-btn" onClick={() => setForumOpen({ iso3: c.iso3 })}>Foro</button>
                    <button className="cd-btn primary" onClick={() => setCountryDashboard(null)}>Cerrar (Esc)</button>
                  </div>
                </div>
              </div>

              <div className="cd-body">
                {/* Presidente */}
                <div className="cd-card">
                  <div className="cd-card-h">
                    <span>Presidencia</span>
                    <span className="mono">{detail.president.periodStart}–{detail.president.periodEnd}</span>
                  </div>
                  <div className="cd-pres">
                    <div className="avatar">{presInitials}</div>
                    <div>
                      <div className="pres-name">{detail.president.name}</div>
                      <div className="pres-meta">
                        <span className="badge">{detail.president.party.short}</span>
                        {detail.president.party.name} · <em>{detail.president.party.tone}</em>
                      </div>
                    </div>
                  </div>
                  <div className="pres-stats">
                    <div className="pres-stat">
                      <div className="lb">Aprobación ciudadana</div>
                      <div className="vl">{detail.president.approval}%</div>
                      <div className="bar"><i style={{ width: `${detail.president.approval}%`, background: detail.president.approval > 50 ? "var(--good)" : "var(--warn)" }}></i></div>
                    </div>
                    <div className="pres-stat">
                      <div className="lb">Apoyo legislativo</div>
                      <div className="vl">{detail.president.support}%</div>
                      <div className="bar"><i style={{ width: `${detail.president.support}%`, background: detail.president.support > 50 ? "var(--good)" : "var(--warn)" }}></i></div>
                    </div>
                  </div>
                </div>

                {/* Gabinete */}
                <div className="cd-card">
                  <div className="cd-card-h">
                    <span>Gabinete · {year}</span>
                    <span className="mono" style={{ color: "var(--bad)" }}>● bajo investigación</span>
                  </div>
                  <div className="cabinet-grid">
                    {detail.cabinet.map((m, i) => (
                      <div key={i} className={`cabinet-row${m.risk ? " at-risk" : ""}`}>
                        <span className="port">{m.portfolio}</span>
                        <span className="min">
                          {m.name}
                          <span className="stance">{m.risk ? "imputación pendiente" : m.stance}</span>
                        </span>
                        <span className="risk"></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contexto macro */}
                <div className="cd-card span-2">
                  <div className="cd-card-h">
                    <span>Contexto macro · {year}</span>
                    <span style={{ fontSize: 9, color: "var(--text-3)" }}>ILUSTRATIVO</span>
                  </div>
                  <div className="ctx-grid">
                    <div className="ctx-cell">
                      <div className="lb">Inflación anual</div>
                      <div className="vl">{detail.context.inflation}<span className="un">%</span></div>
                    </div>
                    <div className="ctx-cell">
                      <div className="lb">Crecimiento PIB</div>
                      <div className="vl">{detail.context.gdp}<span className="un">%</span></div>
                    </div>
                    <div className="ctx-cell">
                      <div className="lb">Pobreza</div>
                      <div className="vl">{detail.context.poverty}<span className="un">%</span></div>
                    </div>
                    <div className="ctx-cell">
                      <div className="lb">Homicidios c/100k</div>
                      <div className="vl">{detail.context.homicide}</div>
                    </div>
                  </div>
                </div>

                {/* Tendencia */}
                <div className="cd-card">
                  <div className="cd-card-h">
                    <span>Evolución del índice</span>
                    <span className="mono" style={{ color: c.scores[2024] > c.scores[2015] ? "var(--bad)" : "var(--good)" }}>
                      {c.scores[2024] > c.scores[2015] ? "▲" : "▼"} {Math.abs(c.scores[2024] - c.scores[2015]).toFixed(1)} pts 2015→2024
                    </span>
                  </div>
                  <Sparkline country={c} year={year} onYearChange={setYear} />
                  <div style={{ height: 8, marginTop: 14, background: "var(--palette-gradient)", borderRadius: 2, position: "relative" }}>
                    <div style={{ position: "absolute", left: `${c.scores[year]}%`, top: -4, width: 2, height: 16, background: "var(--text)", transform: "translateX(-50%)" }}></div>
                  </div>
                </div>

                {/* Indicadores */}
                <div className="cd-card">
                  <div className="cd-card-h"><span>Indicadores asociados</span><span style={{ fontSize: 9, color: "var(--text-3)" }}>ILUSTRATIVOS</span></div>
                  <div className="ctx-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    {detail.indicators.map((ind, i) => (
                      <div key={i} className="ctx-cell">
                        <div className="lb">{ind.label}</div>
                        <div className="vl">{ind.value}<span className="un">{ind.unit}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cronología extendida */}
                <div className="cd-card">
                  <div className="cd-card-h">
                    <span>Cronología · {year}</span>
                    <span className="mono" style={{ color: "var(--text-3)" }}>{detail.events.length} hitos</span>
                  </div>
                  <div className="cd-timeline">
                    {detail.events.map((ev, i) => (
                      <div key={i} className="tl-item">
                        <span className="tl-date">{ev.date}</span>
                        <span className="tl-sector">{ev.sector}</span>
                        <div className="tl-text">{ev.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Titulares */}
                <div className="cd-card cd-headlines">
                  <div className="cd-card-h"><span>Titulares de prensa</span><span className="mono" style={{ color: "var(--text-3)" }}>{year}</span></div>
                  {detail.headlines.map((h, i) => (
                    <div key={i} className="cd-headline">
                      <span className="hl-src">{h.source}</span>
                      <span className="hl-text">«{h.text}»</span>
                    </div>
                  ))}
                </div>

                <div className="cd-card span-2" style={{ background: "var(--bg-2)", borderStyle: "dashed" }}>
                  <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--text)" }}>Aviso:</strong> esta ficha es <em>periodismo de datos ilustrativo</em>.
                    Nombres de presidente, gabinete, partidos, indicadores y titulares son <span className="mono" style={{ color: "var(--bad)" }}>ficticios</span> y se generan de forma determinística a partir de las iniciales del país y el año. No corresponden a personas reales.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Perfil de usuario */}
      {profileOpen && authUser.kind !== "guest" && window.ProfileModal && (
        <window.ProfileModal
          user={authUser}
          onClose={() => setProfileOpen(false)}
          theme={tweaks.theme}
        />
      )}

      {/* Foro takeover */}
      {forumOpen && (
        <window.Forum
          initialIso3={forumOpen.iso3 || null}
          initialThreadId={forumOpen.threadId || null}
          user={authUser}
          onClose={() => setForumOpen(null)}
          theme={tweaks.theme}
          onToggleTheme={() => {
            const next = tweaks.theme === "dark" ? "light" : tweaks.theme === "light" ? "corporate" : "dark";
            setTweak("theme", next);
          }}
        />
      )}

      {/* Tweaks panel */}
      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Vista">
          <window.TweakRadio
            label="Tipo de mapa"
            value={tweaks.viewMode}
            onChange={(v) => setTweak("viewMode", v)}
            options={[
              { value: "choropleth", label: "Coropleta" },
              { value: "bubbles", label: "Burbujas" },
            ]}
          />
          <window.TweakSelect
            label="Proyección"
            value={tweaks.projection}
            onChange={(v) => setTweak("projection", v)}
            options={[
              { value: "equalEarth", label: "Equal Earth" },
              { value: "mercator", label: "Mercator" },
              { value: "orthographic", label: "Ortográfica (globo)" },
            ]}
          />
          <window.TweakToggle
            label="Etiquetas ISO"
            value={tweaks.showLabels}
            onChange={(v) => setTweak("showLabels", v)}
          />
          <window.TweakRadio
            label="Tema"
            value={tweaks.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "dark", label: "Oscuro" },
              { value: "light", label: "Claro" },
              { value: "corporate", label: "Corporativo" },
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

function Root() {
  const [authUser, setAuthUser] = useState(() => window.AuthAPI?.current() || null);
  if (!authUser) {
    return <window.AuthScreen onAuth={setAuthUser} />;
  }
  const handleLogout = () => {
    window.AuthAPI.logout();
    setAuthUser(null);
  };
  return <App user={authUser} onLogout={handleLogout} />;
}

root.render(<Root />);
