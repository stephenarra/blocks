import * as Y from "yjs";
import WSSharedDoc from "./WSSharedDoc";
import { fromUint8Array } from "js-base64";

import { prisma } from "database";
import { RedisPersistence } from "y-redis";

const isRedis = !!process.env.REDIS_URL;

const writeState = async (docName: string, ydoc: WSSharedDoc) => {
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
};

let persistence: {
  provider: any;
  bindState: (docName: string, ydoc: WSSharedDoc) => Promise<any>;
  writeState: (docName: string, ydoc: WSSharedDoc) => Promise<void>;
};

if (isRedis) {
  const redisOpts = process.env.REDIS_UR as any;
  const provider = new RedisPersistence({ redisOpts });

  persistence = {
    provider,
    bindState: async (docName: string, ydoc: WSSharedDoc) => {
      provider.closeDoc(docName);
      return provider.bindState(docName, ydoc);
    },
    writeState,
  };
} else {
  const persistenceDir = process.env.YPERSISTENCE || "./dbDir";
  console.info('Persisting documents to "' + persistenceDir + '"');
  const LeveldbPersistence = require("y-leveldb").LeveldbPersistence;
  const provider = new LeveldbPersistence(persistenceDir);

  persistence = {
    provider,
    bindState: async (docName: string, ydoc: WSSharedDoc) => {
      const persistedYdoc = await provider.getYDoc(docName);
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      provider.storeUpdate(docName, newUpdates);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));

      ydoc.on("update", (update) => {
        provider.storeUpdate(docName, update);
      });
    },
    writeState,
  };
}

export { persistence };
