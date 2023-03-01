import { proxy, subscribe } from "valtio";

import * as Y from "yjs";
import { bind } from "valtio-yjs";
import { toUint8Array } from "js-base64";
import { get, set, cloneDeep, xor, pick } from "lodash";
// import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { type Model } from "database";

import { generateId, getNextId } from "@/lib/utils";
import { env } from "@/env.mjs";

export const DRAW_MODE = "draw" as const;
export const SELECT_MODE = "select" as const;
export const ERASE_MODE = "erase" as const;
export const COLOR_MODE = "color" as const;
const MODES = [DRAW_MODE, SELECT_MODE, ERASE_MODE, COLOR_MODE] as const;

type Mode = (typeof MODES)[number];

export type Position = [x: number, y: number, z: number];

export interface Layer {
  name: string;
  visible: boolean;
}

export interface Cube {
  position: Position;
  color: string;
  layer: string;
}

export interface SharedState {
  cubes: { [key: string]: Cube };
  layers: { [key: string]: Layer };
  layerOrder: string[];
}

export interface LocalState {
  color: string;
  position: Position | null;
  activeLayer: string;
  selected: string[];
  mode: Mode;
}

export interface AwarenessProps {
  name: string;
  color: string;
  mode: Mode;
  position: Position;
}

export const DEFAULT_SHARED_STATE: SharedState = {
  cubes: {},
  layers: { layer_1: { name: "Layer 1", visible: true } },
  layerOrder: ["layer_1"],
};

const DEFAULT_LOCAL_STATE: LocalState = {
  color: "#3C82F6",
  position: null,
  activeLayer: "layer_1",
  selected: [],
  mode: DRAW_MODE,
};
const AWARENESS_PROPS = ["color", "position", "mode"];
const wsServerUrl = env.NEXT_PUBLIC_WS_SERVER || "ws://localhost:4444";

export const getBaseDocument = (docStr: string) => {
  const ydoc = new Y.Doc();
  Y.applyUpdate(ydoc, toUint8Array(docStr));
  return ydoc;
};

export const createStore = (model: Model) => {
  const ydoc = getBaseDocument(model.data);

  // const provider = new WebrtcProvider(model.id, ydoc, {
  //   signaling: [
  //     "ws://localhost:4444/",
  //     // "wss://voxel-server.onrender.com/",
  //     // "wss://signaling.yjs.dev",
  //     // "wss://y-webrtc-signaling-us.herokuapp.com",
  //   ],
  // });

  const provider = new WebsocketProvider(wsServerUrl, model.id, ydoc);
  provider.on("status", (event: any) => {
    console.log(event.status); // logs "connected" or "disconnected"
  });

  const ymap = ydoc.getMap("cubes");

  // To give more control of undo stack, all commits are made manually
  const undoManager = new Y.UndoManager(ymap, { captureTimeout: Infinity });
  const capture = () => undoManager.stopCapturing();

  const sharedState = proxy<SharedState>(cloneDeep(DEFAULT_SHARED_STATE));
  const localState = proxy<LocalState>(cloneDeep(DEFAULT_LOCAL_STATE));
  bind(sharedState as never, ymap);

  // initialize user with name
  provider.awareness.setLocalState({
    ...pick(DEFAULT_LOCAL_STATE, AWARENESS_PROPS),
    name: "Unknown",
  });

  // make sure all selected are defined and visible
  const _updateSelectedCubes = () => {
    localState.selected = localState.selected.filter((id) => {
      const layer = sharedState.cubes[id]?.layer;
      return layer && sharedState.layers[layer]?.visible;
    });
  };
  let positionMap: ReturnType<typeof getCubeMap> = {};
  subscribe(sharedState.cubes, () => {
    positionMap = getCubeMap(sharedState.cubes);
  });

  const actions = {
    reset: () => {
      Object.entries(cloneDeep(DEFAULT_SHARED_STATE)).forEach(
        ([key, value]) => {
          sharedState[key as keyof SharedState] = value;
        }
      );
      Object.entries(cloneDeep(DEFAULT_LOCAL_STATE)).forEach(([key, value]) => {
        localState[key as keyof LocalState] = value;
      });
    },
    addCubes: (positions: Position[]) => {
      if (!positions.length) return;
      if (!localState.color || !localState.activeLayer) {
        return;
      }
      if (!sharedState.layers[localState.activeLayer]?.visible) {
        return;
      }

      positions.forEach((pos) => {
        const existing = get(positionMap, pos, null);
        if (
          existing &&
          existing.find(
            (id) => sharedState.cubes[id]?.layer === localState.activeLayer
          )
        ) {
          // cube exists
          return;
        }

        const id = generateId();
        sharedState.cubes[id] = {
          position: pos,
          color: localState.color,
          layer: localState.activeLayer,
        };
      });
      capture();
    },
    removeCubes: (ids: string[]) => {
      if (!ids.length) return;

      ids.forEach((id) => {
        delete sharedState.cubes[id];
      });
      _updateSelectedCubes();
      capture();
    },
    updateCubes: (ids: string[], data: Partial<Cube>) => {
      if (!ids.length) return;

      ids.forEach((id) => {
        if (!sharedState.cubes[id]) return;
        sharedState.cubes[id] = { ...sharedState.cubes[id], ...data };
      });
      capture();
    },
    updateCubesColor: (ids: string[]) => {
      actions.updateCubes(ids, { color: localState.color });
    },
    removeSelected: () => {
      if (!localState.selected.length) return;

      actions.removeCubes(localState.selected);
      localState.selected = [];
    },
    setColor: (color: string) => {
      localState.color = color;
      provider.awareness.setLocalStateField("color", color);
      actions.updateCubes(localState.selected, { color });
    },

    setPosition: (position: Position | null) => {
      localState.position = position;
      provider.awareness.setLocalStateField("position", position);
    },
    setActiveLayer: (activeLayer: string) => {
      localState.activeLayer = activeLayer;
    },
    setUser: (data: { name: string }) => {
      provider.awareness.setLocalStateField("name", data.name);
    },
    setMode: (mode: Mode) => {
      if (mode !== SELECT_MODE) {
        localState.selected = [];
      }

      provider.awareness.setLocalStateField("mode", mode);
      localState.mode = mode;
    },

    // this might want to be the in the component
    // could be boxSelect, boxDraw, boxErase
    onBoxSelect: (box: THREE.Box3, append?: boolean) => {
      const mode = localState.mode;

      const positions = getPositionsFromBox(box);
      const cubes = Object.keys(sharedState.cubes).filter((id) => {
        const cube = sharedState.cubes[id];
        const position = cube.position;
        return (
          sharedState.layers[cube.layer]?.visible &&
          position[0] >= box.min.x &&
          position[0] <= box.max.x &&
          position[1] >= box.min.y &&
          position[1] <= box.max.y &&
          position[2] >= box.min.z &&
          position[2] <= box.max.z
        );
      });

      if (mode === DRAW_MODE) {
        actions.addCubes(positions);
      } else if (mode === SELECT_MODE) {
        actions.selectCubes(cubes, append);
      } else if (mode === ERASE_MODE) {
        actions.removeCubes(cubes);
      } else if (mode === COLOR_MODE) {
        actions.updateCubesColor(cubes);
      }
    },

    // layers
    addLayer: () => {
      const id = getNextId("layer_", Object.keys(sharedState.layers));
      sharedState.layers[id] = {
        name: `Layer ${sharedState.layerOrder.length + 1}`,
        visible: true,
      };
      sharedState.layerOrder.push(id);
      capture();
    },
    updateLayer: (id: string, data: Partial<Layer>) => {
      sharedState.layers[id] = { ...sharedState.layers[id], ...data };
      _updateSelectedCubes();
      capture();
    },
    removeLayer: (id: string) => {
      // don't allow removing all layers
      if (sharedState.layerOrder.length <= 1) {
        return;
      }

      const index = sharedState.layerOrder.findIndex(
        (layerId) => layerId === id
      );
      if (index > -1) {
        sharedState.layerOrder.splice(index, 1);
      }
      delete sharedState.layers[id];

      // update active layer
      if (localState.activeLayer === id) {
        localState.activeLayer = sharedState.layerOrder[0];
      }

      // remove cubes in layer
      const cubesInLayer = Object.keys(sharedState.cubes).filter(
        (cubeId) => sharedState.cubes[cubeId].layer === id
      );
      actions.removeCubes(cubesInLayer);

      _updateSelectedCubes();
      capture();
    },

    selectCubes: (ids: string[], append?: boolean) => {
      localState.selected = append ? xor(localState.selected, ids) : ids;
    },

    undo: () => undoManager.undo(),
    redo: () => undoManager.redo(),
  };

  return {
    id: model.id,
    ydoc,
    localState,
    sharedState,
    provider,
    undoManager,
    clientId: provider.awareness.clientID,
    actions,
    destroy: () => {
      ydoc.destroy();
      provider.destroy();
      undoManager.destroy();
    },
  };
};

const getCubeMap = (cubes: SharedState["cubes"]) => {
  const map: {
    [key: string]: { [key: string]: { [key: string]: string[] } };
  } = {};
  Object.keys(cubes).forEach((id) => {
    const pos = cubes[id].position;
    let value = get(map, pos, null);
    value = [...(value ? value : []), id];
    set(map, pos, value);
  });
  return map;
};

const getPositionsFromBox = (box: THREE.Box3) => {
  const positions = [];
  for (let i = box.min.x; i < box.max.x; i++) {
    for (let j = box.min.y; j < box.max.y; j++) {
      for (let k = box.min.z; k < box.max.z; k++) {
        positions.push([i + 0.5, j + 0.5, k + 0.5] as Position);
      }
    }
  }
  return positions;
};
