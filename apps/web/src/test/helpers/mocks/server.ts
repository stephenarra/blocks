import { createTRPCMsw } from "msw-trpc";
import type { AppRouter } from "@/server/api/root";
import { setupServer } from "msw/node";

export const trpcMsw = createTRPCMsw<AppRouter>();

export const server = setupServer(
  trpcMsw.model.get.query((req, res, ctx) => {
    return res(ctx.status(200), ctx.data({ id: "1", name: "Uncle bob" }));
  }),
  trpcMsw.model.create.mutation(async (req, res, ctx) => {
    return res(ctx.status(200), ctx.data({ id: "2", name: await req.json() }));
  })
);
