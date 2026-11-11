import { useRef } from 'react';
import portfolio from '../data/portfolio.js';

function Layer({ gray }) {
  const { src, alt } = portfolio.portrait;
  const style = gray ? { filter: 'grayscale(1) contrast(1.05)' } : undefined;

  if (src) {
    return (
      <img
        src={src}
        alt={gray ? alt : ''}
        aria-hidden={!gray}
        draggable="false"
        className="absolute inset-0 h-full w-full object-contain object-bottom"
        style={style}
      />
    );
  }

  const id = gray ? 'phg' : 'phc';
  return (
    <svg
      viewBox="0 0 360 470"
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-0 h-full w-full"
      style={style}
      role={gray ? 'img' : undefined}
      aria-label={gray ? alt : undefined}
      aria-hidden={!gray}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f9a8d4" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path d="M10 470 C10 360 70 300 130 285 L230 285 C290 300 350 360 350 470 Z" fill={`url(#${id})`} />
      <rect x="150" y="235" width="60" height="60" rx="22" fill={`url(#${id})`} />
      <circle cx="180" cy="165" r="88" fill={`url(#${id})`} />
    </svg>
  );
}

export default function PortraitColorReveal() {
  const ref = useRef(null);

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`);
    ref.current.style.setProperty('--o', '1');
  };
  const leave = () => ref.current.style.setProperty('--o', '0');

  const mask = 'radial-gradient(circle 150px at var(--x, 50%) var(--y, 50%), #000 30%, transparent 100%)';

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className="relative aspect-[360/470] w-full">
      <Layer gray />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ opacity: 'var(--o, 0)', WebkitMaskImage: mask, maskImage: mask }}
      >
        <Layer />
      </div>
    </div>
  );
}