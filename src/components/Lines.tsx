import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapRoute,
} from "@/components/ui/map";
import { TramFrontIcon } from "lucide-react";

// const route = [
//   [-74.006, 40.7128], // NYC City Hall
//   [-73.9857, 40.7484], // Empire State Building
//   [-73.9772, 40.7527], // Grand Central
//   [-73.9654, 40.7829], // Central Park
// ] as [number, number][];

// const stops = [
//   { name: "City Hall", lng: -74.006, lat: 40.7128 },
//   { name: "Empire State Building", lng: -73.9857, lat: 40.7484 },
//   { name: "Grand Central Terminal", lng: -73.9772, lat: 40.7527 },
//   { name: "Central Park", lng: -73.9654, lat: 40.7829 },
// ];

export function RouteExample({ routes, stops, onStopClick }) {
  console.log("routes", routes);
  return (
    <>
      {routes.length > 0 &&
        routes.map((line) => {
          console.log("line", line);
          const coords = line.coordinates.map((item) => [
            item.longitude,
            item.latitude,
          ]);

          return (
            <MapRoute
              key={line.id}
              coordinates={coords}
              color={`#${line.routeColor}`}
              width={4}
              opacity={0.8}
            />
          );
        })}

      {stops.length > 0 &&
        stops.map((stop) => (
          <MapMarker
            key={stop.stopId}
            longitude={stop.stopLon}
            latitude={stop.stopLat}
            onClick={() => onStopClick(stop)}
          >
            <MarkerContent>
              <div className='flex size-5 p-1 items-center justify-center rounded-full border-2 border-white bg-black text-xs font-semibold text-white shadow-lg'>
                {/* {index + 1} */}
                <TramFrontIcon size={16} />
              </div>
            </MarkerContent>
            <MarkerTooltip>{stop.stopName}</MarkerTooltip>
          </MapMarker>
        ))}
    </>
  );
}
