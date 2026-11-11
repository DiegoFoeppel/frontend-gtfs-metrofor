import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useStopsTimetables } from "@/hooks/stops";
import { LoaderPinwheel } from "lucide-react";

export function StationInfo({ stop, onOpenChange }) {
  console.log("stop", stop);

  const { data, isLoading, error } = useStopsTimetables(stop.stopId);

  if (isLoading) {
    return <LoaderPinwheel />;
  }

  console.log("data", data);

  const timetables = data.timetables;

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
            timetables.map((group, index) => (
              <div className='mb-2 px-4' key={index}>
                <h1 className='font-bold text-lg mt-3 mb-1.5'>
                  Sentido {group.sentido}
                </h1>
                <div className='grid grid-cols-4 text-center gap-2'>
                  {group.horarios.map((hora) => (
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

export default StationInfo;
