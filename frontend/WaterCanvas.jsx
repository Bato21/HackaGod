// WaterCanvas — cursor ripple trail over non-country (water) areas on the map
// Sits as an absolute overlay above Leaflet, pointer-events: none
// Emits a ripple ring at the cursor position while over water

function WaterCanvas({ isOverCountry }) {
  const canvasRef  = React.useRef(null);
  const ripplesRef = React.useRef([]);
  const posRef     = React.useRef({ x: -999, y: -999, over: false });
  const frameRef   = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      canvas.width  = width;
      canvas.height = height;
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();
    return () => ro.disconnect();
  }, []);

  // Spawn ripples at cursor position when over water
  React.useEffect(() => {
    let interval;

    function spawnRipple() {
      const { x, y, over } = posRef.current;
      if (!over || isOverCountry) return;
      ripplesRef.current.push({
        x, y,
        r: 2,
        maxR: 28 + Math.random() * 16,
        alpha: 0.55,
        startTime: performance.now(),
        duration: 900 + Math.random() * 400,
      });
    }

    interval = setInterval(spawnRipple, 120);
    return () => clearInterval(interval);
  }, [isOverCountry]);

  // Animation loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter(r => {
        const elapsed = ts - r.startTime;
        if (elapsed > r.duration) return false;
        const t = elapsed / r.duration;
        const radius = r.r + (r.maxR - r.r) * t;
        const alpha  = r.alpha * (1 - t);

        const isDark = document.documentElement.getAttribute('data-theme') !== 'corporate'
          && document.documentElement.getAttribute('data-theme') !== 'light';
        const color = isDark
          ? `rgba(125, 179, 210, ${alpha})`
          : `rgba(30, 80, 160, ${alpha * 1.4})`;

        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth   = isDark ? 1.5 : 2;
        ctx.stroke();
        return true;
      });

      // Subtle glowing dot at cursor when over water
      if (posRef.current.over && !isOverCountry) {
        const { x, y } = posRef.current;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
        grad.addColorStop(0, 'rgba(125,179,210,0.25)');
        grad.addColorStop(1, 'rgba(125,179,210,0)');
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [isOverCountry]);

  // Track cursor from the parent map container
  React.useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    function onMove(e) {
      const rect = parent.getBoundingClientRect();
      posRef.current = {
        x:    e.clientX - rect.left,
        y:    e.clientY - rect.top,
        over: true,
      };
    }
    function onLeave() { posRef.current = { ...posRef.current, over: false }; }

    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);
    return () => {
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="water-canvas-el"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}

window.WaterCanvas = WaterCanvas;
