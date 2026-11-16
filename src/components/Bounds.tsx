import { useEffect } from "react";
import { useMap } from "@/components/ui/map";
import { LngLatBounds } from "maplibre-gl";

type Props = {
  lineCoords: [number, number][] | null; // [lng, lat], da linha selecionada
  cityView: { center: [number, number]; zoom: number };
};

export function MapCamera({ lineCoords, cityView }: Props) {
  const { map, isLoaded } = useMap();

  console.log("line", lineCoords);

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (lineCoords?.length) {
      const bounds = lineCoords.reduce(
        (b, c) => b.extend(c),
        new LngLatBounds(lineCoords[0], lineCoords[0]),
      );

      console.log("bounds", bounds);
      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        duration: 800,
        maxZoom: 15,
      });
    } else {
      map.flyTo({
        center: cityView.center,
        zoom: cityView.zoom,
        duration: 800,
      });
    }
  }, [map, isLoaded, lineCoords, cityView]);

  return null;
}
