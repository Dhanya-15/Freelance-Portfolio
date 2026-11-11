import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import portfolio from '../data/portfolio.js';
import useReducedMotion from '../hooks/useReducedMotion.js';

const roles = portfolio.hero.roles;
const pad = (n) => String(n).padStart(2, '0');

function PageFace({ index, className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-[18px] bg-gradient-to-b from-white to-[#f0ede8] ${className}`}>
      <p
        className="absolute inset-x-0 top-[60%] -translate-y-1/2 whitespace-nowrap px-[4%] font-bold leading-none tracking-[-0.04em] text-[#161413]"
        style={{ fontSize: 'clamp(1.55rem, 4.2vw, 3.6rem)' }}
      >
        {roles[index]}
      </p>
      <span className="absolute bottom-2.5 right-5 text-[11px] tracking-[0.12em] text-neutral-400">
        {pad(index + 1)} / {pad(roles.length)}
      </span>
    </div>
  );
}

export default function FlippingNotebook() {
  const [index, setIndex] = useState(0);
  const sheet = useRef(null);
  const reduced = useReducedMotion();
  const next = (index + 1) % roles.length;

  // After each flip, put the sheet back in place showing the new word.
  useLayoutEffect(() => {
    gsap.set(sheet.current, { rotateX: 0 });
    gsap.set(Array.from(sheet.current.children), { opacity: 1 });
  }, [index]);

  useEffect(() => {
    let tl;
    const id = setInterval(() => {
      if (reduced) { setIndex((i) => (i + 1) % roles.length); return; }
      const faces = Array.from(sheet.current.children);
      tl = gsap
        .timeline({ onComplete: () => setIndex((i) => (i + 1) % roles.length) })
        .to(sheet.current, { rotateX: -180, duration: 0.9, ease: 'power2.inOut' })
        .to(faces, { opacity: 0, duration: 0.25 }, 0.6);
    }, 3000);
    return () => { clearInterval(id); if (tl) tl.kill(); };
  }, [reduced]);

  return (
    <div
      className="relative w-[min(600px,88vw)] lg:w-[min(600px,46vw)]"
      style={{ height: 'clamp(84px, 10vw, 120px)', transform: 'rotate(-0.6deg)' }}
      role="status"
      aria-live="polite"
    >
      {/* hard black back cover */}
      <div className="absolute inset-0 translate-x-[9px] translate-y-[20px] rounded-[18px] bg-[#0d0c0b] dark:bg-black" />

      {/* visible page edges */}
      {[3, 2, 1].map((i) => (
        <div
          key={i}
          className="absolute inset-x-px rounded-[18px] border border-black/10 bg-[#f4f1ed]"
          style={{ top: i * 4, bottom: -i * 4 }}
        />
      ))}

      <div className="perspective absolute inset-0">
        <div aria-hidden="true" className="absolute inset-0">
          <PageFace index={next} className="shadow-md" />
        </div>

        <div ref={sheet} className="preserve-3d absolute inset-0 z-20" style={{ transformOrigin: 'top center' }}>
          <PageFace index={index} className="backface-hidden shadow-xl" />
          <div
            className="backface-hidden absolute inset-0 rounded-[18px] bg-[#e7e3dd]"
            style={{ transform: 'rotateX(180deg)' }}
          />
        </div>
      </div>

      {/* spiral rings */}
      <div className="pointer-events-none absolute inset-x-0 -top-[14px] z-30 flex justify-between px-[18px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="h-6 w-[9px] rotate-[5deg] rounded-full border border-neutral-400/80 bg-gradient-to-b from-white via-neutral-100 to-neutral-300 shadow-[0_2px_3px_rgba(0,0,0,.3)]"
          />
        ))}
      </div>
    </div>
  );
}