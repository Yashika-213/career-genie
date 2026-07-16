import { useCallback, useEffect, useState } from 'react';

const KEY = 'careergenie:activeRoadmap';

/** Remembers which roadmap the user is currently working on (localStorage-backed). */
export function useActiveRoadmap() {
  const [activeId, setActiveId] = useState<number | null>(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? Number(raw) : null;
  });

  useEffect(() => {
    if (activeId != null) localStorage.setItem(KEY, String(activeId));
  }, [activeId]);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    setActiveId(null);
  }, []);

  return { activeId, setActiveId, clear };
}
