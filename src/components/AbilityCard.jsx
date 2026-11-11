import { useEffect, useRef, useState } from 'react';
import portfolio from '../data/portfolio.js';

const surface = 'bg-[#1a1817] text-[#f3efe9] dark:bg-[#efebe5] dark:text-[#1a1817]';

export default function AbilityCard() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="absolute bottom-[2%] left-[6%] z-30">
      <div
        id="ability-panel"
        aria-hidden={!open}
        className={`absolute bottom-full left-0 mb-3 w-64 origin-bottom-left rounded-3xl p-5 shadow-2xl ring-1 ring-black/10 transition duration-300 ${surface} ${
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0'
        }`}
      >
        <p className="mb-4 text-sm font-semibold">Technical skills</p>
        {portfolio.skills.map((g) => (
          <div key={g.group} className="mb-3 last:mb-0">
            <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] opacity-60">{g.group}</p>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <span key={s} className="rounded-full bg-white/15 px-2.5 py-1 text-xs dark:bg-black/10">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        aria-expanded={open}
        aria-controls="ability-panel"
        onClick={() => setOpen(!open)}
        className={`rounded-full px-4 py-2.5 text-[13px] font-semibold shadow-lg ring-1 ring-black/10 transition hover:scale-105 ${surface}`}
      >
        My ability card
      </button>
    </div>
  );
}