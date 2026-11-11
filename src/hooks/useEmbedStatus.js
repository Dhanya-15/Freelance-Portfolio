import { useCallback, useEffect, useState } from 'react';

const TIMEOUT = 10000;

export default function useEmbedStatus(project, enabled) {
  const [status, setStatus] = useState(
    project.embeddable === false || !project.liveUrl ? 'blocked' : 'idle'
  );

  // Ask the server whether the site allows framing (works once deployed on Vercel).
  useEffect(() => {
    if (!enabled || status !== 'idle') return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/embed-check?url=${encodeURIComponent(project.liveUrl)}`);
        const j = await r.json();
        if (!cancelled && j.embeddable === false) { setStatus('blocked'); return; }
      } catch {
        /* no API (local dev) or request failed: just try the iframe */
      }
      if (!cancelled) setStatus('loading');
    })();
    return () => { cancelled = true; };
  }, [enabled, status, project.liveUrl]);

  // If the iframe never reports loaded, treat the preview as unavailable.
  useEffect(() => {
    if (status !== 'loading') return;
    const id = setTimeout(() => setStatus((s) => (s === 'loading' ? 'blocked' : s)), TIMEOUT);
    return () => clearTimeout(id);
  }, [status]);

  const onLoad = useCallback(() => setStatus((s) => (s === 'loading' ? 'ready' : s)), []);

  return { status, onLoad };
}