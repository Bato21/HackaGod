// Aletheia — App principal
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
  riesgo: {
    name: "Riesgo",
    stops: [
      [0,  [22, 163, 74]],   // dark green — bajo riesgo
      [25, [132, 204, 22]],  // lime
      [50, [250, 204, 21]],  // yellow
      [75, [249, 115, 22]],  // orange
      [100,[185, 28, 28]],   // dark red — alto riesgo
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
  "projection": "leaflet",
  "viewMode": "choropleth",
  "showLabels": false,
  "theme": "corporate",
  "palette": "riesgo",
  "labelScale": 1
}/*EDITMODE-END*/;

const COUNTRIES_BY_ID = {};
window.COUNTRIES.forEach(c => {
  COUNTRIES_BY_ID[c.id] = c;
  COUNTRIES_BY_ID[+c.id] = c; // cover IDs without leading zeros (e.g. 76 → "076")
});

// Dynamic year bounds — always derived from window.YEARS (driven by DB/cpi-override).
const YEAR_FIRST  = window.YEARS[0];
const YEAR_LATEST = window.YEARS[window.YEARS.length - 1];

const GEOJSON_URL = "countries-110m.json";

class ChatErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? null : this.props.children; }
}

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
  onHover, onLeave, onSelect, filterRange, apiRef, onZoomChange, theme, palette
}) {
  const containerRef  = useRef(null);
  const mapInst       = useRef(null);
  const geoLayer      = useRef(null);
  const bubbleGroup   = useRef(null);
  const labelGroup    = useRef(null);
  const nameGroupRef  = useRef(null);
  const layersById    = useRef({});
  const tileLayerRef  = useRef(null);
  const newsPoiGroup   = useRef(null);
  const elevGroupRef   = useRef(null); // tracks which layer has elevation applied
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
    const hasFocus = !!sid;
    const notActive = hasFocus && !isSel && !isCmp;
    return {
      fillColor:   colorFor(score),
      fillOpacity: dim ? 0.12 : notActive ? 0.32 : 1,
      color:  isSel ? '#facc15' : isCmp ? '#38bdf8' : (notActive ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.5)'),
      weight: isSel ? 3         : isCmp ? 2          : 0.6,
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

    // Sin tile layer: el fondo es el mismo que el del globo
    // (.globe-stage-bg = gradiente navy + malla login, detrás del mapa).

    // Custom labels pane above GeoJSON overlay (400)
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';

    // Pane for news POIs (above country layer)
    map.createPane('news-pois');
    map.getPane('news-pois').style.zIndex = 620;

    map.setMaxBounds([[-80, -180], [85, 180]]);
    map.fitBounds([[-58, -120], [74, -32]]);
    map.on('zoomend', () => {
      const z = map.getZoom();
      onZoomChange && onZoomChange(z);
      setMapZoom(z);
    });
    mapInst.current = map;
    // Two-pass invalidate: 250ms for initial layout, 600ms for iOS Safari
    // which settles layout a frame later (single 100ms was too short on mobile)
    const resizeAndFit = () => {
      map.invalidateSize({ animate: false });
      map.fitBounds([[-58, -120], [74, -32]]);
    };
    setTimeout(resizeAndFit, 250);
    setTimeout(resizeAndFit, 600);

    // Mobile: el layout (topbar wrap, dvh, rotación) cambia el tamaño del
    // contenedor después del mount → Leaflet queda con size 0 (mapa en blanco).
    // ResizeObserver + resize/orientationchange fuerzan invalidateSize.
    let rafId = null;
    const refresh = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => map.invalidateSize({ animate: false }));
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(containerRef.current);
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
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
  }, [year, filterRange, selectedId, comparedId, theme, palette]);

  // ── Floating elevation effect: drop-shadow on selected country ──
  useEffect(() => {
    // Remove elevation from previous selection
    if (elevGroupRef.current) {
      try { elevGroupRef.current._path.style.filter = ''; } catch (_) {}
      try { elevGroupRef.current._path.style.transform = ''; } catch (_) {}
      elevGroupRef.current = null;
    }
    if (selectedId && layersById.current[selectedId]) {
      const lyr = layersById.current[selectedId];
      try {
        lyr.bringToFront?.();
        if (lyr._path) {
          lyr._path.style.filter = 'drop-shadow(0 6px 18px rgba(0,0,0,0.65)) drop-shadow(0 0 10px rgba(250,204,21,0.45))';
        }
        elevGroupRef.current = lyr;
      } catch (_) {}
    }
  }, [selectedId]);

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

  // ── News Points of Interest ─────────────────────────────────────
  useEffect(() => {
    const map = mapInst.current;
    if (!map || !americasFeatures.length) return;
    if (newsPoiGroup.current) { map.removeLayer(newsPoiGroup.current); newsPoiGroup.current = null; }

    const sorted = window.COUNTRIES.slice().sort((a, b) => b.scores[year] - a.scores[year]);

    // High importance (red) — top 4 most corrupt
    const highNews = sorted.slice(0, 4).map(c => ({
      country: c,
      title: `${c.name}: Investigación por corrupción activa`,
      type: 'high',
    }));

    // Medium importance (orange) — positions 5–6 by corruption
    const medNews = sorted.slice(4, 6).map(c => ({
      country: c,
      title: `${c.name}: Alerta por irregularidades detectadas`,
      type: 'medium',
    }));

    const grp = L.layerGroup();
    [...highNews, ...medNews].forEach(({ country, title, type }) => {
      const isHigh = type === 'high';
      const color  = isHigh ? '#dc2626' : '#f97316';
      const pulse  = isHigh ? '#ef4444' : '#fb923c';
      const radius = isHigh ? 7 : 5.5;

      // Outer pulse ring
      const ring = L.circleMarker([country.lat, country.lng], {
        radius: radius + 5,
        color: color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.12,
        pane: 'news-pois',
        interactive: false,
      }).addTo(grp);

      // Inner dot
      const dot = L.circleMarker([country.lat, country.lng], {
        radius,
        color: '#fff',
        weight: 1.2,
        fillColor: color,
        fillOpacity: 0.92,
        pane: 'news-pois',
      });

      dot.bindTooltip(`
        <div style="font-family:monospace;font-size:10px;line-height:1.5;max-width:200px;">
          <div style="font-weight:700;color:${color};letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px;">
            ${isHigh ? '⬤ ALTA IMPORTANCIA' : '◉ MEDIA IMPORTANCIA'}
          </div>
          <div style="font-weight:600;">${country.name}</div>
          <div style="color:#888;margin-top:2px;">${title.replace(country.name + ': ', '')}</div>
          <div style="color:#888;margin-top:2px;">Índice: ${country.scores[year].toFixed(1)}/100</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -8],
        opacity: 1,
        className: 'news-poi-tooltip',
      });

      dot.addTo(grp);
    });

    grp.addTo(map);
    newsPoiGroup.current = grp;
    return () => {
      if (newsPoiGroup.current) { map.removeLayer(newsPoiGroup.current); newsPoiGroup.current = null; }
    };
  }, [americasFeatures, year]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />;
}


// ── GlobeView — vista D3 ortográfica (globo 3D arrastrable) ──────────
// Solo se monta cuando projection === "orthographic". Mapa base = Leaflet.
function GlobeView({
  topology, year, viewMode, showLabels,
  selectedId, comparedId, hoveredId,
  onHover, onLeave, onSelect, filterRange, apiRef, onZoomChange
}) {
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomBehaviorRef = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [rotation, setRotation] = useState([80, -10]);
  const rotationRef = useRef(rotation);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  const pathFnRef = useRef(null);
  const spinTimerRef = useRef(null);

  // Centra [lng,lat] al frente del globo + zoom-in, movimiento fluido
  const centerOn = React.useCallback((lng, lat) => {
    if (lng == null || lat == null) return;
    if (spinTimerRef.current) spinTimerRef.current.stop();
    const start = rotationRef.current.slice();
    let dLng = (-lng) - start[0];
    dLng = ((dLng + 180) % 360 + 360) % 360 - 180;
    const end = [start[0] + dLng, -lat];
    const DUR = 1000;

    // Rotación (estado React, via timer + easing suave)
    spinTimerRef.current = d3.timer((elapsed) => {
      const k = Math.min(1, elapsed / DUR);
      const e = d3.easeCubicInOut(k);
      setRotation([start[0] + (end[0] - start[0]) * e,
                   start[1] + (end[1] - start[1]) * e]);
      if (k >= 1) { spinTimerRef.current.stop(); spinTimerRef.current = null; }
    });

    // Zoom-in hacia el centro del globo (transform GPU sobre <g>, fluido)
    const svgEl = svgRef.current;
    const zoom = zoomBehaviorRef.current;
    if (svgEl && zoom) {
      const W = svgEl.clientWidth || svgEl.parentElement.clientWidth;
      const H = svgEl.clientHeight || svgEl.parentElement.clientHeight;
      const cx = W / 2, cy = H / 2, scale = 2.4;
      const t = d3.zoomIdentity.translate(cx, cy).scale(scale).translate(-cx, -cy);
      d3.select(svgEl).transition().duration(DUR).ease(d3.easeCubicInOut)
        .call(zoom.transform, t);
    }
  }, []);
  const centerOnRef = useRef(centerOn);
  useEffect(() => { centerOnRef.current = centerOn; }, [centerOn]);

  // Click en país: centrar + seleccionar
  const handleCountryClick = (f) => {
    const c = COUNTRIES_BY_ID[f.id];
    if (c) centerOn(c.lng, c.lat);
    onSelect(f.id);
  };

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

  // d3.zoom (solo escala con wheel; el drag rota el globo)
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const zoom = d3.zoom()
      .scaleExtent([1, 14])
      .filter((event) => event.type === "wheel")
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        if (onZoomChange) onZoomChange(event.transform.k);
      });
    svg.call(zoom).on("dblclick.zoom", null);
    zoomBehaviorRef.current = zoom;
    if (apiRef) {
      apiRef.current = {
        zoomIn: () => svg.transition().duration(220).call(zoom.scaleBy, 1.6),
        zoomOut: () => svg.transition().duration(220).call(zoom.scaleBy, 1 / 1.6),
        reset: () => svg.transition().duration(380).call(zoom.transform, d3.zoomIdentity),
        // Selección externa (chatbot/búsqueda): centra el globo en el país
        zoomToFeature: (feature) => {
          const c = feature && COUNTRIES_BY_ID[feature.id];
          if (c) centerOnRef.current(c.lng, c.lat);
        },
        getFeatureById: (id) => ({ id }),
      };
    }
    return () => { svg.on(".zoom", null); };
  }, [apiRef, onZoomChange]);

  // Drag para rotar el globo
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    let startRot = null, startPos = null, moved = false;
    let rafId = null, pending = null;

    const flush = () => {
      rafId = null;
      if (!pending) return;
      setRotation(pending);
      pending = null;
    };
    let captured = false;
    const onDown = (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      startRot = [rotationRef.current[0], rotationRef.current[1]];
      startPos = [event.clientX, event.clientY];
      moved = false;
      // NO capturar aquí: robaría el click del país (tap = select).
    };
    const onMove = (event) => {
      if (!startPos) return;
      const dx = event.clientX - startPos[0];
      const dy = event.clientY - startPos[1];
      if (!moved && Math.hypot(dx, dy) < 3) return;
      if (!moved) {
        moved = true;
        svg.classed("dragging", true);
        // Capturar solo cuando ES un drag real → el tap simple sigue
        // generando click en el <path> y selecciona el país.
        try { svgRef.current.setPointerCapture(event.pointerId); captured = true; } catch (_) {}
      }
      const k = 0.35;
      // Coalesce: guarda el último valor y aplica 1 vez por frame (fluido).
      pending = [
        startRot[0] + dx * k,
        Math.max(-89, Math.min(89, startRot[1] - dy * k)),
      ];
      if (rafId == null) rafId = requestAnimationFrame(flush);
    };
    const onUp = (event) => {
      if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; }
      if (pending) { setRotation(pending); pending = null; }
      startPos = null; startRot = null;
      if (moved) svg.classed("dragging", false);
      moved = false;
      if (captured) {
        try { svgRef.current.releasePointerCapture(event.pointerId); } catch (_) {}
        captured = false;
      }
    };
    const el = svgRef.current;
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // Geometría: SOLO depende de topology (caro: no recomputar al rotar).
  const geo = useMemo(() => {
    if (!topology) return null;
    const all = topojson.feature(topology, topology.objects.countries).features;
    return {
      all,
      americas: all.filter(f => COUNTRIES_BY_ID[f.id]),
      graticule: d3.geoGraticule10(),
      sphere: { type: "Sphere" },
    };
  }, [topology]);

  // Proyección/path: depende de tamaño y rotación (barato vs rebuild geo).
  const { projectionFn, pathFn } = useMemo(() => {
    if (!geo) return {};
    const proj = d3.geoOrthographic()
      .rotate([rotation[0], rotation[1], 0])
      .clipAngle(90)
      .translate([size.w / 2, size.h / 2])
      .scale(Math.min(size.w, size.h) * 0.45);
    return { projectionFn: proj, pathFn: d3.geoPath(proj) };
  }, [geo, size, rotation]);

  const allFeatures      = geo?.all;
  const americasFeatures = geo?.americas;
  const graticule        = geo?.graticule;
  const sphere           = geo?.sphere;

  if (!topology || !pathFn) return null;
  pathFnRef.current = pathFn;

  const handleEnter = (e, f) => {
    const country = COUNTRIES_BY_ID[f.id];
    if (!country) return;
    const yi = window.YEARS.indexOf(year);
    const prev = yi > 0 ? country.scores[window.YEARS[yi - 1]] : null;
    onHover({ country, year, delta: prev != null ? country.scores[year] - prev : null,
              x: e.clientX, y: e.clientY });
  };
  const isDimmed = (id) => {
    const c = COUNTRIES_BY_ID[id];
    if (!c) return false;
    const s = c.scores[year];
    return s < filterRange[0] || s > filterRange[1];
  };

  return (
    <React.Fragment>
      {/* Fondo estilo login: gradiente navy (sin animación) */}
      <div className="globe-stage-bg" />
      <svg ref={svgRef} viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none"
         style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, touchAction: 'none', cursor: 'grab' }}>
      <defs>
        <radialGradient id="globeWater" cx="0.4" cy="0.34" r="0.9">
          <stop offset="0%"   stopColor="#2a8ab5" />
          <stop offset="55%"  stopColor="#1a6080" />
          <stop offset="100%" stopColor="#0d3550" />
        </radialGradient>
        <pattern id="globeMesh" width="13" height="13" patternUnits="userSpaceOnUse">
          <path d="M13 0 H0 V13" fill="none"
                stroke="rgba(94,200,230,0.16)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <g ref={gRef}>
        <path d={pathFn(sphere)} className="sphere" />
        <path d={pathFn(sphere)} className="sphere-mesh" />
        <path d={pathFn(graticule)} className="graticule" />
        <g>
          {allFeatures.map((f, i) => {
            if (COUNTRIES_BY_ID[f.id]) return null;
            const d = pathFn(f);
            return d ? <path key={`o-${f.id ?? i}`} d={d} className="country-path outside" /> : null;
          })}
        </g>
        {viewMode === "choropleth" && (
          <g>
            {americasFeatures.map(f => {
              const country = COUNTRIES_BY_ID[f.id];
              const d = pathFn(f);
              if (!d) return null;
              const dim = isDimmed(f.id);
              return (
                <path
                  key={f.id}
                  d={d}
                  className={`country-path${dim ? " dim" : ""}${selectedId === f.id ? " selected" : ""}${comparedId === f.id ? " compared" : ""}`}
                  style={{ fill: colorFor(country.scores[year]) }}
                  onMouseMove={(e) => handleEnter(e, f)}
                  onMouseLeave={onLeave}
                  onClick={() => handleCountryClick(f)}
                />
              );
            })}
          </g>
        )}
        {viewMode === "bubbles" && (
          <>
            <g>
              {americasFeatures.map(f => {
                const d = pathFn(f);
                return d ? <path key={f.id} d={d} className="country-path" /> : null;
              })}
            </g>
            <g>
              {americasFeatures.map(f => {
                const country = COUNTRIES_BY_ID[f.id];
                const pt = projectionFn([country.lng, country.lat]);
                if (!pt) return null;
                const score = country.scores[year];
                return (
                  <circle
                    key={f.id} cx={pt[0]} cy={pt[1]} r={4 + (score / 100) * 22}
                    className="country-bubble"
                    style={{ fill: colorFor(score) }}
                    opacity={isDimmed(f.id) ? 0.15 : 0.85}
                    stroke={selectedId === f.id ? "var(--accent)" : comparedId === f.id ? "var(--accent-2)" : null}
                    strokeWidth={(selectedId === f.id || comparedId === f.id) ? 2 : 1}
                    onMouseMove={(e) => handleEnter(e, f)}
                    onMouseLeave={onLeave}
                    onClick={() => handleCountryClick(f)}
                  />
                );
              })}
            </g>
          </>
        )}
        {/* Nombres de países (español) — como en Leaflet, todos los visibles */}
        <g>
          {allFeatures.map(f => {
            const name = (window.COUNTRY_NAMES_ES || {})[String(f.id)] ||
                         (COUNTRIES_BY_ID[f.id] && COUNTRIES_BY_ID[f.id].name);
            if (!name) return null;
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
              } catch (_) { return null; }
            }
            const rot = projectionFn.rotate();
            // ocultar países en la cara trasera del globo
            if (d3.geoDistance([lng, lat], [-rot[0], -rot[1]]) > Math.PI / 2) return null;
            const pt = projectionFn([lng, lat]);
            if (!pt) return null;
            const isAmericas = !!c;
            return (
              <text
                key={`name-${f.id}`}
                x={pt[0]}
                y={pt[1] + 3}
                className={isAmericas ? "country-label" : "country-label outside-label"}
                opacity={isAmericas ? (isDimmed(f.id) ? 0.35 : 0.95) : 0.5}
              >
                {name}
              </text>
            );
          })}
        </g>
        {/* ISO3 extra cuando showLabels activo */}
        {showLabels && (
          <g>
            {americasFeatures.map(f => {
              const country = COUNTRIES_BY_ID[f.id];
              const pt = projectionFn([country.lng, country.lat]);
              if (!pt) return null;
              const rot = projectionFn.rotate();
              if (d3.geoDistance([country.lng, country.lat], [-rot[0], -rot[1]]) > Math.PI / 2) return null;
              return (
                <text key={`iso-${f.id}`} x={pt[0]} y={pt[1] + 14} className="country-label"
                      opacity={isDimmed(f.id) ? 0.3 : 0.7} style={{ fontSize: 8 }}>
                  {country.iso3}
                </text>
              );
            })}
          </g>
        )}
      </g>
    </svg>
    </React.Fragment>
  );
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
        {CATS.every(cat => !(news[cat.key] || []).length) ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-3)", fontSize: 12, lineHeight: 1.7 }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>○</div>
            No hay noticias verificadas para <strong style={{ color: "var(--text-2)" }}>{country.name}</strong>.
            <br/>El relato real del año está en los <strong style={{ color: "var(--text-2)" }}>hitos</strong> de la ficha (Información).
          </div>
        ) : CATS.map(cat => {
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

const WORLD_NEWS_DATA = [
  {
    id: "wn1", cat: "corrupcion", catLabel: "Corrupción", tag: "Europa",
    source: "Reuters", rel: "Hace 1h",
    title: "Tribunal europeo condena a ex primer ministro por desvío de fondos de cohesión",
  },
  {
    id: "wn2", cat: "corrupcion", catLabel: "Corrupción", tag: "África",
    source: "Al Jazeera", rel: "Hace 3h",
    title: "Filtración expone red de sobornos en licitaciones de infraestructura vial",
  },
  {
    id: "wn3", cat: "corrupcion", catLabel: "Corrupción", tag: "Asia",
    source: "Bloomberg", rel: "Hace 6h",
    title: "Gigante estatal investigado: auditores detectan irregularidades por 4.200M USD",
  },
  {
    id: "wn4", cat: "politica", catLabel: "Política", tag: "LATAM",
    source: "El País", rel: "Hace 2h",
    title: "Cumbre CELAC debate pacto regional contra el lavado de activos",
  },
  {
    id: "wn5", cat: "politica", catLabel: "Política", tag: "Global",
    source: "FT", rel: "Hace 5h",
    title: "G20 aprueba marco de intercambio automático de información fiscal",
  },
  {
    id: "wn6", cat: "politica", catLabel: "Política", tag: "Medio Oriente",
    source: "BBC", rel: "Hace 8h",
    title: "Parlamento aprueba ley de protección a denunciantes de corrupción",
  },
  {
    id: "wn7", cat: "gobernanza", catLabel: "Gobernanza", tag: "ONU",
    source: "UN News", rel: "Hace 4h",
    title: "UNODC publica índice global de integridad institucional 2026",
  },
  {
    id: "wn8", cat: "gobernanza", catLabel: "Gobernanza", tag: "Europa",
    source: "Euronews", rel: "Hace 7h",
    title: "Comisión Europea endurece requisitos de transparencia para contratos públicos",
  },
  {
    id: "wn9", cat: "gobernanza", catLabel: "Gobernanza", tag: "Global",
    source: "TI", rel: "Hace 10h",
    title: "Transparencia Internacional: 2 de cada 3 países mantienen niveles altos de corrupción",
  },
];

const WORLD_NEWS_CATS = [
  { key: "corrupcion", label: "Corrupción" },
  { key: "politica",   label: "Política" },
  { key: "gobernanza", label: "Gobernanza" },
];

function WorldNewsPanel() {
  return (
    <div className="world-news-panel">
      <div className="wnp-hint">
        Haz clic en un país en el mapa o el ranking para ver su detalle y compararlo con otro.
      </div>
      <div className="wnp-header-label">Noticias recientes · Mundial</div>
      {WORLD_NEWS_CATS.map(cat => {
        const items = WORLD_NEWS_DATA.filter(n => n.cat === cat.key);
        return (
          <div key={cat.key} className={`news-section ${cat.key}`}>
            <div className="news-section-h">
              <span className="dot"></span>
              <span>{cat.label}</span>
              <span className="count">{items.length}</span>
            </div>
            {items.map(item => (
              <div key={item.id} className="news-item">
                <div className="ni-meta">
                  <span className="ni-source">{item.source}</span>
                  <span>{item.rel}</span>
                </div>
                <div className="ni-title">{item.title}</div>
                <div className="ni-foot">
                  <span className="ni-sector">{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div className="wnp-foot">Datos ilustrativos · Aletheia demo</div>
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
        <span className="mono">Δ {(country.scores[YEAR_LATEST] - country.scores[YEAR_FIRST]).toFixed(1)}</span>
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

// Buscador de país (topbar). Al elegir → onPick(country.id) (mismo flujo que click).
function CountrySearch({ onPick }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const norm = s => (s || "").toString().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return [];
    return (window.COUNTRIES || [])
      .filter(c => norm(c.name).includes(t) || norm(c.iso3).includes(t))
      .sort((a, b) => norm(a.name).indexOf(t) - norm(b.name).indexOf(t))
      .slice(0, 8);
  }, [q]);
  const pick = (c) => { onPick(c.id); setQ(""); setOpen(false); };
  return (
    <div className="country-search">
      <svg className="cs-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 L14 14" />
      </svg>
      <input
        className="cs-input"
        type="text"
        placeholder="Buscar país…"
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={e => {
          if (e.key === "Enter" && results[0]) pick(results[0]);
          else if (e.key === "Escape") { setQ(""); setOpen(false); e.target.blur(); }
        }}
      />
      {open && results.length > 0 && (
        <div className="cs-dropdown">
          {results.map(c => (
            <div key={c.id} className="cs-item" onMouseDown={() => pick(c)}>
              <span className="cs-name">{c.name}</span>
              <span className="cs-iso">{c.iso3}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App({ user: authUser, onLogout, onOpenHelp }) {
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

  // ── Tweaks — self-contained, no dependency on window.useTweaks load order
  const [tweaks, setTweakValues] = useState(TWEAK_DEFAULTS);
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = (typeof keyOrEdits === "object" && keyOrEdits !== null)
      ? keyOrEdits : { [keyOrEdits]: val };
    setTweakValues(prev => ({ ...prev, ...edits }));
    window.dispatchEvent(new CustomEvent("tweakchange", { detail: edits }));
  }, []);
  // Palette activa para colorFor() (módulo-scope, actualizado en render)
  ACTIVE_PALETTE = tweaks.palette || "editorial";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme || "dark");
    // Auto-switch palette to match theme
    if (tweaks.theme === "corporate" && tweaks.palette === "editorial") {
      setTweak("palette", "riesgo");
    } else if (tweaks.theme !== "corporate" && tweaks.palette === "riesgo") {
      setTweak("palette", "editorial");
    }
  }, [tweaks.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--palette-gradient", paletteCss(tweaks.palette || "editorial"));
  }, [tweaks.palette]);

  useEffect(() => {
    document.documentElement.style.setProperty("--label-scale", tweaks.labelScale || 1);
  }, [tweaks.labelScale]);

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
  const [zoomLevel, setZoomLevel] = useState(3);
  const [mapSettingsOpen, setMapSettingsOpen] = useState(false);
  const [countryFocus, setCountryFocus] = useState(null);
  const [countryDashboard, setCountryDashboard] = useState(null);
  // Mobile: ficha de país y noticias se muestran como un solo overlay con
  // pestañas. 'info' = ficha, 'news' = noticias. Default 'info'.
  const [mobileFichaTab, setMobileFichaTab] = useState("info");
  // Cómo se abrió el dashboard: 'auto' (al tocar país, es la ficha mobile)
  // o 'expand' (botón Expandir ficha en desktop). En desktop el modo 'auto'
  // se oculta vía CSS para no abrir el modal en cada click.
  const [dashMode, setDashMode] = useState(null);
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

  // Remove Babel loading splash once React has mounted
  useEffect(() => {
    const el = document.getElementById("app-loading");
    if (el) el.remove();
  }, []);

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
        if (countryDashboard) { setCountryDashboard(null); setDashMode(null); return; }
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

  // Tops del panel: 10 más corruptos, 10 más limpios, promedio por región.
  const panelTops = useMemo(() => {
    const all = window.COUNTRIES.slice();
    const byScore = all.slice().sort((a, b) => b.scores[year] - a.scores[year]);
    const topCorrupt = byScore.slice(0, 10);
    const topClean = byScore.slice().reverse().slice(0, 10);
    const reg = {};
    all.forEach(c => {
      (reg[c.region] ||= { sum: 0, n: 0 });
      reg[c.region].sum += c.scores[year];
      reg[c.region].n += 1;
    });
    const regional = Object.entries(reg)
      .map(([region, { sum, n }]) => ({ region, avg: sum / n, n }))
      .sort((a, b) => b.avg - a.avg);
    return { topCorrupt, topClean, regional };
  }, [year]);

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
    setMobileFichaTab("info"); // mobile: abrir siempre en la ficha primero
    // La pestaña Información (mobile) usa el dashboard completo (presidente,
    // gabinete, etc.). Se monta siempre; en desktop el modo 'auto' queda
    // oculto por CSS (no abre el modal en cada click).
    setCountryDashboard(id);
    setDashMode("auto");
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
    setCountryDashboard(null); // mobile: cierra también el dashboard de la ficha
    setDashMode(null);
    mapApi.current?.reset();
  };

  // Chatbot → map: escucha evento de selección de país por iso3.
  // Usa ref para llamar siempre el handleSelect actual (evita closure stale)
  // y funciona en ambos modos: Leaflet (MapView) y Globo (GlobeView).
  const handleSelectRef = useRef(handleSelect);
  handleSelectRef.current = handleSelect;
  React.useEffect(() => {
    const handler = (e) => {
      const iso3 = e.detail?.iso3;
      if (!iso3) return;
      const country = window.COUNTRIES.find(
        c => c.iso3 === String(iso3).trim().toUpperCase()
      );
      if (country) handleSelectRef.current(country.id);
    };
    window.addEventListener("aletheia:select-country", handler);
    return () => window.removeEventListener("aletheia:select-country", handler);
  }, []);

  // Tour: avisa cuando el panel se abrió (para paso spotlight-action)
  const prevFullscreen = useRef(mapFullscreen);
  useEffect(() => {
    if (prevFullscreen.current && !mapFullscreen) {
      window.dispatchEvent(new CustomEvent("aletheia:tour:action-done"));
    }
    prevFullscreen.current = mapFullscreen;
  }, [mapFullscreen]);

  const prevSelectedId = useRef(selectedId);
  useEffect(() => {
    if (!prevSelectedId.current && selectedId) {
      window.dispatchEvent(new CustomEvent("aletheia:tour:country-selected"));
    }
    prevSelectedId.current = selectedId;
  }, [selectedId]);

  const prevDashMode = useRef(dashMode);
  useEffect(() => {
    if (prevDashMode.current !== "expand" && dashMode === "expand") {
      window.dispatchEvent(new CustomEvent("aletheia:tour:dashboard-opened"));
    }
    prevDashMode.current = dashMode;
  }, [dashMode]);

  // Tour: reacciona a eventos del TourOverlay
  useEffect(() => {
    const openPanel  = () => setMapFullscreen(false);
    const toFullscreen = () => { setMapFullscreen(true); setCountryDashboard(null); setDashMode(null); };
    const selectForTour = () => {
      const c = (window.COUNTRIES || []).find(c => c.iso3 === "MEX") || (window.COUNTRIES || [])[0];
      if (c) handleSelectRef.current(c.id);
    };
    const resetView = () => {
      setCountryFocus(null); setSelectedId(null); setComparedId(null);
      setCompareMode(false); setCountryDashboard(null); setDashMode(null);
      setMapFullscreen(true); setMapSettingsOpen(false);
      mapApi.current?.reset();
    };
    window.addEventListener("aletheia:tour:open-panel",      openPanel);
    window.addEventListener("aletheia:tour:go-fullscreen",   toFullscreen);
    window.addEventListener("aletheia:tour:select-country",  selectForTour);
    window.addEventListener("aletheia:tour:reset-view",      resetView);
    return () => {
      window.removeEventListener("aletheia:tour:open-panel",     openPanel);
      window.removeEventListener("aletheia:tour:go-fullscreen",  toFullscreen);
      window.removeEventListener("aletheia:tour:select-country", selectForTour);
      window.removeEventListener("aletheia:tour:reset-view",     resetView);
    };
  }, []);

  // Tour: dispara eventos cuando el usuario interactúa con opciones del mapa
  const prevSettingsOpen = useRef(mapSettingsOpen);
  useEffect(() => {
    if (!prevSettingsOpen.current && mapSettingsOpen)
      window.dispatchEvent(new CustomEvent("aletheia:tour:settings-opened"));
    prevSettingsOpen.current = mapSettingsOpen;
  }, [mapSettingsOpen]);

  const prevPalette = useRef(tweaks.palette);
  useEffect(() => {
    if (prevPalette.current !== tweaks.palette)
      window.dispatchEvent(new CustomEvent("aletheia:tour:palette-changed"));
    prevPalette.current = tweaks.palette;
  }, [tweaks.palette]);

  const prevLabelScale = useRef(tweaks.labelScale);
  useEffect(() => {
    if (prevLabelScale.current !== tweaks.labelScale)
      window.dispatchEvent(new CustomEvent("aletheia:tour:labelscale-changed"));
    prevLabelScale.current = tweaks.labelScale;
  }, [tweaks.labelScale]);

  const prevTheme = useRef(tweaks.theme);
  useEffect(() => {
    if (prevTheme.current !== tweaks.theme)
      window.dispatchEvent(new CustomEvent("aletheia:tour:theme-changed"));
    prevTheme.current = tweaks.theme;
  }, [tweaks.theme]);

  const prevProjection = useRef(tweaks.projection);
  useEffect(() => {
    if (prevProjection.current !== "orthographic" && tweaks.projection === "orthographic")
      window.dispatchEvent(new CustomEvent("aletheia:tour:globe-selected"));
    prevProjection.current = tweaks.projection;
  }, [tweaks.projection]);

  // Forum takeover abierto → marca body para ocultar el bottom-nav mobile
  // (el foro tiene su propia navegación y el nav tapaba el composer).
  useEffect(() => {
    document.body.classList.toggle("forum-open", !!forumOpen);
    return () => document.body.classList.remove("forum-open");
  }, [forumOpen]);

  // Mobile arranca en mapa full (los taps de país abren la ficha-overlay).
  // El botón "Panel" alterna a la vista de panel (1 columna scrolleable).
  // Solo se fuerza fullscreen UNA vez al entrar en viewport mobile, no en
  // cada render, para que el toggle del botón siga funcionando.
  const didMobileInit = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const initIfMobile = () => {
      if (mq.matches && !didMobileInit.current) {
        didMobileInit.current = true;
        setMapFullscreen(true);
      }
      if (!mq.matches) didMobileInit.current = false;
    };
    initIfMobile();
    mq.addEventListener("change", initIfMobile);
    return () => mq.removeEventListener("change", initIfMobile);
  }, []);

  // ¿Viewport mobile? (para decidir contenido del rail, no solo CSS)
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 760px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setIsMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Secciones colapsables del panel (mobile): filtros + ranking.
  // Acordeón: una sola sección abierta a la vez; la abierta ocupa todo
  // el panel y scrollea internamente. Click en la abierta la colapsa.
  const [openSec, setOpenSec] = useState("ranking");
  const toggleSec = (k) => setOpenSec(cur => (cur === k ? null : k));
  const secOpen = {
    filtros:    openSec === "filtros",
    ranking:    openSec === "ranking",
    topCorrupt: openSec === "topCorrupt",
    topClean:   openSec === "topClean",
    regional:   openSec === "regional",
  };

  // Ficha país abierta (mobile): body classes para overlay full-screen
  // con pestañas Información/Noticias y para ocultar el bottom-nav.
  useEffect(() => {
    const open = !!countryFocus;
    document.body.classList.toggle("ficha-open", open);
    document.body.classList.toggle("ficha-tab-info", open && mobileFichaTab === "info");
    document.body.classList.toggle("ficha-tab-news", open && mobileFichaTab === "news");
    // dash-auto: dashboard montado por tap (no por "Expandir ficha").
    // Desktop usa esta clase para ocultar el modal auto.
    document.body.classList.toggle("dash-auto", dashMode === "auto");
    return () => {
      document.body.classList.remove(
        "ficha-open", "ficha-tab-info", "ficha-tab-news", "dash-auto"
      );
    };
  }, [countryFocus, mobileFichaTab, dashMode]);

  const selected = selectedId ? COUNTRIES_BY_ID[selectedId] : null;
  const compared = comparedId ? COUNTRIES_BY_ID[comparedId] : null;

  const pillNavItems = [
    { label: 'Foro',        onClick: () => setForumOpen({}) },
    { label: 'Metodología', onClick: () => setShowNotes(true) },
    { label: 'Comparar',    onClick: () => setCompareMode(m => !m) },
    {
      label: tweaks.theme === "dark" ? "☀ Claro" : tweaks.theme === "light" ? "◑ Corp." : "● Oscuro",
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
            <div className="logo">
              {/* Athena's owl — truth & wisdom */}
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
                <path d="M16 4 L22 6 L26 12 L26 22 L20 27 L12 27 L6 22 L6 12 L10 6 Z" stroke="#e6b840" strokeWidth="1.2" fill="rgba(230,184,64,0.08)"/>
                <circle cx="12" cy="13" r="3.5" stroke="#e6b840" strokeWidth="1.1" fill="rgba(230,184,64,0.10)"/>
                <circle cx="12" cy="13" r="1.7" fill="#e6b840" opacity="0.95"/>
                <circle cx="12" cy="13" r="0.8" fill="#0e0c13"/>
                <circle cx="20" cy="13" r="3.5" stroke="#e6b840" strokeWidth="1.1" fill="rgba(230,184,64,0.10)"/>
                <circle cx="20" cy="13" r="1.7" fill="#e6b840" opacity="0.95"/>
                <circle cx="20" cy="13" r="0.8" fill="#0e0c13"/>
                <path d="M14.5 15.5 L16 18 L17.5 15.5" stroke="#e6b840" strokeWidth="1" strokeLinejoin="round" fill="rgba(230,184,64,0.35)"/>
                <path d="M11 5.5 L9 2.5 M21 5.5 L23 2.5" stroke="#e6b840" strokeWidth="1" strokeLinecap="round"/>
                <path d="M6 16 L3.5 13.5 L6 20 M26 16 L28.5 13.5 L26 20" stroke="#e6b840" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 27 L10 30 M16 27 L16 30 M20 27 L22 30" stroke="#e6b840" strokeWidth="0.9" strokeLinecap="round"/>
              </svg>
              <span className="logo-text">Aletheia</span>
            </div>
            <div className="tagline">aquello que no está oculto</div>
            <CountrySearch onPick={handleSelect} />
          </div>

          {/* PillNav + Pregunta a Aletheia */}
          <div className="topbar-center" data-tour="forum-btn">
            {window.PillNav && (
              <window.PillNav
                items={pillNavItems}
                baseColor="#0e0c13"
                pillColor="#1d1a2d"
                hoveredPillTextColor="#e6b840"
              />
            )}
            <button
              className="ask-aletheia-btn"
              data-tour="chatbot"
              onClick={() => window.dispatchEvent(new CustomEvent("aletheia:chat:toggle"))}
              title="Asistente Aletheia"
            >
              <span aria-hidden="true">💬</span> Pregunta a Aletheia
            </button>
          </div>

          <div className="meta">
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
            {onOpenHelp && (
              <button className="help-btn" onClick={onOpenHelp} title="Introducción a Aletheia">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6.5"/>
                  <path d="M6 6.2C6 5 6.9 4.2 8 4.2c1.2 0 2 .9 2 1.9 0 1.4-1.5 1.9-2 2.7"/>
                  <circle cx="8" cy="11.5" r=".7" fill="currentColor" stroke="none"/>
                </svg>
                <span className="help-btn-label">Ayuda</span>
              </button>
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

        {/* Bottom nav — solo mobile (CSS lo oculta en desktop) */}
        <nav className="mobile-nav" aria-label="Navegación móvil">
          <button
            className="mn-btn"
            onClick={() => {
              setForumOpen(null);
              setShowNotes(false);
              setProfileOpen(false);
              setCompareMode(false);
              closeCountryFocus();
            }}
            aria-label="Inicio"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 L12 3 L21 10.5" />
              <path d="M5 9.5 L5 20 L19 20 L19 9.5" />
              <path d="M10 20 L10 14 L14 14 L14 20" />
            </svg>
            <span>Mapa</span>
          </button>

          <button className="mn-btn" onClick={() => setForumOpen({})} aria-label="Foro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="5" rx="1.5" />
              <path d="M5 9 L5 19 A1 1 0 0 0 6 20 L18 20 A1 1 0 0 0 19 19 L19 9" />
              <path d="M10 13 L14 13" />
            </svg>
            <span>Foro</span>
          </button>

          <button
            className="mn-btn mn-btn--accent"
            onClick={() => window.dispatchEvent(new CustomEvent("aletheia:chat:toggle"))}
            aria-label="Pregunta a Aletheia"
          >
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 4 L22 6 L26 12 L26 22 L20 27 L12 27 L6 22 L6 12 L10 6 Z" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="12" cy="13" r="3.3" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="12" cy="13" r="1.5" fill="currentColor" />
              <circle cx="20" cy="13" r="3.3" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="20" cy="13" r="1.5" fill="currentColor" />
              <path d="M14.5 15.5 L16 18 L17.5 15.5" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
              <path d="M11 5.5 L9 2.5 M21 5.5 L23 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <span>Aletheia</span>
          </button>

          <button
            className="mn-btn"
            onClick={() => {
              if (authUser.kind === "guest") onLogout();
              else setProfileOpen(true);
            }}
            aria-label="Perfil"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="9" r="3.4" />
              <path d="M5.5 20 A6.5 6.5 0 0 1 18.5 20" />
            </svg>
            <span>Perfil</span>
          </button>

          <button className="mn-btn" onClick={() => setShowNotes(true)} aria-label="Metodología">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 2.5 L12 5 M12 19 L12 21.5 M2.5 12 L5 12 M19 12 L21.5 12 M5.2 5.2 L7 7 M17 17 L18.8 18.8 M5.2 18.8 L7 17 M17 7 L18.8 5.2" />
            </svg>
            <span>Info</span>
          </button>
        </nav>

        {/* Main */}
        <div className={`main${mapFullscreen ? " fullscreen" : ""}`}>
          {/* Left rail */}
          <div className="col" data-tour="ranking">
            {selected && !isMobile ? (
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
            {/* Cerrar panel (solo mobile) → vuelve al mapa */}
            <button className="panel-close-btn" onClick={() => setMapFullscreen(true)}>
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 3 L11 11 M11 3 L3 11"/>
              </svg>
              <span>Cerrar panel</span>
            </button>
            <div className="search-wrap">
              <input
                className="search"
                placeholder="Buscar país, código o región…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <button
              className={`sec-toggle${secOpen.filtros ? " open" : ""}`}
              onClick={() => toggleSec("filtros")}
            >
              <svg className="sec-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4.5 L6 7.5 L9 4.5"/>
              </svg>
              <span>Filtros y orden</span>
            </button>
            <div className="sec-body" style={{ display: secOpen.filtros ? "block" : "none" }}>
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
            </div>
            <button
              className={`sec-toggle${secOpen.ranking ? " open" : ""}`}
              onClick={() => toggleSec("ranking")}
            >
              <svg className="sec-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4.5 L6 7.5 L9 4.5"/>
              </svg>
              <span>Ranking · {sortedList.length}</span>
              <span className="mono sec-year">{year}</span>
            </button>
            <div className="body" style={{ display: secOpen.ranking ? "block" : "none" }}>
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

            {/* Top 10 más corruptos */}
            <button
              className={`sec-toggle${secOpen.topCorrupt ? " open" : ""}`}
              onClick={() => toggleSec("topCorrupt")}
            >
              <svg className="sec-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4.5 L6 7.5 L9 4.5"/>
              </svg>
              <span>Top 10 más corruptos</span>
              <span className="mono sec-year">{year}</span>
            </button>
            <div className="body" style={{ display: secOpen.topCorrupt ? "block" : "none" }}>
              <div className="ranking-list">
                {panelTops.topCorrupt.map((c, i) => {
                  const s = c.scores[year];
                  return (
                    <div key={c.id} className={`rank-row${selectedId === c.id ? " selected" : ""}`} onClick={() => handleSelect(c.id)}>
                      <span className="pos">{String(i + 1).padStart(2, "0")}</span>
                      <span className="name">{c.name}</span>
                      <span className="chip" style={{ background: colorFor(s) }}></span>
                      <span className="score">{s.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 10 más limpios */}
            <button
              className={`sec-toggle${secOpen.topClean ? " open" : ""}`}
              onClick={() => toggleSec("topClean")}
            >
              <svg className="sec-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4.5 L6 7.5 L9 4.5"/>
              </svg>
              <span>Top 10 más limpios</span>
              <span className="mono sec-year">{year}</span>
            </button>
            <div className="body" style={{ display: secOpen.topClean ? "block" : "none" }}>
              <div className="ranking-list">
                {panelTops.topClean.map((c, i) => {
                  const s = c.scores[year];
                  return (
                    <div key={c.id} className={`rank-row${selectedId === c.id ? " selected" : ""}`} onClick={() => handleSelect(c.id)}>
                      <span className="pos">{String(i + 1).padStart(2, "0")}</span>
                      <span className="name">{c.name}</span>
                      <span className="chip" style={{ background: colorFor(s) }}></span>
                      <span className="score">{s.toFixed(1)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promedio regional */}
            <button
              className={`sec-toggle${secOpen.regional ? " open" : ""}`}
              onClick={() => toggleSec("regional")}
            >
              <svg className="sec-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 4.5 L6 7.5 L9 4.5"/>
              </svg>
              <span>Promedio regional</span>
              <span className="mono sec-year">{year}</span>
            </button>
            <div className="body" style={{ display: secOpen.regional ? "block" : "none" }}>
              <div className="ranking-list">
                {panelTops.regional.map((r, i) => (
                  <div key={r.region} className="rank-row">
                    <span className="pos">{String(i + 1).padStart(2, "0")}</span>
                    <span className="name">{r.region} <span className="mono" style={{ color: "var(--text-3)", fontSize: 10 }}>· {r.n}</span></span>
                    <span className="chip" style={{ background: colorFor(r.avg) }}></span>
                    <span className="score">{r.avg.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
            </React.Fragment>
            )}
          </div>

          {/* Map */}
          <div className="col" style={{ borderRight: "none", borderLeft: "none" }}>
            <div className="map-wrap" data-tour="globe">
              <div className="map-frame">
                {!topology && <div className="loading">Cargando geometría</div>}
                {topology && tweaks.projection === "orthographic" && (
                  <GlobeView
                    topology={topology}
                    year={year}
                    viewMode={tweaks.viewMode}
                    showLabels={tweaks.showLabels}
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
                {topology && tweaks.projection !== "orthographic" && (
                  <React.Fragment>
                  {/* Mismo fondo que el globo (gradiente navy + malla login) */}
                  <div className="globe-stage-bg" />
                  <MapView
                    topology={topology}
                    year={year}
                    viewMode={tweaks.viewMode}
                    showLabels={tweaks.showLabels}
                    theme={tweaks.theme}
                    palette={tweaks.palette}
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
                  </React.Fragment>
                )}
                <div className="map-zoom-controls">
                  <button className="map-zoom-btn" onClick={() => mapApi.current?.zoomIn()} title="Acercar (+)">
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M7 3 L7 11 M3 7 L11 7" />
                    </svg>
                  </button>
                  <div className="zoom-level">z{Math.round(zoomLevel)}</div>
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
                    data-tour="settings-btn"
                    onClick={() => setMapSettingsOpen(o => !o)}
                    title="Configuración del mapa"
                    aria-label="Configuración del mapa"
                  >
                    {/* Cog / wrench-nut: hex outer ring + inner hole */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  {mapFullscreen ? (
                    <button
                      className="map-action-btn expanded map-fs-toggle"
                      data-tour="panel-btn"
                      onClick={() => setMapFullscreen(false)}
                      title="Abrir panel principal"
                      aria-label="Abrir panel principal"
                    >
                      {/* Dashboard layout icon: 2x2 grid */}
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="5" height="5" rx="0.8" />
                        <rect x="9" y="2" width="5" height="5" rx="0.8" />
                        <rect x="2" y="9" width="5" height="5" rx="0.8" />
                        <rect x="9" y="9" width="5" height="5" rx="0.8" />
                      </svg>
                      <span>Panel</span>
                    </button>
                  ) : (
                    <button
                      className="map-action-btn map-fs-toggle"
                      onClick={() => setMapFullscreen(true)}
                      title="Pantalla completa"
                      aria-label="Pantalla completa"
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6 L2 2 L6 2 M10 2 L14 2 L14 6 M14 10 L14 14 L10 14 M6 14 L2 14 L2 10" />
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
                        <div className="mp-lbl">Vista</div>
                        <div className="mp-seg cols-2">
                          <button
                            className={tweaks.projection !== "orthographic" ? "active" : ""}
                            onClick={() => setTweak("projection", "leaflet")}
                          >Mapa</button>
                          <button
                            className={tweaks.projection === "orthographic" ? "active" : ""}
                            data-tour="settings-globe"
                            onClick={() => setTweak("projection", "orthographic")}
                          >Globo</button>
                        </div>
                      </div>
                      <div className="mp-section" data-tour="settings-palette">
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
                      <div className="mp-section" data-tour="settings-textsize">
                        <div className="mp-lbl">Tamaño de letras</div>
                        <div className="mp-seg cols-4">
                          {[
                            { v: 1,    label: "Normal" },
                            { v: 1.1,  label: "Media" },
                            { v: 1.2,  label: "Grande" },
                            { v: 1.32, label: "Máx" },
                          ].map(o => (
                            <button
                              key={o.v}
                              className={(tweaks.labelScale || 1) === o.v ? "active" : ""}
                              onClick={() => setTweak("labelScale", o.v)}
                            >{o.label}</button>
                          ))}
                        </div>
                      </div>
                      <div className="mp-section" data-tour="settings-theme">
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

            </div>
          </div>

          {/* Right rail */}
          <div className="col" data-tour="country-ficha">
            <div className="header">
              <h2>{selected ? "Detalle" : "Noticias Mundiales"}</h2>
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
                <WorldNewsPanel />
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

      {/* Ficha mobile: barra de pestañas Información / Noticias.
          CSS la muestra solo en mobile cuando hay país enfocado. */}
      {countryFocus && (
        <div className="ficha-tabs" role="tablist">
          <button
            className={`ficha-tab${mobileFichaTab === "info" ? " active" : ""}`}
            onClick={() => setMobileFichaTab("info")}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="6.2"/>
              <path d="M8 7.2 L8 11.2 M8 5 L8 5.01"/>
            </svg>
            <span>Información</span>
          </button>
          <button
            className={`ficha-tab${mobileFichaTab === "news" ? " active" : ""}`}
            onClick={() => setMobileFichaTab("news")}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="3" width="11" height="10" rx="1"/>
              <path d="M5 6 L11 6 M5 8.5 L11 8.5 M5 11 L9 11"/>
            </svg>
            <span>Noticias</span>
          </button>
          <button className="ficha-tabs-close" onClick={closeCountryFocus} aria-label="Cerrar">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 3 L11 11 M11 3 L3 11"/>
            </svg>
          </button>
        </div>
      )}

      {/* News Focus Panel — slide-in desde la izquierda */}
      <div className={`news-focus${selected && mapFullscreen ? " open" : ""}`} data-tour="news">
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

      {/* Country Focus Panel — slide-in desde la derecha */}
      {(() => {
        const c = countryFocus ? COUNTRIES_BY_ID[countryFocus] : null;
        const data = c ? window.COUNTRY_DATA(c, year) : null;
        const rank = c ? window.COUNTRIES.slice()
          .sort((a, b) => b.scores[year] - a.scores[year])
          .findIndex(x => x.id === c.id) + 1 : null;
        return (
          <div className={`country-focus${countryFocus ? " open" : ""}`} data-tour="country-focus">
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
                        Posición mundial
                        <span className="rk rk--grad" style={{ color: colorFor(c.scores[year]) }}>#{rank}</span>
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
                    <div className="cb-lbl"><span>Tendencia {YEAR_FIRST}–{YEAR_LATEST}</span>
                      <span className="mono" style={{ color: c.scores[YEAR_LATEST] > c.scores[YEAR_FIRST] ? "var(--bad)" : "var(--good)" }}>
                        {c.scores[YEAR_LATEST] > c.scores[YEAR_FIRST] ? "▲" : "▼"} {Math.abs(c.scores[YEAR_LATEST] - c.scores[YEAR_FIRST]).toFixed(1)} pts
                      </span>
                    </div>
                    <Sparkline country={c} year={year} onYearChange={setYear} />
                  </div>

                  {data.indicators.length > 0 && (
                    <div className="cf-block">
                      <div className="cb-lbl"><span>Indicadores asociados</span><span style={{ color: "var(--good)", fontSize: 9 }}>DATOS REALES (proxy)</span></div>
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
                  )}
                </div>

                <div className="cf-disclaimer">
                  <span className="mono">DATOS RESPALDADOS</span> — la ficha completa
                  (presidente, gabinete, indicadores e hitos del año) está en «Expandir
                  ficha». Solo se muestran bloques con dato verificado. Ver Metodología.
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
                  <button className="cf-action-btn" data-tour="cf-foro-btn" onClick={() => setForumOpen({ iso3: c.iso3 })}>Foro</button>
                  <button className="cf-action-btn primary" data-tour="expand-btn" onClick={() => { setCountryDashboard(countryFocus); setDashMode("expand"); }}>Expandir ficha</button>
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
            <h3>¿De dónde salen estos datos?</h3>
            <p>
              <strong>Aletheia</strong> reúne en un solo mapa información pública
              sobre corrupción y gobernanza. Cada cifra que ves <strong>tiene una
              fuente verificable</strong>. Cuando no hay dato confiable para un
              país-año, <strong>no inventamos nada</strong>: simplemente no se muestra.
            </p>

            <div className="nh">El puntaje 0–100</div>
            <p>
              Es el índice CPI de <strong>Transparencia Internacional</strong>, pero
              invertido para leerlo intuitivo: <span className="mono">0</span> = país
              percibido muy limpio, <span className="mono">100</span> = muy corrupto.
              Verde es mejor, rojo es peor.
            </p>

            <div className="nh">En qué se basa el puntaje (13 criterios)</div>
            <p style={{ fontSize: 12, color: "var(--text-2)" }}>
              El CPI mide la percepción de corrupción del sector público a partir
              de estos 13 aspectos:
            </p>
            <ol className="meth-src meth-num">
              <li><b>Soborno de funcionarios</b> — pagos irregulares en servicios públicos.</li>
              <li><b>Desvío de fondos públicos</b> — malversación o uso indebido del presupuesto.</li>
              <li><b>Cargos públicos para beneficio privado</b> — conflictos de interés y enriquecimiento ilícito.</li>
              <li><b>Nepotismo</b> — contratación por conexiones o favoritismo.</li>
              <li><b>Captura del Estado</b> — influencia indebida de empresas en políticas públicas.</li>
              <li><b>Acceso a la información</b> — transparencia y disponibilidad de datos públicos.</li>
              <li><b>Protección a denunciantes</b> — leyes y canales efectivos para denunciar.</li>
              <li><b>Financiamiento de campañas</b> — regulación de donaciones y gastos electorales.</li>
              <li><b>Declaración de bienes</b> — divulgación y verificación patrimonial.</li>
              <li><b>Independencia judicial</b> — autonomía e imparcialidad de tribunales.</li>
              <li><b>Integridad del sector público</b> — códigos de ética y sistemas de mérito.</li>
              <li><b>Fiscalización y auditoría</b> — órganos de control independientes.</li>
              <li><b>Aplicación de leyes anticorrupción</b> — procesamiento y sanciones reales.</li>
            </ol>

            <div className="nh">Datos verificados</div>
            <ul className="meth-src">
              <li><b>Puntaje de corrupción</b> — Transparencia Internacional (CPI).</li>
              <li><b>Presidente / líder</b> — listas públicas de jefes de Estado y gobierno.</li>
              <li><b>Aprobación del gobierno</b> — Cadem, Gallup y Executive Approval Project.</li>
              <li><b>Pobreza, homicidios, crecimiento del PIB</b> — Banco Mundial.</li>
              <li><b>Inflación anual</b> — Banco Mundial / FMI (vía Our World in Data).</li>
              <li><b>Gabinete (6 ministerios)</b> — CIA World Leaders y fuentes oficiales de gobierno.</li>
              <li><b>Postura política</b> — Database of Political Institutions (BID).</li>
            </ul>
            <p style={{ fontSize: 12, color: "var(--text-3)" }}>
              Si un ministerio o cifra no está en una fuente confiable, se deja
              vacío en vez de rellenar con un nombre o número falso.
            </p>

            <div className="nh">Qué significa cada dato</div>
            <ul className="meth-src meth-def">
              <li><b>Puntaje 0–100</b> — percepción de corrupción del sector público (CPI invertido).</li>
              <li><b>Aprobación del gobierno</b> — % de ciudadanía que aprueba la gestión ese año.</li>
              <li><b>Pobreza</b> — % de población bajo la línea nacional de pobreza.</li>
              <li><b>Homicidios</b> — homicidios intencionales por cada 100.000 habitantes.</li>
              <li><b>Crecimiento del PIB</b> — variación anual de la economía (%).</li>
              <li><b>Inflación</b> — subida anual de precios al consumidor (%).</li>
              <li><b>Postura política</b> — orientación del gobierno: izquierda, centro o derecha.</li>
              <li><b>Gabinete</b> — ministros de 6 carteras clave (Economía, Salud, Vivienda, Transporte, Trabajo, Justicia).</li>
              <li><b>Hitos del año</b> — resumen de lo relevante del país en ese año, armado con los datos reales.</li>
            </ul>

            <div className="nh">Indicadores judiciales: léelos con cuidado</div>
            <p style={{ fontSize: 12.5, color: "var(--text-2)" }}>
              Son un <strong>estimado comparativo calculado</strong> a partir de los
              datos reales (PIB, pobreza, homicidios, aprobación). <strong>No son un
              conteo oficial de tribunales</strong>: comparan la <em>intensidad</em> de
              actividad institucional entre países y años, no son cifra legal exacta.
            </p>
            <ul className="meth-src meth-def">
              <li><b>Casos abiertos</b> — carga de causas o investigaciones en curso estimada.</li>
              <li><b>Imputaciones</b> — personas o procesos formalmente acusados estimados.</li>
              <li><b>Sentencias firmes</b> — fallos judiciales cerrados estimados.</li>
              <li><b>Allanamientos</b> — operativos de seguridad/investigación estimados.</li>
              <li><b>Reportes UIF</b> — alertas financieras antilavado estimadas.</li>
              <li><b>Acceso a información negado</b> — restricción de transparencia estimada.</li>
              <li><b>Casos de corrupción</b> — eventos de corrupción relevantes detectados.</li>
            </ul>

            <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 14 }}>
              Cobertura: ~180 países, 2017–2025. Última actualización de datos:
              mayo 2026.
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
          <div className="cd-backdrop" onClick={() => { setCountryDashboard(null); setDashMode(null); }}>
            <div className="cd-shell" data-tour="ficha-dashboard" onClick={e => e.stopPropagation()}>
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
                    <button className="cd-btn cd-btn--foro" onClick={() => setForumOpen({ iso3: c.iso3 })}>Foro</button>
                    <button className="cd-btn primary cd-btn--close" onClick={() => { setCountryDashboard(null); setDashMode(null); }}>Cerrar (Esc)</button>
                  </div>
                </div>
              </div>

              <div className="cd-body">
                {/* Presidente — solo si hay dato real */}
                {detail.realPresident && (
                  <div className="cd-card">
                    <div className="cd-card-h">
                      <span>Presidencia</span>
                      <span className="mono">Líder en {year}</span>
                    </div>
                    <div className="cd-pres">
                      <div className="avatar">{presInitials}</div>
                      <div>
                        <div className="pres-name">{detail.president.name}</div>
                        {detail.president.stance && (
                          <div className="pres-meta">
                            <em>{detail.president.stance}</em>
                          </div>
                        )}
                      </div>
                    </div>
                    {detail.president.approval != null && (
                      <div className="pres-stats">
                        <div className="pres-stat">
                          <div className="lb">Aprobación del gobierno</div>
                          <div className="vl">{detail.president.approval}%</div>
                          <div className="bar"><i style={{ width: `${detail.president.approval}%`, background: detail.president.approval > 50 ? "var(--good)" : "var(--warn)" }}></i></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Gabinete — solo carteras con dato real */}
                {detail.realCabinet && (() => {
                  const real = detail.cabinet.filter(m => !m.noData);
                  if (!real.length) return null;
                  return (
                    <div className="cd-card">
                      <div className="cd-card-h">
                        <span>Gabinete · {year}</span>
                        <span className="mono" style={{ color: "var(--good)" }}>● datos reales</span>
                      </div>
                      <div className="cabinet-grid">
                        {real.map((m, i) => (
                          <div key={i} className="cabinet-row">
                            <span className="port">
                              {m.color && <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: m.color, marginRight: 6, verticalAlign: "middle" }} />}
                              {m.portfolio}
                            </span>
                            <span className="min">
                              {m.name}
                              {m.stance && m.stance !== "—" && <span className="stance">{m.stance}</span>}
                            </span>
                            <span className="risk"></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Hitos del año */}
                {detail.milestones && detail.milestones.length > 0 && (
                  <div className="cd-card span-2">
                    <div className="cd-card-h">
                      <span>Hitos del año · {year}</span>
                      <span className="mono" style={{ color: "var(--good)" }}>● datos reales</span>
                    </div>
                    <ul className="milestones-list">
                      {detail.milestones.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contexto macro — solo métricas reales */}
                {(detail.contextReal.gdp || detail.contextReal.poverty || detail.contextReal.homicide || detail.contextReal.inflation) && (
                  <div className="cd-card span-2">
                    <div className="cd-card-h">
                      <span>Contexto macro · {year}</span>
                      <span style={{ fontSize: 9, color: "var(--good)" }}>DATOS REALES</span>
                    </div>
                    <div className="ctx-grid">
                      {detail.contextReal.inflation && (
                        <div className="ctx-cell">
                          <div className="lb">Inflación anual</div>
                          <div className="vl">{detail.context.inflation}<span className="un">%</span></div>
                        </div>
                      )}
                      {detail.contextReal.gdp && (
                        <div className="ctx-cell">
                          <div className="lb">Crecimiento PIB</div>
                          <div className="vl">{detail.context.gdp}<span className="un">%</span></div>
                        </div>
                      )}
                      {detail.contextReal.poverty && (
                        <div className="ctx-cell">
                          <div className="lb">Pobreza</div>
                          <div className="vl">{detail.context.poverty}<span className="un">%</span></div>
                        </div>
                      )}
                      {detail.contextReal.homicide && (
                        <div className="ctx-cell">
                          <div className="lb">Homicidios c/100k</div>
                          <div className="vl">{detail.context.homicide}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tendencia */}
                <div className="cd-card">
                  <div className="cd-card-h">
                    <span>Evolución del índice</span>
                    <span className="mono" style={{ color: c.scores[YEAR_LATEST] > c.scores[YEAR_FIRST] ? "var(--bad)" : "var(--good)" }}>
                      {c.scores[YEAR_LATEST] > c.scores[YEAR_FIRST] ? "▲" : "▼"} {Math.abs(c.scores[YEAR_LATEST] - c.scores[YEAR_FIRST]).toFixed(1)} pts {YEAR_FIRST}→{YEAR_LATEST}
                    </span>
                  </div>
                  <Sparkline country={c} year={year} onYearChange={setYear} />
                  <div style={{ height: 8, marginTop: 14, background: "var(--palette-gradient)", borderRadius: 2, position: "relative" }}>
                    <div style={{ position: "absolute", left: `${c.scores[year]}%`, top: -4, width: 2, height: 16, background: "var(--text)", transform: "translateX(-50%)" }}></div>
                  </div>
                </div>

                {/* Indicadores — solo si son reales (proxy calculado) */}
                {detail.realIndicators && detail.indicators.length > 0 && (
                  <div className="cd-card">
                    <div className="cd-card-h">
                      <span>Indicadores asociados</span>
                      <span style={{ fontSize: 9, color: "var(--good)" }}>DATOS REALES (proxy)</span>
                    </div>
                    <div className="ctx-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      {detail.indicators.map((ind, i) => (
                        <div key={i} className="ctx-cell">
                          <div className="lb">{ind.label}</div>
                          <div className="vl">{ind.value}<span className="un">{ind.unit}</span></div>
                        </div>
                      ))}
                    </div>
                    {detail.indicatorsSource && (
                      <div style={{ fontSize: 9.5, color: "var(--text-3)", marginTop: 8, lineHeight: 1.4 }}>
                        {detail.indicatorsSource}
                      </div>
                    )}
                  </div>
                )}

                <div className="cd-card span-2" style={{ background: "var(--bg-2)", borderStyle: "dashed" }}>
                  <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--text)" }}>Fuentes:</strong> presidente/líder,
                    aprobación de gobierno, pobreza, homicidios y crecimiento del PIB son
                    <span className="mono" style={{ color: "var(--good)" }}> datos reales</span>{" "}
                    (Banco Mundial, Cadem/Gallup/Executive Approval, DPI 2023). Gabinete:
                    titulares reales por cartera (CIA World Leaders), color = postura del
                    gobierno. Indicadores judiciales: proxy comparativo calculado, no cifra
                    oficial. Hitos: generados desde los datos reales del país-año.
                    {detail.gdpComment ? ` PIB: ${detail.gdpComment}.` : ""}{" "}
                    Solo se muestran bloques con dato respaldado. Ver Metodología.
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
            label="Vista"
            value={tweaks.projection === "orthographic" ? "orthographic" : "leaflet"}
            onChange={(v) => setTweak("projection", v)}
            options={[
              { value: "leaflet", label: "Mapa" },
              { value: "orthographic", label: "Globo 3D" },
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

      {/* Chatbot flotante — aislado en error boundary para no afectar el mapa */}
      {window.AletheiaChat && (
        <ChatErrorBoundary>
          <window.AletheiaChat selectedCountry={
            countryFocus ? (window.COUNTRIES || []).find(c => c.id === countryFocus || c.id === String(countryFocus)) || null : null
          } />
        </ChatErrorBoundary>
      )}
    </>
  );
}

// ── Onboarding ───────────────────────────────────────────────
// type:'modal' → tarjeta centrada. type:'spotlight' → recorta hueco sobre el elemento real.
// event: CustomEvent que App escucha para ajustar su estado antes de mostrar el paso.
// delay: ms a esperar después de disparar el event (animaciones).
const TOUR_STEPS = [
  {
    type: "modal",
    icon: "◆",
    iconStyle: { fontSize: "28px", color: "#e6b840", fontStyle: "normal" },
    title: "¿Qué es Aletheia?",
    desc: "Aletheia es una plataforma de inteligencia cívica global. Visualiza y compara el Índice de Percepción de Corrupción (CPI) de países de todo el mundo, con datos reales: líderes, gabinetes, indicadores económicos y judiciales.",
    isSummary: true,
  },
  {
    type: "modal",
    icon: "🌍",
    title: "El mapa interactivo",
    desc: "Cada país tiene un color según su puntaje CPI. Verde = más transparente, rojo = mayor corrupción percibida. Gira el globo, haz zoom y explora cada país.",
  },
  {
    type: "spotlight",
    selector: '[data-tour="globe"]',
    tooltipPos: "right",
    title: "🗺️  El mapa — inténtalo",
    desc: "Haz zoom con la rueda del mouse o los botones +/−. Arrastra para moverte por el mapa. Haz clic sobre cualquier país para ver su información detallada.",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="panel-btn"]',
    tooltipPos: "left",
    title: "Abre el panel",
    desc: "Haz clic en el botón «Panel» para ver el ranking y los detalles de cada país.",
    actionHint: "Toca el botón resaltado ↗",
  },
  {
    type: "spotlight",
    selector: '[data-tour="ranking"]',
    tooltipPos: "right",
    delay: 400,
    title: "📊  Panel de análisis",
    desc: "Aquí encontrarás todo: el ranking completo de países, el Top 10 más corruptos y los más limpios, filtros por rango de puntuación, promedio regional y la opción de comparar dos países.",
  },
  {
    type: "spotlight",
    selector: '[data-tour="country-ficha"]',
    tooltipPos: "left",
    delay: 200,
    title: "🌐  Noticias mundiales",
    desc: "Cuando no hay país seleccionado, el panel muestra noticias internacionales recientes sobre corrupción, política y gobernanza global.",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="globe"]',
    tooltipPos: "right",
    actionEvent: "aletheia:tour:country-selected",
    title: "🗺️  Elige un país",
    desc: "Haz clic sobre cualquier país del mapa para explorar su información detallada.",
    actionHint: "Toca cualquier país del mapa ↓",
  },
  {
    type: "spotlight",
    selector: '[data-tour="country-focus"]',
    tooltipPos: "left",
    delay: 450,
    title: "🗂️  Ficha de país",
    desc: "Puntaje CPI, posición global, evolución histórica y comparación con otro país. Usa el botón «Comparar» para contrastar con cualquier otro.",
  },
  {
    type: "spotlight",
    selector: '[data-tour="cf-foro-btn"]',
    tooltipPos: "top",
    delay: 200,
    title: "💬  Foro del país",
    desc: "Cada país tiene su propio espacio de debate ciudadano. Lo exploraremos en detalle más adelante.",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="expand-btn"]',
    tooltipPos: "top",
    actionEvent: "aletheia:tour:dashboard-opened",
    title: "📋  Expande la ficha completa",
    desc: "Haz clic en «Expandir ficha» para ver el perfil detallado: presidente, gabinete ministerial, indicadores económicos e hitos históricos del país.",
    actionHint: "Toca «Expandir ficha» ↓",
  },
  {
    type: "spotlight",
    selector: '[data-tour="ficha-dashboard"]',
    tooltipPos: "left",
    delay: 350,
    title: "📊  Perfil completo del país",
    desc: "Aquí encuentras todo: el presidente y su período, el gabinete de ministros, indicadores macro (deuda, desempleo, inflación) y los hitos políticos más relevantes del año.",
  },
  {
    type: "spotlight",
    selector: '[data-tour="news"]',
    tooltipPos: "right",
    event: "aletheia:tour:go-fullscreen",
    delay: 480,
    title: "📰  Noticias del país",
    desc: "Panel de noticias del país seleccionado, clasificadas en Corrupción, Política y Gobierno. Puedes abrir un hilo de debate en el foro desde cualquier noticia.",
  },
  {
    type: "modal",
    icon: "⚙️",
    title: "Personaliza tu vista",
    desc: "Cerramos la ficha del país. Ahora exploraremos las opciones del mapa: paletas de color, tamaño de etiquetas, tema de interfaz y el modo Globo 3D.",
    event: "aletheia:tour:reset-view",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="settings-btn"]',
    tooltipPos: "right",
    actionEvent: "aletheia:tour:settings-opened",
    title: "⚙️  Abre la configuración",
    desc: "Haz clic en el engranaje del mapa para abrir las opciones de personalización.",
    actionHint: "Toca el engranaje ↓",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="settings-palette"]',
    tooltipPos: "right",
    actionEvent: "aletheia:tour:palette-changed",
    delay: 300,
    title: "🎨  Paleta de colores",
    desc: "Cada paleta resalta distintos rangos del índice CPI. Prueba haciendo clic en cualquiera para ver el cambio en el mapa.",
    actionHint: "Toca una paleta ↓",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="settings-textsize"]',
    tooltipPos: "right",
    actionEvent: "aletheia:tour:labelscale-changed",
    title: "🔤  Tamaño de etiquetas",
    desc: "Ajusta el tamaño de las etiquetas de países sobre el mapa. Toca cualquier opción para probarla.",
    actionHint: "Toca un tamaño ↓",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="settings-theme"]',
    tooltipPos: "right",
    actionEvent: "aletheia:tour:theme-changed",
    title: "🌙  Tema de la interfaz",
    desc: "Cambia entre tema oscuro, claro o corporativo. El cambio aplica a toda la interfaz.",
    actionHint: "Toca un tema ↓",
  },
  {
    type: "spotlight-action",
    selector: '[data-tour="settings-globe"]',
    tooltipPos: "right",
    actionEvent: "aletheia:tour:globe-selected",
    title: "🌍  Vista Globo 3D",
    desc: "Activa el modo globo tridimensional. Arrastra para rotar el planeta y usa la rueda para hacer zoom sobre cualquier región.",
    actionHint: "Toca «Globo» ↓",
  },
  {
    type: "spotlight",
    selector: '[data-tour="forum-btn"]',
    tooltipPos: "bottom",
    title: "💬  Foro ciudadano",
    desc: "Hilo de debate por país. Lee, comenta y discute con otros usuarios sobre los datos, noticias y eventos de cada nación.",
  },
  {
    type: "spotlight",
    selector: '[data-tour="chatbot"]',
    tooltipPos: "bottom",
    title: "🦉  Aletheia IA",
    desc: "Asistente con acceso a todos los datos de la plataforma. Pregúntale por rankings, comparativas, evolución histórica o contexto político de cualquier país.",
  },
];

function isElVisible(el) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  return r.width > 10 && r.height > 10
    && r.left < vw && r.right > 0
    && r.top  < vh && r.bottom > 0;
}

function useTourRect(selector, step, delay) {
  const [rect, setRect] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    setRect(null);
    if (!selector) { setReady(true); return; }

    const capture = () => {
      const el = document.querySelector(selector);
      if (isElVisible(el)) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height, right: r.right, bottom: r.bottom });
        setReady(true);
        return true;
      }
      return false;
    };

    // Wait delay ms (for event-triggered state changes) then start polling
    let pollId, timeoutId;
    const start = () => {
      if (!capture()) {
        pollId = setInterval(() => { if (capture()) clearInterval(pollId); }, 100);
        timeoutId = setTimeout(() => { clearInterval(pollId); setReady(true); }, 2500);
      }
    };
    const waitId = delay ? setTimeout(start, delay) : (start(), null);
    return () => { clearTimeout(waitId); clearInterval(pollId); clearTimeout(timeoutId); };
  }, [selector, step, delay]);

  useEffect(() => {
    if (!rect || !selector) return;
    const update = () => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height, right: r.right, bottom: r.bottom });
      }
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selector, rect]);

  return { rect, ready };
}

function TourTooltip({ step: s, stepIdx, totalSteps, animKey, onPrev, onNext, onSkip, style }) {
  const isLast = stepIdx === totalSteps - 1;
  return (
    <div className="ob-tooltip" style={style}>
      <div className="ob-tooltip-header">
        <div className="ob-tour-dots">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`ob-tour-dot${i === stepIdx ? " active" : ""}`} />
          ))}
        </div>
        <button className="ob-tour-skip" onClick={onSkip}>Saltar</button>
      </div>
      <div key={animKey} className="ob-step-enter">
        <div className="ob-tooltip-title">{s.title}</div>
        <div className="ob-tooltip-desc">{s.desc}</div>
      </div>
      <div className="ob-tour-nav">
        {stepIdx > 0 && (
          <button className="ob-btn-secondary" onClick={onPrev}>Anterior</button>
        )}
        <button className={`ob-btn-primary${isLast ? " done" : ""}`} onClick={onNext}>
          {isLast ? "¡Listo!" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}

function computeTooltipPos(rect, preferredPos) {
  const PAD = 12, GAP = 16, TW = 300, TH_EST = 230;
  const vw = window.innerWidth, vh = window.innerHeight;
  const cl = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const spaceRight  = vw - rect.right  - PAD;
  const spaceLeft   = rect.left - PAD;
  const spaceBottom = vh - rect.bottom - PAD;
  const spaceTop    = rect.top  - PAD;

  // Center-of-viewport fallback used when element fills the screen
  const centerStyle = { position:"fixed", zIndex:10001,
    left: cl(vw / 2 - TW / 2, 12, vw - TW - 12),
    top:  cl(vh / 2 - TH_EST / 2, 12, vh - TH_EST - 12),
    width: cl(TW, 200, vw - 24),
  };

  const sides = [
    { key: "right",  ok: spaceRight  >= TW + GAP },
    { key: "left",   ok: spaceLeft   >= TW + GAP },
    { key: "bottom", ok: spaceBottom >= TH_EST + GAP },
    { key: "top",    ok: spaceTop    >= TH_EST + GAP },
  ];

  // Try preferred first, then each side in order, then center
  const order = [preferredPos, "right", "left", "bottom", "top"];
  const pos = order.find(p => sides.find(s => s.key === p)?.ok) || null;
  if (!pos) return centerStyle;

  const midX = rect.left + rect.width  / 2;
  const midY = rect.top  + rect.height / 2;

  switch (pos) {
    case "right": return { position:"fixed", zIndex:10001,
      left: cl(rect.right + PAD + GAP, 12, vw - TW - 12),
      top:  cl(midY - TH_EST / 2, 12, vh - TH_EST - 12),
      width: cl(TW, 200, vw - 24),
    };
    case "left": return { position:"fixed", zIndex:10001,
      left: cl(rect.left - PAD - GAP - TW, 12, vw - TW - 12),
      top:  cl(midY - TH_EST / 2, 12, vh - TH_EST - 12),
      width: cl(TW, 200, vw - 24),
    };
    case "bottom": return { position:"fixed", zIndex:10001,
      left: cl(midX - TW / 2, 12, vw - TW - 12),
      top:  cl(rect.bottom + PAD + GAP, 12, vh - TH_EST - 12),
      width: cl(TW, 200, vw - 24),
    };
    case "top": return { position:"fixed", zIndex:10001,
      left:   cl(midX - TW / 2, 12, vw - TW - 12),
      top:    cl(rect.top - PAD - GAP - TH_EST, 12, vh - TH_EST - 12),
      width:  cl(TW, 200, vw - 24),
    };
    default: return centerStyle;
  }
}

function TourOverlay({ onDone }) {
  const [step, setStep]     = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const eventFiredRef = useRef(-1);

  const s = TOUR_STEPS[step];

  // Fire event before polling for spotlight
  useEffect(() => {
    if (eventFiredRef.current === step) return;
    eventFiredRef.current = step;
    if (s.event) {
      window.dispatchEvent(new CustomEvent(s.event));
    }
  }, [step, s.event]);

  // spotlight-action: auto-advance when App fires the action event
  useEffect(() => {
    if (s.type !== "spotlight-action") return;
    const evName = s.actionEvent || "aletheia:tour:action-done";
    const handler = () => go(step + 1);
    window.addEventListener(evName, handler);
    return () => window.removeEventListener(evName, handler);
  }, [step, s.type, s.actionEvent]);

  const isMobileView = window.innerWidth < 760;
  const isAction = s.type === "spotlight-action";

  const { rect, ready } = useTourRect(
    ((s.type === "spotlight" || isAction) && !isMobileView) ? s.selector : null,
    step,
    s.delay || 0
  );

  const go = (next) => {
    setAnimKey(k => k + 1);
    if (next >= TOUR_STEPS.length) { onDone(); return; }
    setStep(next);
  };

  const isLast = step === TOUR_STEPS.length - 1;
  const PAD    = 12;

  // Modal mode: type:'modal', mobile, or element not found after polling
  if (s.type === "modal" || isMobileView || (ready && !rect)) {
    return (
      <div className="ob-backdrop">
        <div className="ob-card">
          <div className="ob-tour-header">
            <div className="ob-tour-dots">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`ob-tour-dot${i === step ? " active" : ""}`} />
              ))}
            </div>
            <button className="ob-tour-skip" onClick={onDone}>Saltar</button>
          </div>
          <div key={animKey} className="ob-step-enter">
            {s.icon && (
              <div className={`ob-tour-icon${s.isSummary ? " ob-tour-icon--summary" : ""}`}
                   style={s.iconStyle || {}}>
                {s.icon}
              </div>
            )}
            <div className={`ob-tour-title${s.isSummary ? " ob-tour-title--summary" : ""}`}>{s.title}</div>
            <div className={`ob-tour-desc${s.isSummary ? " ob-tour-desc--summary" : ""}`}>{s.desc}</div>
          </div>
          <div className="ob-tour-nav">
            {step > 0 && (
              <button className="ob-btn-secondary" onClick={() => go(step - 1)}>Anterior</button>
            )}
            <button className={`ob-btn-primary${isLast ? " done" : ""}`} onClick={() => go(step + 1)}>
              {isLast ? "¡Listo, explorar!" : step === 0 ? "Ver funciones →" : "Siguiente →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Polling — show a minimal centered card while waiting for element
  if (!ready) {
    return (
      <div className="ob-backdrop">
        <div className="ob-card" style={{ textAlign:"center", padding:"32px 28px" }}>
          <div className="ob-tour-dots" style={{ justifyContent:"center", marginBottom:20 }}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} className={`ob-tour-dot${i === step ? " active" : ""}`} />
            ))}
          </div>
          <div className="ob-tour-icon">{s.icon || "⏳"}</div>
          <div className="ob-tour-title" style={{ marginTop:12 }}>{s.title}</div>
          <div className="ob-tour-desc">{s.desc}</div>
        </div>
      </div>
    );
  }

  // Spotlight mode
  const spotStyle = {
    position: "fixed",
    top:    rect.top    - PAD,
    left:   rect.left   - PAD,
    width:  rect.width  + PAD * 2,
    height: rect.height + PAD * 2,
    borderRadius: 12,
    boxShadow: "0 0 0 9999px rgba(8,6,16,0.80)",
    // spotlight-action: let clicks pass through to the highlighted button
    border: isAction ? "2.5px solid rgba(230,184,64,0.9)" : "2px solid rgba(230,184,64,0.6)",
    zIndex: 10000,
    pointerEvents: "none",
    transition: "top .32s ease,left .32s ease,width .32s ease,height .32s ease",
    // Pulse animation for action steps to draw attention
    animation: isAction ? "ob-pulse 1.4s ease-in-out infinite" : "none",
  };

  const tooltipStyle = computeTooltipPos(rect, s.tooltipPos || "left");

  // spotlight-action tooltip: no Siguiente, just instruction + skip
  if (isAction) {
    return (
      <>
        <div style={spotStyle} />
        <div className="ob-tooltip" style={tooltipStyle}>
          <div className="ob-tooltip-header">
            <div className="ob-tour-dots">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`ob-tour-dot${i === step ? " active" : ""}`} />
              ))}
            </div>
            <button className="ob-tour-skip" onClick={onDone}>Saltar</button>
          </div>
          <div key={animKey} className="ob-step-enter">
            <div className="ob-tooltip-title">{s.title}</div>
            <div className="ob-tooltip-desc">{s.desc}</div>
            {s.actionHint && (
              <div className="ob-action-hint">{s.actionHint}</div>
            )}
          </div>
          <button className="ob-btn-secondary" style={{ width:"100%", marginTop:4 }}
            onClick={() => { window.dispatchEvent(new CustomEvent("aletheia:tour:open-panel")); go(step + 1); }}>
            Abrir panel y continuar →
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={spotStyle} />
      <TourTooltip
        step={s}
        stepIdx={step}
        totalSteps={TOUR_STEPS.length}
        animKey={animKey}
        onPrev={() => go(step - 1)}
        onNext={() => go(step + 1)}
        onSkip={onDone}
        style={tooltipStyle}
      />
    </>
  );
}

function WelcomeModal({ user, onClose }) {
  const [showTour, setShowTour] = useState(false);

  const markDone = () => {
    try { localStorage.setItem("aletheia.onboarded", "1"); } catch (_) {}
    onClose();
  };

  if (showTour) return <TourOverlay onDone={markDone} />;

  return (
    <div className="ob-backdrop">
      <div className="ob-card">
        <div className="ob-owl">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="38" rx="20" ry="18" fill="rgba(230,184,64,0.12)" stroke="rgba(230,184,64,0.35)" strokeWidth="1.5"/>
            <ellipse cx="24" cy="26" rx="9" ry="11" fill="#1d1a2d" stroke="rgba(230,184,64,0.4)" strokeWidth="1.5"/>
            <ellipse cx="40" cy="26" rx="9" ry="11" fill="#1d1a2d" stroke="rgba(230,184,64,0.4)" strokeWidth="1.5"/>
            <circle cx="24" cy="26" r="5" fill="#e6b840" opacity="0.9"/>
            <circle cx="40" cy="26" r="5" fill="#e6b840" opacity="0.9"/>
            <circle cx="24" cy="26" r="2.5" fill="#12100e"/>
            <circle cx="40" cy="26" r="2.5" fill="#12100e"/>
            <circle cx="24.8" cy="25.2" r="1" fill="white" opacity="0.7"/>
            <circle cx="40.8" cy="25.2" r="1" fill="white" opacity="0.7"/>
            <path d="M29 35 Q32 38 35 35" stroke="rgba(230,184,64,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M20 18 L24 22 L28 18" stroke="rgba(230,184,64,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M36 18 L40 22 L44 18" stroke="rgba(230,184,64,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <ellipse cx="32" cy="52" rx="14" ry="6" fill="rgba(230,184,64,0.06)" stroke="rgba(230,184,64,0.15)" strokeWidth="1"/>
          </svg>
        </div>
        <div className="ob-title">
          Bienvenido a <span>Aletheia</span>
          {user?.name && user.kind !== "guest" ? `, ${user.name.split(" ")[0]}` : ""}
        </div>
        <div className="ob-desc">
          Plataforma de inteligencia cívica para América Latina. Datos reales de corrupción, presidentes, gabinetes e indicadores.<br/><br/>
          ¿Quieres una introducción rápida?
        </div>
        <div className="ob-actions">
          <button className="ob-btn-primary" onClick={() => setShowTour(true)}>
            Sí, muéstrame cómo funciona →
          </button>
          <button className="ob-btn-secondary" onClick={markDone}>
            Explorar por mi cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

function shouldShowWelcome(user) {
  if (!user) return false;
  if (user.kind === "guest") return true;
  try { return !localStorage.getItem("aletheia.onboarded"); } catch (_) { return true; }
}

function Root() {
  const [authUser, setAuthUser] = useState(() => window.AuthAPI?.current() || null);
  // Show welcome for: any guest (always), registered user who hasn't seen it,
  // AND for existing sessions already loaded on page refresh.
  const [showWelcome, setShowWelcome] = useState(() => shouldShowWelcome(window.AuthAPI?.current()));

  const handleAuth = useCallback((user) => {
    setAuthUser(user);
    setShowWelcome(shouldShowWelcome(user));
  }, []);

  if (!authUser) {
    return <window.AuthScreen onAuth={handleAuth} />;
  }
  const handleLogout = () => {
    window.AuthAPI.logout();
    setAuthUser(null);
    setShowWelcome(false);
  };
  return (
    <>
      <App user={authUser} onLogout={handleLogout} onOpenHelp={() => setShowWelcome(true)} />
      {showWelcome && (
        <WelcomeModal user={authUser} onClose={() => setShowWelcome(false)} />
      )}
    </>
  );
}

root.render(<Root />);
