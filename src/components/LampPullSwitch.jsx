import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const sizes = (w) => (w < 768 ? { full: 120, compact: 70 } : { full: 205, compact: 100 });

export default function LampPullSwitch({ dark, onToggle }) {
  const wrap = useRef(null);
  const cord = useRef(null);
  const len = useRef({ base: sizes(window.innerWidth).full, pull: 0 });
  const compact = useRef(false);
  const drag = useRef({ active: false, startY: 0 });

  const paint = () => {
    if (cord.current) cord.current.style.height = `${len.current.base + len.current.pull}px`;
  };

  useLayoutEffect(paint, []);

  // Gentle sway.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tween = gsap.to(wrap.current, {
      rotation: 2.2, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 0%',
    });
    return () => tween.kill();
  }, []);

  // Full length at the top of the page, shorter once you scroll away from the hero.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const should = window.scrollY > window.innerHeight * 0.35;
      if (should === compact.current) return;
      compact.current = should;
      const s = sizes(window.innerWidth);
      gsap.to(len.current, {
        base: should ? s.compact : s.full,
        duration: reduce ? 0 : 0.6,
        ease: 'power3.out',
        onUpdate: paint,
        overwrite: 'auto',
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const setPull = (p) => {
    len.current.pull = p;
    paint();
  };

  const down = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current.active = true;
    drag.current.startY = e.clientY;
  };
  const move = (e) => {
    if (!drag.current.active) return;
    setPull(Math.max(0, Math.min(60, e.clientY - drag.current.startY)));
  };
  const up = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const { pull } = len.current;
    if (pull > 25 || pull < 5) onToggle(); // pulled, or just tapped
    gsap.to(len.current, {
      pull: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', onUpdate: paint,
    });
  };

  return (
    <div className="pointer-events-none fixed right-[72px] top-0 z-[55] md:right-[5.6vw]">
      <div ref={wrap}>
        <div ref={cord} className="flex flex-col items-center">
          <span
            className="w-[5px] flex-1"
            style={{
              background: 'repeating-linear-gradient(135deg, #c2b394 0 2px, #8d7f62 2px 4px)',
              boxShadow: '1px 0 2px rgba(0,0,0,.25)',
            }}
          />
          <div className="relative">
            <span
              className="pointer-events-none absolute left-1/2 top-4 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
              style={{
                background: 'radial-gradient(circle, rgba(255,196,120,.5) 0%, rgba(255,196,120,0) 65%)',
                opacity: dark ? 0.9 : 0.12,
              }}
            />
            <button
              role="switch"
              aria-checked={dark}
              aria-label="Pull cord to toggle dark mode"
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
              className="pointer-events-auto relative flex h-11 w-9 cursor-grab touch-none items-start justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-ink active:cursor-grabbing"
            >
              <span
                className="mt-px block h-[30px] w-[17px]"
                style={{
                  borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%',
                  background: 'radial-gradient(circle at 35% 30%, #d89a62 0%, #8a4a22 55%, #4a2410 100%)',
                  boxShadow: '0 6px 10px rgba(0,0,0,.35)',
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}