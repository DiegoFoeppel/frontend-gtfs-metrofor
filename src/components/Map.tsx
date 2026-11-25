import { useMemo, useState } from "react";
import { SidebarIcon } from "lucide-react";
import { Map } from "@/components/ui/map";
import { cities } from "@/data";
import { useStops } from "@/hooks/stops";
import { useCompleteRoutes } from "@/hooks/use-lines";
import { useCidadeParam } from "@/hooks/useCidadeParams";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CameraPadding, CompleteRoute, Stop } from "@/types";
import AppSidebar from "./AppSidebar";
import { ThemeToggle } from "./theme-toggle";
import { MapCamera } from "./FlyTo";
import { FullScreenLoader } from "./Loading";
import { RouteExample } from "./Lines";
import { Button } from "./ui/button";

const SIDEBAR_WIDTH = 384; // md:w-96
const NO_PADDING: CameraPadding = { top: 0, bottom: 0, left: 0, right: 0 };

export function MapExample() {
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedLine, setSelectedLine] = useState<CompleteRoute | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

  const { cidade, center, zoom, setCidade } = useCidadeParam();

  const {
    data: stops = [],
    isLoading: isLoadingStops,
    error: stopsError,
  } = useStops();
  const { fullRoutes, isLoadingCompleteRoutes, errorRoutes } =
    useCompleteRoutes();

  const routes = (fullRoutes?.features ?? []) as unknown as CompleteRoute[];

  console.log("routes", routes);
  // Área do mapa coberta pelo painel, para a câmera centralizar no espaço livre.
  const padding = useMemo<CameraPadding>(() => {
    if (isMobile) {
      const h = isOpen ? window.innerHeight * 0.5 : 132;
      return { ...NO_PADDING, bottom: Math.round(h) };
    }
    return isOpen ? { ...NO_PADDING, left: SIDEBAR_WIDTH } : NO_PADDING;
  }, [isOpen, isMobile]);

  const stopCenter = useMemo<[number, number] | null>(
    () => (selectedStop ? [selectedStop.stopLon, selectedStop.stopLat] : null),
    [selectedStop],
  );
  const lineCoords = selectedLine?.geometry.coordinates ?? null;

  if (isLoadingStops || isLoadingCompleteRoutes) {
    return (
      <div className='h-dvh w-full'>
        <FullScreenLoader />
      </div>
    );
  }

  if (stopsError || errorRoutes) {
    return (
      <div className='flex h-dvh w-full flex-col items-center justify-center gap-2 p-6 text-center'>
        <p className='font-medium text-destructive'>
          Não foi possível carregar os dados do Metrofor.
        </p>
        <Button variant='outline' onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Seleção pelo mapa ou pela lista sempre abre o painel (no mobile ele
  // pode estar fechado e o usuário não veria nada acontecer).
  const selectStop = (stop: Stop) => {
    setSelectedStop(stop);
    setSelectedLine(null);
    setIsOpen(true);
  };

  const selectLine = (line: CompleteRoute) => {
    setSelectedLine(line);
    setSelectedStop(null);
    setIsOpen(true);
  };

  const changeCity = (city: typeof cidade) => {
    setSelectedLine(null);
    setSelectedStop(null);
    setCidade(city);
  };

  const cityView = cities[cidade];

  return (
    <div className='relative h-dvh w-full overflow-hidden'>
      <Map center={center as [number, number]} zoom={zoom}>
        {routes.length > 0 && (
          <RouteExample
            routes={routes}
            stops={stops}
            onSelectStop={selectStop}
            onSelectLine={selectLine}
            active={selectedLine?.properties.routeId}
          />
        )}
        <MapCamera
          cityCenter={cityView.center as [number, number]}
          cityZoom={cityView.zoom}
          stopCenter={stopCenter}
          lineCoords={lineCoords}
          padding={padding}
        />
      </Map>

      <AppSidebar
        city={cidade}
        onCityChange={changeCity}
        onSelectRoute={selectLine}
        onSelectStop={selectStop}
        stop={selectedStop}
        line={selectedLine}
        routes={routes}
        stops={stops}
        clearStop={() => setSelectedStop(null)}
        clearLine={() => setSelectedLine(null)}
        open={isOpen}
        onOpenChange={setIsOpen}
      />

      <div className='absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-[60]'>

        <ThemeToggle />

      </div>


      {!isOpen && !isMobile && (
        <Button
          size='icon'
          onClick={() => setIsOpen(true)}
          aria-label='Abrir painel'
          className='absolute top-[max(0.75rem,env(safe-area-inset-top))] left-3 z-10 shadow-md'
        >
          <SidebarIcon />
        </Button>
      )}
    </div>
  );
}

export default MapExample;
