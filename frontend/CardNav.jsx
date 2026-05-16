// CardNav — floating centered navigation with GSAP expand
// GSAP is pre-loaded via CDN in index.html

function CardNav({ onForumOpen, onNotesOpen, authUser }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const navRef              = React.useRef(null);
  const cardsRef            = React.useRef([]);
  const tlRef               = React.useRef(null);

  const ITEMS = [
    {
      label: "Foro",
      bgColor: "#1d1a2d",
      accent: "#e6b840",
      icon: "◈",
      links: [
        { label: "Ver conversaciones", action: () => { onForumOpen && onForumOpen({}); close(); } },
        { label: "Nuevo hilo",         action: () => { onForumOpen && onForumOpen({ newThread: true }); close(); } },
      ]
    },
    {
      label: "Metodología",
      bgColor: "#141828",
      accent: "#7db3d2",
      icon: "◉",
      links: [
        { label: "El índice IEA",    action: () => { onNotesOpen && onNotesOpen(); close(); } },
        { label: "Sobre los datos",  action: () => { onNotesOpen && onNotesOpen(); close(); } },
      ]
    },
    {
      label: "Comparar",
      bgColor: "#141e1a",
      accent: "#4aad88",
      icon: "◐",
      links: [
        { label: "Seleccionar países", action: () => close() },
        { label: "Evolución temporal", action: () => close() },
      ]
    }
  ];

  React.useLayoutEffect(() => {
    const navEl = navRef.current;
    if (!navEl || typeof gsap === 'undefined') return;

    gsap.set(navEl, { height: 44, overflow: 'hidden' });
    gsap.set(cardsRef.current.filter(Boolean), { y: 36, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: 218, duration: 0.38, ease: 'power3.out' });
    tl.to(cardsRef.current.filter(Boolean), {
      y: 0, opacity: 1, duration: 0.30, ease: 'power3.out', stagger: 0.07
    }, '-=0.16');

    tlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  function open()  { setIsOpen(true);  tlRef.current?.play(0); }
  function close() {
    setIsOpen(false);
    if (tlRef.current) {
      tlRef.current.reverse();
    }
  }
  function toggle() { isOpen ? close() : open(); }

  // Esc + click outside
  React.useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && isOpen) close(); }
    function onDown(e) {
      if (isOpen && navRef.current && !navRef.current.contains(e.target)) close();
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [isOpen]);

  return (
    <div className="cn-wrapper">
      <div ref={navRef} className={`cn-nav${isOpen ? ' open' : ''}`}>

        {/* Top bar */}
        <div className="cn-top">
          <button
            className={`cn-hamburger${isOpen ? ' open' : ''}`}
            onClick={toggle}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir navegación'}
          >
            <span className="cn-line" />
            <span className="cn-line" />
          </button>

          <div className="cn-center-label">
            <span className="cn-diamond">◆</span>
            <span className="cn-nav-text">Navegar</span>
          </div>

          <kbd className="cn-kbd">ESC</kbd>
        </div>

        {/* Cards */}
        <div className="cn-cards" aria-hidden={!isOpen}>
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="cn-card"
              ref={el => { if (el) cardsRef.current[i] = el; }}
              style={{ backgroundColor: item.bgColor, borderTop: `2px solid ${item.accent}` }}
            >
              <div className="cn-card-label" style={{ color: item.accent }}>
                <span className="cn-card-icon">{item.icon}</span>
                {item.label}
              </div>
              <div className="cn-card-links">
                {item.links.map((lnk, j) => (
                  <button key={j} className="cn-card-link" onClick={lnk.action}>
                    <span className="cn-arrow">↗</span>
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

window.CardNav = CardNav;
