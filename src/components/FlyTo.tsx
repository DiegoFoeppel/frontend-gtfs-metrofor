import { useEffect, useRef } from "react";
import { LngLatBounds } from "maplibre-gl";
import { useMap } from "./ui/map";
import type { CameraPadding } from "@/types";

type Props = {
  cityCenter: [number, number];
  cityZoom: number;
  stopCenter: [number, number] | null;
  lineCoords: [number, number][] | null;
  /** Área coberta pelo painel (lateral no desktop, inferior no mobile). */
  padding: CameraPadding;
};

/** Controla a câmera: cidade → estação → linha, respeitando o painel aberto. */
export function MapCamera({
  cityCenter,
  cityZoom,
  stopCenter,
  lineCoords,
  padding,
}: Props) {
  const { map, isLoaded } = useMap();

  // padding lido via ref: abrir/fechar o painel não deve mover a câmera.
  const paddingRef = useRef(padding);
  useEffect(() => {
    paddingRef.current = padding;
  }, [padding]);

  const [cityLng, cityLat] = cityCenter;
  useEffect(() => {
    if (!map || !isLoaded) return;
    map.flyTo({
      center: [cityLng, cityLat],
      zoom: cityZoom,
      padding: paddingRef.current,
      duration: 1000,
      essential: true,
    });
  }, [map, isLoaded, cityLng, cityLat, cityZoom]);

  const stopLng = stopCenter?.[0];
  const stopLat = stopCenter?.[1];
  useEffect(() => {
    if (!map || !isLoaded || stopLng == null || stopLat == null) return;
    map.flyTo({
      center: [stopLng, stopLat],
      zoom: Math.max(map.getZoom(), 14.5),
      padding: paddingRef.current,
      duration: 800,
      essential: true,
    });
  }, [map, isLoaded, stopLng, stopLat]);

  useEffect(() => {
    if (!map || !isLoaded || !lineCoords?.length) return;
    const bounds = lineCoords.reduce(
      (b, c) => b.extend(c),
      new LngLatBounds(lineCoords[0], lineCoords[0]),
    );
    const p = paddingRef.current;
    map.fitBounds(bounds, {
      padding: {
        top: p.top + 48,
        bottom: p.bottom + 48,
        left: p.left + 48,
        right: p.right + 48,
      },
      duration: 800,
      maxZoom: 15,
    });
  }, [map, isLoaded, lineCoords]);

  return null;
}
