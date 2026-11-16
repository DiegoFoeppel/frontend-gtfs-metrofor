import { useEffect } from "react";
import { useMap } from "./ui/map";

export function FlyToSelected({ place, zoom }) {
  const { map } = useMap();

  console.log("map", place);

  useEffect(() => {
    if (!map || !place) return;
    map.flyTo({
      center: [place[0], place[1]],
      zoom: zoom,
      duration: 1000,
      essential: true,
    });
  }, [map, place, zoom]);

  return null;
}
