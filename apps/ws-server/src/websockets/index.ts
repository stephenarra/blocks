import ws from "ws";
import { setupWSConnection } from "./utils";
import { Server } from "http";

const wsServer = async (expressServer: Server) => {
  const wss = new ws.Server({ noServer: true });

  expressServer.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit("connection", websocket, request);
    });
  });

  wss.on("connection", setupWSConnection);

  return wss;
};

export default wsServer;
