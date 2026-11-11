import portfolio from '../src/data/portfolio.js';

const allowed = new Set(
  portfolio.projects.map((p) => {
    try { return new URL(p.liveUrl).hostname; } catch { return ''; }
  })
);

export default async function handler(req, res) {
  const target = String(req.query.url || '');
  let host = '';
  try { host = new URL(target).hostname; } catch {}

  if (!allowed.has(host)) return res.status(400).json({ error: 'URL not allowed' });

  try {
    const r = await fetch(target, { redirect: 'follow', signal: AbortSignal.timeout(6000) });
    const xfo = (r.headers.get('x-frame-options') || '').toLowerCase();
    const csp = r.headers.get('content-security-policy') || '';
    const fa = /frame-ancestors([^;]*)/i.exec(csp);
    const me = req.headers.host || '';

    let embeddable = !(xfo.includes('deny') || xfo.includes('sameorigin'));
    if (fa) {
      const v = fa[1];
      embeddable = embeddable && (v.includes('*') || v.includes('https:') || v.includes(me));
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ embeddable });
  } catch {
    return res.status(200).json({ embeddable: true, unknown: true });
  }
}