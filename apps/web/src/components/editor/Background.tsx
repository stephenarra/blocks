import { MeshProps } from "@react-three/fiber";
import { SIZE } from "@/lib/utils";

const Plane = (props: MeshProps) => (
  <mesh {...props} receiveShadow castShadow name="ground">
    <planeGeometry args={[SIZE, SIZE]} />
    <meshStandardMaterial transparent={true} opacity={0.2} />
  </mesh>
);

const Background = () => {
  return (
    <>
      {/* Bottom */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]}
        position={[SIZE / 2, -0.01, SIZE / 2]}
      />

      {/* Left */}
      <Plane position={[SIZE / 2, SIZE / 2, -0.01]} />

      {/* Right */}
      <Plane
        rotation={[0, Math.PI / 2, 0]}
        position={[-0.01, SIZE / 2, SIZE / 2]}
      />
    </>
  );
};

export default Background;
