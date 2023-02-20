/* Draggable box for box select */
import React, { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";
import { snap } from "@/lib/utils";

const SHOW_HELPERS = false;

export default function DraggableBox({
  children,
  onDragStart,
  onDragEnd,
  ...props
}) {
  const ref = useRef();
  const dragInfo = useRef(null);
  const { raycaster, scene } = useThree();

  const bind = useGesture({
    onDrag: () => {
      const obj = raycaster
        .intersectObjects(scene.children)
        .find((d) => d.object.name === "ground");
      if (!obj) return;

      const startPos = dragInfo.current.start.clone();
      const endPos = snap(obj.point);

      // Get bounding box, add 0.5 in all directions
      const box3 = new THREE.Box3();
      box3.setFromPoints([
        startPos,
        endPos,
        startPos.clone().addScalar(0.5),
        endPos.clone().addScalar(0.5),
        startPos.clone().subScalar(0.5),
        endPos.clone().subScalar(0.5),
      ]);

      const size = box3.max.sub(box3.min);
      ref.current.position.copy(box3.min.add(size.clone().multiplyScalar(0.5)));
      ref.current.scale.copy(size);

      dragInfo.current.end = endPos;
    },
    onDragStart: ({ event }) => {
      const obj = raycaster
        .intersectObjects(scene.children)
        .find((d) => d.object.name === "ground");
      if (!obj) return;

      dragInfo.current = {
        start: snap(obj.point),
      };

      onDragStart(event);
    },
    onDragEnd: ({ event }) => onDragEnd(event),
  });

  return (
    <group {...bind()} {...props}>
      <mesh ref={ref}>
        <meshBasicMaterial color="#3068C4" opacity={0.5} transparent={true} />
        <boxGeometry />
      </mesh>
      {SHOW_HELPERS && (
        <>
          {dragInfo.current?.start && (
            <mesh position={dragInfo.current.start}>
              <meshBasicMaterial
                color="green"
                opacity={0.5}
                transparent={true}
              />
              <boxGeometry />
            </mesh>
          )}
          {dragInfo.current?.end && (
            <mesh position={dragInfo.current.end}>
              <meshBasicMaterial color="red" opacity={0.5} transparent={true} />
              <boxGeometry />
            </mesh>
          )}
        </>
      )}
      {children}
    </group>
  );
}
