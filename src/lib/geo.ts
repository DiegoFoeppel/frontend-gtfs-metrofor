import type { Stop } from "@/types";

/** Distância em metros entre dois pontos (fórmula de Haversine). */
export function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function nearestStop(
  stops: Stop[],
  lat: number,
  lon: number,
): { stop: Stop; distance: number } | null {
  let best: { stop: Stop; distance: number } | null = null;
  for (const stop of stops) {
    const distance = distanceMeters(lat, lon, stop.stopLat, stop.stopLon);
    if (!best || distance < best.distance) best = { stop, distance };
  }
  return best;
}

