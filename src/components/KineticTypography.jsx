import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolio from '../data/portfolio.js';
import useReducedMotion from '../hooks/useReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

const tones = ['text-ink/40', 'text-ink', 'text-orange-500'];

export default function KineticTypography() {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const { phrases } = portfolio.services;

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('.kt-char', {
        yPercent: 115,
        rotate: 7,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.03,
        scrollTrigger: { trigger: root.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });

      gsap.utils.toArray('.kt-line').forEach((line, i) => {
        gsap.fromTo(
          line,
          { x: i % 2 ? 40 : -40 },
          {
            x: i % 2 ? -40 : 40,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root}>
      <p className="sr-only">{phrases.join(' ')}</p>
      <div
        aria-hidden="true"
        className="font-bold leading-[1.02] tracking-[-0.04em]"
        style={{ fontSize: 'clamp(2.6rem, 5.4vw, 5.2rem)' }}
      >
        {phrases.map((text, i) => (
          <div key={text} className={`kt-line ${tones[i % tones.length]}`}>
            <span className="block overflow-hidden pb-[0.14em]">
              {Array.from(text).map((ch, j) => (
                <span key={j} className="kt-char inline-block">
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}