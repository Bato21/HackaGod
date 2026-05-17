// PillNav — GSAP pill navigation (adapted from React Bits, no react-router)
// GSAP is pre-loaded via CDN. No imports needed.

function PillNav({
  items,
  activeHref,
  className     = '',
  ease          = 'power3.out',
  baseColor     = '#0e0c13',
  pillColor     = '#1d1a2d',
  hoveredPillTextColor = '#e6b840',
  pillTextColor,
}) {
  const resolvedPillTextColor = pillTextColor ?? '#ede9e0';
  const circleRefs  = React.useRef([]);
  const tlRefs      = React.useRef([]);
  const activeTween = React.useRef([]);

  const layout = React.useCallback(() => {
    circleRefs.current.forEach((circle, index) => {
      if (!circle?.parentElement) return;
      const pill = circle.parentElement;
      const { width: w, height: h } = pill.getBoundingClientRect();
      if (!w || !h) return;
      const R      = ((w * w) / 4 + h * h) / (2 * h);
      const D      = Math.ceil(2 * R) + 2;
      const delta  = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const origY  = D - delta;

      circle.style.width  = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${origY}px` });

      const label = pill.querySelector('.pn-label');
      const hover = pill.querySelector('.pn-label-hover');
      if (label) gsap.set(label, { y: 0 });
      if (hover) gsap.set(hover, { y: h + 12, opacity: 0 });

      tlRefs.current[index]?.kill();
      const tl = gsap.timeline({ paused: true });
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
      if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
      if (hover) {
        gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(hover, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
      }
      tlRefs.current[index] = tl;
    });
  }, [ease]);

  React.useLayoutEffect(() => {
    // Small delay so DOM is rendered
    const t = setTimeout(layout, 60);
    window.addEventListener('resize', layout);
    return () => { clearTimeout(t); window.removeEventListener('resize', layout); };
  }, [items, layout]);

  function handleEnter(i) {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTween.current[i]?.kill();
    activeTween.current[i] = tl.tweenTo(tl.duration(), { duration: 0.28, ease, overwrite: 'auto' });
  }
  function handleLeave(i) {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTween.current[i]?.kill();
    activeTween.current[i] = tl.tweenTo(0, { duration: 0.18, ease, overwrite: 'auto' });
  }

  const cssVars = {
    '--pn-base':  baseColor,
    '--pn-pill':  pillColor,
    '--pn-hover': hoveredPillTextColor,
    '--pn-text':  resolvedPillTextColor,
  };

  return (
    <div className={`pn-wrap ${className}`} style={cssVars}>
      <div className="pn-items">
        <ul className="pn-list" role="menubar">
          {(items || []).map((item, i) => (
            <li key={i} role="none">
              <a
                role="menuitem"
                href={item.href || '#'}
                className={`pn-pill${activeHref === item.href ? ' is-active' : ''}`}
                aria-label={item.ariaLabel || item.label}
                onClick={e => { e.preventDefault(); item.onClick?.(); }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
              >
                <span
                  className="pn-circle"
                  aria-hidden="true"
                  ref={el => { circleRefs.current[i] = el; }}
                />
                <span className="pn-label-stack">
                  <span className="pn-label">{item.label}</span>
                  <span className="pn-label-hover" aria-hidden="true">{item.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

window.PillNav = PillNav;
