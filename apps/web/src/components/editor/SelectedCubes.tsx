import * as THREE from "three";
import { type Vector3 } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { useSelectedCubes } from "@/stores/editor/useStore";

const Cube = ({ position, color }: { position: Vector3; color: string }) => {
  return (
    <mesh position={position}>
      <meshStandardMaterial color={color} transparent opacity={0} />
      <boxGeometry />
      <Edges visible={true} scale={1} threshold={15} renderOrder={1000}>
        <meshBasicMaterial transparent color="#333" side={THREE.DoubleSide} />
      </Edges>
    </mesh>
  );
};

const SelectedCubes = () => {
  const data = useSelectedCubes();

  return (
    <>
      {data.map((d) => (
        <Cube key={d.id} position={d.position} color={d.color} />
      ))}
    </>
  );
};

export default SelectedCubes;
