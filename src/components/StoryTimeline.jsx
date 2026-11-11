import { useLayoutEffect, useRef, useState } from 'react';
import { History } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolio from '../data/portfolio.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import RollingNumber from './RollingNumber.jsx';
import ClockDial from './ClockDial.jsx';

gsap.registerPlugin(ScrollTrigger);

const pad = (n) => String(n).padStart(2, '0');
const LINE = 0.55; // how far down the screen an entry becomes active (0 = top, 1 = bottom)

export default function StoryTimeline() {
  const { timeline, projects, story } = portfolio;
  const n = timeline.length;
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  const root = useRef(null);
  const list = useRef(null);
  const rail = useRef(null);
  const track = useRef(null);
  const fill = useRef(null);
  const outer = useRef(null);
  const inner = useRef(null);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root);

    // One calculation drives the fill, counter, progress bar, clock and active entry.
    const update = () => {
      const titles = q('[data-title]');
      if (!titles.length || !rail.current) return;

      const railTop = rail.current.getBoundingClientRect().top;
      const ys = titles.map((t) => {
        const r = t.getBoundingClientRect();
        return r.top + r.height / 2 - railTop;
      });
      const y0 = ys[0];
      const y1 = ys[ys.length - 1];
      const span = Math.max(0, y1 - y0);
      const lineY = window.innerHeight * LINE - railTop;

      track.current.style.top = `${y0}px`;
      track.current.style.height = `${span}px`;
      const fillH = Math.min(Math.max(lineY - y0, 0), span);
      fill.current.style.height = `${fillH}px`;

      const p = span ? fillH / span : 0;
      gsap.set(q('.story-bar'), { scaleX: p });
      if (!reduced) {
        gsap.set(outer.current, { rotation: p * 300 });
        gsap.set(inner.current, { rotation: -p * 200 });
      }

      let idx = 0;
      ys.forEach((y, i) => { if (y <= lineY) idx = i; });
      setActive(idx);
    };

    const st = ScrollTrigger.create({
      trigger: list.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: update,
      onRefresh: update,
    });
    update();

    return () => st.kill();
  }, [reduced, n]);

  const current = timeline[active];
  const label = (e) => e.short || e.range;

  return (
    <section id="story" ref={root} className="relative bg-[#f7f4f0] dark:bg-[#100f0e]">
      {/* glows + texture, fixed to the screen while the section scrolls */}
      <div aria-hidden="true" className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-[100svh] overflow-hidden">
        <div className="story-bg absolute inset-0" />
        <div className="story-texture absolute inset-0" />
      </div>

      <div className="relative z-10 lg:grid lg:grid-cols-2">
        {/* ---------- mobile: heading + compact sticky year ---------- */}
        <div className="px-6 pb-6 pt-24 lg:hidden">
          <p className="mb-3 flex items-center gap-2 text-[13px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-muted" />
            {story.label}
          </p>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em]">{story.heading}</h2>
        </div>

        <div className="sticky top-[60px] z-30 border-y border-ink/10 bg-[#f7f4f0]/85 backdrop-blur-md dark:bg-[#100f0e]/85 lg:hidden">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-baseline gap-3">
              <RollingNumber value={current.year} className="text-4xl font-bold tracking-[-0.04em]" />
              <span key={active} className="story-rise font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {label(current)}
              </span>
            </div>
            <span className="text-xs tabular-nums text-muted">{pad(active + 1)} / {pad(n)}</span>
          </div>
          <div className="h-[2px] w-full bg-ink/10">
            <div className="story-bar h-full origin-left scale-x-0 bg-ink" />
          </div>
        </div>

        {/* ---------- desktop: stationary left panel ---------- */}
        <div className="relative hidden overflow-hidden px-[7vw] pt-16 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:self-start">
          <ClockDial outerRef={outer} innerRef={inner} />

          <div className="relative z-10">
            <p className="mb-4 flex items-center gap-2 text-[13px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              {story.label}
            </p>

            <h2
              className="font-bold leading-[1.05] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.4rem)' }}
            >
              {story.heading}
            </h2>

            <div className="mt-6">
              <RollingNumber
                value={current.year}
                className="font-bold tracking-[-0.05em]"
                style={{ fontSize: 'clamp(5rem, 12vw, 11rem)' }}
              />
            </div>

            <p
              key={active}
              className="story-rise mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/80"
            >
              {label(current)}
            </p>

            <div className="mt-5 flex items-center gap-3 tabular-nums">
              <History size={15} className="text-muted" aria-hidden="true" />
              <span className="text-[15px] font-semibold">{pad(active + 1)}</span>
              <span className="text-[15px] text-muted">/ {pad(n)}</span>
              <div className="ml-1 h-[2px] w-40 bg-ink/15">
                <div className="story-bar h-full origin-left scale-x-0 bg-ink" />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- scrolling timeline ---------- */}
        <div ref={list} className="relative pb-[20svh] pr-6 lg:pr-[7vw]">
          <div ref={rail} className="relative ml-6 lg:ml-2">
            {/* light track (first dot to last dot) with a dark fill */}
            <span aria-hidden="true" ref={track} className="absolute left-0 w-[2px] -translate-x-1/2 bg-ink/15">
              <span ref={fill} className="absolute inset-x-0 top-0 h-0 bg-ink" />
            </span>

            {timeline.map((e, i) => {
              const project = projects.find((p) => p.id === e.projectId);
              const points = e.points && e.points.length ? e.points : project ? project.features : [];
              const on = i === active;
              const reached = i < active;
              const fade = `transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-40'}`;
              const dot = on
                ? 'h-4 w-4 bg-ink ring-[7px] ring-ink/10'
                : reached
                ? 'h-2.5 w-2.5 bg-ink'
                : 'h-2.5 w-2.5 bg-ink/25';

              return (
                <article
                  key={`${e.title}-${i}`}
                  aria-current={on ? 'step' : undefined}
                  className={`relative pb-[14svh] pl-8 ${i === 0 ? 'pt-10 lg:pt-[48svh]' : ''}`}
                >
                  <div className="max-w-[440px]">
                    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${fade}`}>{label(e)}</p>

                    <div data-title className="relative mt-4">
                      <span
                        aria-hidden="true"
                        className={`absolute -left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${dot}`}
                      />
                      <h3
                        className={`font-medium leading-[1.1] tracking-[-0.03em] ${fade}`}
                        style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.3rem)' }}
                      >
                        {e.title}
                      </h3>
                    </div>

                    <p className={`mt-2 text-base ${fade}`}>{e.role}</p>

                    {points.length > 0 && (
                      <ul className={`mt-5 space-y-3 text-[15px] leading-relaxed ${fade}`}>
                        {points.map((pt) => (
                          <li key={pt} className="flex gap-3">
                            <span aria-hidden="true" className="text-muted">–</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}