import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "cn";
import { StopContent } from "./StationInfo";
import LineInfo from "./LineInfo";
import ListContent from "./ListContent";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "./ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { City, CompleteRoute, Stop } from "@/types";

type Props = {
  city: City;
  onCityChange: (city: City) => void;
  routes: CompleteRoute[];
  stops: Stop[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRoute: (line: CompleteRoute) => void;
  onSelectStop: (stop: Stop) => void;
  stop: Stop | null;
  line: CompleteRoute | null;
  clearStop: () => void;
  clearLine: () => void;
};

// Snap points do bottom sheet (estilo CityMapper): só o topo, metade, quase tela cheia.
const PEEK = "132px";
const HALF = 0.5;
const FULL = 0.92;
const SNAP_POINTS = [PEEK, HALF, FULL];

const AppSidebar = ({ open, onOpenChange, ...content }: Props) => {
  const isMobile = useIsMobile();
  const [snap, setSnap] = useState<string | number | null>(HALF);

  // Sincroniza o snap quando o pai abre/fecha o painel (ex.: tocar numa estação no mapa).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setSnap(open ? (snap === PEEK ? HALF : snap) : PEEK);
  }

  const body: ReactNode = content.stop ? (
    <StopContent stop={content.stop} clearStop={content.clearStop} />
  ) : content.line ? (
    <LineInfo line={content.line} clearLine={content.clearLine} />
  ) : (
    <ListContent
      city={content.city}
      routes={content.routes}
      stops={content.stops}
      onSelectRoute={content.onSelectRoute}
      onSelectStop={content.onSelectStop}
      onCityChange={content.onCityChange}
    />
  );

  if (isMobile) {
    return (
      <Drawer
        open
        modal={false}
        disablePointerDismissal
        showSwipeHandle
        snapPoints={SNAP_POINTS}
        snapPoint={snap}
        onSnapPointChange={(next) => {
          setSnap(next);
          setPrevOpen(next !== PEEK);
          onOpenChange(next !== PEEK);
        }}
      >
        <DrawerContent aria-label='Linhas e estações' className='shadow-2xl'>
          <DrawerTitle className='sr-only'>Linhas e estações</DrawerTitle>
          {/* O popup tem 100dvh; só a parte acima do offset do snap é visível. */}
          <div
            className='flex min-h-0 flex-col gap-3 px-4 pt-1 pb-[max(1rem,env(safe-area-inset-bottom))]'
            style={{ height: "calc(100dvh - var(--drawer-snap-point-offset, 0px))" }}
          >
            {body}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <aside
      aria-label='Painel de linhas e estações'
      inert={!open}
      className={cn(
        "absolute inset-y-0 left-0 z-10 flex w-96 flex-col gap-3 border-r bg-background p-4 shadow-xl transition-transform duration-300",
        !open && "-translate-x-full",
      )}
    >
      <div className='flex shrink-0 justify-end'>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => onOpenChange(false)}
          aria-label='Fechar painel'
        >
          <X />
        </Button>
      </div>
      {body}
    </aside>
  );
};

export default AppSidebar;
