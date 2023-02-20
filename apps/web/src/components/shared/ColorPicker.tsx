import { useEffect, useState } from "react";
import { ChromePicker } from "react-color";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}
export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  return (
    <div className="flex flex-col items-center">
      <ChromePicker
        disableAlpha={true}
        color={localColor}
        onChange={(c) => setLocalColor(c.hex)}
        onChangeComplete={(c) => onChange(c.hex)}
      />
    </div>
  );
}
