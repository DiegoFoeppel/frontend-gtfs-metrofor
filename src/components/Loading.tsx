import { Spinner } from "@/components/ui/spinner";

export function FullScreenLoader() {
  return (
    <div
      role='status'
      className='flex h-full w-full flex-1 flex-col items-center justify-center gap-3 py-6'
    >
      <Spinner className='size-8 text-primary' />
      <p className='text-sm text-muted-foreground'>Carregando...</p>
    </div>
  );
}
