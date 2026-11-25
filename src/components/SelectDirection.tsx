import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@/types";

export function SelectDemo({
  directions,
  direction,
  onValueChange,
}: SelectProps) {
  const dir = directions.find((d) => d.id === direction);

  return (
    <Select
      items={directions.map((d) => ({ label: `Sentido ${d.label}`, value: d.id }))}
      value={direction}
      onValueChange={(value) => onValueChange(String(value))}
    >
      <SelectTrigger className='my-3 w-full' aria-label='Sentido'>
        <SelectValue>Sentido {dir?.label ?? ""}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Direção</SelectLabel>
          {directions.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              Sentido {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
