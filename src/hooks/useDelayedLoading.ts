import { useEffect, useState } from "react";

/** Só devolve true se o loading durar mais que `delayMs` (evita flash de spinner). */
export function useDelayedLoading(isLoading: boolean, delayMs = 200) {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setElapsed(true), delayMs);
    return () => {
      clearTimeout(timer);
      setElapsed(false);
    };
  }, [isLoading, delayMs]);

  return isLoading && elapsed;
}
