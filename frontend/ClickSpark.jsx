// ClickSpark — canvas-based spark burst on every click
// No external deps. Wraps children with a canvas overlay.

function ClickSpark({
  sparkColor   = '#e6b840',
  sparkSize    = 12,
  sparkRadius  = 22,
  sparkCount   = 8,
  duration     = 480,
  easing       = 'ease-out',
  extraScale   = 1.0,
  children,
}) {
  const canvasRef   = React.useRef(null);
  const sparksRef   = React.useRef([]);

  // Resize canvas to match parent
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    let t;
    const resize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const { width, height } = parent.getBoundingClientRect();
        canvas.width  = width;
        canvas.height = height;
      }, 60);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);

  // Easing
  const ease = React.useCallback(t => {
    switch (easing) {
      case 'linear':      return t;
      case 'ease-in':     return t * t;
      case 'ease-in-out': return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
      default:            return t * (2 - t);
    }
  }, [easing]);

  // Render loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function draw(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter(spark => {
        const elapsed  = ts - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const eased    = ease(progress);
        const dist     = eased * sparkRadius * extraScale;
        const len      = sparkSize * (1 - eased);
        const alpha    = 1 - eased;

        const x1 = spark.x + dist * Math.cos(spark.angle);
        const y1 = spark.y + dist * Math.sin(spark.angle);
        const x2 = spark.x + (dist + len) * Math.cos(spark.angle);
        const y2 = spark.y + (dist + len) * Math.sin(spark.angle);

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth   = 2;
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, ease, extraScale]);

  function handleClick(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x, y,
      angle:     (2 * Math.PI * i) / sparkCount,
      startTime: now,
    }));
    sparksRef.current.push(...newSparks);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} onClick={handleClick}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      {children}
    </div>
  );
}

window.ClickSpark = ClickSpark;
