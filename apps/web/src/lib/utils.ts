import * as THREE from "three";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { uniqueId } from "lodash";

export const SIZE = 21;
export const BLOCK_SIZE = 1;

// snap x, y, z to grid
export const snap = (pos: THREE.Vector3): THREE.Vector3 => {
  return inBounds(pos.clone().round());
};

export const inBounds = (pos: THREE.Vector3) => {
  pos.x = Math.max(0, Math.min(SIZE, pos.x));
  pos.y = Math.max(0, Math.min(SIZE, pos.y));
  pos.z = Math.max(0, Math.min(SIZE, pos.z));
  return pos;
};

export const generateId = () => uniqueId(Math.random().toString(16).slice(2));

export const getNextId = (prefix: string, existing: string[]) => {
  let id = "";
  let i = 1;
  do {
    id = `${prefix}_${i}`;
    i++;
  } while (existing.includes(id));

  return id;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
