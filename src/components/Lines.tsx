import {
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapRoute,
} from "@/components/ui/map";
import { TramPin } from "./TramPin";

export function RouteExample({
  routes,
  stops,
  onStopClick,
  onLineClick,
  active,
}) {
  console.log("routes sda", routes);
  return (
    <>
      {routes.length > 0 &&
        routes.map((line) => {
          console.log("line", line);
          const coords = line.geometry.coordinates;
          const id = line.id;
          const color = line.properties.color;

          return (
            <MapRoute
              key={id}
              onClick={() => onLineClick(line)}
              coordinates={coords}
              color={line.properties.color}
              width={6}
              opacity={1}
              // opacity={active ? 0.35 : 1}
              // active={id === active}
              // activeOpacity={1}
            />
          );
        })}

      {stops.length > 0 &&
        stops.map((stop) => (
          <MapMarker
            key={stop.stopId}
            longitude={stop.stopLon}
            latitude={stop.stopLat}
            // onClick={() => onStopClick(stop)}
            onClick={(e) => {
              e.stopPropagation();
              onStopClick(stop);
            }}
          >
            <MarkerContent>
              {/* <div className='flex size-5  items-center justify-center rounded-full border-2 border-white bg-white text-xs font-semibold text-black shadow-lg'> */}
              {/* {index + 1} */}
              <TramPin active={false} />
              {/* </div> */}
            </MarkerContent>
            <MarkerTooltip>
              <div className='flex flex-col'>
                <span>Estação{stop.stopName}</span>
                <span>Lng: {stop.stopLon}</span>
                <span>Lat: {stop.stopLat}</span>
              </div>
            </MarkerTooltip>
          </MapMarker>
        ))}
    </>
  );
}
