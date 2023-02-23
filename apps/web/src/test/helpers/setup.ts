import { vi, afterAll, beforeAll } from "vitest";
import "@testing-library/jest-dom";

// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch";

// setup msw mock server
// import { server } from "./src/test/helpers/mocks/server";
// beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
// afterAll(() => server.close());
// afterEach(() => server.resetHandlers());

beforeAll(() => {
  // if (global.window) {
  //   // @ts-expect-error: Missing files
  //   // import("vitest-canvas-mock");
  // }

  vi.mock("y-webrtc");
  vi.mock("y-websocket");

  // https://github.com/radix-ui/primitives/issues/420#issuecomment-771615182
  global.ResizeObserver = class ResizeObserver {
    cb: (d: any) => void;
    constructor(cb: any) {
      this.cb = cb;
    }
    observe() {
      this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
    }
    unobserve() {}
    disconnect() {}
  };

  global.DOMRect = {
    // @ts-expect-error type
    fromRect: () => ({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
    }),
  };

  // @ts-expect-error type
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterAll(() => {
  vi.unmock("y-webrtc");
  vi.unmock("y-websocket");

  // @ts-expect-error type
  delete global.ResizeObserver;
  // @ts-expect-error type
  delete global.DOMRect;
  // @ts-expect-error type
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
