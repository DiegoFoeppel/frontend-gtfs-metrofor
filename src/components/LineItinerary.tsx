import type { Stop } from "@/types";
import { cn } from "cn";

type Props = {
  stops: Stop[];
  color: string;
  onStopClick: (stopId: string) => void;
  departures: string[];
  activeStopId: string | null;
  loadingDepartures: boolean;
};

export function LineItinerary({
  stops,
  color,
  onStopClick,
  departures,
  activeStopId,
  loadingDepartures,
}: Props) {
  return (
    <ol className='relative min-h-0 flex-1 overflow-y-auto scrollbar-none'>
      {stops.map((stop, i) => {
        const first = i === 0;
        const last = i === stops.length - 1;
        const terminal = first || last;
        const active = activeStopId === stop.stopId;

        return (
          <li key={stop.stopId} className='relative'>
            <span
              aria-hidden
              className='absolute left-[11px] w-1 -translate-x-1/2'
              style={{
                top: first ? 20 : 0,
                bottom: last ? "calc(100% - 20px)" : 0,
                background: color,
              }}
            />
            <span
              aria-hidden
              className='absolute top-5 left-1 z-10 size-3.5 -translate-y-1/2 rounded-full border-2 bg-background'
              style={{
                borderColor: color,
                background: active ? color : undefined,
              }}
            />

            <button
              type='button'
              onClick={() => onStopClick(stop.stopId)}
              aria-current={active ? "true" : undefined}
              className='w-full cursor-pointer rounded-md py-2.5 pr-2 pl-8 text-left hover:bg-muted'
            >
              <span
                className={cn("block text-base", terminal && "font-semibold")}
              >
                {stop.stopName}
              </span>

              {active && (
                <div className='mt-1 text-sm'>
                  <span className='text-xs text-muted-foreground'>
                    Código {stop.stopCode}
                  </span>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                    <span className='text-muted-foreground'>Próximos:</span>
                    {loadingDepartures ? (
                      <span>...</span>
                    ) : departures.length > 0 ? (
                      departures.map((h) => (
                        <span key={h} className='font-medium tabular-nums'>
                          {h}
                        </span>
                      ))
                    ) : (
                      <span>Sem mais partidas hoje</span>
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
