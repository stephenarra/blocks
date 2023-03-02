import * as Y from "yjs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { fromUint8Array } from "js-base64";
import { TRPCError } from "@trpc/server";

// create base document
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

  getPublished: publicProcedure
    .input(
      z
        .object({ limit: z.number().optional(), page: z.number().optional() })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 8;
      const page = input?.page || 0;

      // must create a seperate count query for now: https://github.com/prisma/prisma/issues/7550
      const res = await ctx.prisma.$transaction([
        ctx.prisma.model.count({ where: { published: true } }),
        ctx.prisma.model.findMany({
          where: { published: true },
          include: { author: true },
          skip: limit * page,
          take: limit,
        }),
      ]);

      return { count: res[0], data: res[1] };
    }),

  getMine: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.model.findMany({
      where: { authorId: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({ name: z.string(), published: z.boolean() }),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.model.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const model = await ctx.prisma.model.findUnique({
        where: { id: input.id },
      });

      if (!model) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (model.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only owner of model may delete.",
        });
      }

      return ctx.prisma.model.delete({ where: { id: input.id } });
    }),
});
