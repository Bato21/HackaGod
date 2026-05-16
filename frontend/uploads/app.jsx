// Alethia — App principal
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ───────────────────────────────────────────────────────────
// Utilidades
// ───────────────────────────────────────────────────────────
// Paletas disponibles para el mapa
const PALETTES = {
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
  vivid: {
    name: "Vibrante",
    stops: [
      [0,  [22, 220, 150]],
      [25, [132, 204, 22]],
      [50, [253, 224, 71]],
      [75, [251, 113, 36]],
      [100,[239, 68, 68]],
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
let ACTIVE_PALETTE = "editorial";

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
  "showLabels": true,
  "theme": "dark",
  "palette": "editorial"
}/*EDITMODE-END*/;

const COUNTRIES_BY_ID = {};
window.COUNTRIES.forEach(c => { COUNTRIES_BY_ID[c.id] = c; });

const GEOJSON_URL = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

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
  topology, year, viewMode, projection, showLabels, theme,
  selectedId, comparedId, hoveredId,
  onHover, onLeave, onSelect, filterRange, apiRef, onZoomChange
}) {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomBehaviorRef = useRef(null);
  const projectionRef = useRef(projection);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [rotation, setRotation] = useState([80, -10]);

  // Mantener una referencia a la proyección para los filtros de d3.zoom
  useEffect(() => { projectionRef.current = projection; }, [projection]);
  // Ref a rotación para handlers de drag (evita closures stale)
  const rotationRef = useRef(rotation);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  // Ref a pathFn para la API zoomToFeature
  const pathFnRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const cr = e.contentRect;
        setSize({ w: cr.width, h: cr.height });
      }
    });
    ro.observe(svgRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  // d3.zoom: drag para mover, scroll para acercar/alejar
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const zoom = d3.zoom()
      .scaleExtent([1, 14])
      .filter((event) => {
        // permitir wheel para zoom
        if (event.type === "wheel") return true;
        // en proyección ortográfica el drag rota el globo — lo maneja d3.drag aparte
        if (projectionRef.current === "orthographic" &&
            (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown")) {
          return false;
        }
        if (event.type === "mousedown" || event.type === "touchstart" || event.type === "pointerdown") {
          return !event.button;
        }
        return !event.ctrlKey && !event.button;
      })
      .on("start", () => svg.classed("dragging", true))
      .on("end", () => svg.classed("dragging", false))
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        if (onZoomChange) onZoomChange(event.transform.k);
      });
    svg.call(zoom).on("dblclick.zoom", null);
    // dblclick personalizado: zoom suave x2 centrado en el cursor
    svg.on("dblclick", (event) => {
      const [mx, my] = d3.pointer(event);
      svg.transition().duration(350).call(
        zoom.scaleBy,
        2,
        [mx, my]
      );
    });
    zoomBehaviorRef.current = zoom;
    if (apiRef) {
      apiRef.current = {
        zoomIn: () => svg.transition().duration(220).call(zoom.scaleBy, 1.6),
        zoomOut: () => svg.transition().duration(220).call(zoom.scaleBy, 1 / 1.6),
        reset: () => svg.transition().duration(380).call(zoom.transform, d3.zoomIdentity),
        zoomToFeature: (feature, panelOpen) => {
          if (!feature || !pathFnRef.current) return;
          const b = pathFnRef.current.bounds(feature);
          const w = b[1][0] - b[0][0];
          const h = b[1][1] - b[0][1];
          const cx = (b[0][0] + b[1][0]) / 2;
          const cy = (b[0][1] + b[1][1]) / 2;
          const svgEl = svgRef.current;
          const W = svgEl.clientWidth || svgEl.parentElement.clientWidth;
          const H = svgEl.clientHeight || svgEl.parentElement.clientHeight;
          const usableW = panelOpen ? Math.max(200, W - 480) : W;
          const k = Math.max(1.5, Math.min(10, 0.7 / Math.max(w / usableW, h / H)));
          const tx = (usableW / 2) - cx * k;
          const ty = (H / 2) - cy * k;
          svg.transition().duration(700)
            .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
        },
      };
    }
    return () => { svg.on(".zoom", null).on("dblclick", null); };
  }, [apiRef, onZoomChange]);

  // Reset zoom cuando cambia proyección o tamaño base
  useEffect(() => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition().duration(200)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  }, [projection]);

  // Drag para rotar el globo en proyección ortográfica
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    if (projection !== "orthographic") {
      svg.on(".rotate", null);
      return;
    }
    let startRot = null;
    let startPos = null;
    let moved = false;
    const onDown = (event) => {
      if (event.button !== 0) return;
      startRot = [rotationRef.current[0], rotationRef.current[1]];
      startPos = [event.clientX, event.clientY];
      moved = false;
    };
    const onMove = (event) => {
      if (!startPos) return;
      const dx = event.clientX - startPos[0];
      const dy = event.clientY - startPos[1];
      if (!moved && Math.hypot(dx, dy) < 3) return; // umbral para no robar clicks
      if (!moved) {
        moved = true;
        svg.classed("dragging", true);
      }
      const k = 0.35;
      setRotation([
        startRot[0] + dx * k,
        Math.max(-89, Math.min(89, startRot[1] - dy * k)),
      ]);
    };
    const onUp = () => {
      startPos = null;
      startRot = null;
      if (moved) svg.classed("dragging", false);
      moved = false;
    };
    svgRef.current.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      svgRef.current && svgRef.current.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [projection]);

  const { allFeatures, americasFeatures, projectionFn, pathFn, graticule, sphere } = useMemo(() => {
    if (!topology) return {};
    const all = topojson.feature(topology, topology.objects.countries).features;
    const americas = all.filter(f => COUNTRIES_BY_ID[f.id]);

    let proj;
    if (projection === "mercator") {
      proj = d3.geoMercator();
    } else if (projection === "orthographic") {
      proj = d3.geoOrthographic().rotate([rotation[0], rotation[1], 0]).clipAngle(90);
    } else {
      proj = d3.geoEqualEarth();
    }

    // Ajustar al bounding de las Américas con margen
    const featuresGroup = { type: "FeatureCollection", features: americas };
    if (projection !== "orthographic") {
      proj.fitExtent([[28, 90], [size.w - 28, size.h - 28]], featuresGroup);
    } else {
      proj.translate([size.w / 2, size.h / 2]).scale(Math.min(size.w, size.h) * 0.45);
    }

    const pf = d3.geoPath(proj);
    const grat = d3.geoGraticule10();
    const sph = { type: "Sphere" };
    return { allFeatures: all, americasFeatures: americas, projectionFn: proj, pathFn: pf, graticule: grat, sphere: sph };
  }, [topology, size, projection, rotation]);

  if (!topology || !pathFn) return null;
  pathFnRef.current = pathFn;
  // Exponer features index para zoom-to-feature por ID
  if (apiRef && apiRef.current) {
    apiRef.current.getFeatureById = (id) => americasFeatures.find(f => f.id === id);
  }

  const handleEnter = (e, f) => {
    const country = COUNTRIES_BY_ID[f.id];
    if (!country) return;
    const yearIdx = window.YEARS.indexOf(year);
    const prev = yearIdx > 0 ? country.scores[window.YEARS[yearIdx - 1]] : null;
    const delta = prev != null ? country.scores[year] - prev : null;
    const rect = svgRef.current.getBoundingClientRect();
    onHover({
      country, year, delta,
      x: e.clientX, y: e.clientY
    });
  };

  const isDimmed = (id) => {
    const c = COUNTRIES_BY_ID[id];
    if (!c) return false;
    const s = c.scores[year];
    return s < filterRange[0] || s > filterRange[1];
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none">
      <g ref={gRef}>
      {projection === "orthographic" && (
        <>
          <path d={pathFn(sphere)} className="sphere" />
          <path d={pathFn(graticule)} className="graticule" />
        </>
      )}

      {/* Resto del mundo en gris atenuado */}
      <g>
        {allFeatures.map((f, i) => {
          if (COUNTRIES_BY_ID[f.id]) return null;
          const d = pathFn(f);
          if (!d) return null;
          return <path key={`o-${f.id ?? i}`} d={d} className="country-path outside" />;
        })}
      </g>

      {/* Coropleta */}
      {viewMode === "choropleth" && (
        <g>
          {americasFeatures.map(f => {
            const country = COUNTRIES_BY_ID[f.id];
            const score = country.scores[year];
            const d = pathFn(f);
            if (!d) return null;
            const dim = isDimmed(f.id);
            const isSel = selectedId === f.id;
            const isCmp = comparedId === f.id;
            const isHov = hoveredId === f.id;
            return (
              <path
                key={f.id}
                d={d}
                className={`country-path${dim ? " dim" : ""}${isSel ? " selected" : ""}${isCmp ? " compared" : ""}`}
                style={{ fill: colorFor(score) }}
                onMouseMove={(e) => handleEnter(e, f)}
                onMouseLeave={onLeave}
                onClick={() => onSelect(f.id)}
              />
            );
          })}
        </g>
      )}

      {/* Burbujas (geometría base en gris) */}
      {viewMode === "bubbles" && (
        <>
          <g>
            {americasFeatures.map(f => {
              const d = pathFn(f);
              if (!d) return null;
              return <path key={f.id} d={d} className="country-path" />;
            })}
          </g>
          <g>
            {americasFeatures.map(f => {
              const country = COUNTRIES_BY_ID[f.id];
              const score = country.scores[year];
              const dim = isDimmed(f.id);
              const pt = projectionFn([country.lng, country.lat]);
              if (!pt) return null;
              const r = 4 + (score / 100) * 22;
              return (
                <circle
                  key={f.id}
                  cx={pt[0]}
                  cy={pt[1]}
                  r={r}
                  className="country-bubble"
                  style={{ fill: colorFor(score) }}
                  opacity={dim ? 0.15 : 0.85}
                  stroke={selectedId === f.id ? "var(--accent)" : comparedId === f.id ? "var(--accent-2)" : null}
                  strokeWidth={(selectedId === f.id || comparedId === f.id) ? 2 : 1}
                  onMouseMove={(e) => handleEnter(e, f)}
                  onMouseLeave={onLeave}
                  onClick={() => onSelect(f.id)}
                />
              );
            })}
          </g>
        </>
      )}

      {/* Labels */}
      {showLabels && (
        <g>
          {americasFeatures.map(f => {
            const country = COUNTRIES_BY_ID[f.id];
            const pt = projectionFn([country.lng, country.lat]);
            if (!pt) return null;
            // Solo mostrar países visibles en orthographic
            if (projection === "orthographic") {
              const rot = projectionFn.rotate();
              const dist = d3.geoDistance([country.lng, country.lat], [-rot[0], -rot[1]]);
              if (dist > Math.PI / 2) return null;
            }
            const dim = isDimmed(f.id);
            return (
              <text
                key={f.id}
                x={pt[0]}
                y={pt[1] + (viewMode === "bubbles" ? 0 : 3)}
                className="country-label"
                opacity={dim ? 0.3 : 0.9}
              >
                {country.iso3}
              </text>
            );
          })}
        </g>
      )}
      </g>
    </svg>
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "dark");
  }, [tweaks.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--palette-gradient", paletteCss(tweaks.palette || "editorial"));
  }, [tweaks.palette]);

  // ── Estado
  const [topology, setTopology] = useState(null);
  const [year, setYear] = useState(2024);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("desc"); // desc | asc | name
  const [filterRange, setFilterRange] = useState([0, 100]);
  const [selectedId, setSelectedId] = useState(null);
  const [comparedId, setComparedId] = useState(null);
  const [hoverData, setHoverData] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapSettingsOpen, setMapSettingsOpen] = useState(false);
  const [countryFocus, setCountryFocus] = useState(null);
  const [countryDashboard, setCountryDashboard] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [forumOpen, setForumOpen] = useState(null); // iso3 del país
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
    setTimeout(() => {
      const feat = mapApi.current?.getFeatureById?.(id);
      if (feat) mapApi.current?.zoomToFeature(feat, true);
    }, 30);
  };

  const closeCountryFocus = () => {
    setCountryFocus(null);
    setComparedId(null);
    setCompareMode(false);
    mapApi.current?.reset();
  };

  const selected = selectedId ? COUNTRIES_BY_ID[selectedId] : null;
  const compared = comparedId ? COUNTRIES_BY_ID[comparedId] : null;

  return (
    <>
      <div className="app">
        {/* Topbar */}
        <div className="topbar">
          <div className="brand">
            <div className="logo">Alethia</div>
            <div className="tagline">Índice ilustrativo · América · 2015–2024</div>
          </div>
          <div className="meta">
            <span className="mono">DATOS·FICTICIOS</span>
            <span className="pill" onClick={() => setShowNotes(true)}>Metodología</span>
            <span className="pill" onClick={() => setTweak("theme", tweaks.theme === "dark" ? "light" : "dark")}>
              {tweaks.theme === "dark" ? "Modo claro" : "Modo oscuro"}
            </span>
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
          </div>

          {/* Map */}
          <div className="col" style={{ borderRight: "none", borderLeft: "none" }}>
            <div className="map-wrap">
              <div className="map-frame">
                {!topology && <div className="loading">Cargando geometría</div>}
                {topology && (
                  <MapView
                    topology={topology}
                    year={year}
                    viewMode={tweaks.viewMode}
                    projection={tweaks.projection}
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
                <div className="map-zoom-controls">
                  <button className="map-zoom-btn" onClick={() => mapApi.current?.zoomIn()} title="Acercar (+)">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M7 3 L7 11 M3 7 L11 7" />
                    </svg>
                  </button>
                  <div className="zoom-level">{Math.round(zoomLevel * 100)}%</div>
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
                        <div className="mp-seg cols-2">
                          <button
                            className={tweaks.theme === "dark" ? "active" : ""}
                            onClick={() => setTweak("theme", "dark")}
                          >Oscuro</button>
                          <button
                            className={tweaks.theme === "light" ? "active" : ""}
                            onClick={() => setTweak("theme", "light")}
                          >Claro</button>
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
                <div className="map-overlay map-title">
                  <div className="kicker">El mapa</div>
                  <div className="h">¿Dónde se siente la corrupción en {year}?</div>
                  <div className="sub editorial">
                    Una representación de la percepción pública —no de cifras oficiales— sobre el grado de
                    corrupción en {window.COUNTRIES.length} países del continente americano.
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

              {/* Timeline */}
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

      {/* Country Focus Panel — slide-in desde la derecha */}
      {(() => {
        const c = countryFocus ? COUNTRIES_BY_ID[countryFocus] : null;
        const data = c ? window.COUNTRY_DATA(c, year) : null;
        const rank = c ? window.COUNTRIES.slice()
          .sort((a, b) => b.scores[year] - a.scores[year])
          .findIndex(x => x.id === c.id) + 1 : null;
        return (
          <div className={`country-focus${countryFocus ? " open" : ""}`}>
            {c && (
              <>
                <div className="cf-head">
                  <div className="cf-kicker">
                    <span>Ficha de país · {year}</span>
                    <button className="cf-close" onClick={closeCountryFocus} title="Cerrar (Esc)">✕</button>
                  </div>
                  <div className="cf-name">{c.name}</div>
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
                  <button className="cf-action-btn" onClick={() => setForumOpen(c.id)}>Foro</button>
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
              <strong>Alethia</strong> es una pieza de <em>periodismo de datos ilustrativo</em>.
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
                    <button className="cd-btn" onClick={() => setForumOpen(c.id)}>Foro</button>
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

      {/* Foro modal */}
      {forumOpen && (
        <window.Forum
          country={COUNTRIES_BY_ID[forumOpen]}
          year={year}
          user={authUser}
          onClose={() => setForumOpen(null)}
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
