const mock = jest.fn();

const clientID = 1;

export const WebsocketProvider = jest.fn().mockImplementation(() => {
  const map = new Map();
  return {
    on: () => {},
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
