import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import InteractivePhone from './InteractivePhone.jsx';
import ProjectLogo from './ProjectLogo.jsx';

const layouts = {
  stack: 'absolute inset-x-2 bottom-3 top-[76px] md:inset-x-4',
  list: 'relative mx-2 mb-4 h-[calc(100svh-6rem)] min-h-[560px] md:mx-4',
};

export default function ProjectCard({ project, index, total, live, isCurrent, layout = 'stack' }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  // Cards behind the front one can't be tabbed into or clicked.
  useEffect(() => {
    if (ref.current) ref.current.toggleAttribute('inert', !isCurrent);
  }, [isCurrent]);

  // List layout (reduced motion): only the card on screen runs a live preview.
  useEffect(() => {
    if (layout !== 'list' || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [layout]);

  const liveNow = layout === 'list' ? seen : live;

  return (
    <article
      ref={ref}
      aria-label={`Project ${index + 1} of ${total}: ${project.name}`}
      className={`project-card ${layouts[layout]} overflow-hidden rounded-[2rem] text-[#1a1817] shadow-[0_-12px_30px_-18px_rgba(0,0,0,.3)]`}
      style={{ background: project.color, zIndex: index + 1 }}
    >
      <div className="flex h-full flex-col lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center">
        {/* text */}
        <div className="relative z-10 flex flex-col px-6 pb-3 pt-6 sm:px-10 lg:px-[5vw] lg:py-10 lg:pb-16">
          <div className="mb-4 flex items-center gap-3 lg:mb-6">
            <ProjectLogo project={project} className="h-10 w-10 lg:h-12 lg:w-12" />
            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium tracking-wide">
              {project.category}
            </span>
          </div>

          <h3
            className="font-bold leading-[1.02] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(1.7rem, 3.6vw, 3.4rem)' }}
          >
            {project.name}
          </h3>

          <p className="mt-3 line-clamp-2 max-w-xl text-[14px] leading-relaxed opacity-70 sm:line-clamp-3 lg:mt-5 lg:line-clamp-none lg:text-base">
            {project.description}
          </p>

          <ul className="mt-4 space-y-1.5 text-[13px] font-medium lg:mt-6 lg:space-y-2 lg:text-[15px]">
            {project.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-1.5 lg:mt-6">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-medium lg:text-xs">
                {t}
              </span>
            ))}
          </div>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#1a1817] px-6 py-3 text-sm font-medium text-[#f3efe9] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            View Live Website
            <ExternalLink size={15} />
          </a>
        </div>

        {/* phone */}
        <div className="relative min-h-0 flex-1 lg:h-full">
          <InteractivePhone project={project} live={liveNow} />
        </div>
      </div>

      {/* dims the card as it recedes (driven by GSAP) */}
      <div className="card-dim pointer-events-none absolute inset-0 z-40 bg-black opacity-0" />
    </article>
  );
}