import { useEffect, useState } from "react";
import { Eye, EyeOff, Trash, Plus } from "lucide-react";
import { Button } from "@/lib/ui/button";
import { Label } from "@/lib/ui/label";
import { cn } from "@/lib/utils";
import useDoubleClick from "@/lib/hooks/use-double-click";
import { useActions, useLayers, useLocalState } from "@/stores/editor/useStore";

const Layer = ({
  name,
  visible,
  isActive,
  setActive,
  onUpdateName,
  onToggleVisibility,
  onRemove,
}: {
  name: string;
  visible: boolean;
  isActive: boolean;
  setActive: () => void;
  onUpdateName: (name: string) => void;
  onToggleVisibility: () => void;
  onRemove: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  useEffect(() => {
    setTempName(name);
  }, [name]);

  const onNameClick = useDoubleClick({
    onSingleClick: () => {
      setActive();
    },
    onDoubleClick: () => {
      setIsEditing(true);
    },
  });

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded",
        isActive && "bg-slate-200"
      )}
      onClick={setActive}
    >
      <Button
        aria-label="visibility"
        variant="ghost"
        className="rounded-none p-2 focus:ring-0 focus:ring-offset-0"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
      >
        {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
      <div className="flex-1">
        {!isEditing ? (
          <div
            className="inline"
            onClick={(e) => {
              e.stopPropagation();
              onNameClick();
            }}
          >
            {name}
          </div>
        ) : (
          <input
            aria-label="layer name"
            data-testid="layer-name-input"
            type="text"
            className="w-full px-1"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => {
              onUpdateName(tempName);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                onUpdateName(tempName);
                setIsEditing(false);
              }
            }}
            autoFocus
          />
        )}
      </div>

      <Button
        aria-label="delete"
        variant="ghost"
        className="rounded-none p-2 focus:ring-0 focus:ring-offset-0"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Layers() {
  const { setActiveLayer, addLayer, updateLayer, removeLayer } = useActions();
  const { activeLayer } = useLocalState();
  const layers = useLayers();

  return (
    <div className="flex w-full flex-col gap-2 p-2" data-testid="layers">
      <Label>Layers</Label>
      <Button
        onClick={addLayer}
        variant="ghost"
        className="justify-start"
        data-testid="add-layer"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Layer
      </Button>
      <div>
        {layers.map((layer) => (
          <Layer
            key={layer.id}
            isActive={activeLayer === layer.id}
            name={layer.name}
            visible={layer.visible}
            setActive={() => {
              setActiveLayer(layer.id);
            }}
            onUpdateName={(name) => {
              updateLayer(layer.id, { name });
            }}
            onToggleVisibility={() => {
              updateLayer(layer.id, { visible: !layer.visible });
            }}
            onRemove={() => {
              removeLayer(layer.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
