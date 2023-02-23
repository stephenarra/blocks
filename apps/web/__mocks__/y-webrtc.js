import { vi } from "vitest";
const mock = vi.fn();

const clientID = 1;

export const WebrtcProvider = vi.fn().mockImplementation(() => {
  const map = new Map();
  return {
    awareness: {
      clientID,
      setLocalState: (data) => {
        map.set(clientID, data);
      },
      setLocalStateField: (prop, value) => {
        map.set(clientID, {
          ...map.get(clientID),
          [prop]: value,
        });
      },
      getLocalState: () => map.get(clientID),
      getStates: () => map,
      on: mock,
      off: mock,
    },
    destroy: mock,
  };
});
