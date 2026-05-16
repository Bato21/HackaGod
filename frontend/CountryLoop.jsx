// CountryLoop — horizontal scrolling country silhouettes strip
// Uses SVG paths from country data. Click a silhouette → opens forum/news.

function CountryLoop({ countries, year, onSelect, onForumOpen }) {
  const wrapRef      = React.useRef(null);
  const trackRef     = React.useRef(null);
  const innerRef     = React.useRef(null);
  const [hovered, setHovered] = React.useState(null);
  const [tooltip, setTooltip] = React.useState(null);

  // User drag-scroll
  React.useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    let isDragging = false, startX = 0, scrollLeft = 0;

    function onDown(e) {
      isDragging = true;
      startX = e.pageX - inner.offsetLeft;
      scrollLeft = inner.scrollLeft || 0;
      inner.style.animationPlayState = 'paused';
      inner.style.cursor = 'grabbing';
    }
    function onMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const x    = e.pageX - inner.offsetLeft;
      const walk = (x - startX) * 1.5;
      inner.scrollLeft = scrollLeft - walk;
    }
    function onUp() {
      isDragging = false;
      inner.style.cursor = 'grab';
      inner.style.animationPlayState = 'running';
    }

    inner.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      inner.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Simple equirectangular projection to SVG path
  function geoToPath(geometry, w, h) {
    if (!geometry) return '';
    const rings = geometry.type === 'Polygon'
      ? geometry.coordinates
      : geometry.type === 'MultiPolygon'
        ? geometry.coordinates.flat()
        : [];

    // Find bounding box of all coordinates
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    rings.forEach(ring => ring.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }));

    const lngSpan = maxLng - minLng || 1;
    const latSpan = maxLat - minLat || 1;
    const scale   = Math.min(w / lngSpan, h / latSpan) * 0.85;
    const offX    = (w - lngSpan * scale) / 2;
    const offY    = (h - latSpan * scale) / 2;

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

  // Build items: countries with geometry
  const items = React.useMemo(() => {
    if (!countries || !countries.length) return [];
    return countries
      .filter(c => c.geometry && c.scores && c.scores[year] != null)
      .slice(0, 24);
  }, [countries, year]);

  // Double the list for seamless loop
  const doubled = [...items, ...items];

  // Score → color
  function scoreColor(score) {
    if (score == null) return '#302c42';
    if (score < 25)  return '#4aad88';
    if (score < 50)  return '#e6b840';
    if (score < 75)  return '#d4822e';
    return '#c94545';
  }

  if (!items.length) return null;

  return (
    <div className="cloop-outer" ref={wrapRef}>
      <div className="cloop-label">
        <span className="cloop-diamond">◆</span>
        PAÍSES DEL ÍNDICE · {year}
      </div>

      <div className="cloop-track" ref={trackRef}>
        <div className="cloop-inner" ref={innerRef} style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          {doubled.map((c, idx) => {
            const score = c.scores?.[year];
            const color = scoreColor(score);
            const isHov = hovered === c.id + '-' + idx;

            return (
              <div
                key={c.id + '-' + idx}
                className={`cloop-item${isHov ? ' hov' : ''}`}
                onMouseEnter={e => {
                  setHovered(c.id + '-' + idx);
                  setTooltip({ name: c.name, score, x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                onMouseMove={e => {
                  if (tooltip) setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
                }}
                onClick={() => {
                  onSelect && onSelect(c.id);
                }}
              >
                <svg
                  viewBox="0 0 60 60"
                  width={60}
                  height={60}
                  style={{ overflow: 'visible' }}
                >
                  <path
                    d={geoToPath(c.geometry, 60, 60)}
                    fill={isHov ? color : 'rgba(255,255,255,0.15)'}
                    stroke={color}
                    strokeWidth={isHov ? 1.5 : 0.8}
                    style={{ transition: 'fill .25s, stroke-width .25s' }}
                  />
                </svg>
                <div className="cloop-iso">{c.iso3}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="cloop-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y - 48, position: 'fixed' }}
        >
          <div className="clt-name">{tooltip.name}</div>
          <div className="clt-score" style={{ color: scoreColor(tooltip.score) }}>
            {tooltip.score?.toFixed(1)} <span className="clt-of">/100</span>
          </div>
          <div className="clt-hint">Clic para abrir ficha →</div>
        </div>
      )}
    </div>
  );
}

window.CountryLoop = CountryLoop;
