import { useVisibleCubes } from "@/stores/editor/useStore";
import { Instance, Instances } from "@react-three/drei";

interface CubeProps {
  position: readonly [x: number, y: number, z: number];
  color: string;
  id: string;
}
const STEP = 1000;

export const CubesRenderer = ({ data }: { data: CubeProps[] }) => {
  const increment = Math.ceil(data.length / STEP);
  const limit = increment * STEP;

  return (
    <Instances limit={limit} key={`instances-${increment}`} castShadow>
      <boxGeometry />
      <meshStandardMaterial />
      {data.map((d, i) => (
        <Instance
          key={d.id}
          name="cube"
          color={d.color}
          position={d.position}
          userData={{ id: d.id }}
        />
      ))}
    </Instances>
  );
};

const Cubes = () => {
  const data = useVisibleCubes();
  return <CubesRenderer data={data} />;
};

export default Cubes;
