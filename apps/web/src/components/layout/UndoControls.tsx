import { ArrowLeft, ArrowRight } from "lucide-react";
import { useUndoStack, useActions } from "@/stores/store";
import Control from "../shared/Control";

const Controls = () => {
  const { undo, redo } = useActions();
  const { undoStack, redoStack } = useUndoStack();

  return (
    <div className="flex items-center">
      <Control
        disabled={!undoStack.length}
        onClick={undo}
        Icon={ArrowLeft}
        label="Undo"
        shortcut="⌘Z"
      />
      <Control
        disabled={!redoStack.length}
        onClick={redo}
        Icon={ArrowRight}
        label="Redo"
        shortcut="⌘Y"
      />
    </div>
  );
};

export default Controls;
