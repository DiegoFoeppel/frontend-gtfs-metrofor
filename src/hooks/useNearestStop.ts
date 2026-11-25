import { useCallback, useState } from "react";
import { nearestStop } from "@/lib/geo";
import type { Stop } from "@/types";

// Acima disso o usuário está fora da área atendida (ex.: outra cidade/estado).
const MAX_DISTANCE_M = 30_000;

type Result = { stop: Stop; distance: number };

export function useNearestStop(stops: Stop[]) {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(
    (onFound: (result: Result) => void) => {
      setError(null);

      if (!("geolocation" in navigator)) {
        setError("Seu navegador não suporta localização.");
        return;
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setIsLocating(false);
          const result = nearestStop(stops, coords.latitude, coords.longitude);
          if (!result || result.distance > MAX_DISTANCE_M) {
            setError("Nenhuma estação perto de você.");
            return;
          }
          onFound(result);
        },
        (err) => {
          setIsLocating(false);
          setError(
            err.code === err.PERMISSION_DENIED
              ? "Permissão de localização negada."
              : "Não foi possível obter sua localização.",
          );
        },
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
      );
    },
    [stops],
  );

  return { locate, isLocating, error };
}
