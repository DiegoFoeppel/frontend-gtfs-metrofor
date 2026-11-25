import { useState } from "react";
import { Button } from "./ui/button";
import { useStopsByRouteId } from "@/hooks/routes";
import { useStopsTimetables } from "@/hooks/stops";
import { SelectDemo } from "./SelectDirection";
import { LineItinerary } from "./LineItinerary";
import { TravelTime } from "./TravelTime";
import { FullScreenLoader } from "./Loading";
import { PanelHeader } from "./PanelHeader";
import { hasServiceToday } from "@/lib/time";
import type { LineInfoProps, LineStopsResponse, StopTimetables } from "@/types";

const LineInfo = ({ line, clearLine }: LineInfoProps) => {
  const [direction, setDirection] = useState(0);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const query = useStopsByRouteId(line.properties.routeId, direction);
  const { isLoading, isError, error, refetch } = query;
  const data = query.data as LineStopsResponse | undefined;

  const stops = data?.stops ?? [];
  const activeStopId = selectedStopId ?? stops[0]?.stopId ?? null;

  const timetableQuery = useStopsTimetables(activeStopId, direction);
  const timetable = timetableQuery.data as StopTimetables | undefined;
  const departures = timetable?.nextDepartures ?? [];

  const handleDirectionChange = (value: string) => {
    setDirection(Number(value));
    setSelectedStopId(null); // volta para a primeira parada do novo sentido
  };

  const color = line.properties.color;

  const header = (
    <PanelHeader
      title={line.properties.name}
      subtitle={line.properties.description}
      color={color}
      onBack={clearLine}
      backLabel='Voltar para a lista'
    />
  );

  if (isLoading) {
    return (
      <>
        {header}
        <FullScreenLoader />
      </>
    );
  }

  if (isError) {
    return (
      <>
        {header}
        <div
          role='alert'
          className='space-y-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm'
        >
          <p className='font-medium text-destructive'>
            Não foi possível carregar as estações.
          </p>
          <p className='text-xs text-muted-foreground'>
            {error instanceof Error ? error.message : "Erro inesperado"}
          </p>
          <Button size='sm' variant='outline' onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      </>
    );
  }

  const directions = data?.directions ?? [];

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {header}

      {directions.length > 0 && (
        <SelectDemo
          direction={direction}
          onValueChange={handleDirectionChange}
          directions={directions}
        />
      )}

      <TravelTime

        key={direction}

        routeId={line.properties.routeId}

        direction={direction}

        stops={stops}

      />


      <LineItinerary
        stops={stops}
        color={color}
        onStopClick={setSelectedStopId}
        departures={departures}
        activeStopId={activeStopId}
        loadingDepartures={timetableQuery.isLoading}
        noService={!hasServiceToday()}
      />
    </div>
  );
};

export default LineInfo;
