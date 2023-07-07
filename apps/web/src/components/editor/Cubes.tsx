import { TRANSLATE_MODE } from "@/stores/editor/store";
import {
  useActions,
  useLocalState,
  useSharedState,
  useVisibleCubes,
} from "@/stores/editor/useStore";
import { Instance, Instances, TransformControls } from "@react-three/drei";
import { groupBy } from "lodash";
import { forwardRef, useMemo, useRef } from "react";

import PointerControls from "./PointerControls";
import Background from "./Background";
import { snap } from "@/lib/utils";

interface CubeProps {
  position: readonly [x: number, y: number, z: number];
  color: string;
  id: string;
}

interface RenderProps {
  data: CubeProps[];
  position?: readonly [x: number, y: number, z: number];
}

const STEP = 1000;

export const CubesRenderer = forwardRef(
  ({ data, position }: RenderProps, ref) => {
    const increment = Math.ceil(data.length / STEP);
    const limit = increment * STEP;

    return (
      <Instances
        ref={ref as any}
        limit={limit}
        key={`instances-${increment}`}
        castShadow
        position={position}
      >
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
  }
);

CubesRenderer.displayName = "CubesRenderer";

const Layer = ({ id, data }: { id: string; data: CubeProps[] }) => {
  const { mode } = useLocalState();
  const { activeLayer } = useLocalState();
  const { layers } = useSharedState();
  const { updateLayer } = useActions();
  const ref = useRef(null!);

  const { setDragging } = useActions();
  const dragProps = {
    onDragStart: () => setDragging(true),
    onDragEnd: () => setDragging(false),
  };
  const layer = layers[id];
  const position = layer.position || [0, 0, 0];
  const isActive = id === activeLayer;
  if (!layer.visible) return null;

  return (
    <>
      <group position={position} ref={ref}>
        <PointerControls {...dragProps} offset={position}>
          {!!isActive && (
            <group position={[-0.5, -0.5, -0.5]}>
              <Background />
            </group>
          )}
          <CubesRenderer data={data} />
        </PointerControls>
      </group>
      {!!(isActive && ref.current && mode === TRANSLATE_MODE) && (
        <TransformControls
          object={ref}
          mode="translate"
          translationSnap={1}
          onObjectChange={(e) => {
            if (!e) return;
            const target = e.target.object;
            // const position = target.position.toArray();
            const pos = snap(target.position).toArray();
            updateLayer(id, { position: pos });
          }}
        />
      )}
    </>
  );
};

const Cubes = () => {
  // const data = useVisibleCubes();
  const { cubes, layers } = useSharedState();

  // const data = useMemo(
  //   () => Object.keys(cubes).map((id) => ({ id, ...cubes[id] })),
  //   [cubes]
  // );
  const grouped = groupBy(
    Object.keys(cubes).map((id) => ({ id, ...cubes[id] })),
    "layer"
  );

  return (
    <>
      {Object.keys(layers).map((layer) => (
        <Layer key={layer} data={grouped[layer] || []} id={layer} />
      ))}
    </>
  );
};

export default Cubes;
