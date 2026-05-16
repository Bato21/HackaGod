// AnimSplitText — vanilla React GSAP text animation (no bundler, no imports)
// Depends on: window.gsap (loaded via CDN before this file)

function AnimSplitText({
  text,
  className = '',
  stagger = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  animDelay = 0,
  tag = 'p',
  textAlign = 'left',
  onComplete,
}) {
  const ref = React.useRef(null);
  const doneRef = React.useRef(false);
  const cbRef = React.useRef(onComplete);
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => { cbRef.current = onComplete; }, [onComplete]);

  React.useEffect(() => {
    if (document.fonts && document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    const gsap = window.gsap;
    if (!ref.current || !fontsLoaded || !gsap || doneRef.current) return;
    const el = ref.current;
    const targets = Array.from(el.querySelectorAll('.sa-unit'));
    if (!targets.length) return;

    const tween = gsap.fromTo(
      targets,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: stagger / 1000,
        delay: animDelay,
        force3D: true,
        onComplete: () => {
          doneRef.current = true;
          cbRef.current && cbRef.current();
        },
      }
    );
    return () => tween.kill();
  }, [fontsLoaded]);

  const units = React.useMemo(() => {
    const words = text.split(' ');
    if (splitType === 'chars') {
      const result = [];
      words.forEach((word, wi) => {
        if (wi > 0) {
          result.push(
            React.createElement('span', {
              key: 'sp' + wi,
              style: { display: 'inline-block', width: '0.28em' },
            }, ' ')
          );
        }
        word.split('').forEach((ch, ci) => {
          result.push(
            React.createElement('span', {
              key: wi + '-' + ci,
              className: 'sa-unit',
            }, ch)
          );
        });
      });
      return result;
    }
    // words
    return words.map((word, i) => {
      const els = [];
      if (i > 0) {
        els.push(
          React.createElement('span', {
            key: 'sp' + i,
            style: { display: 'inline-block', width: '0.28em' },
          }, ' ')
        );
      }
      els.push(
        React.createElement('span', {
          key: 'w' + i,
          className: 'sa-unit',
        }, word)
      );
      return els;
    });
  }, [text, splitType]);

  return React.createElement(
    tag,
    {
      ref,
      className: 'sa-parent ' + className,
      style: { textAlign, display: 'block' },
    },
    units
  );
}

window.AnimSplitText = AnimSplitText;
