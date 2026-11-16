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
      items={directions}
      value={direction}
      onValueChange={(value) => onValueChange(value)}
    >
      <SelectTrigger className='w-full max-w-64 mx-4'>
        {/* <SelectValue /> */}
        <SelectValue>Sentido {dir.label}</SelectValue>
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
