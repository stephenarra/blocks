import http from "http";
import ws from "ws";

const port = process.env.PORT || 4444;
const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
// const wsReadyStateClosing = 2;
// const wsReadyStateClosed = 3;

interface YWebRtcSubscriptionMessage {
  type: "subscribe" | "unsubscribe";
  topics?: string[];
}
interface YWebRtcPingMessage {
  type: "ping";
}
interface YWebRtcPublishMessage {
  type: "publish";
  topic?: string;
  [k: string]: any;
}

const pingTimeout = 30000;

const wss = new ws.Server({ noServer: true });

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

// Map from topic-name to set of subscribed clients.
const topics = new Map<string, Set<any>>();

const send = (conn: ws.WebSocket, message: object) => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    conn.close();
  }
  try {
    conn.send(JSON.stringify(message));
  } catch (e) {
    conn.close();
  }
};

/**
 * Setup a new client
 */
const onconnection = (conn: ws.WebSocket) => {
  const subscribedTopics = new Set<string>();
  let closed = false;

  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close();
      clearInterval(pingInterval);
    } else {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        conn.close();
      }
    }
  }, pingTimeout);

  conn.on("pong", () => {
    pongReceived = true;
  });

  conn.on("close", () => {
    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName) || new Set();
      subs.delete(conn);
      if (subs.size === 0) {
        topics.delete(topicName);
      }
    });
    subscribedTopics.clear();
    closed = true;
  });

  conn.on("message", (data) => {
    const str = data.toString();
    const message = (typeof str === "string" ? JSON.parse(str) : str) as
      | YWebRtcSubscriptionMessage
      | YWebRtcPublishMessage
      | YWebRtcPingMessage;

    if (message && message.type && !closed) {
      switch (message.type) {
        case "subscribe":
          (message.topics || []).forEach((topicName) => {
            if (typeof topicName === "string") {
              // add conn to topic
              let topic = topics.get(topicName);
              if (topic === undefined) {
                topics.set(topicName, (topic = new Set()));
              }
              topic.add(conn);
              // add topic to conn
              subscribedTopics.add(topicName);
            }
          });
          break;
        case "unsubscribe":
          (message.topics || []).forEach((topicName) => {
            const subs = topics.get(topicName);
            if (subs) {
              subs.delete(conn);
            }
          });
          break;
        case "publish":
          if (message.topic) {
            const receivers = topics.get(message.topic);
            if (receivers) {
              receivers.forEach((receiver) => send(receiver, message));
            }
          }
          break;
        case "ping":
          send(conn, { type: "pong" });
      }
    }
  });
};

wss.on("connection", onconnection);

server.on("upgrade", (request, socket, head) => {
  const handleAuth = (ws: ws.WebSocket) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port);

console.log("Signaling server running on localhost:", port);
