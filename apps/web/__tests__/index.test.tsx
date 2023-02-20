import { screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test-utils";

// jest.mock("next/router", () => require("next-router-mock"));

import Editor from "@/components/editor/Editor";

describe.skip("Layers", () => {
  it("can add layer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Editor />);

    const addLayer = screen.getByTestId("add-layer");
    await user.click(addLayer);

    expect(screen.getByText("Layer 2")).toBeInTheDocument();
  });

  it("can rename a layer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Editor />);

    const layers = screen.getByTestId("layers");
    const layer1Text = within(layers).getByText("Layer 1");
    await user.click(layer1Text);
    await user.click(layer1Text);
    const input = await screen.findByTestId("layer-name-input");
    userEvent.clear(input);

    await act(async () => {
      await user.type(input, "Roof{enter}");
    });

    expect(screen.queryByText("Layer 1")).not.toBeInTheDocument();
    expect(screen.getByText("Roof")).toBeInTheDocument();
  });

  it("can toggle visibility on a layer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Editor />);

    const layers = screen.getByTestId("layers");
    const visibilityBtn = within(layers).getByRole("button", {
      name: /visibility/i,
    });

    await user.click(visibilityBtn);
  });

  it("can delete a layer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Editor />);

    const layers = screen.getByTestId("layers");
    const addLayer = screen.getByTestId("add-layer");
    await user.click(addLayer);

    const removeBtns = within(layers).getAllByRole("button", {
      name: /delete/i,
    });
    await user.click(removeBtns[0]);

    expect(screen.getByText("Layer 2")).toBeInTheDocument();
    expect(screen.queryByText("Layer 1")).not.toBeInTheDocument();
  });
});
