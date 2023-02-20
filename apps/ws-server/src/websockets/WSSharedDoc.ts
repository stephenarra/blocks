import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/dist/awareness.cjs";
import * as syncProtocol from "y-protocols/dist/sync.cjs";
import { encoding, decoding, map } from "lib0";
import { debounce } from "lodash";
import { callbackHandler, isCallbackSet } from "./callback";
import { send } from "./utils";

const CALLBACK_DEBOUNCE_WAIT = parseInt(
  process.env.CALLBACK_DEBOUNCE_WAIT || "2000"
);
const CALLBACK_DEBOUNCE_MAXWAIT = parseInt(
  process.env.CALLBACK_DEBOUNCE_MAXWAIT || "10000"
);

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== "false" && process.env.GC !== "0";

const messageSync = 0;
const messageAwareness = 1;
// const messageAuth = 2

const updateHandler = (update: Uint8Array, origin: any, doc: WSSharedDoc) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

export default class WSSharedDoc extends Y.Doc {
  awareness: awarenessProtocol.Awareness;
  name: string;
  conns: Map<Object, Set<number>>;

  constructor(name: string) {
    super({ gc: gcEnabled });
    this.name = name;
    // Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is close
    this.conns = new Map();
    this.awareness = new awarenessProtocol.Awareness(this);
    this.awareness.setLocalState(null);

    /**
     * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
     * @param {Object | null} conn Origin is the connection that made the change
     */
    const awarenessChangeHandler = ({ added, updated, removed }, conn) => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs = this.conns.get(conn);
        if (connControlledIDs !== undefined) {
          added.forEach((clientID) => {
            connControlledIDs.add(clientID);
          });
          removed.forEach((clientID) => {
            connControlledIDs.delete(clientID);
          });
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
      );
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
      });
    };

    this.awareness.on("update", awarenessChangeHandler);
    this.on("update", updateHandler);

    if (isCallbackSet) {
      this.on(
        "update",
        debounce(callbackHandler, CALLBACK_DEBOUNCE_WAIT, {
          maxWait: CALLBACK_DEBOUNCE_MAXWAIT,
        })
      );
    }
  }
}
