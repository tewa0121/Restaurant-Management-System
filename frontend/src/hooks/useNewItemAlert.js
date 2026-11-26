import { useEffect, useRef } from 'react';
import { playBeep } from '../utils/preferences';

// Plays a sound when a polled list gains an id it has not shown before.
// `ready` must be false until the first load finished, so opening the page
// never beeps for everything that was already there.
export default function useNewItemAlert(ids, { ready, enabled, kind = 'new' }) {
  const seen = useRef(null);
  const signature = ids.join('|');

  useEffect(() => {
    if (!ready) return;
    const current = new Set(ids.map(String));
    if (seen.current === null) {
      seen.current = current;
      return;
    }
    let fresh = false;
    current.forEach((id) => {
      if (!seen.current.has(id)) fresh = true;
    });
    seen.current = current;
    if (fresh && enabled) playBeep(kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, ready, enabled, kind]);
}
