import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useStopsTimetables } from "@/hooks/stops";
import type { StopProps, Timetable } from "@/types";
import { LoaderPinwheel } from "lucide-react";

export function StopInfo({ stop, onOpenChange }: StopProps) {
  const { data, isLoading } = useStopsTimetables(stop.stopId);

  if (isLoading) {
    return <LoaderPinwheel />;
  }

  // const timetables = data.timetables;
  const timetables = data?.timetables ?? [];

  return (
    <Sheet open={!!stop} onOpenChange={onOpenChange}>
      {/* <SheetTrigger render={<Button variant='outline'>Open</Button>} /> */}
      <SheetContent>
        <SheetHeader className='p-4'>
          <SheetTitle>{stop.stopName}</SheetTitle>
          <SheetDescription>
            Horários da estação {stop.stopName}.
          </SheetDescription>
        </SheetHeader>

        <div className='overflow-y-auto'>
          {timetables.length > 0 &&
            timetables.map((group: Timetable, index: number) => (
              <div className='mb-2 px-4' key={index}>
                <h1 className='font-bold text-lg mt-3 mb-1.5'>
                  Sentido {group.sentido}
                </h1>
                <div className='grid grid-cols-4 text-center gap-2'>
                  {group.horarios.map((hora: string) => (
                    <p className='rounded-md border text-md p-2' key={hora}>
                      {hora}
                    </p>
                  ))}
                </div>
              </div>
            ))}
        </div>

        <SheetFooter>
          {/* <Button type='submit'>Save changes</Button> */}
          <SheetClose render={<Button variant='outline'>Fechar</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default StopInfo;
