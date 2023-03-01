import { useHotkeys } from "react-hotkeys-hook";
import { useActions } from "@/stores/editor/useStore";
import {
  COLOR_MODE,
  DRAW_MODE,
  ERASE_MODE,
  SELECT_MODE,
} from "@/stores/editor/store";

export default function KeyboardEvents() {
  const { undo, redo, removeSelected, setMode } = useActions();

  useHotkeys("meta+z", undo, { preventDefault: true });
  useHotkeys("meta+y", redo, { preventDefault: true });

  useHotkeys("backspace", removeSelected, { preventDefault: true });

  useHotkeys("v", () => setMode(SELECT_MODE), { preventDefault: true });
  useHotkeys("d", () => setMode(DRAW_MODE), { preventDefault: true });
  useHotkeys("e", () => setMode(ERASE_MODE), { preventDefault: true });
  useHotkeys("c", () => setMode(COLOR_MODE), { preventDefault: true });

  return null;
}
