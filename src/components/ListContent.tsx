import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { selectCities } from "@/data";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import type { City, CompleteRoute, Stop } from "@/types";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

type Props = {
  city: City;
  routes: CompleteRoute[];
  stops: Stop[];
  onSelectRoute: (line: CompleteRoute) => void;
  onSelectStop: (stop: Stop) => void;
  onCityChange: (city: City) => void;
};

const ListContent = ({
  city,
  routes,
  stops,
  onSelectRoute,
  onSelectStop,
  onCityChange,
}: Props) => {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());

  const cityId = selectCities.find((c) => c.value === city)?.id;

  // Só mostra as linhas da cidade selecionada (antes eram listadas desabilitadas).
  const cityRoutes = useMemo(
    () => routes.filter((r) => Number(r.properties.cityId) === cityId),
    [routes, cityId],
  );

  const filteredRoutes = useMemo(
    () =>
      q
        ? cityRoutes.filter((r) => normalize(r.properties.name).includes(q))
        : cityRoutes,
    [cityRoutes, q],
  );

  const filteredStops = useMemo(() => {
    if (!q) return [];
    return stops
      .filter(
        (s) =>
          normalize(s.stopName).includes(q) ||
          s.stopCode.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [stops, q]);

  return (
    <>
      <Select
        items={selectCities}
        value={city}
        onValueChange={(v) => v && onCityChange(v as City)}
      >
        <SelectTrigger className='w-full' aria-label='Cidade'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cidade</SelectLabel>
            {selectCities.map((item) => (
              <SelectItem key={item.id} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Command shouldFilter={false} className='min-h-0 flex-1 bg-transparent'>
        <CommandInput
          placeholder='Buscar linha ou estação...'
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className='max-h-none flex-1'>
          <CommandEmpty>Nada encontrado.</CommandEmpty>

          {filteredRoutes.length > 0 && (
            <CommandGroup heading='Linhas'>
              {filteredRoutes.map((r) => (
                <CommandItem
                  key={r.properties.routeId}
                  className='cursor-pointer py-2.5 md:py-1.5'
                  value={`line-${r.properties.routeId}`}
                  onSelect={() => onSelectRoute(r)}
                >
                  <span
                    className='mr-2 size-2.5 shrink-0 rounded-full'
                    style={{ background: r.properties.color }}
                  />
                  <div className='flex flex-col'>
                    <span>{r.properties.name}</span>

                    <span className='text-xs text-muted-foreground'>
                      {r.properties.type ? "Metrô" : "VLT"} -{" "}
                      {r.properties.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredStops.length > 0 && (
            <CommandGroup heading='Estações'>
              {filteredStops.map((s) => (
                <CommandItem
                  key={s.stopId}
                  className='cursor-pointer py-2.5 md:py-1.5'
                  value={`stop-${s.stopId}`}
                  onSelect={() => {
                    onSelectStop(s);
                    setQuery("");
                  }}
                >
                  <span className='flex-1'>{s.stopName}</span>
                  <span className='text-xs text-muted-foreground'>
                    {s.stopCode}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </>
  );
};

export default ListContent;
