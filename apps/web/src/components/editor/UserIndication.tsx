import {
  type AwarenessProps,
  COLOR_MODE,
  DRAW_MODE,
  useStore,
  useUsers,
} from "@/stores/store";

const arr = [DRAW_MODE, COLOR_MODE] as string[];
const getColor = (data: AwarenessProps) => {
  if (arr.includes(data.mode)) return data.color;
  return "white";
};

export default function UserIndication() {
  const { clientId } = useStore();
  const users = useUsers();

  return (
    <>
      {Array.from(users.entries())
        .filter(([, data]) => data.position)
        .map(([id, data]) => (
          <mesh key={id} position={data.position}>
            <meshBasicMaterial
              color={getColor(data)}
              opacity={id === clientId ? 0.5 : 0.3}
              transparent={true}
            />
            <boxGeometry />
          </mesh>
        ))}
    </>
  );
}
