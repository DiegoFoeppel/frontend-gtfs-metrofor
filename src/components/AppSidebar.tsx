import { useMemo, useState } from "react";

import { Button } from "./ui/button";
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
import { X } from "lucide-react";
import { cn } from "cn";
import { ModeToggle } from "./mode-toggle";
import { ThemeToggle } from "./theme-toggle";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const AppSidebar = ({
  city,
  onCityChange,
  routes,
  open,
  onOpenChange,
  stops,
  onSelectRoute,
  onSelectStop,
}) => {
  const [query, setQuery] = useState("");
  const q = normalize(query.trim());

  const filteredRoutes = useMemo(
    () =>
      q
        ? routes.filter((r) => normalize(r.properties.name).includes(q))
        : routes,
    [routes, q],
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
    <aside
      className={cn(
        "absolute left-0 top-0 z-10 flex h-full w-80 flex-col gap-3 border-r bg-background p-4 shadow-xl transition-transform",
        !open && "-translate-x-full",
      )}
    >
      <div className='flex items-center gap-2'>
        <Select items={selectCities} value={city} onValueChange={onCityChange}>
          <SelectTrigger className='w-full'>
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

        <Button
          size='icon'
          variant='ghost'
          onClick={() => onOpenChange(false)}
          aria-label='Fechar painel'
        >
          <X />
        </Button>
      </div>

      {/* <ModeToggle /> */}
      <ThemeToggle />
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
                  value={`line-${r.properties.routeId}`}
                  onSelect={() => onSelectRoute(r)}
                >
                  <span
                    className='mr-2 size-2.5 shrink-0 rounded-full'
                    style={{ background: r.properties.color }}
                  />
                  <div className='flex flex-col'>
                    <span>{r.properties.name}</span>
                    <span className='text-sml text-muted-foreground'>
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
    </aside>
  );
};

export default AppSidebar;
