import type { Stop } from "@/types";
import { cn } from "cn";

export function LineItinerary({
  stops,
  color,
  onStopClick,
  departures,
  activeStopId,
  loadingDepartures,
}: {
  stops: Stop[];
  color: string;
}) {
  return (
    <ol className='relative overflow-y-auto'>
      {stops.map((stop, i) => {
        const first = i === 0;
        const last = i === stops.length - 1;
        const terminal = first || last;
        const active = activeStopId === stop.stopId;

        return (
          <li
            key={stop.stopId}
            // className='px-4 hover:bg-muted cursor-pointer'
            className='relative px-4 '
            // onClick={() => onStopClick(stop.stopId)}
          >
            <span
              className='absolute left-[23px] w-0.5 -translate-x-1/2 bg-foreground'
              style={{ top: first ? "50%" : 0, bottom: last ? "50%" : 0 }}
            />
            {/* bolinha */}
            <span
              className={cn(
                "absolute left-4 top-1/2 z-10 size-3.5 -translate-y-1/2 rounded-full border-2 border-foreground",
                active ? "bg-foreground" : "bg-background",
              )}
            />

            <button
              type='button'
              onClick={() => onStopClick(stop.stopId)}
              className='w-full py-2 pl-8 text-left hover:bg-muted rounded-md  cursor-pointer'
            >
              <span
                className={cn("block text-lg", terminal && "font-semibold")}
              >
                {stop.stopName}
              </span>

              {active && (
                <div className='mt-1 text-sm'>
                  <span className='text-muted-foreground'>
                    Código {stop.stopCode}
                  </span>
                  <div>
                    <span>Próximos horários: </span>
                    {loadingDepartures ? (
                      <span>...</span>
                    ) : departures.length > 0 ? (
                      departures.map((h) => (
                        <span key={h} className='mr-2 font-medium'>
                          {h}
                        </span>
                      ))
                    ) : (
                      <span>sem mais partidas hoje</span>
                    )}
                  </div>
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
