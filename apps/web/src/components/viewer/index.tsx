import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Model } from "database";
import { CubesRenderer } from "@/components/editor/Cubes";
import { SharedState, getBaseDocument } from "@/stores/editor/store";
import { OrbitControls } from "@react-three/drei";

const ModelCard = ({ model, orbit }: { model: Model; orbit?: boolean }) => {
  const data = useMemo(() => {
    const ydoc = getBaseDocument(model.data);
    const map = ydoc.getMap("cubes").toJSON() as SharedState;
    if (!map.cubes) return [];
    return Object.keys(map.cubes).map((id) => ({ ...map.cubes[id], id }));
  }, [model.data]);

  return (
    <Canvas shadows camera={{ fov: 45, position: [20, 15, 20] }}>
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[200, 200, 0]} />
      <CubesRenderer data={data} />
      {!!orbit && (
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, -1, 0]}
          minDistance={10}
          maxDistance={100}
        />
      )}
    </Canvas>
  );
};

export default ModelCard;
