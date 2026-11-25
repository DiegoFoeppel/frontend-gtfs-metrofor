import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStopsTimetables } from "@/hooks/stops";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import type { Stop, StopTimetables, Timetable } from "@/types";
import { FullScreenLoader } from "./Loading";

type Props = { stop: Stop; clearStop: () => void };

export const StopContent = ({ stop, clearStop }: Props) => {
  const query = useStopsTimetables(stop.stopId);
  const { isLoading, isError, error, refetch } = query;
  const data = query.data as StopTimetables | undefined;
  const showLoader = useDelayedLoading(isLoading, 200);
  const timetables = data?.timetables ?? [];

  const header = (
    <div className='flex shrink-0 items-center gap-2'>
      <Button
        variant='ghost'
        size='icon'
        onClick={clearStop}
        aria-label='Voltar'
      >
        <ArrowLeft />
      </Button>
      <div className='min-w-0'>
        <h2 className='text-lg leading-tight font-semibold'>{stop.stopName}</h2>
        <p className='text-sm text-muted-foreground'>Horários da estação</p>
      </div>
    </div>
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
        {timetables.map((group: Timetable) => (
          <section key={group.directionId} className='mb-3'>
            <h3 className='mt-2 mb-1.5 text-base font-semibold'>
              Sentido {group.sentido}
            </h3>
            <div className='grid grid-cols-4 gap-2 text-center'>
              {group.horarios.map((hora) => (
                <p
                  className='rounded-md border p-2 text-sm tabular-nums'
                  key={hora}
                >
                  {hora}
                </p>
              ))}
            </div>
          </section>
        ))}
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
