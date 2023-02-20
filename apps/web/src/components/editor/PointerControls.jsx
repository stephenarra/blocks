/* Handle interaction behaviors */
import { useGesture } from "@use-gesture/react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { snap } from "@/lib/utils";
import { COLOR_MODE, useActions, useLocalState } from "@/stores/store";
import { Edges } from "@react-three/drei";

import { SELECT_MODE, DRAW_MODE, ERASE_MODE } from "@/stores/store";
import { useRef } from "react";

const faceDirection = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const getPosition = (evt, out = true) => {
  if (evt.object.name === "ground") {
    return snap(evt.point);
  }

  if (evt.object.name === "cube" && evt.faceIndex) {
    const offset = faceDirection[Math.floor(evt.faceIndex / 2)];
    const pos = evt.object.position.clone();
    if (out) {
      // return position out from the hovered cube
      return pos.add(new THREE.Vector3(...offset));
    }
    return pos;
  }

  return null;
};

const getBoundingBox = (startPos, endPos) => {
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
  return box3;
};

/**
 * Need typings for r3f and use-gesture, keeping this as jsx for now
 * https://github.com/pmndrs/use-gesture/discussions/287
 */
export default function PointerControls({ children }) {
  const {
    setPosition,
    addCubes,
    removeCubes,
    updateCubesColor,
    selectCubes,
    onBoxSelect,
  } = useActions();
  const { mode } = useLocalState();

  const ref = useRef();
  const selectionRef = useRef();
  const dragInfo = useRef(null);
  const defaultControls = useThree((state) => state.controls);

  const actions = {
    [SELECT_MODE]: (event) => {
      selectCubes(
        event.object.userData.id ? [event.object.userData.id] : [],
        event.shiftKey
      );
    },
    [DRAW_MODE]: (event) => {
      const pos = getPosition(event);
      if (!pos) return;
      addCubes([pos.toArray()]);
    },
    [ERASE_MODE]: (event) => {
      if (event.object.name === "cube") {
        removeCubes([event.object.userData.id]);
      }
    },
    [COLOR_MODE]: (event) => {
      if (event.object.name === "cube") {
        updateCubesColor([event.object.userData.id]);
      }
    },
  };

  const bind = useGesture(
    {
      onPointerMove: ({ event }) => {
        if (event.object.type === "Object" || dragInfo.current) return;
        event.stopPropagation();

        const pos = getPosition(event, mode === DRAW_MODE);
        setPosition(pos ? pos.toArray() : null);
      },
      onPointerOut: () => {
        setPosition(null);
      },
      onPointerDown: ({ event }) => {
        event.stopPropagation();
        const pos = getPosition(event, mode === DRAW_MODE);
        dragInfo.current = { down: pos };
      },
      onClick: ({ event }) => {
        if (event.object.type === "Object") return;
        if (event.delta > 10) return; // assume this was a camera pan
        event.stopPropagation();

        if (actions[mode]) {
          actions[mode](event);
        }
      },
      onDragStart: ({ event }) => {
        if (defaultControls) {
          defaultControls.enabled = false;
        }
        // use pointer down position, the start drag position may be off due to "filterTaps"
        const pos =
          dragInfo.current.down || getPosition(event, mode === DRAW_MODE);
        if (!pos) return;

        dragInfo.current = { start: pos };
        selectionRef.current.visible = true;
      },
      onDrag: ({ event }) => {
        if (!dragInfo.current?.start) return;
        if (event.intersections.length < 2) {
          // not hoving on anything, first intersection is the start
          setPosition(null);
          return;
        }
        const pos = getPosition(event, mode === DRAW_MODE);
        setPosition(pos ? pos.toArray() : null);
        if (!pos) return;

        const bbox = getBoundingBox(dragInfo.current.start, pos);
        dragInfo.current.end = pos;
        dragInfo.current.box = bbox.clone();

        const size = bbox.max.sub(bbox.min);
        selectionRef.current.position.copy(
          bbox.min.add(size.clone().multiplyScalar(0.5))
        );
        selectionRef.current.scale.copy(size);
      },
      onDragEnd: ({ event }) => {
        if (defaultControls) {
          defaultControls.enabled = true;
        }
        if (!dragInfo.current?.box) return;

        selectionRef.current.visible = false;
        onBoxSelect(dragInfo.current.box, event.shiftKey);
        dragInfo.current = null;
        setPosition(null);
      },
    },
    { drag: { filterTaps: true } }
  );

  return (
    <>
      {/* Keep mesh out of group so raycaster doesn't pick it up */}
      <mesh ref={selectionRef} visible={false}>
        <meshBasicMaterial color="#333" opacity={0.1} transparent={true} />
        <boxGeometry />
        <Edges visible={true} scale={1} threshold={15}>
          <meshBasicMaterial transparent color="#333" side={THREE.DoubleSide} />
        </Edges>
      </mesh>
      <group ref={ref} {...bind()}>
        {children}
      </group>
    </>
  );
}
