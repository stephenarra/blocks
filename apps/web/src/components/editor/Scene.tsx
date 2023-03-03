import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import Cubes from "./Cubes";
import Background from "./Background";
import UserIndication from "./UserIndication";
import KeyboardEvents from "./KeyboardEvents";
import PointerControls from "./PointerControls";
import SelectedCubes from "./SelectedCubes";
import { SIZE } from "@/lib/utils";
import { Vector3 } from "three";

export default function Scene() {
  const [drag, setDrag] = useState(false);

  const dragProps = {
    onDragStart: () => setDrag(true),
    onDragEnd: () => setDrag(false),
  };

  return (
    // <ContextMenu></ContextMenu>
    <Canvas
      data-testid="scene"
      shadows
      gl={{ alpha: false }}
      camera={{ fov: 45, position: [SIZE * 2, SIZE * 1.5, SIZE * 2] }}
      // onContextMenu={(e) => {
      //   // needed to make orbit controls and radix context menu work together
      //   e.defaultPrevented = false;
      // }}
    >
      <color attach="background" args={["white"]} />
      <KeyboardEvents />

      <Lights />

      <UserIndication />
      <SelectedCubes />

      <PointerControls {...dragProps}>
        <group position={[-0.5, -0.5, -0.5]}>
          <Background />
        </group>
        <Cubes />
      </PointerControls>

      {/* Paint Brush */}
      {/* <BrushControls {...dragProps}/> */}

      {/* Box Select */}
      {/* <DraggableBox {...dragProps}>
        <Background />
      </DraggableBox> */}

      {/* Draggable Box */}
      {/* <Draggable {...dragProps}>
        <mesh>
          <boxGeometry />
          <meshNormalMaterial />
        </mesh>
      </Draggable> */}

      <Orbit drag={drag} />
    </Canvas>
  );
}

const Orbit = ({ drag }: { drag: boolean }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <OrbitControls
        enabled={!drag}
        ref={controlsRef}
        makeDefault
        target={[SIZE / 2, SIZE / 2, SIZE / 2]}
        minDistance={10}
        maxDistance={100}
      />

      <GizmoHelper
        alignment="bottom-right"
        margin={[80, 80]}
        onTarget={() => controlsRef?.current?.target || new Vector3()}
        onUpdate={() => controlsRef.current?.update()}
      >
        <GizmoViewcube
          color="rgba(255, 255, 255, 0.2)"
          strokeColor="#ccc"
          textColor="#333"
        />
      </GizmoHelper>
    </>
  );
};

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[200, 200, 0]} />
    </>
  );
};
