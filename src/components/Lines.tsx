import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapRoute,
} from "@/components/ui/map";
import { TramPin } from "./TramPin";
import type { CompleteRoute, Stop } from "@/types";

type Props = {
  routes: CompleteRoute[];
  stops: Stop[];
  onSelectLine: (line: CompleteRoute) => void;
  onSelectStop: (stop: Stop) => void;
  active?: string;
};

export function RouteExample({
  routes,
  stops,
  onSelectLine,
  onSelectStop,
  active,
}: Props) {
  return (
    <>
      {routes.map((line) => {
        const id = line.properties.routeId;

        return (
          <MapRoute
            key={id}
            onClick={() => onSelectLine(line)}
            coordinates={line.geometry.coordinates}
            color={line.properties.color}
            width={6}
            opacity={active ? 0.35 : 1}
            active={id === active}
            activeOpacity={1}
          />
        );
      })}

      {stops.map((stop) => (
        <MapMarker
          key={stop.stopId}
          longitude={stop.stopLon}
          latitude={stop.stopLat}
          onClick={(e) => {
            e.stopPropagation();
            onSelectStop(stop);
          }}
        >
          <MarkerContent>
            <TramPin active={false} />
          </MarkerContent>
          <MarkerTooltip>
            <span>Estação {stop.stopName}</span>
          </MarkerTooltip>
        </MapMarker>
      ))}
    </>
  );
}
