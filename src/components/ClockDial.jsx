const polar = (r, i, count) => {
  const a = (i / count) * Math.PI * 2;
  return [50 + r * Math.sin(a), 50 - r * Math.cos(a)];
};

const minuteTicks = Array.from({ length: 60 }, (_, i) => {
  const [x1, y1] = polar(i % 5 === 0 ? 44.5 : 46.5, i, 60);
  const [x2, y2] = polar(48.8, i, 60);
  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 5 === 0 ? 0.3 : 0.15} />;
});

const hourTicks = Array.from({ length: 12 }, (_, i) => {
  const [x1, y1] = polar(38, i, 12);
  const [x2, y2] = polar(49.2, i, 12);
  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.2" />;
});

const spokes = Array.from({ length: 24 }, (_, i) => {
  const [x1, y1] = polar(10, i, 24);
  const [x2, y2] = polar(30, i, 24);
  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.12" />;
});

export default function ClockDial({ outerRef, innerRef }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[54%] z-0 aspect-square w-[min(600px,44vw)] -translate-x-1/2 -translate-y-1/2 text-ink opacity-25"
    >
      <svg ref={outerRef} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="49.6" strokeWidth="0.2" opacity="0.5" />
        <g opacity="0.6">{minuteTicks}</g>
        <g opacity="0.5">{hourTicks}</g>
        <circle cx="50" cy="1.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>

      <svg ref={innerRef} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor">
        {[36, 30, 24, 18, 12].map((r, i) => (
          <circle key={r} cx="50" cy="50" r={r} strokeWidth="0.15" opacity={0.55 - i * 0.07} />
        ))}
        <g opacity="0.35">{spokes}</g>
        <circle cx="50" cy="14" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}