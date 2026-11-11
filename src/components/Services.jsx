import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolio from '../data/portfolio.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import ServiceDoor from './ServiceDoor.jsx';
import KineticTypography from './KineticTypography.jsx';
import PortalTransition from './PortalTransition.jsx';
import ProjectStack from './ProjectStack.jsx';

const lock = () => { document.body.style.overflow = 'hidden'; };
const unlock = () => { document.body.style.overflow = ''; };

export default function Services() {
  const [view, setView] = useState('door'); // 'door' | 'showcase'
  const reduced = useReducedMotion();

  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const portalRef = useRef(null);
  const parts = useRef({});
  const busy = useRef(false);
  const pendingReverse = useRef(false);
  const tlRef = useRef(null);

  const rootTop = () => rootRef.current.getBoundingClientRect().top + window.scrollY;
  const jumpToSection = () => window.scrollTo({ top: rootTop(), behavior: 'instant' });
  const refreshTriggers = () => requestAnimationFrame(() => ScrollTrigger.refresh());

  // One timeline, used forwards (enter) and backwards (return).
  const buildTimeline = () => {
    const { frame, panel, glow, shade } = parts.current;
    const scene = sceneRef.current;
    const portal = portalRef.current;
    const fades = scene.querySelectorAll('[data-fade]');

    const fr = frame.getBoundingClientRect();
    const sr = scene.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Camera aims at the doorway centre and slides it to the middle of the screen.
    const ox = fr.left + fr.width / 2 - sr.left;
    const oy = fr.top + fr.height / 2 - sr.top;
    const dx = vw / 2 - (fr.left + fr.width / 2);
    const dy = vh / 2 - (fr.top + fr.height / 2);
    const S = Math.max(vw / (fr.width - 28), vh / (fr.height - 14)) * 1.45;

    gsap.set(scene, { transformOrigin: `${ox}px ${oy}px` });

    const tl = gsap.timeline({ paused: true });

    // 0) bring the section to the top of the screen
    const targetY = rootTop();
    const proxy = { y: window.scrollY };
    if (Math.abs(targetY - proxy.y) > 2) {
      tl.to(proxy, {
        y: targetY,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: () => window.scrollTo({ top: proxy.y, behavior: 'instant' }),
      }, 0);
    }

    // 1) the door swings open and light floods the doorway
    tl.to(panel, { rotateY: 72, duration: 1.1, ease: 'power2.inOut' }, 0.2)
      .to(shade, { opacity: 0.55, duration: 1.1, ease: 'power2.inOut' }, 0.2)
      .to(glow, { opacity: 1, duration: 0.9, ease: 'power1.out' }, 0.4)

      // 2) camera moves through the doorway
      .to(fades, { opacity: 0, duration: 0.5, ease: 'power1.in' }, 1.1)
      .to(scene, { x: dx, y: dy, duration: 1.2, ease: 'power2.inOut' }, 1.2)
      .to(scene, { scale: S, duration: 1.6, ease: 'power3.in' }, 1.2)

      // 3) light fills the screen
      .to(portal, { opacity: 1, duration: 0.45, ease: 'power1.in' }, 2.35);

    return tl;
  };

  const enter = () => {
    if (busy.current || view !== 'door') return;
    busy.current = true;
    lock();
    if (reduced) { setView('showcase'); onShowcaseChange?.(true); return; }
    const tl = buildTimeline();
    tlRef.current = tl;
    tl.eventCallback('onComplete', () => {
      setView('showcase');
      onShowcaseChange?.(true);
    });
    tl.play();
  };

const exit = () => {
  if (busy.current || view !== 'showcase') return;
  busy.current = true;
  lock();
  const back = () => {
    pendingReverse.current = true;
    setView('door');
    onShowcaseChange?.(false);
  };
  if (reduced) { back(); return; }
  gsap.to(portalRef.current, { opacity: 1, duration: 0.8, ease: 'power1.in', onComplete: back });
};
  };

  // Showcase just mounted: reveal it from behind the light.
  useLayoutEffect(() => {
    if (view !== 'showcase') return;
    jumpToSection();
    const tl = gsap.timeline({
      onComplete: () => { busy.current = false; unlock(); },
    });
    tl.to(portalRef.current, { opacity: 0, duration: reduced ? 0.01 : 0.8, ease: 'power1.out' })
      .from('.showcase-in', { y: 50, opacity: 0, duration: reduced ? 0.01 : 0.8, ease: 'power3.out', stagger: 0.1 }, 0.1);
    refreshTriggers();
    return () => tl.kill();
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  // Doors just remounted after "Back": start from the end state and play backwards.
  useLayoutEffect(() => {
    if (view !== 'door' || !pendingReverse.current) return;
    pendingReverse.current = false;
    jumpToSection();

    if (reduced) {
      gsap.set(portalRef.current, { opacity: 0 });
      busy.current = false;
      unlock();
      refreshTriggers();
      return;
    }

    const tl = buildTimeline();
    tlRef.current = tl;
    tl.progress(1);
    tl.eventCallback('onReverseComplete', () => {
      gsap.set(sceneRef.current, { clearProps: 'transform,transformOrigin' });
      busy.current = false;
      unlock();
      refreshTriggers();
    });
    tl.reverse();
  }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (tlRef.current) tlRef.current.kill(); unlock(); }, []);

  return (
    <section id="services" ref={rootRef} className="relative">
      {view === 'door' && (
        <div className="overflow-hidden">
          <div
            ref={sceneRef}
            className="flex min-h-[100svh] flex-col justify-center px-6 py-24 md:px-[7vw]"
          >
            <h2
              data-fade
              className="mx-auto max-w-3xl text-center font-bold leading-[1.05] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              {portfolio.services.heading}
            </h2>

            <div className="mx-auto mt-14 grid w-full max-w-6xl items-center gap-16 md:grid-cols-2">
              <div className="flex justify-center">
                <ServiceDoor parts={parts} busy={busy} onOpen={enter} />
              </div>
              <div data-fade>
                <KineticTypography />
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'showcase' && <ProjectStack />}

      {view === 'showcase' && (
        <button
          onClick={exit}
          aria-label="Back to the Doors"
          title="Back to the Doors"
          className="fixed left-2 top-[68px] z-[60] grid h-8 w-8 place-items-center rounded-full bg-[#1a1817] text-[#f3efe9] shadow-lg transition hover:scale-110 md:left-3 md:top-[76px] md:h-9 md:w-9 dark:bg-[#efebe5] dark:text-[#1a1817]"
        >
          <ArrowLeft size={16} />
        </button>
      )}

      <PortalTransition ref={portalRef} />
    </section>
  );
