import { cn } from "@/lib/utils";

interface ColorsProps {
  active?: string;
  colors: string[];
  onSelect: (color: string) => void;
}

export default function Colors({ active, colors, onSelect }: ColorsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {colors.map((color) => (
        <div
          key={color}
          className={cn(
            "p-3 rounded cursor-pointer hover:bg-gray-50",
            color === active ? "bg-gray-100" : "bg-transparent"
          )}
          onClick={() => {
            onSelect(color);
          }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ background: color }}
          ></div>
        </div>
      ))}
    </div>
  );
}
