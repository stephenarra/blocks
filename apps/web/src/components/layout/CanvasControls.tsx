import { MousePointer2, Pencil, Eraser, Paintbrush } from "lucide-react";
import {
  useActions,
  useLocalState,
  SELECT_MODE,
  DRAW_MODE,
  ERASE_MODE,
  COLOR_MODE,
} from "@/stores/store";
import Control from "../shared/Control";

const SELECTED_CLASSES = "bg-blue-500 text-white";

const CanvasControls = () => {
  const { setMode } = useActions();
  const { mode } = useLocalState();

  return (
    <div className="flex items-center">
      <Control
        className={mode === SELECT_MODE && SELECTED_CLASSES}
        onClick={() => {
          setMode(SELECT_MODE);
        }}
        Icon={MousePointer2}
        label="Select"
        shortcut="V"
      />
      <Control
        className={mode === DRAW_MODE && SELECTED_CLASSES}
        onClick={() => {
          setMode(DRAW_MODE);
        }}
        Icon={Pencil}
        label="Draw"
        shortcut="D"
      />
      <Control
        className={mode === ERASE_MODE && SELECTED_CLASSES}
        onClick={() => {
          setMode(ERASE_MODE);
        }}
        Icon={Eraser}
        label="Erase"
        shortcut="E"
      />
      <Control
        className={mode === COLOR_MODE && SELECTED_CLASSES}
        onClick={() => {
          setMode(COLOR_MODE);
        }}
        Icon={Paintbrush}
        label="Color"
        shortcut="C"
      />
    </div>
  );
};

export default CanvasControls;
