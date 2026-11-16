import { Map } from "@/components/ui/map";
import { RouteExample } from "./Lines";
import { useState } from "react";
import type { City, Line, Stop } from "@/types";
import StationInfo from "./StationInfo";
import { SidebarIcon } from "lucide-react";
import { MapCamera } from "./Bounds";
import { cities } from "@/data";
import { FlyToSelected } from "./FlyTo";
import { useCompleteRoutes } from "@/hooks/use-lines";
import { Button } from "./ui/button";
import AppSidebar from "./AppSidebar";
import { useStops } from "@/hooks/stops";
import LineInfo from "./LineInfo";

type Props = {
  lineCoords: [number, number][] | null; // [lng, lat], da linha selecionada
  cityView: { center: [number, number]; zoom: number };
};

const inactiveOpacity = 0.35;

const cityView = {
  center: [-38.565, -3.8] as [number, number],
  zoom: 11.5,
};

export function MapExample() {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  // const [lineIndex, setLineIndex] = useState<string | null>(null);
  const lineIndex = selectedLine?.routeId;

  const [selectedCity, setSelectedCity] = useState<City>("fortaleza");
  const [isOpen, setIsOpen] = useState(false);

  const { data: stops = [], stopsError, isLoadingStops } = useStops();

  const { fullRoutes, completeRoutesError, isLoadingCompleteRoutes } =
    useCompleteRoutes();

  const routes = fullRoutes?.features ?? [];

  if (isLoadingStops || isLoadingCompleteRoutes) {
    return <h1>Carregando...</h1>;
  }

  const handleRouteSelect = (line: Line) => {
    // const result = id === lineIndex ? null : id;
    // setLineIndex(result);
    setSelectedLine(line);
    // map?.flyTo({ center: cities[id].center, zoom: cities[id].zoom });
  };

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    setSelectedLine(null);
  };

  const handleSidebar = () => {
    setIsOpen(true);
  };

  return (
    <div className='h-screen w-full relative'>
      <Map center={[-38.565, -3.8]} zoom={13}>
        {routes.length > 0 && (
          <RouteExample
            // routes={routes}
            routes={routes}
            stops={stops}
            onStopClick={setSelectedStop}
            onLineClick={setSelectedLine}
            active={lineIndex}
          />
        )}

        {selectedStop && (
          <StationInfo
            stop={selectedStop}
            onOpenChange={() => setSelectedStop(null)}
          />
        )}

        {selectedLine && (
          <LineInfo
            line={selectedLine}
            onOpenChange={() => setSelectedLine(null)}
          />
        )}

        {/* <MapCamera
          lineCoords={lineCoords ?? null}
          cityView={cityView}
          // active={selectedLine}
        />
        <FlyToSelected
          place={cities[selectedCity].center}
          zoom={cities[selectedCity].zoom}
        /> */}
      </Map>

      <AppSidebar
        city={selectedCity}
        onCityChange={handleCityClick}
        onSelectRoute={handleRouteSelect}
        onSelectStop={setSelectedStop}
        routes={routes}
        // onCityChange={(id) => {
        //   setCityId(id);
        //   setFocusedRouteId(null);
        // }}
        open={isOpen}
        stops={stops}
        onOpenChange={() => setIsOpen(false)}
      />

      <div
        // role='radiogroup'
        // aria-label='Route options'
        // className='bg-background/95 border-border/50 absolute top-3 left-3 w-48 space-y-0.5 rounded-lg border p-1 shadow-lg backdrop-blur-md'
        className=' absolute top-3 left-3 space-y-0.5'
      >
        <Button onClick={handleSidebar}>
          <SidebarIcon />
        </Button>
      </div>
    </div>
  );
}

export default MapExample;

// const routes = lines.geojson.features ?? [];
// const stops = lines.stopsLine ?? [];
// const routeId = selectedLine?.routeId ?? null;

// const route = routes.find((r) => r.id === lineIndex);

// const lineCoords =
// route?.coordinates.map((c) => [c.longitude, c.latitude]) ?? [];

// const currentGeojson = cities[selectedCity].geojson;
