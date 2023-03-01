/* Allow painting on the canvas */
import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";
import { snap } from "@/lib/utils";
import { useActions } from "@/stores/useStore";

const faceDirection = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

let interval;
let mousePosition = null;
let mouse = new THREE.Vector2();

export default function DraggableBox({
  children,
  onDragStart,
  onDragEnd,
  ...props
}) {
  const ref = useRef();
  const { addCubes } = useActions();
  const { raycaster, size, camera } = useThree();

  const bind = useGesture({
    onPointerMove: ({ event }) => {
      mousePosition = { x: event.x, y: event.y };
    },
    onPointerDown: ({ event }) => {
      event.stopPropagation();
      if (event.delta > 10) return;

      onDragStart();
      function addObject(o) {
        if (!o) return;
        if (o.object.name === "ground") {
          const pos = snap(o.point);
          addCubes([pos.toArray()]);
        } else if (o.object.name === "cube" && o.faceIndex) {
          const offset = faceDirection[Math.floor(o.faceIndex / 2)];
          const pos = o.object.position
            .clone()
            .add(new THREE.Vector3(...offset));
          addCubes([pos.toArray()]);
        }
      }

      addObject(event);

      interval = setInterval(() => {
        // get object from raycaster
        if (!mousePosition) return;
        const nx = ((mousePosition.x - size.left) / size.width) * 2 - 1;
        const ny = (-(mousePosition.y - size.top) / size.height) * 2 + 1;
        mouse.set(nx, ny);

        raycaster.setFromCamera(mouse, camera);
        const objects = raycaster.intersectObjects(ref.current.children); // scene.children
        addObject(objects[0]);
      }, 100);
    },
  });

  useEffect(() => {
    const handleMouseUp = () => {
      clearInterval(interval);
      onDragEnd();
    };
    window.addEventListener("pointerup", handleMouseUp);
    return () => {
      window.removeEventListener("pointerup", handleMouseUp);
    };
  }, [onDragEnd]);

  return (
    <group ref={ref} {...bind()} {...props}>
      {children}
    </group>
  );
}
