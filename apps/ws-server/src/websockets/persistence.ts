import * as Y from "yjs";
import WSSharedDoc from "./WSSharedDoc";
import { fromUint8Array } from "js-base64";

import { prisma } from "database";
import { RedisPersistence } from "y-redis";

const redisOpts = process.env.REDIS_URL as any;
const provider = new RedisPersistence({ redisOpts });

const persistence = {
  provider,
  bindState: async (docName: string, ydoc: WSSharedDoc) => {
    provider.closeDoc(docName);
    return provider.bindState(docName, ydoc);
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

export { persistence };
