import { type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";
import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";

const Tip = ({ label, shortcut }: { label: string; shortcut: string }) => {
  return (
    <span>
      <span>{label}</span>
      {shortcut && (
        <span className="ml-2 text-gray-400">{`(${shortcut})`}</span>
      )}
    </span>
  );
};

const Control = ({
  className,
  onClick,
  Icon,
  label,
  shortcut,
  disabled = false,
}: {
  onClick: () => void;
  Icon: LucideIcon;
  label: string;
  shortcut: string;
  className?: ClassValue;
  disabled?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "rounded disabled:cursor-not-allowed disabled:text-gray-300",
            className
          )}
          disabled={disabled}
          onClick={onClick}
        >
          <Icon className="h-9 w-9 p-2" />
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={12} side="bottom">
        <Tip label={label} shortcut={shortcut} />
      </TooltipContent>
    </Tooltip>
  );
};

export default Control;
