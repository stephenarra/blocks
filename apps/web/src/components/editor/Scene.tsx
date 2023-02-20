import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Cubes from "./Cubes";
import Background from "./Background";
import UserIndication from "./UserIndication";
import KeyboardEvents from "./KeyboardEvents";
import PointerControls from "./PointerControls";
import SelectedCubes from "./SelectedCubes";

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
      camera={{ fov: 45, position: [20, 15, 20] }}
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

      <OrbitControls
        enabled={!drag}
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, -1, 0]}
        minDistance={10}
        maxDistance={100}
      />
    </Canvas>
  );
}

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[200, 200, 0]} />
    </>
  );
};
