import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import portfolio from '../data/portfolio.js';

const PILL_H = 100;   // height of each pill (px)
const PILL_STEP = 60; // vertical distance between pills (px) -> 40px overlap

const pills = [
  { label: portfolio.name,     from: '#262524', to: '#151413', text: '#c9c5bd' },
  { label: 'Web Developer',    from: '#2d4673', to: '#18253f', text: '#c3cad8' },
  { label: 'Creative Developer', from: '#c0663a', to: '#8a4322', text: '#f0d3c2' },
  { label: 'Available for Work', from: '#d6c0c0', to: '#b99d9e', text: '#4a3a3d' },
];

const tags = ['Web', 'React', 'Creative', 'Freelance'];

export default function IntroLoader({ onDone }) {
  const root = useRef(null);
  const [count, setCount] = useState(0);

  // Lock page scroll while the loader is visible.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counter = { v: 0 };

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from('.intro-pill', {
          y: 90, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        });
        gsap.from('.intro-fade', { opacity: 0, y: 12, duration: 0.8, delay: 0.2, ease: 'power2.out' });
      }

      // 000 -> 100 in exactly 3 seconds, then slide the screen away.
      gsap.to(counter, {
        v: 100,
        duration: 3,
        ease: 'none',
        onUpdate: () => setCount(Math.round(counter.v)),
        onComplete: () =>
          gsap.to(root.current, {
            yPercent: -100, duration: reduced ? 0.01 : 0.8, ease: 'power3.inOut', onComplete: onDone,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, [onDone]);

  const stackH = (pills.length - 1) * PILL_STEP + PILL_H;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden border-t border-white/20 text-[#ece8e1]"
      style={{
        background: `
          radial-gradient(900px 520px at 0% 100%, rgba(98,50,25,.55), transparent 62%),
          radial-gradient(700px 420px at 100% 40%, rgba(62,46,38,.35), transparent 62%),
          radial-gradient(640px 420px at 50% 0%, rgba(52,42,37,.35), transparent 70%),
          #0a0908`,
      }}
    >
      {/* top bar */}
      <div className="intro-fade absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-10 text-[13px] md:px-10">
        <p className="text-[#8f8a82]">
          <strong className="font-semibold text-[#ece8e1]">{portfolio.name}</strong> · Portfolio
        </p>
        <p className="hidden text-[#a29d94] sm:block">{tags.join(' · ')}</p>
      </div>

      {/* pill stack */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 'min(370px, 80vw)', height: stackH, marginTop: -20 }}
        aria-hidden="true"
      >
        {pills.map((p, i) => (
          <div
            key={p.label}
            className="intro-pill absolute left-0 w-full rounded-full px-[59px] pt-[18px] text-[15px] font-semibold"
            style={{
              top: i * PILL_STEP,
              height: PILL_H,
              zIndex: i + 1,
              color: p.text,
              background: `linear-gradient(180deg, ${p.from} 0%, ${p.to} 100%)`,
              boxShadow:
                '0 -8px 22px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.10), inset 0 -18px 28px rgba(0,0,0,.18)',
            }}
          >
            {p.label}
          </div>
        ))}
      </div>

      {/* counter bottom-left */}
      <div className="intro-fade absolute bottom-8 left-6 md:bottom-10 md:left-10">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#9a948b]">
          Opening up the work
        </p>
        <div
          role="progressbar"
          aria-label="Loading"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={count}
          className="font-sans font-bold leading-[0.9] tabular-nums"
          style={{ fontSize: 'clamp(84px, 12vw, 160px)', letterSpacing: '-0.04em' }}
        >
          {String(count).padStart(3, '0')}
        </div>
      </div>

      {/* thin progress line bottom-right */}
      <div className="intro-fade absolute bottom-[52px] right-6 h-[2px] w-32 bg-white/15 md:right-10">
        <div
          className="h-full origin-left bg-[#ece8e1]/70"
          style={{ transform: `scaleX(${count / 100})` }}
        />
      </div>
    </div>
  );
}