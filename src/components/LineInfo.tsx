import {
  SheetClose,
  SheetContent,
  SheetFooter,
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { useStopsByRouteId } from "@/hooks/routes";
import { useStopsTimetables } from "@/hooks/stops";
import { SelectDemo } from "./SelectDirection";
import { useState } from "react";
// import { cn } from "cn";
import type { LineInfoProps } from "@/types";
import { LineItinerary } from "./LineItinerary";

const LineInfo = ({ line, onOpenChange }: LineInfoProps) => {
  const [direction, setDirection] = useState(0);

  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const { data, isLoading } = useStopsByRouteId(
    line.properties.routeId,
    direction,
  );

  const stops = data?.stops ?? [];
  const activeStopId = selectedStopId ?? stops[0]?.stopId ?? null;

  const { data: timetable, isLoading: isLoadingDepartures } =
    useStopsTimetables(activeStopId, direction);

  const departures = timetable?.nextDepartures ?? [];

  // const { data: departures = [], isLoading: loadingDepartures } =
  //   useStopsTimetables(activeStopId, direction);

  const handleDirectionChange = (value: string) => {
    setDirection(Number(value));
    setSelectedStopId(null); // volta para a primeira parada do novo sentido
  };

  if (isLoading) {
    return <h1>Carregando...</h1>;
  }

  // const route = route.route;
  const directions = data.directions ?? [];

  const color = line.properties.color;

  return (
    <Sheet open={!!line} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader
          className='m-4 p-0 pl-2 border-l-5'
          style={{ borderLeftColor: color }}
        >
          <SheetTitle>
            <span className=''>{line.properties.name}</span>
          </SheetTitle>
          <SheetDescription>
            Estações da linha {line.properties.description}
          </SheetDescription>
        </SheetHeader>

        {/* trocar sentido */}
        {directions.length > 0 && (
          <SelectDemo
            direction={direction}
            onValueChange={handleDirectionChange}
            directions={directions}
          />
        )}

        <LineItinerary
          stops={stops}
          color='black'
          onStopClick={setSelectedStopId}
          departures={departures}
          activeStopId={activeStopId}
          loadingDepartures={isLoadingDepartures}
        />

        <SheetFooter>
          <SheetClose render={<Button variant='outline'>Fechar</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default LineInfo;

// const [direction, setDirection] = useState(0);
// const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

// const { data: route, isLoading } = useStopsByRouteId(line.route_id, direction);

// const stops = route?.stops ?? [];
// const activeStopId = selectedStopId ?? stops[0]?.stopId ?? null;

// // só dispara quando já existe uma parada ativa
// const { data: departures = [], isLoading: loadingDepartures } =
//   useStopsTimetables(activeStopId, direction);

// const handleDirectionChange = (value: string) => {
//   setDirection(Number(value));
//   setSelectedStopId(null); // volta para a primeira parada do novo sentido
// };
