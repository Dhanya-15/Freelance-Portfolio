import { ArrowDown, ArrowRight } from 'lucide-react';
import portfolio from '../data/portfolio.js';
import FlippingNotebook from './FlippingNotebook.jsx';
import PortraitColorReveal from './PortraitColorReveal.jsx';
import AbilityCard from './AbilityCard.jsx';

export default function Hero({ onHire }) {
  const { hero } = portfolio;

  return (
    <section id="home" className="px-2 pb-2 pt-2 md:px-3 md:pt-3">
      <div
        className="relative flex min-h-[calc(100svh-1.25rem)] flex-col overflow-hidden rounded-b-[2.5rem] rounded-t-[1.5rem] border border-ink/10 shadow-[0_30px_70px_-35px_rgba(26,24,23,.45)]"
        style={{ background: 'var(--hero-bg)' }}
      >

        <div className="relative flex flex-1 flex-col px-6 pt-[clamp(6.5rem,15vh,9rem)] md:px-[7vw]">
          <p className="mb-5 flex items-center gap-2 text-[13px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-muted" />
            {hero.eyebrow}
          </p>

          <h1
            className="font-bold leading-[1.04] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2.6rem, 5.2vw, 4.5rem)' }}
          >
            <span className="block">{hero.greeting}</span>
            <span className="block text-ink/45">{hero.lead}</span>
          </h1>
          <p className="sr-only">{hero.intro}</p>

          <div className="mt-9">
            <FlippingNotebook />
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3 pb-10">
            <button
              onClick={onHire}
              className="group flex h-12 items-center gap-5 rounded-full bg-ink py-1.5 pl-6 pr-1.5 text-sm font-medium text-bg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Hire me
              <span className="grid h-9 w-9 place-items-center rounded-full bg-bg text-ink transition group-hover:translate-x-0.5">
                <ArrowRight size={16} />
              </span>
            </button>
            <a
              href="#services"
              className="flex h-12 items-center rounded-full border border-ink/10 px-6 text-sm font-medium transition hover:bg-ink/5"
            >
              See my work
            </a>
          </div>

          <div className="relative mx-auto mt-2 w-[min(340px,80vw)] lg:absolute lg:bottom-10 lg:right-[3vw] lg:mx-0 lg:mt-0 lg:aspect-[360/470] lg:h-[min(98%,46vw)] lg:w-auto">
            <PortraitColorReveal />
            <AbilityCard />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center border-t border-ink/10 px-6 py-4 text-[11px] uppercase tracking-[0.14em] text-muted sm:grid-cols-3 md:px-[7vw]">
          <span>{hero.footerLeft}</span>
          <span className="hidden text-center sm:block">{hero.footerCenter}</span>
          <a href="#services" className="flex items-center gap-1.5 justify-self-end hover:text-ink">
            {hero.footerRight}
            <ArrowDown size={12} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}