import { useEffect, useRef } from 'react';

// Calls `callback` every `intervalMs` while the tab is visible, and once more
// right when the tab becomes visible again so the screen is never stale.
// Pass `intervalMs = null` to pause polling.
export default function usePolling(callback, intervalMs = 10000) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!intervalMs) return undefined;

    const tick = () => {
      if (document.visibilityState === 'visible') saved.current();
    };
    const id = setInterval(tick, intervalMs);
    document.addEventListener('visibilitychange', tick);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [intervalMs]);
}
