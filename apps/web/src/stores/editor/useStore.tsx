import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from "react";
import { type Model } from "database";
import { useSnapshot } from "valtio";
import * as yPresence from "y-presence";
import { pick, uniq } from "lodash";

import { createStore, AwarenessProps } from "./store";

type StoreProps = ReturnType<typeof createStore>;

export const StoreContext = createContext<StoreProps>({} as never);

export const StoreProvider = ({
  model,
  children,
}: {
  model: Model;
  children: React.ReactNode;
}) => {
  const [store, setStore] = useState<ReturnType<typeof createStore>>();

  useEffect(
    () => {
      const _store = createStore(model);
      setStore(_store);

      return () => {
        _store.destroy();
        setStore(undefined);
      };
    },
    // don't rebuild document for existing model
    [model.id] // eslint-disable-line
  );

  if (store === undefined) return null;

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

/**
 * Selectors
 */
export const useUsers = () => {
  const { provider } = useStore();
  return yPresence.useUsers(provider.awareness) as Map<number, AwarenessProps>;
};

export const useSelf = () => {
  const { provider } = useStore();
  return yPresence.useSelf(provider.awareness);
};

export const useActions = () => {
  const { actions } = useStore();
  return actions;
};

export const useUndoStack = () => {
  const { undoManager } = useStore();
  const [stacks, setStacks] = useState<{
    undoStack: typeof undoManager.undoStack;
    redoStack: typeof undoManager.undoStack;
  }>({ undoStack: [], redoStack: [] });

  undoManager.on("stack-item-added", () => {
    setStacks(pick(undoManager, ["undoStack", "redoStack"]));
  });

  undoManager.on("stack-item-popped", () => {
    setStacks(pick(undoManager, ["undoStack", "redoStack"]));
  });

  return stacks;
};

export const useLocalState = () => {
  const { localState } = useStore();
  return useSnapshot(localState);
};

export const useSharedState = () => {
  const { sharedState } = useStore();
  return useSnapshot(sharedState);
};

export const useVisibleCubes = () => {
  const { cubes, layers } = useSharedState();
  return useMemo(() => {
    return Object.keys(cubes)
      .filter((id) => layers[cubes[id].layer].visible)
      .map((id) => ({ id, ...cubes[id] }));
  }, [cubes, layers]);
};

export const useSelectedCubes = () => {
  const { cubes } = useSharedState();
  const { selected } = useLocalState();
  return selected.map((id) => ({ id, ...cubes[id] }));
};

export const useUsedColors = () => {
  const { cubes } = useSharedState();
  return uniq(Object.values(cubes).map((d) => d.color));
};

export const useLayers = () => {
  const { layers, layerOrder } = useSharedState();
  return useMemo(
    () => layerOrder.map((id) => ({ id, ...layers[id] })),
    [layers, layerOrder]
  );
};
