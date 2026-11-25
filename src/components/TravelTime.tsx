import { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { useTravelTime } from "@/hooks/routes";
import type { Stop } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  routeId: string;
  direction: number;
  /** Paradas do sentido atual, na ordem da viagem. */
  stops: Stop[];
};

/** "Quanto tempo de X até Y" na mesma linha, sem baldeação. */
export function TravelTime({ routeId, direction, stops }: Props) {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);

  // `to` só pode ser uma parada depois de `from` no sentido atual.
  const fromIndex = stops.findIndex((s) => s.stopId === from);
  const toOptions = fromIndex >= 0 ? stops.slice(fromIndex + 1) : stops;

  const { data, isLoading, isError } = useTravelTime(
    routeId,
    from,
    to,
    direction,
  );

  const items = (list: Stop[]) =>
    list.map((s) => ({ label: s.stopName, value: s.stopId }));

  return (
    <Collapsible className='mb-2 shrink-0'>
      <CollapsibleTrigger className='group flex w-full cursor-pointer items-center justify-between rounded-md px-1 py-1.5 text-sm text-muted-foreground hover:bg-muted'>
        <span className='flex items-center gap-1.5'>
          <Clock className='size-4' />
          Quanto tempo demora?
        </span>
        <ChevronDown className='size-4 transition-transform group-data-panel-open:rotate-180' />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className='space-y-2 pt-2'>
          <Select
            items={items(stops)}
            value={from}
            onValueChange={(v) => {
              setFrom(v);
              setTo(null);
            }}
          >
            <SelectTrigger className='w-full' aria-label='Estação de origem'>
              <SelectValue placeholder='De' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>De</SelectLabel>
                {stops.slice(0, -1).map((s) => (
                  <SelectItem key={s.stopId} value={s.stopId}>
                    {s.stopName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select items={items(toOptions)} value={to} onValueChange={setTo}>
            <SelectTrigger className='w-full' aria-label='Estação de destino'>
              <SelectValue placeholder='Até' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Até</SelectLabel>
                {toOptions.map((s) => (
                  <SelectItem key={s.stopId} value={s.stopId}>
                    {s.stopName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {from && to && (
            <p className='flex items-center gap-1.5 text-sm' aria-live='polite'>
              <Clock className='size-4 text-muted-foreground' />
              {isLoading ? (
                <span className='text-muted-foreground'>Calculando...</span>
              ) : isError || !data ? (
                <span className='text-muted-foreground'>
                  Sem viagem direta entre essas estações.
                </span>
              ) : (
                <>
                  <span className='font-semibold'>~{data.minutes} min</span>
                  <span className='text-muted-foreground'>
                    · sem baldeação
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
