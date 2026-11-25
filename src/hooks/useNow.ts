import { useEffect, useState } from "react";
import { nowMinutes } from "@/lib/time";

/** Minutos desde a meia-noite (Fortaleza), atualizado a cada 30s. */
export function useNowMinutes(intervalMs = 30_000) {
  const [now, setNow] = useState(() => nowMinutes());

  useEffect(() => {
    const id = setInterval(() => setNow(nowMinutes()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
