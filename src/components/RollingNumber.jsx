export default function RollingNumber({ value, className = '', style }) {
  const chars = String(value).split('');

  return (
    <span
      role="img"
      aria-label={String(value)}
      className={`inline-flex leading-none tabular-nums ${className}`}
      style={style}
    >
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} aria-hidden="true" className="inline-block h-[1em] overflow-hidden align-top">
            <span
              className="block transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)]"
              style={{ transform: `translateY(-${Number(ch) * 10}%)` }}
            >
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d} className="block h-[1em] leading-none">{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">{ch}</span>
        )
      )}
    </span>
  );
}