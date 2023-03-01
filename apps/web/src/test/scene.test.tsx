import { expect, it, describe } from "vitest";
import {
  renderWithProviders,
  renderReactThreeWithProvider,
} from "./helpers/test-utils";
import { act } from "react-dom/test-utils";

import Cubes from "@/components/editor/Cubes";
import Scene from "@/components/editor/Scene";
import { ERASE_MODE } from "@/stores/editor/store";

/**
 * This testing is heavy on store implementation details,
 * but it's difficult to test three.js state and interactions
 */

describe("Cubes", () => {
  it("can add a cube", () => {
    const { store } = renderWithProviders(<Scene />);
    store.actions.addCubes([
      [0, 0, 0],
      [1, 1, 1],
    ]);

    expect(Object.keys(store.sharedState.cubes).length).toEqual(2);
  });

  it("can remove cubes", () => {
    const { store } = renderWithProviders(<Scene />);
    store.actions.addCubes([
      [0, 0, 0],
      [1, 1, 1],
    ]);
    const ids = Object.keys(store.sharedState.cubes);
    store.actions.removeCubes([ids[0]]);

    expect(Object.keys(store.sharedState.cubes).length).toEqual(1);
  });

  it("cube meshes are rendered", async () => {
    const state = await renderReactThreeWithProvider(<Cubes />);
    await act(async () => {
      state.store.actions.addCubes([
        [0, 0, 0],
        [1, 1, 1],
      ]);
    });

    const cubeMeshes = state.renderer.scene.findAll(
      (node) => node._fiber.name === "cube"
    );
    expect(cubeMeshes.length).toEqual(2);
  });
});

describe("Layers", () => {
  it("can add a layer", () => {
    const { store } = renderWithProviders(<Scene />);
    store.actions.addCubes([[0, 0, 0]]);
    store.actions.addLayer();
    store.actions.addLayer();
    const layers = store.sharedState.layerOrder;
    expect(layers.length).toEqual(3);

    // add blocks on another layer
    store.actions.setActiveLayer(layers[1]);
    store.actions.addCubes([[1, 1, 1]]);

    const layer1Cubes = Object.values(store.sharedState.cubes).filter(
      (d) => d.layer === layers[0]
    );
    const layer2Cubes = Object.values(store.sharedState.cubes).filter(
      (d) => d.layer === layers[1]
    );
    const layer3Cubes = Object.values(store.sharedState.cubes).filter(
      (d) => d.layer === layers[2]
    );

    expect(Object.keys(store.sharedState.cubes).length).toEqual(2);
    expect(layer1Cubes.length).toEqual(1);
    expect(layer2Cubes.length).toEqual(1);
    expect(layer3Cubes.length).toEqual(0);
  });

  it("can remove a layer", () => {
    const { store } = renderWithProviders(<Scene />);
    store.actions.addCubes([[0, 0, 0]]);
    store.actions.addLayer();
    const layers = [...store.sharedState.layerOrder];

    // add blocks on another layer
    store.actions.setActiveLayer(layers[1]);
    store.actions.addCubes([[1, 1, 1]]);

    // remove layer
    store.actions.setActiveLayer(layers[0]);
    store.actions.removeLayer(layers[0]);

    expect(store.sharedState.layerOrder.length).toEqual(1);
    expect(Object.keys(store.sharedState.layers).length).toEqual(1);

    // cubes are remove
    expect(Object.keys(store.sharedState.cubes).length).toEqual(1);

    // selected layer is updated
    expect(store.localState.activeLayer).toEqual(layers[1]);
  });

  it("can't delete all layers", () => {
    const { store } = renderWithProviders(<Scene />);
    const layers = [...store.sharedState.layerOrder];
    store.actions.removeLayer(layers[0]);

    expect(store.localState.activeLayer).toEqual(layers[0]);
    expect(store.sharedState.layerOrder).toEqual(layers);
  });

  it("can update a layer", () => {
    const { store } = renderWithProviders(<Scene />);
    const layers = store.sharedState.layerOrder;
    store.actions.updateLayer(layers[0], { name: "Roof" });

    expect(store.sharedState.layers[layers[0]].name).toEqual("Roof");
  });

  it("can't add to a hidden a layer", () => {
    const { store } = renderWithProviders(<Scene />);
    const layers = store.sharedState.layerOrder;
    store.actions.updateLayer(layers[0], { visible: false });

    store.actions.setActiveLayer(layers[0]);
    store.actions.addCubes([[1, 1, 1]]);

    expect(Object.keys(store.sharedState.cubes).length).toEqual(0);
  });
});

describe("Selected", () => {
  it("can select cubes", () => {
    const { store } = renderWithProviders(<Scene />);
    store.actions.addCubes([
      [0, 0, 0],
      [1, 1, 1],
    ]);
    const cubes = Object.keys(store.sharedState.cubes);
    store.actions.selectCubes([cubes[0]]);

    expect(store.localState.selected).toEqual([cubes[0]]);
  });
  it("can remove cubes", () => {
    const { store } = renderWithProviders(<Scene />);
    store.actions.addCubes([
      [0, 0, 0],
      [1, 1, 1],
    ]);
    const cubes = Object.keys(store.sharedState.cubes);
    store.actions.selectCubes([cubes[0]]);
    store.actions.removeCubes([cubes[0]]);

    expect(store.localState.selected).toEqual([]);
  });
  it("can switch mode and clear selected", () => {
    const { store } = renderWithProviders(<Scene />);
    store.actions.addCubes([
      [0, 0, 0],
      [1, 1, 1],
    ]);
    const cubes = Object.keys(store.sharedState.cubes);
    store.actions.selectCubes([cubes[0]]);
    store.actions.setMode(ERASE_MODE);

    expect(store.localState.selected).toEqual([]);
  });
});

// describe("Undo/Redo", () => {});
