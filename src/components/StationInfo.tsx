import { ChevronDown, Clock, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelHeader } from "./PanelHeader";
import { useStopsTimetables } from "@/hooks/stops";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import type { Stop, StopTimetables, Timetable } from "@/types";
import { useNowMinutes } from "@/hooks/useNow";
import { formatEta, hasServiceToday, nextTrain, toMinutes } from "@/lib/time";
import { cn } from "cn";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { FullScreenLoader } from "./Loading";

type Props = { stop: Stop; clearStop: () => void };

export const StopContent = ({ stop, clearStop }: Props) => {
  const query = useStopsTimetables(stop.stopId);
  const { isLoading, isError, error, refetch } = query;
  const data = query.data as StopTimetables | undefined;
  const showLoader = useDelayedLoading(isLoading, 200);
  const now = useNowMinutes();
  const timetables = data?.timetables ?? [];

  const header = (
    <PanelHeader
      title={stop.stopName}
      subtitle='Horários da estação'
      onBack={clearStop}
    />
  );

  let body;
  if (isError) {
    body = (
      <div
        role='alert'
        className='space-y-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm'
      >
        <p className='font-medium text-destructive'>
          Não foi possível carregar os horários.
        </p>
        <p className='text-xs text-muted-foreground'>
          {error instanceof Error ? error.message : "Erro inesperado"}
        </p>
        <Button size='sm' variant='outline' onClick={() => refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  } else if (!hasServiceToday()) {
    body = (
      <p className='py-6 text-center text-sm text-muted-foreground'>
        Não há operação aos domingos.
      </p>
    );
  } else if (isLoading) {
    // < 200ms: não mostra nada para evitar flash do spinner
    body = showLoader ? <FullScreenLoader /> : null;
  } else if (timetables.length === 0) {
    body = (
      <p className='py-6 text-center text-sm text-muted-foreground'>
        Nenhum horário previsto para esta estação hoje.
      </p>
    );
  } else {
    body = (
      <div className='min-h-0 flex-1 overflow-y-auto scrollbar-none'>
        {timetables.map((group: Timetable) => {
          const next = nextTrain(group.horarios, now);
          return (
            <section
              key={group.directionId}
              className='mb-3 rounded-lg border p-3'
            >
              <h3 className='flex items-center gap-1.5 text-sm font-medium'>
                <TrainFront className='size-4 text-muted-foreground' />
                Sentido {group.sentido}
              </h3>
              <p className='mt-1.5 flex items-center gap-1.5 text-sm'>
                <Clock className='size-4 text-muted-foreground' />
                {next ? (
                  <>
                    <span className='font-semibold tabular-nums'>
                      {next.time.slice(0, 5)}
                    </span>
                    <span className='text-muted-foreground'>
                      · {formatEta(next.inMinutes)}
                    </span>
                  </>
                ) : (
                  <span className='text-muted-foreground'>
                    Sem mais partidas hoje
                  </span>
                )}
              </p>

              <Collapsible defaultOpen className='mt-2'>
                <CollapsibleTrigger className='group flex w-full cursor-pointer items-center justify-between rounded-md px-1 py-1.5 text-sm text-muted-foreground hover:bg-muted'>
                  Grade do dia
                  <ChevronDown className='size-4 transition-transform group-data-panel-open:rotate-180' />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className='grid grid-cols-4 gap-2 pt-2 text-center'>
                    {group.horarios.map((hora) => (
                      <p
                        key={hora}
                        className={cn(
                          'rounded-md border p-1.5 text-sm tabular-nums',
                          toMinutes(hora) < now &&
                            'text-muted-foreground opacity-50',
                          hora === next?.time &&
                            'border-primary font-semibold',
                        )}
                      >
                        {hora.slice(0, 5)}
                      </p>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-2'>
      {header}
      {body}
    </div>
  );
};

export default StopContent;
