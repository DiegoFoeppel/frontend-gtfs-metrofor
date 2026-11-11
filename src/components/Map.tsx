import { Map } from "@/components/ui/map";
import useStations from "@/hooks/useStations";
import { RouteExample } from "./Lines";
import { useState } from "react";
import type { Stop } from "@/types";
import StationInfo from "./StationInfo";

export function MapExample() {
  const { data: lines = {}, error, isLoading } = useStations();

  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  const routes = lines.geojson.features;
  const stops = lines.stopsLine;

  console.log("lines", routes, stops);

  return (
    <div className='h-screen w-full'>
      <Map center={[-38.5269, -3.7331]} zoom={11}>
        {routes.length > 0 && (
          <RouteExample
            routes={routes}
            stops={stops}
            onStopClick={setSelectedStop}
          />
        )}

        {selectedStop && (
          <StationInfo
            stop={selectedStop}
            onOpenChange={() => setSelectedStop(null)}
          />
        )}
      </Map>
    </div>
  );
}

export default MapExample;
