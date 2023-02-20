import * as Y from "yjs";
import WSSharedDoc from "./WSSharedDoc";
import { fromUint8Array } from "js-base64";

import { prisma } from "database";

const persistenceDir = process.env.YPERSISTENCE || "./dbDir";

console.info('Persisting documents to "' + persistenceDir + '"');
const LeveldbPersistence = require("y-leveldb").LeveldbPersistence;
const ldb = new LeveldbPersistence(persistenceDir);

export const persistence = {
  provider: ldb,
  bindState: async (docName: string, ydoc: WSSharedDoc) => {
    console.log("BIND", docName);

    const persistedYdoc = await ldb.getYDoc(docName);
    const newUpdates = Y.encodeStateAsUpdate(ydoc);
    ldb.storeUpdate(docName, newUpdates);
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));

    ydoc.on("update", (update) => {
      ldb.storeUpdate(docName, update);
    });
  },
  writeState: async (docName: string, ydoc: WSSharedDoc) => {
    const documentState = Y.encodeStateAsUpdate(ydoc);
    const base64Encoded = fromUint8Array(documentState);

    const model = await prisma.model.findUnique({ where: { id: docName } });

    if (model.data !== base64Encoded) {
      const updatedModel = await prisma.model.update({
        where: { id: docName },
        data: { data: base64Encoded },
      });

      console.log("UPDATE::", updatedModel.id);
    } else {
      console.log("NO UPDATES");
    }
  },
};
