import * as Y from "yjs";
import { toUint8Array } from "js-base64";

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

export const DEFAULT_SHARED_STATE: SharedState = {
  cubes: {},
  layers: { layer_1: { name: "Layer 1", visible: true } },
  layerOrder: ["layer_1"],
};

// const toBase64 = (u8: Uint8Array) => Buffer.from(u8).toString("base64");
// const fromBase64 = (b64: string) => new Uint8Array(Buffer.from(b64, "base64"));

export const getBaseDocument = (docStr: string) => {
  const ydoc = new Y.Doc();
  Y.applyUpdate(ydoc, toUint8Array(docStr));
  return ydoc;
};
