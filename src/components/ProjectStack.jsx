import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolio from '../data/portfolio.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import ProjectCard from './ProjectCard.jsx';

gsap.registerPlugin(ScrollTrigger);

const pad = (n) => String(n).padStart(2, '0');

export default function ProjectStack() {
  const projects = portfolio.projects;
  const n = projects.length;

  const outer = useRef(null);
  const root = useRef(null);
  const currentRef = useRef(0);
  const idleTimer = useRef(null);
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [live, setLive] = useState(0); // the only card allowed to run a live preview

  useLayoutEffect(() => {
    if (reduced || n < 2) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.project-card');
      gsap.set(cards, { force3D: true, willChange: 'transform' });
      gsap.set(cards.slice(1), { yPercent: 108 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${(n - 1) * window.innerHeight * 0.9}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          onUpdate: (self) => {
            const idx = Math.min(n - 1, Math.round(self.progress * (n - 1)));
            if (idx !== currentRef.current) {
              currentRef.current = idx;
              setCurrent(idx);
            }
            // Start the live preview only once scrolling has stopped.
            clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => setLive(currentRef.current), 300);
          },
        },
      });

      for (let i = 1; i < n; i++) {
        const at = i - 1;
        tl.to(cards[i], { yPercent: 0, duration: 1 }, at);
        for (let j = 0; j < i; j++) {
          const depth = i - j;
          tl.to(cards[j], { scale: 1 - 0.05 * depth, yPercent: -4 * depth, duration: 1 }, at);
          tl.to(
            cards[j].querySelector('.card-dim'),
            { opacity: Math.min(0.55, 0.16 * depth), duration: 1 },
            at
          );
        }
      }
    }, outer);

    return () => {
      ctx.revert();
      clearTimeout(idleTimer.current);
    };
  }, [reduced, n]);

  // Reduced motion: a plain vertical list, no pinning.
  if (reduced) {
    return (
      <div className="pb-24 pt-[76px]">
        <h2 className="showcase-in sr-only">Selected work</h2>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} total={n} live={false} isCurrent layout="list" />
        ))}
      </div>
    );
  }

  return (
    <div ref={outer}>
      <div ref={root} className="relative h-[100svh] overflow-hidden">
        <h2 className="showcase-in sr-only">Selected work</h2>

        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            total={n}
            live={i === live}
            isCurrent={i === current}
            layout="stack"
          />
        ))}

        <div className="showcase-in pointer-events-none absolute bottom-6 right-6 z-[80] flex items-center gap-3 rounded-full bg-[#1a1817]/95 px-4 py-2 text-xs font-medium tabular-nums text-[#f3efe9]">
          <span>{pad(current + 1)} / {pad(n)}</span>
          <span className="flex gap-1.5">
            {projects.map((p, i) => (
              <span
                key={p.id}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-5 bg-[#f3efe9]' : 'w-1.5 bg-[#f3efe9]/40'
                }`}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}