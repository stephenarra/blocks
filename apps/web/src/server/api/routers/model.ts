import * as Y from "yjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { fromUint8Array } from "js-base64";

// want to allow a user to create a document without signing in
// this document shouldn't be saved

// const toBase64 = (u8: Uint8Array) => Buffer.from(u8).toString("base64");
// const fromBase64 = (b64: string) => new Uint8Array(Buffer.from(b64, "base64"));

/**
 * Since there's currently no server,
 * create a ydoc base state so all updates are applied on top of this document and can be synced
 * this must be consistent across clients (with a consistent clientId) - generated once
 * any updates to the intial shared state should extend this template
 * https://discuss.yjs.dev/t/merging-changes-from-one-document-into-another/499/4
 */
const ydoc = new Y.Doc();
const ymap = ydoc.getMap("cubes");
const layersMap = new Y.Map();
const layerMap = new Y.Map();
layerMap.set("name", "Layer 1");
layerMap.set("visible", true);
layersMap.set("layer_1", layerMap);
ymap.set("cubes", new Y.Map());
ymap.set("layers", layersMap);
const layerOrder = new Y.Array();
layerOrder.insert(0, ["layer_1"]);
ymap.set("layerOrder", layerOrder);
// const template = fromUint8Array(Y.encodeStateAsUpdate(ydoc));
// const template =
//   "AQfq7dfVBQAnAQVjdWJlcwVjdWJlcwEnAQVjdWJlcwZsYXllcnMBJwDq7dfVBQEHbGF5ZXJfMQEoAOrt19UFAgRuYW1lAXcHTGF5ZXIgMSgA6u3X1QUCB3Zpc2libGUBeCcBBWN1YmVzCmxheWVyT3JkZXIACADq7dfVBQUBdwdsYXllcl8xAA==";

export const modelRouter = createTRPCRouter({
  create: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.model.create({
      data: {
        name: "Untitled",
        data: fromUint8Array(Y.encodeStateAsUpdate(ydoc)),
        authorId: ctx.session.user.id,
      },
    });
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.model.findUnique({ where: { id: input.id } });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.model.findMany({ where: { published: true } });
  }),

  getMine: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.model.findMany({
      where: { authorId: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: z.object({ name: z.string() }) }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.model.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.model.delete({ where: { id: input.id } });
    }),
});
