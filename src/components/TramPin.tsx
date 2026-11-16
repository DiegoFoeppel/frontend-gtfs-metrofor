import { cn } from "cn";
import { TramFrontIcon } from "lucide-react";

export function TramPin({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "text-background flex items-center justify-center rounded-full shadow-md transition-all",
        active
          ? "bg-foreground/80 size-7 scale-110"
          : "bg-foreground hover:bg-muted-foreground size-5.5",
      )}
    >
      <TramFrontIcon className={cn(active ? "size-4.5" : "size-3.5")} />
    </div>
  );
}
