import { Label } from "@/lib/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";
import { useActions, useLocalState, useUsedColors } from "@/stores/store";
import BaseColorPicker from "@/components/shared/ColorPicker";
import Colors from "@/components/shared/Colors";
import { useState } from "react";

const DEFAULT_COLORS = [
  "#F88DA7",
  "#D12C2F",
  "#F76803",
  "#FBBA01",
  "#7BDCB5",
  "#43D082",
  "#8DD1FC",
  "#2594E2",
  "#EEEEEE",
  "#ABB7C3",
];

type onChange = (color: string) => void;

const UsedColors = ({ onChange }: { onChange: onChange }) => {
  const usedColors = useUsedColors();
  const { color } = useLocalState();
  if (!usedColors.length) return null;

  return (
    <div className="w-full">
      <Colors colors={usedColors} onSelect={onChange} active={color} />
    </div>
  );
};

export const MobileColorPicker = () => {
  const { setColor } = useActions();
  const { color } = useLocalState();

  const [open, setOpen] = useState(false);
  const onSetColor = (color: string) => {
    setOpen(false);
    setColor(color);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-8 h-8 border-2 border-white rounded-full outline-1 outline-gray-300 outline"
          style={{ background: color }}
        ></button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: "250px" }}
        onOpenAutoFocus={(e) => {
          // don't autofocus on the color hex input
          e.preventDefault();
        }}
      >
        <BaseColorPicker color={color} onChange={onSetColor} />
        <div className="mb-4 border-b border-gray-100"></div>
        <Colors colors={DEFAULT_COLORS} onSelect={onSetColor} active={color} />
        <div className="my-4 border-b border-gray-100"></div>
        <UsedColors onChange={onSetColor} />
      </PopoverContent>
    </Popover>
  );
};

export const ColorPicker = () => {
  const { setColor } = useActions();
  const { color } = useLocalState();

  return (
    <div className="p-2">
      <Label>Color</Label>
      <div className="flex flex-col items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="w-full h-8 border-4 border-white rounded outline-1 outline-gray-300 outline"
              style={{ background: color }}
            ></button>
          </PopoverTrigger>
          <PopoverContent style={{ width: "250px" }}>
            <BaseColorPicker color={color} onChange={setColor} />
            <div className="mb-4 border-b border-gray-200"></div>
            <Colors
              colors={DEFAULT_COLORS}
              onSelect={setColor}
              active={color}
            />
          </PopoverContent>
        </Popover>
        <UsedColors onChange={setColor} />
      </div>
    </div>
  );
};
