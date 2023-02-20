import Avatar from "boring-avatars";
import { useStore, useUsers } from "@/stores/store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";

export default function Users() {
  const { clientId } = useStore();
  const users = useUsers();

  return (
    <div className="flex items-center gap-2">
      {Array.from(users.entries())
        .filter(([id]) => clientId !== id)
        .map(([id, data]) => (
          <Tooltip key={id} delayDuration={200}>
            <TooltipTrigger>
              <div
                className="overflow-hidden border-2 border-white rounded-full outline outline-2"
                style={{ outlineColor: data.color }}
              >
                <Avatar
                  size={30}
                  name={data.name}
                  variant="beam"
                  colors={[
                    "#92A1C6",
                    "#146A7C",
                    "#F0AB3D",
                    "#C271B4",
                    "#C20D90",
                  ]}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{data.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
    </div>
  );
}
