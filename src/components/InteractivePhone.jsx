import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, MousePointerClick, X } from 'lucide-react';
import gsap from 'gsap';
import useEmbedStatus from '../hooks/useEmbedStatus.js';
import useMediaQuery from '../hooks/useMediaQuery.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import ProjectLogo from './ProjectLogo.jsx';

const IDLE_DESKTOP = { rotateY: -20, rotateX: 8, rotateZ: 3, scale: 1 };
const IDLE_MOBILE = { rotateY: -10, rotateX: 6, rotateZ: 0, scale: 1 };
const ACTIVE = { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.05 };

function Skeleton() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-white to-[#ececec] text-[#1a1817]">
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-black/15 border-t-black/60" />
      <span className="text-[11px] font-medium opacity-60">Loading live preview…</span>
    </div>
  );
}

// Static picture shown whenever the live site isn't running (cheap to scroll past).
function Poster({ project }) {
  return (
    <div className="absolute inset-0" style={{ background: project.color }}>
      {project.screenshot ? (
        <img
          src={project.screenshot}
          alt=""
          draggable="false"
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-[#1a1817]">
          <ProjectLogo project={project} className="h-14 w-14" />
          <p className="text-lg font-bold leading-tight">{project.name}</p>
        </div>
      )}
    </div>
  );
}

// Shown when the site can't be embedded at all.
function Fallback({ project }) {
  return (
    <div className="absolute inset-0" style={{ background: project.color }}>
      {project.screenshot ? (
        <>
          <img
            src={project.screenshot}
            alt={`${project.name} screenshot`}
            draggable="false"
            className="h-full w-full object-cover object-top"
          />
          <span className="absolute inset-x-0 bottom-7 mx-auto w-fit rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white">
            Screenshot
          </span>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-[#1a1817]">
          <ProjectLogo project={project} className="h-14 w-14" />
          <p className="text-lg font-bold leading-tight">{project.name}</p>
          <p className="text-xs opacity-60">A live preview isn’t available here.</p>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#1a1817] px-4 py-2 text-xs font-medium text-[#f3efe9]"
          >
            View Live Website <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}

function Screen({ project, status, frameOn, loaded, onFrameLoad, interactive }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2.1rem] bg-white" style={{ isolation: 'isolate' }}>
      {status === 'blocked' ? (
        <Fallback project={project} />
      ) : (
        <>
          <Poster project={project} />
          {frameOn && (
            <iframe
              src={project.liveUrl}
              title={`${project.name} live preview`}
              onLoad={onFrameLoad}
              tabIndex={interactive ? 0 : -1}
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              className={`absolute inset-0 h-full w-full border-0 bg-white transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              } ${interactive ? '' : 'pointer-events-none'}`}
            />
          )}
          {frameOn && !loaded && <Skeleton />}
        </>
      )}
      {/* dynamic island + home indicator */}
      <div className="pointer-events-none absolute left-1/2 top-2.5 z-20 h-[22px] w-[74px] -translate-x-1/2 rounded-full bg-black" />
      <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-20 h-1 w-24 -translate-x-1/2 rounded-full bg-black/60" />
    </div>
  );
}

export default function InteractivePhone({ project, live }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const { status, onLoad } = useEmbedStatus(project, live);

  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [overlayReady, setOverlayReady] = useState(false);

  const pos = useRef(null);
  const tilt = useRef(null);
  const exitBtn = useRef(null);
  const first = useRef(true);

  const inPlace = active && isDesktop; // desktop: the phone itself goes live
  const overlay = active && !isDesktop; // mobile: full-screen preview
  const frameOn = live && !overlay && (status === 'loading' || status === 'ready');

  const handleFrameLoad = () => {
    onLoad();
    setLoaded(true);
  };

  // The iframe is removed whenever it's switched off, so reset its state.
  useEffect(() => {
    if (!frameOn) setLoaded(false);
  }, [frameOn]);

  useEffect(() => {
    if (!live) setActive(false);
  }, [live]);

  // Tilt: idle pose <-> straightened live pose.
  useLayoutEffect(() => {
    const target = inPlace ? ACTIVE : isDesktop ? IDLE_DESKTOP : IDLE_MOBILE;
    if (first.current) {
      first.current = false;
      gsap.set(tilt.current, target);
      return;
    }
    gsap.to(tilt.current, { ...target, duration: reduced ? 0 : 0.8, ease: 'power3.inOut', overwrite: 'auto' });
  }, [inPlace, isDesktop, reduced]);

  // While a preview is live: lock page scroll, close on Escape or outside click.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => e.key === 'Escape' && setActive(false);
    const onDown = (e) => {
      if (!inPlace) return;
      const t = e.target;
      if (pos.current && !pos.current.contains(t) && !(exitBtn.current && exitBtn.current.contains(t))) {
        setActive(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    if (inPlace && exitBtn.current) exitBtn.current.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [active, inPlace]);

  useEffect(() => {
    if (!overlay) setOverlayReady(false);
  }, [overlay]);

  const onMove = (e) => {
    if (!isDesktop || inPlace || reduced || !live) return;
    const r = pos.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(tilt.current, {
      rotateY: IDLE_DESKTOP.rotateY + px * 10,
      rotateX: IDLE_DESKTOP.rotateX - py * 8,
      duration: 0.5, ease: 'power2.out', overwrite: 'auto',
    });
  };
  const onLeave = () => {
    if (!isDesktop || inPlace) return;
    gsap.to(tilt.current, { ...IDLE_DESKTOP, duration: 0.7, ease: 'power3.out', overwrite: 'auto' });
  };

  return (
    <div className="relative h-full w-full overflow-hidden lg:flex lg:items-center lg:justify-center lg:overflow-visible">
      <div
        ref={pos}
        className={`absolute left-1/2 top-3 -translate-x-1/2 lg:relative lg:left-auto lg:top-auto lg:translate-x-0 ${
          inPlace ? 'z-[60]' : ''
        }`}
        style={{ height: 'min(76svh, 680px)', aspectRatio: '9 / 19' }}
      >
        <div className={`h-full w-full ${live && !inPlace ? 'phone-float' : ''}`}>
          <div
            className="relative h-full w-full"
            style={{ perspective: 1600 }}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            {/* floor shadow (cheap gradient, no blur) */}
            <div
              className="pointer-events-none absolute inset-x-6 -bottom-6 h-8"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,.35), transparent 70%)' }}
            />

            <div ref={tilt} className="preserve-3d absolute inset-0">
              {/* thickness */}
              {[1, 2].map((k) => (
                <div
                  key={k}
                  className="absolute inset-0 rounded-[3rem] bg-[#0b0b0d]"
                  style={{ transform: `translateZ(${-k * 4}px)` }}
                />
              ))}

              {/* body */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-[#2e2e33] via-[#18181b] to-[#0c0c0e] p-[10px] shadow-[0_30px_50px_-20px_rgba(0,0,0,.5),inset_0_0_0_1.5px_rgba(255,255,255,.12)]">
                <div className="relative h-full w-full">
                  <Screen
                    project={project}
                    status={status}
                    frameOn={frameOn}
                    loaded={loaded}
                    onFrameLoad={handleFrameLoad}
                    interactive={inPlace}
                  />

                  {!inPlace && (
                    <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.1rem] bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />
                  )}

                  {loaded && !active && (
                    <button
                      onClick={() => setActive(true)}
                      aria-label={`Interact with the ${project.name} live preview`}
                      className="group absolute inset-0 z-30 rounded-[2.1rem] focus-visible:ring-4 focus-visible:ring-orange-400/70"
                    >
                      <span className="absolute inset-x-0 top-14 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-2 text-[11px] font-semibold text-white shadow-lg transition group-hover:scale-105 lg:bottom-9 lg:top-auto">
                        <MousePointerClick size={13} />
                        {isDesktop ? 'Click to interact' : 'Tap to interact'}
                      </span>
                    </button>
                  )}
                </div>

                {/* side buttons */}
                <span className="absolute -left-[3px] top-[16%] h-6 w-[3px] rounded-l bg-[#2b2b2f]" />
                <span className="absolute -left-[3px] top-[24%] h-10 w-[3px] rounded-l bg-[#2b2b2f]" />
                <span className="absolute -left-[3px] top-[33%] h-10 w-[3px] rounded-l bg-[#2b2b2f]" />
                <span className="absolute -right-[3px] top-[27%] h-14 w-[3px] rounded-r bg-[#2b2b2f]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {inPlace && (
        <button
          ref={exitBtn}
          onClick={() => setActive(false)}
          className="absolute right-6 top-6 z-[70] flex items-center gap-2 rounded-full bg-[#1a1817] px-4 py-2.5 text-sm font-medium text-[#f3efe9] shadow-xl"
        >
          <X size={15} /> Exit Preview
        </button>
      )}

      {overlay &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${project.name} live preview`}
            className="fixed inset-0 z-[120] flex flex-col items-center bg-black/80 p-3"
            onPointerDown={(e) => { if (e.target === e.currentTarget) setActive(false); }}
          >
            <div className="relative min-h-0 w-full max-w-[420px] flex-1 rounded-[2.4rem] bg-[#141416] p-2 shadow-2xl">
              <div className="relative h-full w-full">
                <Screen
                  project={project}
                  status="loading"
                  frameOn
                  loaded={overlayReady}
                  onFrameLoad={() => setOverlayReady(true)}
                  interactive
                />
              </div>
            </div>
            <button
              onClick={() => setActive(false)}
              className="mt-3 rounded-full bg-white px-10 py-3 text-sm font-semibold text-[#1a1817] shadow-xl"
            >
              Done
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}