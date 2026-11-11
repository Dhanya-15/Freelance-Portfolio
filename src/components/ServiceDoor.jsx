import gsap from 'gsap';
import portfolio from '../data/portfolio.js';

const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const gold = 'linear-gradient(135deg,#f9e29a 0%,#d9a93e 45%,#a97a22 100%)';

export default function ServiceDoor({ parts, busy, onOpen }) {
  const { doorLabel, hint } = portfolio.services;

  const hover = (on) => {
    if (busy.current) return;
    const { panel, glow } = parts.current;
    gsap.to(panel, { rotateY: on ? 9 : 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(glow, { opacity: on ? 0.55 : 0, duration: 0.5, overwrite: 'auto' });
  };

  return (
    <div className="relative" style={{ width: 'min(360px, 78vw, 46svh)' }}>
      {/* ground shadow */}
      <div className="absolute -bottom-5 left-1/2 h-8 w-[88%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-xl" />

      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => hover(true)}
        onPointerLeave={() => hover(false)}
        onFocus={() => hover(true)}
        onBlur={() => hover(false)}
        aria-label={`Open the ${doorLabel} door and view projects`}
        className="perspective relative block aspect-[340/520] w-full cursor-pointer rounded-t-[999px] outline-none focus-visible:ring-4 focus-visible:ring-orange-400/60"
      >
        {/* stone arch frame */}
        <div
          ref={(el) => (parts.current.frame = el)}
          className="absolute inset-0 rounded-t-[999px] bg-gradient-to-b from-[#ece4d4] to-[#d9cfba] shadow-[0_30px_60px_-20px_rgba(16,26,58,.55),inset_0_2px_0_rgba(255,255,255,.7)]"
        />

        {/* doorway interior (the light behind the door) */}
        <div className="absolute inset-[14px] overflow-hidden rounded-t-[999px] bg-[#0b1020] shadow-[inset_0_10px_30px_rgba(0,0,0,.6)]">
          <div
            ref={(el) => (parts.current.glow = el)}
            className="absolute inset-0 opacity-0"
            style={{ background: 'radial-gradient(circle at 50% 55%, #fffaf0 0%, #f9e9bd 55%, #f1d594 100%)' }}
          />
        </div>

        {/* door panel */}
        <div
          ref={(el) => (parts.current.panel = el)}
          className="absolute inset-[14px] overflow-hidden rounded-t-[999px]"
          style={{
            transformOrigin: 'left center',
            background: 'linear-gradient(135deg,#22356b 0%,#16264f 45%,#0e1a3b 100%)',
            boxShadow: 'inset -6px 0 14px rgba(0,0,0,.35), inset 4px 0 8px rgba(255,255,255,.06)',
          }}
        >
          {/* grain */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: NOISE }} />
          {/* vertical grooves */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(90deg, rgba(0,0,0,.35) 0 2px, rgba(255,255,255,.07) 2px 4px, transparent 4px 26px)',
            }}
          />
          {/* top light */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 60% at 30% 0%, rgba(255,255,255,.16), transparent 60%)' }}
          />
          {/* molded inner border */}
          <div className="absolute inset-[16px] rounded-t-[999px] border border-white/10 shadow-[inset_0_0_14px_rgba(0,0,0,.45)]" />

          {/* gold nameplate */}
          <div
            className="absolute left-1/2 top-[24%] -translate-x-1/2 whitespace-nowrap rounded-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2a1d05]"
            style={{ background: gold, boxShadow: '0 2px 6px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.6)' }}
          >
            {doorLabel}
          </div>

          {/* lever handle */}
          <div className="absolute right-[9%] top-[54%] flex items-center">
            <div
              className="-mr-1 h-[7px] w-11 rounded-full"
              style={{ background: gold, boxShadow: '0 2px 4px rgba(0,0,0,.5)' }}
            />
            <div
              className="h-[22px] w-[22px] rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #fbe9a8, #c99a35 60%, #8a621a)',
                boxShadow: '0 3px 6px rgba(0,0,0,.55)',
              }}
            />
          </div>

          {/* keyhole */}
          <div
            className="absolute right-[10%] top-[63%] grid h-7 w-4 place-items-center rounded-md"
            style={{ background: gold, boxShadow: '0 2px 4px rgba(0,0,0,.5)' }}
          >
            <svg viewBox="0 0 10 18" className="h-[14px] w-2 fill-[#1a1203]">
              <circle cx="5" cy="5" r="4" />
              <path d="M3 8h4l1.5 9h-7z" />
            </svg>
          </div>

          {/* edge highlight + opening shade */}
          <div className="absolute inset-y-0 right-0 w-[3px] bg-white/10" />
          <div ref={(el) => (parts.current.shade = el)} className="absolute inset-0 bg-black opacity-0" />
        </div>
      </button>

      <p data-fade className="mt-10 text-center text-sm text-muted">
        {hint}
      </p>
    </div>
  );
}