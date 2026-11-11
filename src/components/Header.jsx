import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import portfolio from '../data/portfolio.js';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Web Development', href: '#services' },
  { label: 'My Story', href: '#story' },
];

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);

  const tz = portfolio.timezone;
  const time = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz })
    .format(now).replace(/\s/g, '').toLowerCase();
  const d = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: tz })
      .formatToParts(now).map((p) => [p.type, p.value])
  );

  return (
    <div className="hidden items-center gap-3 rounded-full border border-ink/10 bg-panel/40 px-4 py-2 text-[13px] text-muted md:flex">
      <span>Chennai time</span>
      <span className="font-semibold tabular-nums text-ink">{time}</span>
      <span className="h-1 w-1 rounded-full bg-muted/60" />
      <span>{d.day} {d.month}, {d.year}</span>
    </div>
  );
}

export default function Header({ onContact }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-ink/10 bg-bg/75 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav
        className={`flex items-center justify-between px-6 transition-all duration-300 md:px-[7vw] ${scrolled ? 'py-4' : 'py-6'}`}
        aria-label="Main"
      >
        <a href="#home" className="font-display text-xl font-semibold md:hidden">
          N Dhanya<span className="text-orange-500">.</span>
        </a>

        <ul className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[15px] transition hover:opacity-55">{l.label}</a>
            </li>
          ))}
          <li>
            <button onClick={onContact} className="text-[15px] transition hover:opacity-55">Contact</button>
          </li>
        </ul>

        <LocalTime />

        <button
          className="relative z-10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-4 border-t border-ink/10 bg-bg px-6 py-5 md:hidden">
          {links.map((l) => (
            <li key={l.href}><a href={l.href} onClick={() => setOpen(false)}>{l.label}</a></li>
          ))}
          <li><button onClick={() => { setOpen(false); onContact(); }}>Contact</button></li>
        </ul>
      )}
    </header>
  );
}