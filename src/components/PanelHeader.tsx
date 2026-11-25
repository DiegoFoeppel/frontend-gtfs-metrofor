import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  title: string;
  subtitle?: ReactNode;
  /** Cor da linha: desenha uma barra à esquerda do título. */
  color?: string;
  onBack: () => void;
  backLabel?: string;
};

/** Cabeçalho padrão das telas do painel: voltar + título (+ subtítulo). */
export function PanelHeader({
  title,
  subtitle,
  color,
  onBack,
  backLabel = "Voltar",
}: Props) {
  return (
    <div className='flex shrink-0 items-center gap-2'>
      <Button
        variant='ghost'
        size='icon'
        onClick={onBack}
        aria-label={backLabel}
      >
        <ArrowLeft />
      </Button>
      <div
        className='min-w-0 border-l-4 pl-2'
        style={{ borderLeftColor: color ?? "transparent" }}
      >
        <h2 className='truncate text-lg leading-tight font-semibold'>
          {title}
        </h2>
        {subtitle && (
          <p className='truncate text-sm text-muted-foreground'>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
