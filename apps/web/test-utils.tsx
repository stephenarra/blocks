import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import ReactThreeTestRenderer from "@react-three/test-renderer";

import { StoreContext, createStore } from "@/stores/store";
import { SessionProvider } from "next-auth/react";

const testModel = {
  id: "test_model",
  data: "AQfq7dfVBQAnAQVjdWJlcwVjdWJlcwEnAQVjdWJlcwZsYXllcnMBJwDq7dfVBQEHbGF5ZXJfMQEoAOrt19UFAgRuYW1lAXcHTGF5ZXIgMSgA6u3X1QUCB3Zpc2libGUBeCcBBWN1YmVzCmxheWVyT3JkZXIACADq7dfVBQUBdwdsYXllcl8xAA==",
  name: "Test Model",
} as any;

const session = {
  user: { id: "user1", name: "User1", email: "user1@example.com" },
  expires: "",
};

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  // preloadedState?: object;
  store?: ReturnType<typeof createStore>;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    // preloadedState = {},
    store = createStore(testModel),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <SessionProvider session={session}>
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
      </SessionProvider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

interface ThreeRenderOptions {
  store?: ReturnType<typeof createStore>;
}

export const renderReactThreeWithProvider = async (
  ui: React.ReactElement,
  { store = createStore(testModel) }: ThreeRenderOptions = {}
) => {
  const renderer = await ReactThreeTestRenderer.create(
    <SessionProvider session={session}>
      <StoreContext.Provider value={store}>{ui}</StoreContext.Provider>
    </SessionProvider>
  );
  return { store, renderer };
};
