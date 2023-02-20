import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import "jest-canvas-mock";

jest.mock("y-webrtc");

// https://github.com/radix-ui/primitives/issues/420#issuecomment-771615182
window.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
};

window.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  }),
};
