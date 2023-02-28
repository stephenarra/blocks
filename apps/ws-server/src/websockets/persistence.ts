import * as Y from "yjs";
import WSSharedDoc from "./WSSharedDoc";
import { fromUint8Array, toUint8Array } from "js-base64";

import { prisma } from "database";
import { RedisPersistence } from "y-redis";

const redisOpts = process.env.REDIS_URL as any;
const provider = new RedisPersistence({ redisOpts });

/*
 * Prisma = long term state
 * Redis = session state as long as someone has the document open
 *
 * Prisma is updated as soon as everyone leaves the session
 */

const persistence = {
  provider,
  bindState: async (docName: string, ydoc: WSSharedDoc) => {
    // get from redis
    const doc = provider.docs.get(docName);
    console.log(doc);
    if (doc) {
      return doc;
    }

    // initialize doc from prisma
    const model = await prisma.model.findUnique({ where: { id: docName } });
    if (model && model.data) {
      Y.applyUpdate(ydoc, toUint8Array(model.data));
    }

    provider.closeDoc(docName);
    return provider.bindState(docName, ydoc);
  },
  writeState: async (docName: string, ydoc: WSSharedDoc) => {
    const documentState = Y.encodeStateAsUpdate(ydoc);
    const base64Encoded = fromUint8Array(documentState);

    provider.clearDocument(docName);

    const model = await prisma.model.findUnique({ where: { id: docName } });

    if (!model) {
      console.log("UPDATE::not_found::", docName);
      return;
    }

    if (model.data === base64Encoded) {
      console.log("UPDATE::none::", docName);
      return;
    }

    await prisma.model.update({
      where: { id: docName },
      data: { data: base64Encoded },
    });

    console.log("UPDATE::updated::", docName, ydoc.getMap("cubes").toJSON());
  },
};

export { persistence };
